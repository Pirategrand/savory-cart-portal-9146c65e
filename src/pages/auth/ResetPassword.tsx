
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const { resetPassword, loading } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await resetPassword(email);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">{t('auth.resetPassword')}</h1>
          <p className="text-muted-foreground mt-2">
            {t('auth.resetPasswordDesc')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">{t('auth.email')}</Label>
            <Input 
              id="email"
              type="email" 
              placeholder="your@email.com" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600"
            disabled={loading}
          >
            {loading ? t('auth.sendingResetLink') : t('auth.resetPassword')}
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">{t('auth.rememberPassword')}</span>{' '}
            <Link to="/auth/login" className="text-orange-500 hover:text-orange-600">
              {t('auth.backToLogin')}
            </Link>
          </div>
        </form>

        <div className="mt-4 text-center">
          <Button
            variant="outline"
            className="text-sm"
            onClick={() => navigate('/')}
          >
            {t('common.backToHome')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
