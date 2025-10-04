'use client';

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, LogOut, RefreshCw } from 'lucide-react';

interface SessionWarningModalProps {
  isOpen: boolean;
  timeLeft: number;
  onExtend: () => void;
  onLogout: () => void;
  onClose: () => void;
}

export function SessionWarningModal({ 
  isOpen, 
  timeLeft, 
  onExtend, 
  onLogout, 
  onClose 
}: SessionWarningModalProps) {
  const [timeRemaining, setTimeRemaining] = useState(timeLeft);
  const [isExtending, setIsExtending] = useState(false);

  useEffect(() => {
    setTimeRemaining(timeLeft);
  }, [timeLeft]);

  useEffect(() => {
    if (!isOpen) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1000) {
          onLogout();
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, onLogout]);

  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleExtend = async () => {
    setIsExtending(true);
    try {
      await onExtend();
      onClose();
    } catch (error) {
      console.error('Failed to extend session:', error);
    } finally {
      setIsExtending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Session Expiring Soon</h3>
              <p className="text-sm text-gray-600">Your session will expire due to inactivity</p>
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600">Time remaining:</span>
            </div>
            <div className="text-2xl font-mono font-bold text-red-600">
              {formatTime(timeRemaining)}
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-red-500 h-2 rounded-full transition-all duration-1000"
                style={{ 
                  width: `${Math.max(0, (timeRemaining / timeLeft) * 100)}%` 
                }}
              />
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleExtend}
              disabled={isExtending}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isExtending ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              <span>{isExtending ? 'Extending...' : 'Extend Session'}</span>
            </button>

            <button
              onClick={onLogout}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout Now</span>
            </button>
          </div>

          <div className="mt-4 text-xs text-gray-500 text-center">
            Click "Extend Session" to continue working, or "Logout Now" to end your session.
          </div>
        </div>
      </div>
    </div>
  );
}

