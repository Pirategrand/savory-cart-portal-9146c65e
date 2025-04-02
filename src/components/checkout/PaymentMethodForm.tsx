
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CreditCard, DollarSign, QrCode } from 'lucide-react';
import StripeQRPayment from './StripeQRPayment';

interface PaymentFormData {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
}

interface PaymentMethodFormProps {
  paymentMethod: string;
  setPaymentMethod: (value: string) => void;
  formData: PaymentFormData;
  handleCardNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleExpiryDateChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  amount: number;
  onPaymentComplete: () => void;
  onPaymentError: (error: string) => void;
  customerEmail?: string;
  isPaymentComplete: boolean;
  setIsPaymentComplete: (value: boolean) => void;
}

const PaymentMethodForm: React.FC<PaymentMethodFormProps> = ({
  paymentMethod,
  setPaymentMethod,
  formData,
  handleCardNumberChange,
  handleExpiryDateChange,
  handleInputChange,
  amount,
  onPaymentComplete,
  onPaymentError,
  customerEmail,
  isPaymentComplete,
  setIsPaymentComplete
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 mb-8 subtle-shadow">
      <h2 className="text-lg font-medium mb-4">Payment Method</h2>
      <RadioGroup 
        defaultValue="credit-card" 
        value={paymentMethod}
        onValueChange={(value) => {
          setPaymentMethod(value);
          // Reset payment complete state when changing payment method
          if (isPaymentComplete) {
            setIsPaymentComplete(false);
          }
        }}
        className="space-y-4"
      >
        <div className="flex items-center space-x-2 border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
          <RadioGroupItem value="credit-card" id="credit-card" />
          <Label htmlFor="credit-card" className="flex-grow cursor-pointer">
            <div className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-blue-500" />
              Credit / Debit Card
            </div>
          </Label>
        </div>
        
        <div className="flex items-center space-x-2 border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
          <RadioGroupItem value="cash" id="cash" />
          <Label htmlFor="cash" className="flex-grow cursor-pointer">
            <div className="flex items-center">
              <DollarSign className="h-5 w-5 mr-2 text-green-500" />
              Cash on Delivery
            </div>
          </Label>
        </div>

        <div className="flex items-center space-x-2 border border-gray-200 dark:border-gray-700 rounded-lg p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
          <RadioGroupItem value="cashapp" id="cashapp" />
          <Label htmlFor="cashapp" className="flex-grow cursor-pointer">
            <div className="flex items-center">
              <QrCode className="h-5 w-5 mr-2 text-blue-600" />
              Cash App Pay (Stripe)
            </div>
          </Label>
        </div>
      </RadioGroup>
      
      {paymentMethod === 'credit-card' && (
        <div className="mt-6 space-y-4">
          <div>
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input 
              id="cardNumber"
              name="cardNumber"
              value={formData.cardNumber}
              onChange={handleCardNumberChange}
              placeholder="4242 4242 4242 4242"
              maxLength={19}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="expiryDate">Expiry Date</Label>
              <Input 
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleExpiryDateChange}
                placeholder="MM/YY"
                maxLength={5}
              />
            </div>
            <div>
              <Label htmlFor="cvv">CVV</Label>
              <Input 
                id="cvv"
                name="cvv"
                value={formData.cvv}
                onChange={handleInputChange}
                placeholder="123"
                maxLength={4}
                type="password"
              />
            </div>
          </div>
        </div>
      )}

      {paymentMethod === 'cashapp' && (
        <StripeQRPayment 
          amount={amount}
          onSuccess={onPaymentComplete}
          onError={onPaymentError}
          customerEmail={customerEmail}
        />
      )}
    </div>
  );
};

export default PaymentMethodForm;
