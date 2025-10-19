import React from 'react';
import { CheckCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface SuccessModalProps {
  isOpen: boolean;
  applicationId: string;
  onClose: () => void;
}

export function SuccessModal({ isOpen, applicationId, onClose }: SuccessModalProps) {
  const { t, isRTL } = useLanguage();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-title"
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-md w-full p-8 text-center"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </div>

        <h2 id="success-title" className="text-2xl font-bold text-gray-900 mb-3">
          {t.successTitle}
        </h2>

        <p className="text-gray-600 mb-6">{t.successMessage}</p>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600 mb-1">{t.applicationId}:</p>
          <p className="text-lg font-mono font-semibold text-gray-900">{applicationId}</p>
        </div>

        <button
          onClick={onClose}
          className="w-full px-6 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          OK
        </button>
      </div>
    </div>
  );
}
