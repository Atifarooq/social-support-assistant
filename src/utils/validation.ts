import { ValidationErrors } from '../types';

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validateDate(date: string): boolean {
  const dateObj = new Date(date);
  return !isNaN(dateObj.getTime()) && date.length > 0;
}

export function validateStep1(data: Record<string, any>, t: any): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.name?.trim()) errors.name = t.required;
  if (!data.national_id?.trim()) errors.national_id = t.required;
  if (!data.date_of_birth) {
    errors.date_of_birth = t.required;
  } else if (!validateDate(data.date_of_birth)) {
    errors.date_of_birth = t.invalidDate;
  }
  if (!data.gender) errors.gender = t.required;
  if (!data.address?.trim()) errors.address = t.required;
  if (!data.city?.trim()) errors.city = t.required;
  if (!data.state?.trim()) errors.state = t.required;
  if (!data.country?.trim()) errors.country = t.required;
  if (!data.phone?.trim()) errors.phone = t.required;
  if (!data.email?.trim()) {
    errors.email = t.required;
  } else if (!validateEmail(data.email)) {
    errors.email = t.invalidEmail;
  }

  return errors;
}

export function validateStep2(data: Record<string, any>, t: any): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.marital_status) errors.marital_status = t.required;
  if (data.dependents === undefined || data.dependents === '') {
    errors.dependents = t.required;
  } else if (data.dependents < 0) {
    errors.dependents = t.mustBePositive;
  }
  if (!data.employment_status) errors.employment_status = t.required;
  if (data.monthly_income === undefined || data.monthly_income === '') {
    errors.monthly_income = t.required;
  } else if (data.monthly_income < 0) {
    errors.monthly_income = t.mustBePositive;
  }
  if (!data.housing_status) errors.housing_status = t.required;

  return errors;
}

export function validateStep3(data: Record<string, any>, t: any): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!data.financial_situation?.trim()) errors.financial_situation = t.required;
  if (!data.employment_circumstances?.trim()) errors.employment_circumstances = t.required;
  if (!data.reason_for_applying?.trim()) errors.reason_for_applying = t.required;

  return errors;
}
