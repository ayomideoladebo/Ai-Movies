import crypto from 'crypto';

// Verify Paystack webhook signature
export const verifyPaystackWebhook = (payload: any, signature: string, secret: string): boolean => {
  if (!signature) return false;

  const hash = crypto
    .createHmac('sha512', secret)
    .update(JSON.stringify(payload))
    .digest('hex');

  return hash === signature;
};

// Generate Paystack reference
export const generatePaystackRef = (userId: string): string => {
  return `ref_${Date.now()}_${userId}`;
};
