import express from 'express';
import { body, validationResult } from 'express-validator';
import { prisma } from '../lib/prisma';
import { adminMiddleware, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Apply admin middleware to all routes
router.use(adminMiddleware);

// Get dashboard stats
router.get('/stats', async (req: AuthRequest, res) => {
  try {
    const [
      totalUsers,
      premiumUsers,
      totalPayments,
      totalRevenue,
      recentPayments,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { subscriptionStatus: 'PREMIUM' } }),
      prisma.payment.count(),
      prisma.payment.aggregate({
        where: { status: 'COMPLETED' },
        _sum: { amount: true },
      }),
      prisma.payment.findMany({
        where: { status: 'COMPLETED' },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { user: { select: { email: true } } },
      }),
    ]);

    res.json({
      stats: {
        totalUsers,
        premiumUsers,
        freeUsers: totalUsers - premiumUsers,
        totalPayments,
        totalRevenue: totalRevenue._sum.amount || 0,
      },
      recentPayments,
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

// Get all users
router.get('/users', async (req: AuthRequest, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: Number(limit),
        select: {
          id: true,
          email: true,
          role: true,
          subscriptionStatus: true,
          createdAt: true,
          _count: { select: { payments: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.user.count(),
    ]);

    res.json({
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update user subscription
router.put('/users/:id/subscription', [
  body('subscriptionStatus').isIn(['FREE', 'PREMIUM']),
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { subscriptionStatus } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: { subscriptionStatus },
      select: {
        id: true,
        email: true,
        subscriptionStatus: true,
      },
    });

    // Log admin action
    await prisma.adminLog.create({
      data: {
        action: 'UPDATE_SUBSCRIPTION',
        adminId: req.user!.id,
        detail: `Updated ${user.email} subscription to ${subscriptionStatus}`,
      },
    });

    res.json({ user });
  } catch (error) {
    console.error('Admin update subscription error:', error);
    res.status(500).json({ error: 'Failed to update subscription' });
  }
});

// Get movie overrides
router.get('/content', async (req: AuthRequest, res) => {
  try {
    const overrides = await prisma.movieOverride.findMany({
      orderBy: { createdAt: 'desc' },
    });

    res.json({ overrides });
  } catch (error) {
    console.error('Admin content error:', error);
    res.status(500).json({ error: 'Failed to fetch content overrides' });
  }
});

// Create/update movie override
router.post('/content', [
  body('tmdbId').isInt(),
  body('featured').isBoolean(),
  body('manualCategory').optional().isString(),
  body('notes').optional().isString(),
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { tmdbId, featured, manualCategory, notes } = req.body;

    const override = await prisma.movieOverride.upsert({
      where: { tmdbId },
      update: { featured, manualCategory, notes },
      create: { tmdbId, featured, manualCategory, notes },
    });

    // Log admin action
    await prisma.adminLog.create({
      data: {
        action: 'UPDATE_CONTENT',
        adminId: req.user!.id,
        detail: `Updated movie override for TMDB ID ${tmdbId}`,
      },
    });

    res.json({ override });
  } catch (error) {
    console.error('Admin content update error:', error);
    res.status(500).json({ error: 'Failed to update content override' });
  }
});

// Delete movie override
router.delete('/content/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    await prisma.movieOverride.delete({
      where: { id },
    });

    // Log admin action
    await prisma.adminLog.create({
      data: {
        action: 'DELETE_CONTENT',
        adminId: req.user!.id,
        detail: `Deleted movie override ${id}`,
      },
    });

    res.json({ message: 'Content override deleted successfully' });
  } catch (error) {
    console.error('Admin content delete error:', error);
    res.status(500).json({ error: 'Failed to delete content override' });
  }
});

// Get admin logs
router.get('/logs', async (req: AuthRequest, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const [logs, total] = await Promise.all([
      prisma.adminLog.findMany({
        skip,
        take: Number(limit),
        include: {
          admin: { select: { email: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.adminLog.count(),
    ]);

    res.json({
      logs,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    console.error('Admin logs error:', error);
    res.status(500).json({ error: 'Failed to fetch admin logs' });
  }
});

export default router;
