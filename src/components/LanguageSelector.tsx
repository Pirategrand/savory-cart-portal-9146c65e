
import React from 'react';
import { useLanguage, Language } from '@/contexts/LanguageContext';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Globe } from 'lucide-react';

interface LanguageSelectorProps {
  variant?: 'minimal' | 'full';
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ variant = 'full' }) => {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (value: string) => {
    setLanguage(value as Language);
  };

  const languageOptions = [
    { value: 'en', label: t('language.english') },
    { value: 'hi', label: t('language.hindi') },
    { value: 'fr', label: t('language.french') },
    { value: 'de', label: t('language.german') },
  ];

  if (variant === 'minimal') {
    return (
      <Select value={language} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-10 h-10 p-0 justify-center">
          <Globe className="h-5 w-5" />
        </SelectTrigger>
        <SelectContent>
          {languageOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Globe className="h-4 w-4" />
      <Select value={language} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder={t('language.selectLanguage')} />
        </SelectTrigger>
        <SelectContent>
          {languageOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSelector;
