import { PrismaClient, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@movieapp.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

  // Hash the admin password
  const hashedPassword = await bcrypt.hash(adminPassword, 12);

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      passwordHash: hashedPassword,
      role: Role.ADMIN,
      subscriptionStatus: 'PREMIUM',
    },
  });

  console.log('Admin user created:', { email: admin.email, role: admin.role });

  // Create some sample movie overrides
  await prisma.movieOverride.upsert({
    where: { tmdbId: 550 },
    update: {},
    create: {
      tmdbId: 550,
      featured: true,
      manualCategory: 'Classic Drama',
      notes: 'Featured classic film',
    },
  });

  await prisma.movieOverride.upsert({
    where: { tmdbId: 13 },
    update: {},
    create: {
      tmdbId: 13,
      featured: true,
      manualCategory: 'Thriller',
      notes: 'Editor\'s pick',
    },
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
