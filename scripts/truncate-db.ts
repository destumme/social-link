import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const connectionString = process.env.DATABASE_URL ?? "";

if (!connectionString) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  const tables = [
    '"public"."Trait"',
    '"public"."Connection"',
    '"public"."ConnectionGroup"',
    '"public"."user"',
    '"public"."session"',
    '"public"."auth_account"',
    '"public"."verification"',
  ];

  console.log("Truncating all tables...");

  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE ${tables.join(", ")} RESTART IDENTITY CASCADE`,
  );

  console.log("All tables truncated successfully.");

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error("Failed to truncate tables:", error);
  process.exit(1);
});
