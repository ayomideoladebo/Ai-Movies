import { verifyPaystackWebhook } from '../utils/paystack';

// Mock crypto for webhook verification
jest.mock('crypto', () => ({
  createHmac: jest.fn(() => ({
    update: jest.fn(() => ({
      digest: jest.fn(() => 'mock_signature'),
    })),
  })),
}));

describe('Paystack Utils', () => {
  describe('verifyPaystackWebhook', () => {
    it('should verify valid webhook signature', () => {
      const payload = { event: 'charge.success', data: { reference: 'test_ref' } };
      const signature = 'mock_signature';
      const secret = 'test_secret';

      const isValid = verifyPaystackWebhook(payload, signature, secret);

      expect(isValid).toBe(true);
    });

    it('should reject invalid webhook signature', () => {
      const payload = { event: 'charge.success', data: { reference: 'test_ref' } };
      const signature = 'invalid_signature';
      const secret = 'test_secret';

      const isValid = verifyPaystackWebhook(payload, signature, secret);

      expect(isValid).toBe(false);
    });

    it('should handle missing signature', () => {
      const payload = { event: 'charge.success', data: { reference: 'test_ref' } };
      const signature = '';
      const secret = 'test_secret';

      const isValid = verifyPaystackWebhook(payload, signature, secret);

      expect(isValid).toBe(false);
    });
  });
});
