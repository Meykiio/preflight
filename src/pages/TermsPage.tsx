import { Link } from "react-router-dom";

export const TermsPage = (): JSX.Element => {
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
            Terms of Service
          </h1>
          <p className="mt-4 text-on-surface-variant">
            Last updated: January 2025
          </p>
        </header>

        <div className="prose prose-invert mt-12 max-w-none">
          <section className="mb-12">
            <h2 className="mb-4 font-headline text-2xl font-semibold text-on-surface">
              Acceptance of Terms
            </h2>
            <p className="text-on-surface-variant">
              By accessing and using Preflight, you accept and agree to be bound by these Terms of
              Service. If you do not agree to these terms, please do not use the application.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 font-headline text-2xl font-semibold text-on-surface">
              Description of Service
            </h2>
            <p className="text-on-surface-variant">
              Preflight is an open-source, local-first project management tool designed to help
              developers plan and build applications with AI assistance. The service is provided
              "as is" without warranties of any kind.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 font-headline text-2xl font-semibold text-on-surface">
              User Responsibilities
            </h2>
            <p className="text-on-surface-variant">
              As a user of Preflight, you agree to:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-on-surface-variant">
              <li>Use the application in compliance with all applicable laws and regulations</li>
              <li>Maintain the security of your API keys and credentials</li>
              <li>Not use the application for any illegal or unauthorized purpose</li>
              <li>Not attempt to reverse engineer, decompile, or disassemble the application</li>
              <li>Respect the terms of service of third-party AI providers you integrate with</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 font-headline text-2xl font-semibold text-on-surface">
              API Keys and Third-Party Services
            </h2>
            <p className="text-on-surface-variant">
              Preflight integrates with third-party AI providers (Anthropic, OpenAI, Google, etc.):
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-on-surface-variant">
              <li>You are responsible for obtaining and managing your own API keys</li>
              <li>You must comply with each provider's terms of service and usage policies</li>
              <li>API usage costs are your responsibility</li>
              <li>We are not liable for any issues arising from third-party service usage</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 font-headline text-2xl font-semibold text-on-surface">
              Data and Privacy
            </h2>
            <p className="text-on-surface-variant">
              Preflight is a local-first application:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-on-surface-variant">
              <li>All data is stored locally in your browser</li>
              <li>You are responsible for backing up your data</li>
              <li>We do not have access to your projects, files, or API keys</li>
              <li>Clearing browser data will delete all Preflight data</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 font-headline text-2xl font-semibold text-on-surface">
              Intellectual Property
            </h2>
            <p className="text-on-surface-variant">
              Preflight is open-source software licensed under the MIT License:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-on-surface-variant">
              <li>You may use, modify, and distribute the software</li>
              <li>Attribution to the original authors is required</li>
              <li>The software is provided without warranty</li>
              <li>Content you create using Preflight belongs to you</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 font-headline text-2xl font-semibold text-on-surface">
              Disclaimer of Warranties
            </h2>
            <p className="text-on-surface-variant">
              Preflight is provided "as is" and "as available" without warranties of any kind,
              either express or implied, including but not limited to:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-on-surface-variant">
              <li>Warranties of merchantability or fitness for a particular purpose</li>
              <li>Warranties that the service will be uninterrupted or error-free</li>
              <li>Warranties regarding the accuracy or reliability of generated content</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 font-headline text-2xl font-semibold text-on-surface">
              Limitation of Liability
            </h2>
            <p className="text-on-surface-variant">
              To the maximum extent permitted by law, the Preflight team shall not be liable for:
            </p>
            <ul className="mt-4 list-disc space-y-2 pl-6 text-on-surface-variant">
              <li>Any indirect, incidental, special, or consequential damages</li>
              <li>Loss of data, profits, or business opportunities</li>
              <li>Damages arising from third-party service failures</li>
              <li>Damages resulting from unauthorized access to your data</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 font-headline text-2xl font-semibold text-on-surface">
              Changes to Terms
            </h2>
            <p className="text-on-surface-variant">
              We reserve the right to modify these terms at any time. Changes will be posted on
              this page with an updated "Last updated" date. Continued use of Preflight after
              changes constitutes acceptance of the new terms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 font-headline text-2xl font-semibold text-on-surface">
              Termination
            </h2>
            <p className="text-on-surface-variant">
              You may stop using Preflight at any time. We reserve the right to terminate or
              suspend access to the service for violations of these terms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 font-headline text-2xl font-semibold text-on-surface">
              Governing Law
            </h2>
            <p className="text-on-surface-variant">
              These terms shall be governed by and construed in accordance with applicable laws,
              without regard to conflict of law principles.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="mb-4 font-headline text-2xl font-semibold text-on-surface">
              Contact
            </h2>
            <p className="text-on-surface-variant">
              For questions about these terms, please open an issue on our GitHub repository:{" "}
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
