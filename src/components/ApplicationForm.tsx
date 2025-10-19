import React, { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft, Save, Loader2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { ApplicationData, FormStep, ValidationErrors } from '../types';
import { validateStep1, validateStep2, validateStep3 } from '../utils/validation';
import { saveToLocalStorage, loadFromLocalStorage, clearLocalStorage } from '../utils/localStorage';
import { saveApplication, submitApplication } from '../services/applicationService';
import { ProgressBar } from './ProgressBar';
import { Step1PersonalInfo } from './Step1PersonalInfo';
import { Step2FamilyFinancial } from './Step2FamilyFinancial';
import { Step3SituationDescriptions } from './Step3SituationDescriptions';
import { SuccessModal } from './SuccessModal';

export function ApplicationForm() {
  const { t, isRTL } = useLanguage();
  const [currentStep, setCurrentStep] = useState<FormStep>(1);
  const [formData, setFormData] = useState<Partial<ApplicationData>>({});
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [saving, setSaving] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [applicationId, setApplicationId] = useState('');

  useEffect(() => {
    const savedData = loadFromLocalStorage();
    if (savedData) {
      setFormData(savedData);
      if (savedData.current_step) {
        setCurrentStep(savedData.current_step as FormStep);
      }
    }
  }, []);

  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      saveToLocalStorage({ ...formData, current_step: currentStep });
    }
  }, [formData, currentStep]);

  const handleChange = (field: keyof ApplicationData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateCurrentStep = (): boolean => {
    let stepErrors: ValidationErrors = {};

    if (currentStep === 1) {
      stepErrors = validateStep1(formData, t);
    } else if (currentStep === 2) {
      stepErrors = validateStep2(formData, t);
    } else if (currentStep === 3) {
      stepErrors = validateStep3(formData, t);
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    if (currentStep < 3) {
      setCurrentStep((prev) => (prev + 1) as FormStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => (prev - 1) as FormStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const id = await saveApplication({
        ...formData,
        current_step: currentStep
      });
      setApplicationId(id);
      setFormData((prev) => ({ ...prev, id }));
    } catch (error) {
      alert(t.errorSaving);
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      return;
    }

    setSubmitting(true);
    try {
      let id = formData.id || applicationId;
      if (!id) {
        id = await saveApplication(formData);
      }
      await submitApplication(id, formData);
      setApplicationId(id);
      setShowSuccess(true);
      clearLocalStorage();
    } catch (error) {
      alert(t.errorSubmitting);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    setFormData({});
    setCurrentStep(1);
    setErrors({});
    window.location.reload();
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <ProgressBar currentStep={currentStep} />

      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <form onSubmit={(e) => e.preventDefault()}>
          {currentStep === 1 && (
            <Step1PersonalInfo
              data={formData}
              errors={errors}
              onChange={handleChange}
            />
          )}

          {currentStep === 2 && (
            <Step2FamilyFinancial
              data={formData}
              errors={errors}
              onChange={handleChange}
            />
          )}

          {currentStep === 3 && (
            <Step3SituationDescriptions
              data={formData}
              errors={errors}
              onChange={handleChange}
            />
          )}
        </form>
      </div>

      <div
        className={`flex items-center justify-between gap-4 ${
          isRTL ? 'flex-row-reverse' : ''
        }`}
      >
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {t.saving}
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              {t.saveProgress}
            </>
          )}
        </button>

        <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          {currentStep > 1 && (
            <button
              onClick={handlePrevious}
              className="flex items-center gap-2 px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              {isRTL ? (
                <>
                  <span>{t.previous}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              ) : (
                <>
                  <ArrowLeft className="w-5 h-5" />
                  <span>{t.previous}</span>
                </>
              )}
            </button>
          )}

          {currentStep < 3 ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              {isRTL ? (
                <>
                  <ArrowLeft className="w-5 h-5" />
                  <span>{t.next}</span>
                </>
              ) : (
                <>
                  <span>{t.next}</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-3 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {t.submitting}
                </>
              ) : (
                t.submit
              )}
            </button>
          )}
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccess}
        applicationId={applicationId}
        onClose={handleSuccessClose}
      />
    </div>
  );
}
