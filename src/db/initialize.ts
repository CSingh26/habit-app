import { db } from './client';
import { runMigrations } from './migrations';
import { seedDemoData } from '@/seed/demoSeed';
import { ENABLE_DEMO_SEED } from '@/config/dev';

let initialized = false;

export async function initializeDatabase() {
  if (initialized) {
    return;
  }

  await runMigrations(db);

  if (__DEV__ && ENABLE_DEMO_SEED) {
    await seedDemoData(db);
  }

  initialized = true;
}
