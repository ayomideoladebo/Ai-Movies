import express from 'express';
import axios from 'axios';
import { body, validationResult } from 'express-validator';
import { prisma } from '../lib/prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_PUBLIC_KEY = process.env.PAYSTACK_PUBLIC_KEY;

// Initialize payment
router.post('/init', authMiddleware, [
  body('amount').isNumeric().isFloat({ min: 1 }),
  body('email').isEmail(),
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { amount, email } = req.body;
    const userId = req.user!.id;

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        userId,
        paystackRef: `ref_${Date.now()}_${userId}`,
        amount: parseFloat(amount),
        status: 'PENDING',
      },
    });

    // Initialize Paystack transaction
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount: amount * 100, // Convert to kobo
        reference: payment.paystackRef,
        callback_url: `${process.env.FRONTEND_URL}/payment/callback`,
        metadata: {
          userId,
          paymentId: payment.id,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({
      authorization_url: response.data.data.authorization_url,
      access_code: response.data.data.access_code,
      reference: payment.paystackRef,
    });
  } catch (error) {
    console.error('Paystack init error:', error);
    res.status(500).json({ error: 'Failed to initialize payment' });
  }
});

// Verify payment
router.get('/verify/:reference', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { reference } = req.params;

    // Verify with Paystack
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const { status, amount, reference: ref } = response.data.data;

    if (status === 'success') {
      // Update payment record
      await prisma.payment.update({
        where: { paystackRef: ref },
        data: {
          status: 'COMPLETED',
        },
      });

      // Update user subscription
      await prisma.user.update({
        where: { id: req.user!.id },
        data: {
          subscriptionStatus: 'PREMIUM',
        },
      });

      res.json({
        success: true,
        message: 'Payment verified successfully',
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Payment verification failed',
      });
    }
  } catch (error) {
    console.error('Paystack verify error:', error);
    res.status(500).json({ error: 'Failed to verify payment' });
  }
});

// Webhook handler
router.post('/webhook', async (req, res) => {
  try {
    const { event, data } = req.body;

    if (event === 'charge.success') {
      const { reference, amount, customer } = data;

      // Update payment record
      await prisma.payment.update({
        where: { paystackRef: reference },
        data: {
          status: 'COMPLETED',
        },
      });

      // Get user from payment record
      const payment = await prisma.payment.findUnique({
        where: { paystackRef: reference },
        include: { user: true },
      });

      if (payment) {
        // Update user subscription
        await prisma.user.update({
          where: { id: payment.userId },
          data: {
            subscriptionStatus: 'PREMIUM',
          },
        });
      }
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Paystack webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

// Get payment history
router.get('/history', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const payments = await prisma.payment.findMany({
      where: { userId: req.user!.id },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ payments });
  } catch (error) {
    console.error('Payment history error:', error);
    res.status(500).json({ error: 'Failed to fetch payment history' });
  }
});

export default router;
