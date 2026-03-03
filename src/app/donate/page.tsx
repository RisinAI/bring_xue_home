import { auth } from "@/auth";

export default async function DonatePage() {
    await auth();

    return (
        <div className="space-y-10">
            <section className="text-center py-10 px-4 bg-gradient-to-b from-green-50 to-white rounded-2xl shadow-sm border border-green-100">
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
                    Support the Legal Fund
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
                    Your contributions make a tremendous difference in ensuring our friend has the resources they need to navigate this situation.
                </p>
            </section>

            <section className="grid gap-6 md:grid-cols-2">
                {/* Replace the hrefs and content with actual donation targets when available */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md transition">
                    <div className="h-16 w-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                        P
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">PayPal</h2>
                    <p className="text-slate-600 mb-6">
                        Make a direct contribution to the legal defense fund campaign.
                    </p>
                    <a
                        href="https://www.paypal.com/paypalme/BringXueHome"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-[#0070ba] text-white font-medium px-6 py-3 rounded-lg hover:bg-[#003087] transition"
                    >
                        Donate via PayPal
                    </a>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center hover:shadow-md transition">
                    <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
                        G
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">GoFundMe</h2>
                    <p className="text-slate-600 mb-6">
                        Make a direct contribution to the official GoFundMe campaign.
                    </p>
                    <a
                        href="https://www.gofundme.com/f/bring-xue-lor-home"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-emerald-600 text-white font-medium px-6 py-3 rounded-lg hover:bg-emerald-700 transition"
                    >
                        Donate via GoFundMe
                    </a>
                </div>
            </section>

            <section className="bg-slate-50 p-6 md:p-8 rounded-2xl border border-slate-200">
                <h3 className="text-xl font-semibold text-slate-800 mb-3">Other Ways to Help</h3>
                <ul className="list-disc list-inside text-slate-700 space-y-2">
                    <li>Share the <a href="#" className="font-medium text-blue-600 hover:underline">GoFundMe campaign</a> on your social media.</li>
                    <li>Leave an encouraging public message on the <a href="/testimonies" className="font-medium text-blue-600 hover:underline">Testimonies</a> page.</li>
                    <li>Keep the family in your thoughts and prayers.</li>
                </ul>
            </section>
        </div>
    );
}
