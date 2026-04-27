import { Link } from "react-router-dom";

export const PrivacyPage = (): JSX.Element => {
  return (
    <div className="min-h-screen bg-surface px-6 py-12">
      <div className="mx-auto max-w-4xl">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-primary transition hover:underline"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          <span>Back to Project Hub</span>
        </Link>

        <header className="mt-8">
          <h1 className="font-headline text-5xl font-bold text-on-surface">
            Privacy Policy
          </h1>
          <p className="mt-4 text-on-surface-variant">
            Last updated: January 2025
          </p>
        </header>

        <div className="prose prose-invert mt-12 max-w-none">
          <section className="mb-12">
            <h2 className="mb-4 font-headline text-2xl font-semibold text-on-surface">
              Overview
            </h2>
            <p className="text-on-surface-variant">
              Preflight is a local-first application that runs entirely in your browser. We take
              your privacy seriously and have designed the application to minimize data collection
              and maximize user control.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 font-headline text-2xl font-semibold text-on-surface">
              Data Storage
            </h2>
            <p className="text-on-surface-variant">
              All your data is stored locally in your browser using IndexedDB. This includes:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-on-surface-variant">
              <li>Project information (names, descriptions, briefs)</li>
              <li>Generated artifacts (prompts, PRDs, build stages)</li>
              <li>Vault files (uploaded documents and context files)</li>
              <li>AI provider API keys (encrypted using AES-GCM)</li>
              <li>Application settings and preferences</li>
            </ul>
            <p className="mt-4 text-on-surface-variant">
              <strong>Important:</strong> Your data never leaves your device unless you explicitly
              export it or make API calls to AI providers.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 font-headline text-2xl font-semibold text-on-surface">
              API Keys and Encryption
            </h2>
            <p className="text-on-surface-variant">
              When you provide API keys for AI providers (Anthropic, OpenAI, Google, etc.):
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-on-surface-variant">
              <li>Keys are encrypted using AES-GCM encryption before storage</li>
              <li>Encryption keys are stored in your browser's localStorage</li>
              <li>Keys are only decrypted when making API calls to AI providers</li>
              <li>We never transmit your API keys to our servers (we don't have servers)</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 font-headline text-2xl font-semibold text-on-surface">
              Third-Party Services
            </h2>
            <p className="text-on-surface-variant">
              Preflight integrates with third-party AI providers. When you use these services:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-on-surface-variant">
              <li>
                Your prompts and content are sent directly to the AI provider you've configured
              </li>
              <li>Each provider has their own privacy policy and data handling practices</li>
              <li>We recommend reviewing the privacy policies of:
                <ul className="mt-2 list-circle space-y-1 pl-6">
                  <li>Anthropic: https://www.anthropic.com/privacy</li>
                  <li>OpenAI: https://openai.com/privacy</li>
                  <li>Google: https://policies.google.com/privacy</li>
                </ul>
              </li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 font-headline text-2xl font-semibold text-on-surface">
              Analytics and Monitoring
            </h2>
            <p className="text-on-surface-variant">
              We may collect anonymous usage analytics to improve the application, including:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-on-surface-variant">
              <li>Page views and navigation patterns</li>
              <li>Feature usage (which modules are used most)</li>
              <li>Error reports (to fix bugs and improve stability)</li>
            </ul>
            <p className="mt-4 text-on-surface-variant">
              <strong>We do NOT collect:</strong>
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-on-surface-variant">
              <li>Personal information (names, emails, addresses)</li>
              <li>Project content or generated artifacts</li>
              <li>API keys or credentials</li>
              <li>Uploaded files or vault content</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 font-headline text-2xl font-semibold text-on-surface">
              GDPR Compliance
            </h2>
            <p className="text-on-surface-variant">
              As a local-first application with no server-side data storage, Preflight is inherently
              GDPR-compliant:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-on-surface-variant">
              <li>You have full control over your data</li>
              <li>You can export all data at any time (Settings → Storage → Export JSON)</li>
              <li>You can delete all data at any time (Settings → Storage → Clear All Data)</li>
              <li>No data is shared with third parties without your explicit action</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 font-headline text-2xl font-semibold text-on-surface">
              Cookies
            </h2>
            <p className="text-on-surface-variant">
              Preflight does not use cookies. All application state is managed through browser
              storage APIs (IndexedDB and localStorage).
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 font-headline text-2xl font-semibold text-on-surface">
              Changes to This Policy
            </h2>
            <p className="text-on-surface-variant">
              We may update this privacy policy from time to time. Changes will be posted on this
              page with an updated "Last updated" date.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 font-headline text-2xl font-semibold text-on-surface">
              Contact
            </h2>
            <p className="text-on-surface-variant">
              If you have questions about this privacy policy, please open an issue on our GitHub
              repository:{" "}
              <a
                href="https://github.com/Meykiio/preflight/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                github.com/Meykiio/preflight/issues
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};
