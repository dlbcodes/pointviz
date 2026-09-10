<!-- app/pages/privacy.vue -->
<script setup lang="ts">
definePageMeta({ layout: "default" });

useSeoMeta({
    title: "Privacy Policy",
    description:
        "Read the Privacy Policy for PointViz. Learn how we collect, use, and protect your data when you build and share charts.",
    ogTitle: "Privacy Policy | PointViz",
    ogDescription:
        "Learn how PointViz handles your data and protects your privacy.",
    ogUrl: "https://www.pointviz.co/privacy",
});

useHead({
    link: [{ rel: "canonical", href: "https://www.pointviz.co/privacy" }],
});
</script>

<template>
    <div class="mx-auto max-w-3xl px-6 py-24">
        <!-- Header -->
        <div class="mb-12 text-center">
            <h1
                class="font-display text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl"
            >
                Privacy Policy
            </h1>
            <p class="mt-4 text-sm text-text-tertiary">
                Last updated: September 10, 2026
            </p>
        </div>

        <!-- Content Wrapper with Prose -->
        <div
            class="prose prose-slate mx-auto max-w-none prose-headings:font-display prose-headings:tracking-tight prose-a:text-chart-teal prose-a:no-underline hover:prose-a:underline"
        >
            <h2>1. Introduction</h2>
            <p>
                At PointViz, we are committed to protecting your privacy. This
                Privacy Policy explains how we collect, use, and safeguard your
                information when you use our AI-powered charting service.
            </p>

            <h2>2. Information We Collect</h2>
            <ul>
                <li>
                    <strong>Account Information:</strong> Email address and
                    authentication data (managed securely via Supabase).
                </li>
                <li>
                    <strong>User Data:</strong> The datasets (CSV, JSON, text)
                    you upload or paste to generate charts.
                </li>
                <li>
                    <strong>Usage Data:</strong> Anonymous analytics about how
                    you interact with the Service (e.g., features used, chart
                    types generated), collected via privacy-friendly tools like
                    Umami.
                </li>
            </ul>

            <h2>3. How We Use Your Information</h2>
            <p>We use your information strictly to:</p>
            <ul>
                <li>Provide, maintain, and improve the PointViz Service.</li>
                <li>Generate and render your requested charts.</li>
                <li>
                    Communicate with you about your account or Service updates.
                </li>
            </ul>
            <p>
                <strong>Crucially:</strong> We DO NOT use your uploaded data to
                train public AI models. Your data is processed solely to
                generate your specific chart and is kept strictly confidential.
            </p>

            <h2>4. Data Sharing and Third Parties</h2>
            <p>
                We do not sell your data. We only share information with trusted
                third-party service providers necessary to operate the Service,
                such as:
            </p>
            <ul>
                <li>
                    <strong>Hosting & Database:</strong> Vercel and Supabase for
                    secure data storage and authentication.
                </li>
                <li>
                    <strong>Analytics:</strong> Umami for anonymous,
                    privacy-first website analytics.
                </li>
            </ul>

            <h2>5. Data Retention and Deletion</h2>
            <ul>
                <li>
                    You can delete your uploaded datasets and generated charts
                    at any time directly from your dashboard.
                </li>
                <li>
                    Upon deletion, your data is permanently removed from our
                    active servers within 30 days.
                </li>
                <li>
                    We may retain anonymized, aggregated data for analytical
                    purposes.
                </li>
            </ul>

            <h2>6. Security</h2>
            <p>
                We implement industry-standard security measures (including
                encryption in transit and at rest) to protect your data.
                However, no method of transmission over the internet is 100%
                secure, and we cannot guarantee absolute security.
            </p>

            <h2>7. Your Rights</h2>
            <p>
                Depending on your location, you may have the right to access,
                correct, or delete your personal data. You can exercise these
                rights by contacting us or managing your account settings
                directly within the app.
            </p>

            <h2>8. Children’s Privacy</h2>
            <p>
                The Service is not intended for individuals under the age of 13.
                We do not knowingly collect personal information from children.
            </p>

            <h2>9. Changes to This Policy</h2>
            <p>
                We may update this Privacy Policy from time to time. We will
                notify you of any significant changes by posting the new policy
                on this page and updating the "Last Updated" date.
            </p>

            <h2>10. Contact Us</h2>
            <p>
                If you have any questions about this Privacy Policy or your
                data, please contact us at:
                <a href="mailto:hello@pointviz.co">hello@pointviz.co</a>
            </p>
        </div>
    </div>
</template>
