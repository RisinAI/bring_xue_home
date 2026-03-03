import NextAuth from "next-auth"
import Nodemailer from "next-auth/providers/nodemailer"
import { PrismaAdapter } from "@auth/prisma-adapter"
import prisma from "./lib/prisma"

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(prisma) as any,
    providers: [
        Nodemailer({
            id: "email",
            name: "Email",
            server: process.env.EMAIL_SERVER,
            from: process.env.EMAIL_FROM,
            sendVerificationRequest({ identifier, url, provider }) {
                console.log(`\n======================================================`);
                console.log(`MAGIC LINK FOR ${identifier}:`);
                console.log(`${url}`);
                console.log(`======================================================\n`);
            },
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            if (!user.email) return false
            // Only allow users that exist in our database and are active
            const dbUser = await prisma.user.findUnique({
                where: { email: user.email },
            })
            if (!dbUser || !dbUser.isActive) {
                return false // Deny access
            }
            return true
        },
        async session({ session, user }) {
            if (session.user && user.id) {
                session.user.id = user.id
                // Ensure role is available on session
                const dbUser = await prisma.user.findUnique({ where: { id: user.id } })
                session.user.role = dbUser?.role || "USER"
            }
            return session
        },
    },
})
