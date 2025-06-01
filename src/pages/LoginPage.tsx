import React from 'react';
import LoginForm from '../components/auth/LoginForm';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full flex flex-col md:flex-row max-w-4xl">
        <div className="flex-1 flex flex-col justify-center p-8 text-white">
          <h1 className="text-4xl font-bold mb-4">ArcFit Admin Portal</h1>
          <p className="text-lg mb-6">
            Manage your fitness business efficiently with our comprehensive admin dashboard.
          </p>
          <ul className="space-y-2 list-disc list-inside">
            <li>Member management & enrollment</li>
            <li>Trainer scheduling & performance tracking</li>
            <li>Society-wide fitness programs</li>
            <li>Real-time analytics & insights</li>
          </ul>
        </div>
        <div className="flex-1 bg-white rounded-lg shadow-xl overflow-hidden transform transition-all animate-fade-in">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;