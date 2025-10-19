import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { PersonalInfo, ValidationErrors } from '../types';

interface Step1Props {
  data: Partial<PersonalInfo>;
  errors: ValidationErrors;
  onChange: (field: keyof PersonalInfo, value: string) => void;
}

export function Step1PersonalInfo({ data, errors, onChange }: Step1Props) {
  const { t, isRTL } = useLanguage();

  const inputClass = (fieldName: string) =>
    `w-full px-4 py-3 border ${
      errors[fieldName] ? 'border-red-500' : 'border-gray-300'
    } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`;

  const labelClass = 'block text-sm font-medium text-gray-700 mb-2';

  return (
    <div className="space-y-6">
      <div>
        <label htmlFor="name" className={labelClass}>
          {t.name} <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          type="text"
          value={data.name || ''}
          onChange={(e) => onChange('name', e.target.value)}
          className={inputClass('name')}
          dir={isRTL ? 'rtl' : 'ltr'}
          aria-required="true"
          aria-invalid={!!errors.name}
          aria-describedby={errors.name ? 'name-error' : undefined}
        />
        {errors.name && (
          <p id="name-error" className="mt-1 text-sm text-red-600">
            {errors.name}
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="national_id" className={labelClass}>
            {t.national_id} <span className="text-red-500">*</span>
          </label>
          <input
            id="national_id"
            type="text"
            value={data.national_id || ''}
            onChange={(e) => onChange('national_id', e.target.value)}
            className={inputClass('national_id')}
            dir={isRTL ? 'rtl' : 'ltr'}
            aria-required="true"
            aria-invalid={!!errors.national_id}
            aria-describedby={errors.national_id ? 'national_id-error' : undefined}
          />
          {errors.national_id && (
            <p id="national_id-error" className="mt-1 text-sm text-red-600">
              {errors.national_id}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="date_of_birth" className={labelClass}>
            {t.date_of_birth} <span className="text-red-500">*</span>
          </label>
          <input
            id="date_of_birth"
            type="date"
            value={data.date_of_birth || ''}
            onChange={(e) => onChange('date_of_birth', e.target.value)}
            className={inputClass('date_of_birth')}
            aria-required="true"
            aria-invalid={!!errors.date_of_birth}
            aria-describedby={errors.date_of_birth ? 'date_of_birth-error' : undefined}
          />
          {errors.date_of_birth && (
            <p id="date_of_birth-error" className="mt-1 text-sm text-red-600">
              {errors.date_of_birth}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="gender" className={labelClass}>
          {t.gender} <span className="text-red-500">*</span>
        </label>
        <select
          id="gender"
          value={data.gender || ''}
          onChange={(e) => onChange('gender', e.target.value)}
          className={inputClass('gender')}
          aria-required="true"
          aria-invalid={!!errors.gender}
          aria-describedby={errors.gender ? 'gender-error' : undefined}
        >
          <option value="">Select...</option>
          <option value="male">{t.genderOptions.male}</option>
          <option value="female">{t.genderOptions.female}</option>
          <option value="other">{t.genderOptions.other}</option>
          <option value="prefer_not_to_say">{t.genderOptions.preferNotToSay}</option>
        </select>
        {errors.gender && (
          <p id="gender-error" className="mt-1 text-sm text-red-600">
            {errors.gender}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="address" className={labelClass}>
          {t.address} <span className="text-red-500">*</span>
        </label>
        <input
          id="address"
          type="text"
          value={data.address || ''}
          onChange={(e) => onChange('address', e.target.value)}
          className={inputClass('address')}
          dir={isRTL ? 'rtl' : 'ltr'}
          aria-required="true"
          aria-invalid={!!errors.address}
          aria-describedby={errors.address ? 'address-error' : undefined}
        />
        {errors.address && (
          <p id="address-error" className="mt-1 text-sm text-red-600">
            {errors.address}
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="city" className={labelClass}>
            {t.city} <span className="text-red-500">*</span>
          </label>
          <input
            id="city"
            type="text"
            value={data.city || ''}
            onChange={(e) => onChange('city', e.target.value)}
            className={inputClass('city')}
            dir={isRTL ? 'rtl' : 'ltr'}
            aria-required="true"
            aria-invalid={!!errors.city}
            aria-describedby={errors.city ? 'city-error' : undefined}
          />
          {errors.city && (
            <p id="city-error" className="mt-1 text-sm text-red-600">
              {errors.city}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="state" className={labelClass}>
            {t.state} <span className="text-red-500">*</span>
          </label>
          <input
            id="state"
            type="text"
            value={data.state || ''}
            onChange={(e) => onChange('state', e.target.value)}
            className={inputClass('state')}
            dir={isRTL ? 'rtl' : 'ltr'}
            aria-required="true"
            aria-invalid={!!errors.state}
            aria-describedby={errors.state ? 'state-error' : undefined}
          />
          {errors.state && (
            <p id="state-error" className="mt-1 text-sm text-red-600">
              {errors.state}
            </p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="country" className={labelClass}>
          {t.country} <span className="text-red-500">*</span>
        </label>
        <input
          id="country"
          type="text"
          value={data.country || ''}
          onChange={(e) => onChange('country', e.target.value)}
          className={inputClass('country')}
          dir={isRTL ? 'rtl' : 'ltr'}
          aria-required="true"
          aria-invalid={!!errors.country}
          aria-describedby={errors.country ? 'country-error' : undefined}
        />
        {errors.country && (
          <p id="country-error" className="mt-1 text-sm text-red-600">
            {errors.country}
          </p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="phone" className={labelClass}>
            {t.phone} <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            type="tel"
            value={data.phone || ''}
            onChange={(e) => onChange('phone', e.target.value)}
            className={inputClass('phone')}
            dir={isRTL ? 'rtl' : 'ltr'}
            aria-required="true"
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
          />
          {errors.phone && (
            <p id="phone-error" className="mt-1 text-sm text-red-600">
              {errors.phone}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            {t.email} <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={data.email || ''}
            onChange={(e) => onChange('email', e.target.value)}
            className={inputClass('email')}
            dir={isRTL ? 'rtl' : 'ltr'}
            aria-required="true"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <p id="email-error" className="mt-1 text-sm text-red-600">
              {errors.email}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
