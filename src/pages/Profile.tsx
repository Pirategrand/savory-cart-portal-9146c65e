
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import CartButton from '@/components/CartButton';
import LanguageSelector from '@/components/LanguageSelector';

const Profile = () => {
  const { user, profile, loading, updateProfile, signOut } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip_code: ''
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
    }
    
    if (profile) {
      setFormData({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        phone: profile.phone || '',
        address: profile.address || '',
        city: profile.city || '',
        state: profile.state || '',
        zip_code: profile.zip_code || ''
      });
    }
  }, [user, profile, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(formData);
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex justify-center items-center">
        <p>{t('common.loading')}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto py-8 px-4">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <Tabs defaultValue="personal">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold">{t('profile.myProfile')}</h1>
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="text-red-500 border-red-500 hover:bg-red-500/10"
              >
                {t('common.logout')}
              </Button>
            </div>
            
            <TabsList className="mb-6">
              <TabsTrigger value="personal">{t('profile.personalInfo')}</TabsTrigger>
              <TabsTrigger value="settings">{t('common.settings')}</TabsTrigger>
            </TabsList>
            
            <TabsContent value="personal">
              <Separator className="mb-6" />
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">{t('auth.firstName')}</Label>
                    <Input 
                      id="first_name"
                      name="first_name"
                      value={formData.first_name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="last_name">{t('auth.lastName')}</Label>
                    <Input 
                      id="last_name"
                      name="last_name"
                      value={formData.last_name}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('profile.phone')}</Label>
                  <Input 
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">{t('profile.address')}</Label>
                  <Input 
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="city">{t('profile.city')}</Label>
                    <Input 
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="state">{t('profile.state')}</Label>
                    <Input 
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="zip_code">{t('profile.zipCode')}</Label>
                    <Input 
                      id="zip_code"
                      name="zip_code"
                      value={formData.zip_code}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
                
                <div className="flex justify-center gap-4 pt-4">
                  {isEditing ? (
                    <>
                      <Button 
                        type="submit" 
                        className="bg-orange-500 hover:bg-orange-600"
                      >
                        {t('profile.saveChanges')}
                      </Button>
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => {
                          setIsEditing(false);
                          if (profile) {
                            setFormData({
                              first_name: profile.first_name || '',
                              last_name: profile.last_name || '',
                              phone: profile.phone || '',
                              address: profile.address || '',
                              city: profile.city || '',
                              state: profile.state || '',
                              zip_code: profile.zip_code || ''
                            });
                          }
                        }}
                      >
                        {t('profile.cancel')}
                      </Button>
                    </>
                  ) : (
                    <Button 
                      type="button"
                      className="bg-orange-500 hover:bg-orange-600"
                      onClick={() => setIsEditing(true)}
                    >
                      {t('profile.editProfile')}
                    </Button>
                  )}
                </div>
              </form>
            </TabsContent>
            
            <TabsContent value="settings">
              <Separator className="mb-6" />
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">{t('language.selectLanguage')}</h3>
                  <div className="max-w-xs">
                    <LanguageSelector />
                  </div>
                </div>
                
                <Separator />
                
                {/* Future settings can be added here */}
                <div className="py-4 text-muted-foreground text-sm">
                  <p>More settings coming soon</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <CartButton />
    </div>
  );
};

export default Profile;
