import { runSeed, upsertAdminUser } from './seedLogic.js'

async function seed() {
  await runSeed()
  await upsertAdminUser()
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seeding failed:', err)
    process.exit(1)
  })
