import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { FormStep } from '../types';
import { Check } from 'lucide-react';

interface ProgressBarProps {
  currentStep: FormStep;
}

export function ProgressBar({ currentStep }: ProgressBarProps) {
  const { t, isRTL } = useLanguage();

  const steps = [
    { number: 1, title: t.step1Title },
    { number: 2, title: t.step2Title },
    { number: 3, title: t.step3Title }
  ];

  return (
    <div className="w-full py-8" role="navigation" aria-label="Progress">
      <div className="flex items-center justify-between max-w-3xl mx-auto px-4">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-semibold transition-all ${
                  step.number < currentStep
                    ? 'bg-green-600 text-white'
                    : step.number === currentStep
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                    : 'bg-gray-200 text-gray-600'
                }`}
                aria-current={step.number === currentStep ? 'step' : undefined}
              >
                {step.number < currentStep ? (
                  <Check className="w-6 h-6" />
                ) : (
                  <span>{step.number}</span>
                )}
              </div>
              <div className="mt-2 text-center">
                <p
                  className={`text-sm font-medium ${
                    step.number === currentStep
                      ? 'text-blue-600'
                      : step.number < currentStep
                      ? 'text-green-600'
                      : 'text-gray-500'
                  }`}
                >
                  {step.title}
                </p>
              </div>
            </div>

            {index < steps.length - 1 && (
              <div className="flex-1 px-4 pb-8">
                <div
                  className={`h-1 rounded-full transition-all ${
                    step.number < currentStep ? 'bg-green-600' : 'bg-gray-200'
                  }`}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
