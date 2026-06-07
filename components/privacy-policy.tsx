import { MailtoLink } from "@/components/mailto-link";

const CONTACT_EMAIL = "pratik-kubal@outlook.com";

const THIRD_PARTIES = [
  { name: "Spotify", what: "embedded music widget", policy: "Spotify's Privacy Policy" },
  { name: "GitHub", what: "linked profile", policy: "GitHub's Privacy Policy" },
  { name: "LinkedIn", what: "linked profile", policy: "LinkedIn's Privacy Policy" },
  { name: "Anthropic Claude API", what: "powers the AI interview assistant", policy: "Anthropic's Privacy Policy" },
];

function Num({ n }: { n: string }) {
  return <span className="pp-sec__num" aria-hidden="true">{n}</span>;
}

export function PrivacyPolicy() {
  return (
    <article className="pp-article page-transition">
      {/* Masthead */}
      <header className="pp-masthead">
        <div className="pp-eyebrow">Legal · Data &amp; Privacy</div>
        <h1 className="pp-title">Privacy Policy</h1>
        <div className="pp-domain">pratik-kubal.com</div>
        <dl className="pp-dates">
          <div>
            <dt>Effective</dt>
            <dd>June 7, 2026</dd>
          </div>
          <div>
            <dt>Last Updated</dt>
            <dd>June 7, 2026</dd>
          </div>
        </dl>
      </header>

      {/* 1 */}
      <section className="pp-sec" id="overview">
        <Num n="01" />
        <div className="pp-sec__body">
          <h2 className="pp-h2">Overview</h2>
          <p className="pp-p">
            This Privacy Policy explains how Pratik Kubal (&ldquo;I&rdquo;,
            &ldquo;me&rdquo;, or &ldquo;my&rdquo;) collects, uses, and protects
            information when you visit pratik-kubal.com (the &ldquo;Site&rdquo;).
            I am committed to handling your data responsibly and transparently.
          </p>
          <p className="pp-p">
            By using the Site, you agree to the practices described in this
            policy. If you do not agree, please discontinue use of the Site.
          </p>
        </div>
      </section>

      {/* 2 */}
      <section className="pp-sec" id="applies-to">
        <Num n="02" />
        <div className="pp-sec__body">
          <h2 className="pp-h2">Who this policy applies to</h2>
          <p className="pp-p">
            This policy applies to all visitors of pratik-kubal.com, including:
          </p>
          <ul className="pp-list">
            <li>Recruiters and hiring managers exploring my professional profile</li>
            <li>Developers, engineers, or colleagues reviewing my projects</li>
            <li>Anyone interacting with the AI-powered interview assistant on the Site</li>
          </ul>
        </div>
      </section>

      {/* 3 */}
      <section className="pp-sec" id="collection">
        <Num n="03" />
        <div className="pp-sec__body">
          <h2 className="pp-h2">Information I collect</h2>

          <h3 className="pp-h3">3.1 — Information you provide</h3>
          <p className="pp-p">
            When you interact with the AI-powered chat assistant on the Site,
            your typed messages are sent to Anthropic&rsquo;s Claude API to
            generate responses. Your messages are also stored in a private
            database (Neon DB) for my own personal usage and product improvement
            purposes.
          </p>
          <p className="pp-p">
            <b>Important:</b> I do not store any personally identifiable
            information (PII) from these conversations. No names, email
            addresses, IP addresses, or other identifying details are retained
            in connection with conversation content. Conversations are stored in
            anonymized form only.
          </p>
          <p className="pp-p">
            Your messages are additionally processed by Anthropic in accordance
            with their privacy policy.
          </p>

          <h3 className="pp-h3">3.2 — Automatically collected information</h3>
          <p className="pp-p">
            Like most websites, the Site may automatically collect certain
            technical information when you visit, including:
          </p>
          <ul className="pp-list">
            <li>IP address (used to infer approximate geographic location)</li>
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>Pages visited and time spent on each page</li>
            <li>Referring URL (the site you came from)</li>
            <li>Device type (desktop, mobile, tablet)</li>
          </ul>

          <h3 className="pp-h3">3.3 — Cookies and similar technologies</h3>
          <p className="pp-p">
            The Site may use cookies and local storage to support basic
            functionality such as theme preferences (light/dark mode). No
            third-party advertising cookies are used. If third-party services
            (e.g., Spotify embed, GitHub badges) are present, those services may
            set their own cookies governed by their respective privacy policies.
          </p>

          <h3 className="pp-h3">3.4 — Third-party integrations</h3>
          <p className="pp-p">
            The Site links to or embeds content from the following third-party
            services, which may collect data independently:
          </p>
          <ul className="pp-list">
            {THIRD_PARTIES.map((t) => (
              <li key={t.name}>
                <b>{t.name}</b> — {t.what}; governed by {t.policy}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 4 */}
      <section className="pp-sec" id="use">
        <Num n="04" />
        <div className="pp-sec__body">
          <h2 className="pp-h2">How I use your information</h2>
          <p className="pp-p">
            I use the information collected for the following purposes:
          </p>
          <ul className="pp-list">
            <li>To operate and maintain the Site</li>
            <li>To power the AI chat assistant and deliver relevant responses to your queries</li>
            <li>To understand how visitors use the Site and improve its content and functionality</li>
            <li>To detect and prevent technical errors or security issues</li>
          </ul>
          <p className="pp-p pp-emph">
            I do not sell, rent, or trade your personal information to any third
            party.
          </p>
        </div>
      </section>

      {/* 5 */}
      <section className="pp-sec" id="legal-basis">
        <Num n="05" />
        <div className="pp-sec__body">
          <h2 className="pp-h2">Legal basis for processing (GDPR)</h2>
          <p className="pp-p">
            If you are located in the European Economic Area (EEA) or United
            Kingdom, my legal basis for processing your personal data is:
          </p>
          <ul className="pp-list">
            <li>
              <b>Legitimate interests</b> — to operate and improve the Site and
              understand visitor behavior
            </li>
            <li>
              <b>Consent</b> — where you actively interact with the AI chat
              feature, you are providing implicit consent for your input to be
              processed
            </li>
          </ul>
          <p className="pp-p">
            You may withdraw consent at any time by discontinuing use of the
            Site.
          </p>
        </div>
      </section>

      {/* 6 */}
      <section className="pp-sec" id="retention">
        <Num n="06" />
        <div className="pp-sec__body">
          <h2 className="pp-h2">Data retention</h2>
          <p className="pp-p">
            Anonymized conversation logs from the AI chat assistant are stored in
            a private database (Neon DB) and retained for a period of one (1)
            year, after which they are permanently deleted. No personally
            identifiable information is retained as part of these logs.
          </p>
          <p className="pp-p">
            Automatically collected server log data (if any) is retained for a
            short period for security and operational purposes and then deleted.
          </p>
        </div>
      </section>

      {/* 7 */}
      <section className="pp-sec" id="sharing">
        <Num n="07" />
        <div className="pp-sec__body">
          <h2 className="pp-h2">Data sharing and disclosure</h2>
          <p className="pp-p">
            I do not share your personal information with third parties except in
            the following limited circumstances:
          </p>
          <ul className="pp-list">
            <li>
              <b>Service providers</b> — third-party tools (e.g., Anthropic API,
              hosting provider) that process data on my behalf and are bound by
              appropriate data protection agreements
            </li>
            <li>
              <b>Legal requirements</b> — if required by law, court order, or
              government authority
            </li>
            <li>
              <b>Protection of rights</b> — to protect the integrity of the Site
              or the rights and safety of others
            </li>
          </ul>
        </div>
      </section>

      {/* 8 */}
      <section className="pp-sec" id="rights">
        <Num n="08" />
        <div className="pp-sec__body">
          <h2 className="pp-h2">Your rights</h2>
          <p className="pp-p">
            Depending on your location, you may have the following rights
            regarding your personal data:
          </p>
          <ul className="pp-list">
            <li><b>Access</b> — request a copy of any personal data I hold about you</li>
            <li><b>Correction</b> — request correction of inaccurate data</li>
            <li><b>Deletion</b> — request deletion of your data (&ldquo;right to be forgotten&rdquo;)</li>
            <li><b>Objection</b> — object to processing based on legitimate interests</li>
            <li><b>Portability</b> — request your data in a portable format</li>
            <li><b>Opt-out of sale</b> — I do not sell personal data, so this right is inherently satisfied</li>
          </ul>
          <p className="pp-p">
            To exercise any of these rights, please{" "}
            <MailtoLink href={`mailto:${CONTACT_EMAIL}`} className="pp-inline-link">
              contact me
            </MailtoLink>
            . I will respond within 30 days.
          </p>
        </div>
      </section>

      {/* 9 */}
      <section className="pp-sec" id="children">
        <Num n="09" />
        <div className="pp-sec__body">
          <h2 className="pp-h2">Children&rsquo;s privacy</h2>
          <p className="pp-p">
            The Site is not directed at individuals under the age of 13. I do not
            knowingly collect personal information from children. If you believe a
            child has provided personal information through the Site, please
            contact me and I will promptly delete it.
          </p>
        </div>
      </section>

      {/* 10 */}
      <section className="pp-sec" id="security">
        <Num n="10" />
        <div className="pp-sec__body">
          <h2 className="pp-h2">Security</h2>
          <p className="pp-p">
            I take reasonable technical measures to protect the Site and limit
            exposure of any incidentally collected data. However, no method of
            transmission over the internet is 100% secure. Please use the AI chat
            assistant for professional and publicly appropriate queries only.
          </p>
        </div>
      </section>

      {/* 11 */}
      <section className="pp-sec" id="california">
        <Num n="11" />
        <div className="pp-sec__body">
          <h2 className="pp-h2">California residents (CCPA / CPRA)</h2>
          <p className="pp-p">
            If you are a California resident, you have additional rights under the
            California Consumer Privacy Act (CCPA) and California Privacy Rights
            Act (CPRA), including the right to know what personal information is
            collected, the right to delete it, and the right to opt out of its
            sale. As noted above, I do not sell personal information. To exercise
            your rights, contact me at the address below.
          </p>
        </div>
      </section>

      {/* 12 */}
      <section className="pp-sec" id="external-links">
        <Num n="12" />
        <div className="pp-sec__body">
          <h2 className="pp-h2">External links</h2>
          <p className="pp-p">
            The Site contains links to external websites (GitHub, LinkedIn,
            X/Twitter, Spotify). I am not responsible for the privacy practices of
            those sites and encourage you to review their privacy policies
            independently.
          </p>
        </div>
      </section>

      {/* 13 */}
      <section className="pp-sec" id="changes">
        <Num n="13" />
        <div className="pp-sec__body">
          <h2 className="pp-h2">Changes to this policy</h2>
          <p className="pp-p">
            I may update this Privacy Policy from time to time. Any changes will
            be reflected by the updated &ldquo;Last Updated&rdquo; date at the top
            of this page. Continued use of the Site after any changes constitutes
            your acceptance of the revised policy.
          </p>
        </div>
      </section>

      {/* 14 — Contact */}
      <section className="pp-sec pp-sec--contact" id="contact">
        <Num n="14" />
        <div className="pp-sec__body">
          <h2 className="pp-h2">Contact</h2>
          <p className="pp-p">
            If you have questions, concerns, or requests regarding this Privacy
            Policy, please reach out:
          </p>
          <dl className="pp-contact__kv">
            <div>
              <dt>Name</dt>
              <dd>Pratik Kubal</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>
                <MailtoLink
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="pp-inline-link"
                >
                  {CONTACT_EMAIL}
                </MailtoLink>
              </dd>
            </div>
            <div>
              <dt>Website</dt>
              <dd>
                <a
                  href="https://pratik-kubal.com"
                  className="pp-inline-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  pratik-kubal.com
                </a>
              </dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>Philadelphia, PA, USA</dd>
            </div>
          </dl>
        </div>
      </section>
    </article>
  );
}
