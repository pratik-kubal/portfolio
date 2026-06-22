import type { Metadata } from "next";
import type { ReactNode } from "react";
import { LegalLayout } from "@/components/portfolio/legal-layout";
import { LINKS } from "@/data/portfolio";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How pratik-kubal.com collects, uses, and protects your information — including the AI chat assistant, analytics, cookies, and third-party integrations.",
  alternates: {
    canonical: "https://pratik-kubal.com/privacy",
  },
};

// A numbered section in the formal policy. Styling is theme-aware and scoped
// under .pk-root (see .pk-legal-* in app/globals.css).
function Section({ n, title, children }: { n: string; title: string; children: ReactNode }) {
  return (
    <section className="pk-legal-sec">
      <span className="pk-legal-num" aria-hidden="true">
        {n}
      </span>
      <div className="pk-legal-secbody">
        <h2 className="pk-legal-h2">{title}</h2>
        {children}
      </div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy" lastUpdated="June 22, 2026">
      <Section n="01" title="Overview">
        <p className="pk-legal-body">
          This Privacy Policy explains how Pratik Kubal (&ldquo;I,&rdquo;
          &ldquo;me,&rdquo; or &ldquo;my&rdquo;) collects, uses, and protects
          information when you visit pratik-kubal.com (the &ldquo;Site&rdquo;).
          This is my personal portfolio, so there isn&rsquo;t much to collect — I
          don&rsquo;t run advertising, and I don&rsquo;t sell or trade anything
          about you.
        </p>
        <p className="pk-legal-body">
          By using the Site you agree to the practices described here. If you
          don&rsquo;t agree, please discontinue use of the Site.
        </p>
      </Section>

      <Section n="02" title="Who this policy applies to">
        <p className="pk-legal-body">This policy applies to everyone who visits the Site, including:</p>
        <ul className="pk-legal-list">
          <li>Recruiters and hiring managers exploring my professional profile</li>
          <li>Developers, engineers, or colleagues reviewing my projects</li>
          <li>Anyone interacting with the AI assistant (&ldquo;Bella&rdquo;) on the Site</li>
        </ul>
      </Section>

      <Section n="03" title="Information I collect">
        <h3 className="pk-legal-h3">3.1 — Information you provide through the chat</h3>
        <p className="pk-legal-body">
          When you chat with the AI assistant (&ldquo;Bella&rdquo;), the messages
          you type are sent to Anthropic&rsquo;s Claude API to generate a reply.
          Each question you send is also saved to a private database (Neon
          Postgres) so I can understand what visitors ask and improve the
          assistant. Stored alongside each question are:
        </p>
        <ul className="pk-legal-list">
          <li><b>The message text</b> you sent (and, if you used &ldquo;Ask Bella about this,&rdquo; the page text you highlighted)</li>
          <li><b>A random session ID</b> generated in your browser to group a single conversation — it isn&rsquo;t tied to your name or email</li>
          <li><b>Coarse technical signals</b> — your approximate location (country and region, inferred from your network), a one-way hashed (irreversible) form of your IP address, and a broad browser family such as &ldquo;chrome&rdquo; or &ldquo;safari&rdquo;</li>
        </ul>
        <p className="pk-legal-body">
          <b>Important:</b> the raw text of your messages is stored, so please
          keep questions professional and publicly appropriate — don&rsquo;t
          enter sensitive personal information about yourself or anyone else. I
          never store your raw IP address; only a salted, irreversible hash of it
          is kept, and the browser family is a coarse bucket, not a fingerprint.
        </p>

        <h3 className="pk-legal-h3">3.2 — Automatically collected information</h3>
        <p className="pk-legal-body">
          Like most websites, the Site (and its hosting and analytics providers)
          may automatically collect certain technical information when you visit,
          including:
        </p>
        <ul className="pk-legal-list">
          <li>Approximate geographic location (inferred from your IP)</li>
          <li>Browser type and version, and operating system</li>
          <li>Device type (desktop, mobile, tablet)</li>
          <li>Pages visited and time spent on the Site</li>
          <li>Referring URL (the site you came from)</li>
        </ul>

        <h3 className="pk-legal-h3">3.3 — Cookies and local storage</h3>
        <p className="pk-legal-body">
          The Site saves two small items in your browser&rsquo;s local storage:
          the theme you pick (light, dark, or noir) and the random session ID the
          chat assistant uses. The visitor-analytics tool described below may set
          its own cookies. No advertising cookies are used. For the full details,
          see the{" "}
          <a className="pk-mlink" href="/cookies">
            Cookie
          </a>{" "}
          policy.
        </p>

        <h3 className="pk-legal-h3">3.4 — Third-party integrations</h3>
        <p className="pk-legal-body">
          The Site relies on or links to the following third-party services,
          which may process data under their own privacy policies:
        </p>
        <ul className="pk-legal-list">
          <li><b>Anthropic (Claude API)</b> — generates the AI assistant&rsquo;s replies</li>
          <li><b>Apollo.io</b> — a visitor-analytics tracker that helps me understand traffic in aggregate</li>
          <li><b>Vercel</b> — hosts the Site; <b>Neon</b> — hosts the database that stores chat questions</li>
          <li><b>Spotify</b> — powers the &ldquo;now playing&rdquo; card in the footer</li>
          <li><b>GitHub, LinkedIn, and X/Twitter</b> — linked profiles</li>
        </ul>
      </Section>

      <Section n="04" title="How I use your information">
        <p className="pk-legal-body">I use the information collected to:</p>
        <ul className="pk-legal-list">
          <li>Operate and maintain the Site</li>
          <li>Power the AI assistant and answer your questions</li>
          <li>Understand what visitors ask and improve the Site&rsquo;s content and functionality</li>
          <li>Detect and prevent technical errors, abuse, and security issues</li>
        </ul>
        <p className="pk-legal-body pk-legal-emph">
          I do not sell, rent, or trade your personal information to anyone.
        </p>
      </Section>

      <Section n="05" title="Legal basis for processing (GDPR)">
        <p className="pk-legal-body">
          If you are in the European Economic Area or the United Kingdom, my legal
          basis for processing your data is:
        </p>
        <ul className="pk-legal-list">
          <li><b>Legitimate interests</b> — to operate and improve the Site and understand visitor behavior in aggregate</li>
          <li><b>Consent</b> — when you actively use the chat assistant, you provide your input for processing</li>
        </ul>
        <p className="pk-legal-body">
          You may withdraw consent at any time by discontinuing use of the chat.
        </p>
      </Section>

      <Section n="06" title="Data retention">
        <p className="pk-legal-body">
          Chat logs (the questions and the coarse signals described in section
          3.1) are stored in a private database and retained for up to one (1)
          year, after which they are deleted. Any server or hosting logs are
          retained for a short period for security and operational purposes and
          then cleared.
        </p>
      </Section>

      <Section n="07" title="Data sharing and disclosure">
        <p className="pk-legal-body">
          I don&rsquo;t share your information with third parties except in these
          limited cases:
        </p>
        <ul className="pk-legal-list">
          <li><b>Service providers</b> — the tools listed in section 3.4 (for example Anthropic, Apollo.io, Vercel, and Neon) that process data on my behalf to run the Site</li>
          <li><b>Legal requirements</b> — if required by law, court order, or a government authority</li>
          <li><b>Protection of rights</b> — to protect the integrity of the Site or the rights and safety of others</li>
        </ul>
      </Section>

      <Section n="08" title="Your rights">
        <p className="pk-legal-body">
          Depending on where you live, you may have the right to:
        </p>
        <ul className="pk-legal-list">
          <li><b>Access</b> — request a copy of any personal data I hold about you</li>
          <li><b>Correction</b> — request that inaccurate data be fixed</li>
          <li><b>Deletion</b> — request that your data be deleted (&ldquo;right to be forgotten&rdquo;)</li>
          <li><b>Objection</b> — object to processing based on legitimate interests</li>
          <li><b>Portability</b> — request your data in a portable format</li>
        </ul>
        <p className="pk-legal-body">
          Because chat logs aren&rsquo;t linked to your identity, I may need your
          help (such as the session ID from your browser) to locate the specific
          records that relate to you. To make a request, email me using the
          contact details below; I&rsquo;ll respond within 30 days.
        </p>
      </Section>

      <Section n="09" title="Children's privacy">
        <p className="pk-legal-body">
          The Site is not directed at children under 13, and I don&rsquo;t
          knowingly collect personal information from them. If you believe a child
          has provided personal information through the Site, contact me and
          I&rsquo;ll promptly delete it.
        </p>
      </Section>

      <Section n="10" title="Security">
        <p className="pk-legal-body">
          I take reasonable technical measures to protect the Site and limit the
          data it keeps — your raw IP address is never stored (only a salted,
          one-way hash), message text is length-limited, and analytics are coarse.
          That said, no method of transmission or storage is 100% secure, so
          please use the chat assistant for professional, publicly appropriate
          queries only.
        </p>
      </Section>

      <Section n="11" title="California residents (CCPA / CPRA)">
        <p className="pk-legal-body">
          If you are a California resident, you have additional rights under the
          California Consumer Privacy Act (CCPA) and the California Privacy Rights
          Act (CPRA), including the right to know what personal information is
          collected, the right to delete it, and the right to opt out of its sale.
          As noted above, I do not sell personal information. To exercise your
          rights, contact me using the details below.
        </p>
      </Section>

      <Section n="12" title="External links">
        <p className="pk-legal-body">
          The Site links to or embeds external services — including GitHub,
          LinkedIn, X/Twitter, and Spotify. I&rsquo;m not responsible for the
          privacy practices of those sites and encourage you to review their
          privacy policies independently.
        </p>
      </Section>

      <Section n="13" title="Changes to this policy">
        <p className="pk-legal-body">
          I may update this Privacy Policy from time to time. Any changes are
          reflected by the &ldquo;Last updated&rdquo; date at the bottom of this
          page. Continued use of the Site after a change constitutes acceptance of
          the revised policy.
        </p>
      </Section>

      <Section n="14" title="Contact">
        <p className="pk-legal-body">
          If you have questions, concerns, or requests about this Privacy Policy,
          reach out:
        </p>
        <dl className="pk-legal-contact">
          <div>
            <dt>Name</dt>
            <dd>Pratik Kubal</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>
              <a className="pk-mlink" href={`mailto:${LINKS.email}`}>
                {LINKS.email}
              </a>
            </dd>
          </div>
          <div>
            <dt>Website</dt>
            <dd>
              <a
                className="pk-mlink"
                href="https://pratik-kubal.com"
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
      </Section>
    </LegalLayout>
  );
}
