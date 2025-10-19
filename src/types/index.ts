export interface PersonalInfo {
  name: string;
  national_id: string;
  date_of_birth: string;
  gender: string;
  address: string;
  city: string;
  state: string;
  country: string;
  phone: string;
  email: string;
}

export interface FamilyFinancialInfo {
  marital_status: string;
  dependents: number;
  employment_status: string;
  monthly_income: number;
  housing_status: string;
}

export interface SituationDescriptions {
  financial_situation: string;
  employment_circumstances: string;
  reason_for_applying: string;
}

export interface ApplicationData extends PersonalInfo, FamilyFinancialInfo, SituationDescriptions {
  id?: string;
  user_id?: string;
  status?: string;
  current_step?: number;
  created_at?: string;
  updated_at?: string;
  submitted_at?: string;
}

export type FormStep = 1 | 2 | 3;

export interface ValidationErrors {
  [key: string]: string;
}

export type Language = 'en' | 'ar';
