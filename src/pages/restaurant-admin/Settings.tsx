
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useRestaurantAuth } from '@/contexts/RestaurantAuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from 'sonner';
import { Save } from 'lucide-react';
import LanguageSelector from '@/components/LanguageSelector';

const Settings = () => {
  const { restaurantProfile } = useRestaurantAuth();
  const { t } = useLanguage();
  const [name, setName] = useState(restaurantProfile?.name || '');
  const [email, setEmail] = useState(restaurantProfile?.email || '');
  const [phone, setPhone] = useState('555-123-4567'); // Demo data
  const [address, setAddress] = useState('123 Restaurant Ave');
  const [city, setCity] = useState('New York');
  const [state, setState] = useState('NY');
  const [zip, setZip] = useState('10001');
  const [cuisine, setCuisine] = useState('Italian');
  const [saving, setSaving] = useState(false);
  
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success('Restaurant profile updated successfully');
      setSaving(false);
    }, 1000);
  };
  
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t('admin.settings')}</h1>
        <p className="text-muted-foreground">
          {t('admin.restaurantInformation')}
        </p>
      </div>
      
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">{t('admin.restaurantInformation')}</TabsTrigger>
          <TabsTrigger value="account">{t('admin.accountSettings')}</TabsTrigger>
          <TabsTrigger value="language">{t('language.selectLanguage')}</TabsTrigger>
          <TabsTrigger value="notifications">{t('admin.notificationPreferences')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.restaurantInformation')}</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('admin.restaurantName')}</Label>
                    <Input 
                      id="name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      placeholder={t('admin.restaurantName')}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('auth.email')}</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={t('auth.email')}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('profile.phone')}</Label>
                    <Input 
                      id="phone" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder={t('profile.phone')}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cuisine">{t('admin.cuisineType')}</Label>
                    <Input 
                      id="cuisine" 
                      value={cuisine}
                      onChange={(e) => setCuisine(e.target.value)}
                      placeholder={t('admin.cuisineType')}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">{t('admin.streetAddress')}</Label>
                    <Input 
                      id="address" 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder={t('admin.streetAddress')}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="city">{t('profile.city')}</Label>
                    <Input 
                      id="city" 
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder={t('profile.city')}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="state">{t('profile.state')}</Label>
                    <Input 
                      id="state" 
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder={t('profile.state')}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="zip">{t('profile.zipCode')}</Label>
                    <Input 
                      id="zip" 
                      value={zip}
                      onChange={(e) => setZip(e.target.value)}
                      placeholder={t('profile.zipCode')}
                    />
                  </div>
                </div>
                
                <Button type="submit" disabled={saving} className="mt-6">
                  <Save className="mr-2 h-4 w-4" />
                  {saving ? t('checkout.processing') : t('profile.saveChanges')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.accountSettings')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">{t('admin.changePassword')}</h3>
                  <p className="text-sm text-muted-foreground">
                    {t('admin.updatePassword')}
                  </p>
                </div>
                
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">{t('admin.currentPassword')}</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="new-password">{t('admin.newPassword')}</Label>
                    <Input id="new-password" type="password" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">{t('admin.confirmNewPassword')}</Label>
                    <Input id="confirm-password" type="password" />
                  </div>
                </div>
                
                <Button>{t('admin.updatePassword')}</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="language">
          <Card>
            <CardHeader>
              <CardTitle>{t('language.selectLanguage')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-w-xs">
                <LanguageSelector />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.notificationPreferences')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-6">
                {t('admin.notificationPreferences')} coming soon
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
