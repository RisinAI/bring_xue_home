import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    const email = process.argv[2] || "admin@example.com";

    const user = await prisma.user.upsert({
        where: { email },
        update: {
            role: "ADMIN",
            isActive: true,
        },
        create: {
            email,
            role: "ADMIN",
            isActive: true,
        },
    });

    console.log(`Seeded admin user: ${user.email}`);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
