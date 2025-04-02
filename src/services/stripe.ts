
// This is a simulation service that mimics Stripe API calls
// In a production environment, these would be actual API calls to Stripe

// Simulate creating a payment intent
export const createPaymentIntentWithStripe = async (amount: number, customerEmail?: string): Promise<{id: string}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Generate a fake payment intent ID (would come from Stripe in production)
  const paymentIntentId = `pi_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
  
  console.log(`Created payment intent ${paymentIntentId} for amount $${amount.toFixed(2)}`);
  
  // In production, this would store the payment intent in your database
  localStorage.setItem(`payment_intent_${paymentIntentId}`, JSON.stringify({
    id: paymentIntentId,
    amount,
    status: 'created',
    customerEmail,
    createdAt: new Date().toISOString()
  }));
  
  return { id: paymentIntentId };
};

// Simulate checking payment status
export const checkPaymentStatus = async (paymentIntentId: string): Promise<{status: string}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // In production, this would fetch the payment intent status from Stripe
  const storedPaymentIntent = localStorage.getItem(`payment_intent_${paymentIntentId}`);
  
  if (!storedPaymentIntent) {
    return { status: 'not_found' };
  }
  
  const paymentIntent = JSON.parse(storedPaymentIntent);
  return { status: paymentIntent.status };
};

// Simulate updating a payment intent
export const updatePaymentStatus = async (paymentIntentId: string, status: string): Promise<{status: string}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  const storedPaymentIntent = localStorage.getItem(`payment_intent_${paymentIntentId}`);
  
  if (!storedPaymentIntent) {
    return { status: 'not_found' };
  }
  
  const paymentIntent = JSON.parse(storedPaymentIntent);
  paymentIntent.status = status;
  paymentIntent.updatedAt = new Date().toISOString();
  
  localStorage.setItem(`payment_intent_${paymentIntentId}`, JSON.stringify(paymentIntent));
  
  console.log(`Updated payment intent ${paymentIntentId} status to ${status}`);
  
  return { status };
};
