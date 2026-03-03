import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { revalidatePath } from "next/cache";
import TestimonyForm from "./TestimonyForm";

export default async function TestimoniesPage() {
    const session = await auth();

    // Public users see approved and public testimonies
    // Admins see all testimonies
    const isAdmin = session?.user?.role === "ADMIN";

    const testimonies = await prisma.testimony.findMany({
        where: isAdmin
            ? undefined
            : { isPublic: true, isApproved: true },
        orderBy: { createdAt: "desc" },
    });

    async function submitTestimony(formData: FormData) {
        "use server";
        const authorName = formData.get("authorName") as string;
        const content = formData.get("content") as string;
        const isPublic = formData.get("isPublic") === "true"; // Assuming radio or hidden input

        if (!authorName || !content) return;

        await prisma.testimony.create({
            data: {
                authorName,
                content,
                isPublic,
                // Require admin approval before showing public ones
                isApproved: false,
            },
        });

        revalidatePath("/testimonies");
    }

    async function approveTestimony(id: string, currentStatus: boolean) {
        "use server";
        const session = await auth();
        if (session?.user?.role !== "ADMIN") throw new Error("Unauthorized");

        await prisma.testimony.update({
            where: { id },
            data: { isApproved: !currentStatus },
        });
        revalidatePath("/testimonies");
    }

    return (
        <div className="space-y-10">
            <section className="text-center py-10 px-4 bg-gradient-to-b from-blue-50 to-white rounded-2xl shadow-sm border border-blue-100">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
                    Testimonies & Messages
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    Leave a message, share a memory, or write a testimony. You can choose to make it public (visible on this page after approval) or keep it private (only seen by the family/admin team).
                </p>
            </section>

            <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Leave a Message</h2>
                <TestimonyForm onSubmit={submitTestimony} />
            </section>

            <section>
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Read Testimonies</h2>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {testimonies.length === 0 ? (
                        <div className="col-span-full text-center p-12 bg-white rounded-2xl border border-slate-100">
                            <p className="text-slate-500 italic">No testimonies available yet.</p>
                        </div>
                    ) : (
                        testimonies.map((testimony) => (
                            <article key={testimony.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col relative">
                                {isAdmin && (
                                    <div className="absolute top-4 right-4 flex space-x-2">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${testimony.isPublic ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-800"}`}>
                                            {testimony.isPublic ? "Public Request" : "Private"}
                                        </span>
                                        <form action={approveTestimony.bind(null, testimony.id, testimony.isApproved)}>
                                            <button type="submit" className={`text-xs px-2 py-1 rounded-md font-medium text-white transition ${testimony.isApproved ? "bg-amber-500 hover:bg-amber-600" : "bg-blue-600 hover:bg-blue-700"}`}>
                                                {testimony.isApproved ? "Unapprove" : "Approve"}
                                            </button>
                                        </form>
                                    </div>
                                )}

                                <div className="flex-1 mb-4 pt-6">
                                    <p className="text-slate-700 italic">"{testimony.content}"</p>
                                </div>
                                <footer className="mt-auto border-t border-slate-100 pt-4">
                                    <p className="font-semibold text-slate-900">{testimony.authorName}</p>
                                    <time className="text-xs text-slate-500" dateTime={testimony.createdAt.toISOString()}>
                                        {format(testimony.createdAt, "MMM d, yyyy")}
                                    </time>
                                </footer>
                            </article>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}
