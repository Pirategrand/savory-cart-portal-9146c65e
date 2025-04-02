
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { QrCode, CheckCircle2, XCircle, ArrowRight, Loader2 } from 'lucide-react';
import { createPaymentIntentWithStripe, updatePaymentStatus } from '@/services/stripe';
import { toast } from 'sonner';

interface StripeQRPaymentProps {
  amount: number;
  onSuccess: () => void;
  onError: (error: string) => void;
  customerEmail?: string;
}

const StripeQRPayment: React.FC<StripeQRPaymentProps> = ({
  amount,
  onSuccess,
  onError,
  customerEmail
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isPaymentComplete, setIsPaymentComplete] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);
  const [showSimulatedPaymentPage, setShowSimulatedPaymentPage] = useState(false);

  const handleRevealQRCode = async () => {
    try {
      setIsLoading(true);
      const { id } = await createPaymentIntentWithStripe(amount, customerEmail);
      setPaymentIntentId(id);
      setShowQRCode(true);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      onError('Failed to create payment intent');
      toast.error('Payment setup failed', {
        description: 'Unable to initialize Cash App payment'
      });
    }
  };

  const handleSimulateScan = () => {
    setShowQRCode(false);
    setShowSimulatedPaymentPage(true);
  };

  const handleAuthorizePayment = async () => {
    if (!paymentIntentId) return;
    
    setIsLoading(true);
    
    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update the payment intent status to succeeded
      await updatePaymentStatus(paymentIntentId, 'succeeded');
      
      setIsLoading(false);
      setShowSimulatedPaymentPage(false);
      setIsPaymentComplete(true);
      
      toast.success('Payment authorized successfully', {
        description: 'Your Cash App payment has been completed'
      });
      
      // Wait a moment before calling onSuccess to allow for animation
      setTimeout(() => {
        handlePaymentSuccess();
      }, 1500);
    } catch (error) {
      setIsLoading(false);
      onError('Failed to process payment');
      toast.error('Payment failed', {
        description: 'An error occurred while processing your payment'
      });
    }
  };

  const handleFailPayment = async () => {
    if (!paymentIntentId) return;
    
    setIsLoading(true);
    
    try {
      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update the payment intent status to failed
      await updatePaymentStatus(paymentIntentId, 'failed');
      
      setIsLoading(false);
      setShowSimulatedPaymentPage(false);
      
      toast.error('Payment failed', {
        description: 'You chose to fail this test payment'
      });
      
      onError('Payment was rejected');
    } catch (error) {
      setIsLoading(false);
      onError('Failed to process payment');
    }
  };

  const handlePaymentSuccess = () => {
    onSuccess();
  };

  const qrCodeUrl = paymentIntentId 
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=stripe:payment:${paymentIntentId}&color=0055AA`
    : '';

  return (
    <div className="mt-4">
      {!isPaymentComplete && !showQRCode && !showSimulatedPaymentPage && (
        <div className="border border-slate-200 dark:border-slate-700 rounded-md p-4 bg-slate-50 dark:bg-slate-900">
          <div className="flex items-center mb-4">
            <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
              <QrCode className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h3 className="font-medium">Cash App Pay</h3>
              <p className="text-sm text-muted-foreground">Pay quickly using Cash App's QR code</p>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full mt-2"
            onClick={handleRevealQRCode}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Preparing payment...
              </>
            ) : (
              <>
                Show QR Code
                <ArrowRight className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      )}

      {isPaymentComplete && (
        <div className="border border-green-200 dark:border-green-800 rounded-md p-4 bg-green-50 dark:bg-green-900/20">
          <div className="flex items-center">
            <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400 mr-2" />
            <div>
              <h3 className="font-medium text-green-700 dark:text-green-300">Payment Complete</h3>
              <p className="text-sm text-green-600 dark:text-green-400">Your Cash App payment has been approved</p>
            </div>
          </div>
        </div>
      )}

      {/* QR Code Dialog */}
      <Dialog open={showQRCode} onOpenChange={setShowQRCode}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Scan with Cash App</DialogTitle>
            <DialogDescription>
              Scan this QR code with Cash App to complete your payment of ${amount.toFixed(2)}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex flex-col items-center justify-center p-4">
            {qrCodeUrl && (
              <div className="border-4 border-white dark:border-gray-800 rounded-lg shadow-md mb-4">
                <img src={qrCodeUrl} alt="Payment QR Code" className="w-[200px] h-[200px]" />
              </div>
            )}
            
            <p className="text-sm text-center mb-4 text-muted-foreground">
              Open Cash App and scan this code to pay
            </p>
            
            <Button onClick={handleSimulateScan} className="w-full">
              Simulate Scan
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Simulated Payment Dialog */}
      <Dialog open={showSimulatedPaymentPage} onOpenChange={setShowSimulatedPaymentPage}>
        <DialogContent className="sm:max-w-md">
          <div className="bg-blue-600 dark:bg-blue-700 -m-6 p-4 mb-4">
            <h2 className="text-white text-lg font-medium">Cash App Pay</h2>
            <p className="text-blue-100 text-sm">Simulated payment page</p>
          </div>
          
          <div className="p-2">
            <div className="border-b pb-4 mb-4">
              <p className="text-lg font-medium">Amount: ${amount.toFixed(2)}</p>
              <p className="text-sm text-muted-foreground">Payment to Flavour Finder</p>
              <p className="text-xs mt-2 text-muted-foreground">Payment ID: {paymentIntentId}</p>
            </div>
            
            <div className="space-y-4">
              <Button
                onClick={handleAuthorizePayment}
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    AUTHORIZE TEST PAYMENT
                  </>
                )}
              </Button>
              
              <Button
                onClick={handleFailPayment}
                variant="outline"
                className="w-full border-red-300 text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <XCircle className="mr-2 h-4 w-4" />
                    FAIL TEST PAYMENT
                  </>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StripeQRPayment;
