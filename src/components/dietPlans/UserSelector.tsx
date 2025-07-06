import React, { useState, useRef, useEffect } from 'react';
import { Search, User, ChevronDown } from 'lucide-react';
import { Member } from '../../types/member';

interface UserSelectorProps {
  users: Member[];
  selectedUserId: string;
  onUserSelect: (userId: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

const UserSelector: React.FC<UserSelectorProps> = ({
  users,
  selectedUserId,
  onUserSelect,
  disabled = false,
  placeholder = "Search and select a user..."
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const selectedUser = users.find(user => user.user_id === selectedUserId);

  // Filter users based on search query
  const filteredUsers = users.filter(user => {
    const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
    const email = user.email.toLowerCase();
    const phone = user.phone_number.toLowerCase();
    const query = searchQuery.toLowerCase();
    
    return fullName.includes(query) || email.includes(query) || phone.includes(query);
  });

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUserSelect = (user: Member) => {
    onUserSelect(user.user_id);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleInputClick = () => {
    if (!disabled) {
      setIsOpen(true);
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  const displayValue = selectedUser 
    ? `${selectedUser.first_name} ${selectedUser.last_name} (${selectedUser.email})`
    : '';

  return (
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        Select User *
      </label>
      
      <div className="relative">
        <div
          className={`w-full px-3 py-2 border rounded-md shadow-sm cursor-pointer transition-colors ${
            disabled 
              ? 'bg-gray-100 dark:bg-gray-600 border-gray-300 dark:border-gray-600 cursor-not-allowed opacity-50'
              : isOpen
              ? 'border-blue-500 ring-1 ring-blue-500 bg-white dark:bg-gray-700 dark:border-blue-400'
              : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500'
          }`}
          onClick={handleInputClick}
        >
          {isOpen ? (
            <div className="flex items-center">
              <Search className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, or phone..."
                className="flex-1 outline-none bg-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                disabled={disabled}
              />
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center flex-1 min-w-0">
                <User className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                <span className={`truncate ${
                  selectedUser 
                    ? 'text-gray-900 dark:text-white' 
                    : 'text-gray-500 dark:text-gray-400'
                }`}>
                  {displayValue || placeholder}
                </span>
              </div>
              <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${
                isOpen ? 'transform rotate-180' : ''
              }`} />
            </div>
          )}
        </div>

        {/* Dropdown */}
        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg max-h-60 overflow-auto">
            {filteredUsers.length > 0 ? (
              <div className="py-1">
                {filteredUsers.map((user) => (
                  <div
                    key={user.user_id}
                    onClick={() => handleUserSelect(user)}
                    className={`px-3 py-2 cursor-pointer transition-colors hover:bg-gray-100 dark:hover:bg-gray-600 ${
                      selectedUserId === user.user_id 
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' 
                        : 'text-gray-900 dark:text-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                        <span className="font-medium text-white text-xs">
                          {user.first_name.charAt(0)}{user.last_name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {user.first_name} {user.last_name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {user.email} • {user.phone_number}
                        </div>
                      </div>
                      {selectedUserId === user.user_id && (
                        <div className="flex-shrink-0">
                          <div className="h-4 w-4 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                {searchQuery ? 'No users found matching your search' : 'No users available'}
              </div>
            )}
          </div>
        )}
      </div>
      
      {!disabled && users.length === 0 && (
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          No users found
        </p>
      )}
    </div>
  );
};

export default UserSelector;