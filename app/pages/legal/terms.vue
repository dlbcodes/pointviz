<!-- app/pages/terms.vue -->
<script setup lang="ts">
definePageMeta({ layout: "default" });

useSeoMeta({
    title: "Terms of Service",
    description:
        "Read the Terms of Service for PointViz, the AI-powered chart builder.",
    ogTitle: "Terms of Service | PointViz",
    ogDescription: "Read the Terms of Service for PointViz.",
    ogUrl: "https://www.pointviz.co/terms",
});

useHead({
    link: [{ rel: "canonical", href: "https://www.pointviz.co/terms" }],
});
</script>

<template>
    <div class="mx-auto max-w-3xl px-6 py-24">
        <!-- Header -->
        <div class="mb-12 text-center">
            <h1
                class="font-display text-4xl font-semibold tracking-tight text-text-primary sm:text-5xl"
            >
                Terms of Service
            </h1>
            <p class="mt-4 text-sm text-text-tertiary">
                Last updated: September 10, 2026
            </p>
        </div>

        <!-- Content Wrapper with Prose -->
        <div
            class="prose prose-slate mx-auto max-w-none prose-headings:font-display prose-headings:tracking-tight prose-a:text-chart-teal prose-a:no-underline hover:prose-a:underline"
        >
            <h2>1. Acceptance of Terms</h2>
            <p>
                By accessing or using PointViz ("the Service"), you agree to be
                bound by these Terms of Service. If you do not agree to these
                terms, please do not use the Service.
            </p>

            <h2>2. Description of Service</h2>
            <p>
                PointViz is an AI-powered data visualization tool that allows
                users to generate, customize, and share interactive charts based
                on user-provided data (e.g., CSV, JSON, or copy-pasted text).
            </p>

            <h2>3. User Accounts and Responsibilities</h2>
            <ul>
                <li>
                    You are responsible for maintaining the confidentiality of
                    your account credentials.
                </li>
                <li>
                    You agree not to upload any data that is illegal, malicious,
                    or infringes on the intellectual property rights of others.
                </li>
                <li>
                    You are solely responsible for the accuracy and legality of
                    the data you upload to the Service.
                </li>
            </ul>

            <h2>4. Intellectual Property</h2>
            <p>
                <strong>Your Data:</strong> You retain all ownership and
                intellectual property rights to the data you upload.
            </p>
            <p>
                <strong>Our Platform:</strong> PointViz retains all rights to
                the underlying software, design, AI prompts, and branding of the
                Service.
            </p>
            <p>
                <strong>Generated Charts:</strong> You are granted a license to
                use, share, and embed the charts you generate for personal or
                commercial purposes, subject to your subscription tier.
            </p>

            <h2>5. Acceptable Use</h2>
            <p>You agree not to:</p>
            <ul>
                <li>
                    Use the Service to generate charts that are deceptive,
                    misleading, or intended to defraud.
                </li>
                <li>
                    Attempt to reverse-engineer, scrape, or overload the
                    Service’s infrastructure.
                </li>
                <li>
                    Use the Service in violation of any applicable local,
                    national, or international laws.
                </li>
            </ul>

            <h2>6. Limitation of Liability</h2>
            <p>
                The Service is provided "as is" and "as available." PointViz
                does not guarantee that the AI will always generate perfectly
                accurate visualizations. We are not liable for any direct,
                indirect, or consequential damages arising from your use of the
                Service or reliance on the generated charts.
            </p>

            <h2>7. Termination</h2>
            <p>
                We reserve the right to suspend or terminate your access to the
                Service at our sole discretion, without notice, for conduct that
                we believe violates these Terms or is harmful to other users or
                the Service.
            </p>

            <h2>8. Contact</h2>
            <p>
                For any questions regarding these Terms, please contact us at:
                <a href="mailto:hello@pointviz.co">hello@pointviz.co</a>
            </p>
        </div>
    </div>
</template>
