import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
  Fade,
  Backdrop,
} from '@mui/material';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmationModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmColor = 'error',
  isLoading = false,
  icon
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 300,
        sx: {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(4px)',
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          overflow: 'visible',
        },
      }}
      TransitionComponent={Fade}
      transitionDuration={300}
    >
      {/* Close button */}
      <Box sx={{ position: 'absolute', right: 8, top: 8, zIndex: 1 }}>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: 'rgba(0, 0, 0, 0.4)',
            '&:hover': {
              color: 'rgba(0, 0, 0, 0.6)',
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        >
          <X size={20} />
        </IconButton>
      </Box>

      {/* Header with icon */}
      <DialogTitle
        sx={{
          textAlign: 'center',
          pt: 4,
          pb: 2,
          px: 3,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          {/* Icon container */}
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: confirmColor === 'error' 
                ? 'linear-gradient(135deg, #fee2e2 0%, #fecaca 100%)'
                : 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
              border: confirmColor === 'error'
                ? '2px solid #fca5a5'
                : '2px solid #93c5fd',
              boxShadow: '0 8px 25px -8px rgba(0, 0, 0, 0.1)',
            }}
          >
            {icon || (
              <AlertTriangle 
                size={28} 
                color={confirmColor === 'error' ? '#dc2626' : '#2563eb'} 
              />
            )}
          </Box>

          {/* Title */}
          <Typography
            variant="h5"
            component="h2"
            sx={{
              fontWeight: 600,
              color: '#1f2937',
              fontSize: '1.5rem',
              lineHeight: 1.2,
            }}
          >
            {title}
          </Typography>
        </Box>
      </DialogTitle>

      {/* Content */}
      <DialogContent
        sx={{
          textAlign: 'center',
          px: 3,
          pb: 2,
        }}
      >
        <Typography
          variant="body1"
          sx={{
            color: '#6b7280',
            fontSize: '1rem',
            lineHeight: 1.6,
            whiteSpace: 'pre-line',
          }}
        >
          {message}
        </Typography>
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{
          justifyContent: 'center',
          gap: 2,
          px: 3,
          pb: 4,
          pt: 2,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          size="large"
          disabled={isLoading}
          sx={{
            minWidth: 120,
            height: 48,
            borderRadius: '12px',
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 500,
            borderColor: '#d1d5db',
            color: '#6b7280',
            '&:hover': {
              borderColor: '#9ca3af',
              backgroundColor: '#f9fafb',
            },
          }}
        >
          {cancelText}
        </Button>

        <Button
          onClick={handleConfirm}
          variant="contained"
          size="large"
          disabled={isLoading}
          color={confirmColor}
          sx={{
            minWidth: 120,
            height: 48,
            borderRadius: '12px',
            textTransform: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.1)',
            '&:hover': {
              boxShadow: '0 6px 20px 0 rgba(0, 0, 0, 0.15)',
            },
            '&:disabled': {
              opacity: 0.7,
            },
          }}
        >
          {isLoading ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  border: '2px solid currentColor',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                  },
                }}
              />
              Processing...
            </Box>
          ) : (
            confirmText
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;