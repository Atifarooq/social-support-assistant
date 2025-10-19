import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { SituationDescriptions, ValidationErrors } from '../types';
import { AISuggestionModal } from './AISuggestionModal';

interface Step3Props {
  data: Partial<SituationDescriptions>;
  errors: ValidationErrors;
  onChange: (field: keyof SituationDescriptions, value: string) => void;
}

export function Step3SituationDescriptions({ data, errors, onChange }: Step3Props) {
  const { t, isRTL } = useLanguage();
  const [modalOpen, setModalOpen] = useState(false);
  const [activeField, setActiveField] = useState<keyof SituationDescriptions | null>(null);

  const inputClass = (fieldName: string) =>
    `w-full px-4 py-3 border ${
      errors[fieldName] ? 'border-red-500' : 'border-gray-300'
    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[120px]`;

  const labelClass = 'block text-sm font-medium text-gray-700 mb-2';

  const handleAIClick = (field: keyof SituationDescriptions) => {
    setActiveField(field);
    setModalOpen(true);
  };

  const handleAIAccept = (text: string) => {
    if (activeField) {
      onChange(activeField, text);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="financial_situation" className={labelClass}>
            {t.financial_situation} <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={() => handleAIClick('financial_situation')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            {t.helpMeWrite}
          </button>
        </div>
        <textarea
          id="financial_situation"
          value={data.financial_situation || ''}
          onChange={(e) => onChange('financial_situation', e.target.value)}
          className={inputClass('financial_situation')}
          dir={isRTL ? 'rtl' : 'ltr'}
          aria-required="true"
          aria-invalid={!!errors.financial_situation}
          aria-describedby={errors.financial_situation ? 'financial_situation-error' : undefined}
          placeholder={isRTL ? 'صف وضعك المالي الحالي...' : 'Describe your current financial situation...'}
        />
        {errors.financial_situation && (
          <p id="financial_situation-error" className="mt-1 text-sm text-red-600">
            {errors.financial_situation}
          </p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="employment_circumstances" className={labelClass}>
            {t.employment_circumstances} <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={() => handleAIClick('employment_circumstances')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            {t.helpMeWrite}
          </button>
        </div>
        <textarea
          id="employment_circumstances"
          value={data.employment_circumstances || ''}
          onChange={(e) => onChange('employment_circumstances', e.target.value)}
          className={inputClass('employment_circumstances')}
          dir={isRTL ? 'rtl' : 'ltr'}
          aria-required="true"
          aria-invalid={!!errors.employment_circumstances}
          aria-describedby={errors.employment_circumstances ? 'employment_circumstances-error' : undefined}
          placeholder={isRTL ? 'صف ظروف عملك...' : 'Describe your employment circumstances...'}
        />
        {errors.employment_circumstances && (
          <p id="employment_circumstances-error" className="mt-1 text-sm text-red-600">
            {errors.employment_circumstances}
          </p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label htmlFor="reason_for_applying" className={labelClass}>
            {t.reason_for_applying} <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={() => handleAIClick('reason_for_applying')}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Sparkles className="w-4 h-4" />
            {t.helpMeWrite}
          </button>
        </div>
        <textarea
          id="reason_for_applying"
          value={data.reason_for_applying || ''}
          onChange={(e) => onChange('reason_for_applying', e.target.value)}
          className={inputClass('reason_for_applying')}
          dir={isRTL ? 'rtl' : 'ltr'}
          aria-required="true"
          aria-invalid={!!errors.reason_for_applying}
          aria-describedby={errors.reason_for_applying ? 'reason_for_applying-error' : undefined}
          placeholder={isRTL ? 'اشرح سبب التقديم على الدعم...' : 'Explain your reason for applying...'}
        />
        {errors.reason_for_applying && (
          <p id="reason_for_applying-error" className="mt-1 text-sm text-red-600">
            {errors.reason_for_applying}
          </p>
        )}
      </div>

      {activeField && (
        <AISuggestionModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onAccept={handleAIAccept}
          fieldType={activeField}
          currentValue={data[activeField] || ''}
        />
      )}
    </div>
  );
}
