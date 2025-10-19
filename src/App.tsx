import { LanguageProvider } from './contexts/LanguageContext';
import { useLanguage } from './contexts/LanguageContext';
import { ApplicationForm } from './components/ApplicationForm';
import { LanguageToggle } from './components/LanguageToggle';

function AppContent() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-end mb-6">
          <LanguageToggle />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">{t.appTitle}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {t.appTitle}
          </p>
        </div>

        <ApplicationForm />
      </div>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;
