"use client";

import { Toaster } from 'react-hot-toast';

export const ToastProvider = () => {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        duration: 4000,
        style: {
          background: '#0c0c0c',
          color: '#ebebeb',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '12px',
          fontFamily: 'var(--font-jetbrains-mono)',
          fontSize: '12px',
        },
        success: {
          iconTheme: {
            primary: '#ccff00',
            secondary: '#0a0a0a',
          },
        },
        error: {
          iconTheme: {
            primary: '#ef4444',
            secondary: '#0a0a0a',
          },
        },
      }}
    />
  );
};
