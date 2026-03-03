"use client";

import { useState } from "react";

export default function TestimonyForm({
    onSubmit,
}: {
    onSubmit: (formData: FormData) => Promise<void>;
}) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    async function handleAction(formData: FormData) {
        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            setSubmitted(true);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (submitted) {
        return (
            <div className="text-center p-8 bg-green-50 rounded-xl border border-green-200">
                <h3 className="text-xl font-bold text-green-800 mb-2">Thank you!</h3>
                <p className="text-green-700">Your message has been received.</p>
                <button
                    onClick={() => setSubmitted(false)}
                    className="mt-4 text-sm font-medium text-green-600 hover:text-green-800 underline"
                >
                    Submit another message
                </button>
            </div>
        );
    }

    return (
        <form action={handleAction} className="space-y-6">
            <div>
                <label htmlFor="authorName" className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
                <input
                    required
                    type="text"
                    name="authorName"
                    id="authorName"
                    placeholder="Jane Doe"
                    className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                />
            </div>
            <div>
                <label htmlFor="content" className="block text-sm font-medium text-slate-700 mb-1">Your Message or Testimony</label>
                <textarea
                    required
                    name="content"
                    id="content"
                    rows={5}
                    placeholder="Share your thoughts..."
                    className="block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-3 border"
                />
            </div>

            <fieldset>
                <legend className="text-sm font-medium text-slate-700 mb-2">Privacy Preference</legend>
                <div className="space-y-3 sm:flex sm:space-y-0 sm:space-x-6">
                    <div className="flex items-center">
                        <input
                            id="privacy-public"
                            name="isPublic"
                            type="radio"
                            value="true"
                            defaultChecked
                            className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-600"
                        />
                        <label htmlFor="privacy-public" className="ml-3 block text-sm font-medium text-slate-700">
                            Public <span className="text-slate-500 font-normal">(Visible to approved visitors)</span>
                        </label>
                    </div>
                    <div className="flex items-center">
                        <input
                            id="privacy-private"
                            name="isPublic"
                            type="radio"
                            value="false"
                            className="h-4 w-4 border-slate-300 text-blue-600 focus:ring-blue-600"
                        />
                        <label htmlFor="privacy-private" className="ml-3 block text-sm font-medium text-slate-700">
                            Private <span className="text-slate-500 font-normal">(Only visible to family/admins)</span>
                        </label>
                    </div>
                </div>
            </fieldset>

            <div>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto flex justify-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-70"
                >
                    {isSubmitting ? "Submitting..." : "Submit Testimony"}
                </button>
            </div>
        </form>
    );
}
