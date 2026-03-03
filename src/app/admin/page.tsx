import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export default async function AdminPage() {
    const session = await auth();
    if (session?.user?.role !== "ADMIN") {
        return <div className="p-8 text-center text-red-600 bg-red-50 rounded-lg">Unauthorized Access</div>;
    }

    const users = await prisma.user.findMany({
        orderBy: { email: "asc" }
    });

    async function addUser(formData: FormData) {
        "use server";
        const session = await auth();
        if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");

        const email = formData.get("email") as string;
        const role = formData.get("role") as string;
        if (!email) return;

        await prisma.user.create({
            data: {
                email,
                role: role === "ADMIN" ? "ADMIN" : "USER",
                isActive: true,
            }
        });
        revalidatePath("/admin");
    }

    async function toggleAccess(id: string, currentStatus: boolean) {
        "use server";
        const session = await auth();
        if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");

        await prisma.user.update({
            where: { id },
            data: { isActive: !currentStatus }
        });
        revalidatePath("/admin");
    }

    return (
        <div className="space-y-8">
            <h1 className="text-3xl font-bold text-slate-900">Admin Dashboard</h1>

            <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h2 className="text-xl font-semibold mb-4">Add Permitted User</h2>
                <form action={addUser} className="flex gap-4 items-end">
                    <div className="flex-1">
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Address</label>
                        <input required type="email" name="email" id="email" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" placeholder="friend@example.com" />
                    </div>
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-slate-700">Role</label>
                        <select name="role" id="role" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 bg-white border">
                            <option value="USER">User (View Only)</option>
                            <option value="ADMIN">Admin (Manage Site)</option>
                        </select>
                    </div>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition h-10">
                        Add to Allowlist
                    </button>
                </form>
            </section>

            <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <h2 className="text-xl font-semibold mb-4">Permitted Users</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-slate-200">
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{user.role}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {user.isActive ? 'Active' : 'Revoked'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <form action={toggleAccess.bind(null, user.id, user.isActive)}>
                                            <button type="submit" className={`${user.isActive ? 'text-red-600 hover:text-red-900' : 'text-green-600 hover:text-green-900'}`}>
                                                {user.isActive ? 'Revoke Access' : 'Restore Access'}
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            ))}
                            {users.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-4 text-center text-sm text-slate-500">No users found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}
