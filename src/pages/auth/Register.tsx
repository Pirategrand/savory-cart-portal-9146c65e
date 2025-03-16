
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';

const Register = () => {
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { signUp, loading } = useAuth();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError(t('auth.passwordsDoNotMatch'));
      return;
    }

    if (password.length < 6) {
      setError(t('auth.passwordTooShort'));
      return;
    }

    await signUp(email, password, phone);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 p-8 rounded-xl shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">{t('auth.createAccount')}</h1>
          <p className="text-muted-foreground mt-2">{t('auth.signUp')}</p>
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

          <div className="space-y-2">
            <Label htmlFor="phone">{t('auth.phoneNumber')}</Label>
            <Input 
              id="phone"
              type="tel" 
              placeholder="+1234567890" 
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t('auth.password')}</Label>
            <Input 
              id="password"
              type="password" 
              placeholder="••••••••" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t('auth.confirmPassword')}</Label>
            <Input 
              id="confirmPassword"
              type="password" 
              placeholder="••••••••" 
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 mt-2">{error}</p>
          )}

          <Button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600"
            disabled={loading}
          >
            {loading ? t('auth.creatingAccount') : t('auth.createAccount')}
          </Button>

          <div className="text-center text-sm">
            <span className="text-muted-foreground">{t('auth.alreadyHaveAccount')}</span>{' '}
            <Link to="/auth/login" className="text-orange-500 hover:text-orange-600">
              {t('auth.signIn')}
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

export default Register;
