import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { Lock } from "lucide-react"

export default function AccessPage() {
    async function verifyCode(formData: FormData) {
        "use server"

        // We get the code entered by the user
        const code = formData.get("code")

        // Check if it matches exactly "Xue1976"
        if (code === "Xue1976") {
            // Set a secure, HTTP-only cookie indicating they proved access
            const cookieStore = await cookies()
            cookieStore.set("site_access", "true", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                maxAge: 60 * 60 * 24 * 30 // 30 days
            })

            // Send them to the homepage
            redirect("/")
        } else {
            // If code is wrong, redirect them back to the access page so they can try again.
            // (Using a simple redirect here to keep it lean vs complex error state handling)
            redirect("/access?error=1")
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-green-50/30 px-4">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-green-100 max-w-sm w-full text-center">

                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-6 h-6 text-green-700" />
                </div>

                <h1 className="text-2xl font-semibold text-gray-900 mb-2">Private Access</h1>
                <p className="text-gray-600 mb-6 text-sm">Please enter the access code to view the support hub.</p>

                <form action={verifyCode} className="space-y-4">
                    <div>
                        <input
                            type="password"
                            name="code"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                            placeholder="Enter Access Code"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-xl transition-colors"
                    >
                        Enter Site
                    </button>
                </form>
            </div>
        </div>
    )
}
