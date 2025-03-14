
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface FormData {
  name: string;
  phone: string;
  address: string;
}

interface DeliveryDetailsFormProps {
  formData: FormData;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const DeliveryDetailsForm: React.FC<DeliveryDetailsFormProps> = ({
  formData,
  handleInputChange
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 subtle-shadow">
      <h2 className="text-lg font-medium mb-4">Delivery Details</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input 
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="John Doe"
              required
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input 
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="(123) 456-7890"
              required
            />
          </div>
        </div>
        <div>
          <Label htmlFor="address">Delivery Address</Label>
          <Input 
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="123 Main St, Apt 4B, City, State, ZIP"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default DeliveryDetailsForm;
