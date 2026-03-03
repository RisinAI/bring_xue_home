import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { revalidatePath } from "next/cache";

export default async function Home() {
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";

  const updates = await prisma.update.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  async function createUpdate(formData: FormData) {
    "use server";
    const session = await auth();
    if (session?.user?.role !== "ADMIN" || !session.user.id) throw new Error("Unauthorized");

    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    if (!title || !content) return;

    await prisma.update.create({
      data: {
        title,
        content,
        authorId: session.user.id,
      },
    });

    revalidatePath("/");
  }

  return (
    <div className="space-y-10">
      <section className="text-center py-12 px-4 bg-white rounded-2xl shadow-sm border border-slate-100">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
          Support & Updates
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Welcome to the central hub for our friend's ongoing situation. Here you can find the latest updates, share your testimony, and find ways to support financially.
        </p>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-800">Latest Updates</h2>
        </div>

        {isAdmin && (
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
            <h3 className="text-lg font-semibold mb-4">Post a New Update</h3>
            <form action={createUpdate} className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-slate-700">Title</label>
                <input required type="text" name="title" id="title" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
              </div>
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-slate-700">Content</label>
                <textarea required name="content" id="content" rows={4} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border" />
              </div>
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
                Publish Update
              </button>
            </form>
          </div>
        )}

        <div className="space-y-6">
          {updates.length === 0 ? (
            <p className="text-slate-500 italic bg-white p-8 rounded-xl text-center border border-slate-100 shadow-sm">No updates posted yet.</p>
          ) : (
            updates.map((update) => (
              <article key={update.id} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 transition hover:shadow-md">
                <header className="mb-4">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{update.title}</h3>
                  <div className="text-sm text-slate-500 flex items-center space-x-2">
                    <span className="font-medium">{update.author.name || update.author.email || "Admin"}</span>
                    <span>&bull;</span>
                    <time dateTime={update.createdAt.toISOString()}>
                      {format(update.createdAt, "MMMM d, yyyy 'at' h:mm a")}
                    </time>
                  </div>
                </header>
                <div className="prose prose-slate max-w-none text-slate-700 whitespace-pre-wrap">
                  {update.content}
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
