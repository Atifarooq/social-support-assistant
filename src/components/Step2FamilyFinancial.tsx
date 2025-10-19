import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FamilyFinancialInfo, ValidationErrors } from '../types';

interface Step2Props {
  data: Partial<FamilyFinancialInfo>;
  errors: ValidationErrors;
  onChange: (field: keyof FamilyFinancialInfo, value: string | number) => void;
}

export function Step2FamilyFinancial({ data, errors, onChange }: Step2Props) {
  const { t, isRTL } = useLanguage();

  const inputClass = (fieldName: string) =>
    `w-full px-4 py-3 border ${
      errors[fieldName] ? 'border-red-500' : 'border-gray-300'
    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`;

  const labelClass = 'block text-sm font-medium text-gray-700 mb-2';

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="marital_status" className={labelClass}>
          {t.marital_status} <span className="text-red-500">*</span>
        </label>
        <select
          id="marital_status"
          value={data.marital_status || ''}
          onChange={(e) => onChange('marital_status', e.target.value)}
          className={inputClass('marital_status')}
          aria-required="true"
          aria-invalid={!!errors.marital_status}
          aria-describedby={errors.marital_status ? 'marital_status-error' : undefined}
        >
          <option value="">Select...</option>
          <option value="single">{t.maritalOptions.single}</option>
          <option value="married">{t.maritalOptions.married}</option>
          <option value="divorced">{t.maritalOptions.divorced}</option>
          <option value="widowed">{t.maritalOptions.widowed}</option>
        </select>
        {errors.marital_status && (
          <p id="marital_status-error" className="mt-1 text-sm text-red-600">
            {errors.marital_status}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="dependents" className={labelClass}>
          {t.dependents} <span className="text-red-500">*</span>
        </label>
        <input
          id="dependents"
          type="number"
          min="0"
          value={data.dependents ?? ''}
          onChange={(e) => onChange('dependents', parseInt(e.target.value) || 0)}
          className={inputClass('dependents')}
          aria-required="true"
          aria-invalid={!!errors.dependents}
          aria-describedby={errors.dependents ? 'dependents-error' : undefined}
        />
        {errors.dependents && (
          <p id="dependents-error" className="mt-1 text-sm text-red-600">
            {errors.dependents}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="employment_status" className={labelClass}>
          {t.employment_status} <span className="text-red-500">*</span>
        </label>
        <select
          id="employment_status"
          value={data.employment_status || ''}
          onChange={(e) => onChange('employment_status', e.target.value)}
          className={inputClass('employment_status')}
          aria-required="true"
          aria-invalid={!!errors.employment_status}
          aria-describedby={errors.employment_status ? 'employment_status-error' : undefined}
        >
          <option value="">Select...</option>
          <option value="employed">{t.employmentOptions.employed}</option>
          <option value="part_time">{t.employmentOptions.partTime}</option>
          <option value="self_employed">{t.employmentOptions.selfEmployed}</option>
          <option value="unemployed">{t.employmentOptions.unemployed}</option>
          <option value="retired">{t.employmentOptions.retired}</option>
          <option value="student">{t.employmentOptions.student}</option>
          <option value="disabled">{t.employmentOptions.disabled}</option>
        </select>
        {errors.employment_status && (
          <p id="employment_status-error" className="mt-1 text-sm text-red-600">
            {errors.employment_status}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="monthly_income" className={labelClass}>
          {t.monthly_income} <span className="text-red-500">*</span>
        </label>
        <input
          id="monthly_income"
          type="number"
          min="0"
          step="0.01"
          value={data.monthly_income ?? ''}
          onChange={(e) => onChange('monthly_income', parseFloat(e.target.value) || 0)}
          className={inputClass('monthly_income')}
          aria-required="true"
          aria-invalid={!!errors.monthly_income}
          aria-describedby={errors.monthly_income ? 'monthly_income-error' : undefined}
        />
        {errors.monthly_income && (
          <p id="monthly_income-error" className="mt-1 text-sm text-red-600">
            {errors.monthly_income}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="housing_status" className={labelClass}>
          {t.housing_status} <span className="text-red-500">*</span>
        </label>
        <select
          id="housing_status"
          value={data.housing_status || ''}
          onChange={(e) => onChange('housing_status', e.target.value)}
          className={inputClass('housing_status')}
          aria-required="true"
          aria-invalid={!!errors.housing_status}
          aria-describedby={errors.housing_status ? 'housing_status-error' : undefined}
        >
          <option value="">Select...</option>
          <option value="owned">{t.housingOptions.owned}</option>
          <option value="rented">{t.housingOptions.rented}</option>
          <option value="mortgage">{t.housingOptions.mortgage}</option>
          <option value="with_family">{t.housingOptions.withFamily}</option>
          <option value="homeless">{t.housingOptions.homeless}</option>
          <option value="temporary">{t.housingOptions.temporary}</option>
        </select>
        {errors.housing_status && (
          <p id="housing_status-error" className="mt-1 text-sm text-red-600">
            {errors.housing_status}
          </p>
        )}
      </div>
    </div>
  );
}
