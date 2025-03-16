
import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '@/lib/translations';

// Supported languages
export type Language = 'en' | 'hi' | 'fr' | 'de';

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to get language from localStorage, default to 'en'
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    return savedLanguage && ['en', 'hi', 'fr', 'de'].includes(savedLanguage) 
      ? savedLanguage 
      : 'en';
  });

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem('language', language);
    // Update document language for accessibility
    document.documentElement.lang = language;
    
    // Set dir attribute based on language - note that none of our supported languages use RTL
    document.documentElement.dir = 'ltr';
  }, [language]);

  // Function to set language
  const setLanguage = (lang: Language) => {
    if (['en', 'hi', 'fr', 'de'].includes(lang)) {
      setLanguageState(lang);
      console.log(`Language changed to: ${lang}`);
    } else {
      console.warn(`Unsupported language: ${lang}, defaulting to English`);
      setLanguageState('en');
    }
  };

  // Translation function
  const t = (key: string): string => {
    try {
      const langData = translations[language];
      const keys = key.split('.');
      
      let result = langData;
      for (const k of keys) {
        if (result && typeof result === 'object' && k in result) {
          result = result[k];
        } else {
          // Fallback to English if key not found
          let fallback = translations['en'];
          for (const fbKey of keys) {
            if (fallback && typeof fallback === 'object' && fbKey in fallback) {
              fallback = fallback[fbKey];
            } else {
              console.warn(`Translation key not found: ${key}`);
              return key; // Return the key itself as last resort
            }
          }
          return typeof fallback === 'string' ? fallback : key;
        }
      }
      
      return typeof result === 'string' ? result : key;
    } catch (error) {
      console.error(`Error translating key: ${key}`, error);
      return key;
    }
  };

  const contextValue = {
    language,
    setLanguage,
    t
  };

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};
