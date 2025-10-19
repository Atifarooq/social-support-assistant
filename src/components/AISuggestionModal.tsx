import React, { useState } from 'react';
import { X, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { generateTextSuggestion, OpenAIRequest } from '../services/openai';

interface AISuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: (text: string) => void;
  fieldType: 'financial_situation' | 'employment_circumstances' | 'reason_for_applying';
  currentValue: string;
}

export function AISuggestionModal({
  isOpen,
  onClose,
  onAccept,
  fieldType,
  currentValue
}: AISuggestionModalProps) {
  const { t, isRTL } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const [error, setError] = useState('');
  const [editedText, setEditedText] = useState('');

  React.useEffect(() => {
    if (isOpen && !suggestion) {
      generateSuggestion();
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (!isOpen) {
      setSuggestion('');
      setError('');
      setEditedText('');
    }
  }, [isOpen]);

  const generateSuggestion = async () => {
    setLoading(true);
    setError('');

    const request: OpenAIRequest = {
      prompt: currentValue || 'Help me describe my situation for a government assistance application.',
      fieldType
    };

    try {
      const result = await generateTextSuggestion(request);
      setSuggestion(result.text);
      setEditedText(result.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : t.errorAI);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = () => {
    onAccept(editedText || suggestion);
    onClose();
  };

  const handleDiscard = () => {
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="flex items-center justify-between p-6 border-b">
          <h2 id="modal-title" className="text-xl font-semibold text-gray-900">
            {t.aiSuggestion}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              <span className={`${isRTL ? 'mr-3' : 'ml-3'} text-gray-600`}>
                {t.generating}
              </span>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className={`${isRTL ? 'mr-3' : 'ml-3'}`}>
                <p className="text-red-800 font-medium">{t.errorTitle}</p>
                <p className="text-red-600 text-sm mt-1">{error}</p>
              </div>
            </div>
          )}

          {!loading && !error && suggestion && (
            <div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <p className={`${isRTL ? 'mr-3' : 'ml-3'} text-sm text-blue-800`}>
                    {t.aiSuggestion}
                  </p>
                </div>
              </div>

              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[150px]"
                dir={isRTL ? 'rtl' : 'ltr'}
                aria-label={t.edit}
              />
            </div>
          )}
        </div>

        {!loading && !error && suggestion && (
          <div className="flex items-center justify-end gap-3 p-6 border-t bg-gray-50">
            <button
              onClick={handleDiscard}
              className="px-6 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              {t.discard}
            </button>
            <button
              onClick={handleAccept}
              className="px-6 py-2.5 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {t.accept}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
