import Link from "next/link";
import { MailtoLink } from "./mailto-link";

export function AdvisorPage() {
  return (
    <div className="cn-root">
      <div className="cn-wrap">
        <section className="cn-hero">
          <div>
            <div className="eyebrow">Independent AI / Technical Solutions · 2025 — present</div>
            <h1>
              Building AI solutions that <em>actually work</em>{" "}
              for your organization.
            </h1>
            <p className="lede">
              I design, build, and deploy AI systems for <b>small businesses and nonprofits</b> — chatbots, automations, integrations — with the full technical stack handled, so you don&apos;t need to hire a team to get started.
            </p>
            <aside className="cn-ground" aria-label="Grounding note">
              <p>
                I work with organizations that have real problems, limited budgets, and no technical staff to build solutions internally.{" "}
                <em>I handle the technical side — scoping, building, integrating, testing — and hand you something that runs without me.</em>
              </p>
            </aside>
            <div className="ctas">
              <a href="#contact" className="p">
                Book a technical discovery call
              </a>
            </div>
          </div>
        </section>

        <section className="cn-sec" id="services">
          <div className="lbl">
            <span className="num">01</span>
            <span>The three ways</span>
          </div>
          <h2>
            <em>Three things</em>{" "}I build, implement, and ship.
          </h2>
        </section>

        <section className="cn-svc">
          <div className="meta">
            <span className="pill">01 — Fielding questions</span>
            <dl className="kv">
              <dt>Audience</dt>
              <dd>Support, ops, product</dd>
              <dt>Output</dt>
              <dd>Live, deployed system</dd>
            </dl>
          </div>
          <div className="body">
            <p className="hd">
              Chatbot &amp; FAQ systems — built, integrated, and running on your stack
            </p>
            <p>
              I design, build, and deploy custom <b>chatbots</b>{" "}
              trained on your content — for support, internal knowledge bases, and customer-facing FAQ. I handle the full stack: the architecture, the integration into your existing tools, the evaluation, and the handoff.
            </p>
            <ul>
              <li>
                <span>
                  <b>Pulling in what you already know.</b> Your existing documents,
                  FAQs, and policies, turned into something a bot can actually query.
                </span>
              </li>
              <li>
                <span>
                  <b>Getting accurate answers.</b> Making sure the bot
                  doesn&apos;t hallucinate, and knows when to escalate.
                </span>
              </li>
              <li>
                <span>
                  <b>Testing before it goes live.</b> Evaluation runs and quality checks
                  before your customers see it.
                </span>
              </li>
              <li>
                <span>
                  <b>Knowing when to hand off to a human.</b> Escalation paths built in,
                  so nothing important falls through the cracks.
                </span>
              </li>
              <li>
                <span>
                  <b>Ongoing observability.</b> Dashboards and logs so you can see what&apos;s
                  being asked — and catch problems before they become habits.
                </span>
              </li>
            </ul>
          </div>
          <div className="cn-detail">
            <div className="cn-mx">
              <div className="head">
                <div className="ttl">What well-built can bots do</div>
                <div className="src">
                  Independent
                  <br />
                  research
                </div>
              </div>
              <div className="grid">
                <div className="cell">
                  <div className="k">
                    Issue deflection <sup>1</sup>
                  </div>
                  <div className="v">
                    <em>52</em>
                    <sup>%</sup>
                  </div>
                  <div className="d">
                    of customer issues resolved by self-service bots, rising to{" "}
                    <b>96%</b> on simple queries.
                  </div>
                </div>
                <div className="cell">
                  <div className="k">
                    Response time <sup>2</sup>
                  </div>
                  <div className="v">
                    <em>55</em>
                    <sup>%</sup>
                  </div>
                  <div className="d">
                    average reduction in first-response time across CX teams
                    using AI tooling.
                  </div>
                </div>
                <div className="cell">
                  <div className="k">
                    CSAT lift <sup>3</sup>
                  </div>
                  <div className="v">
                    <em>+40</em>
                    <sup>%</sup>
                  </div>
                  <div className="d">
                    of mid-sized businesses report a 40%+ jump in CSAT within{" "}
                    <b>3 months</b>.
                  </div>
                </div>
                <div className="cell">
                  <div className="k">
                    Resolution time <sup>4</sup>
                  </div>
                  <div className="v">
                    <em>11</em>
                    <sup>min → </sup>
                    <em>2</em>
                  </div>
                  <div className="d">
                    Klarna&apos;s AI assistant cut average resolution from 11
                    minutes to ~2.
                  </div>
                </div>
              </div>
              <div className="srcs">
                <span className="lbl">◦ Sources</span>
                <ol>
                  <li>
                    <sup>1</sup>
                    <span>
                      <a
                        href="https://yourgpt.ai/blog/growth/ai-customer-service-statistics"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        YourGPT, AI Customer Service Statistics 2026
                      </a>{" "}
                      — self-service bots resolve 54% of issues, up to 96% on
                      simple queries.
                    </span>
                  </li>
                  <li>
                    <sup>2</sup>
                    <span>
                      <a
                        href="https://www.freshworks.com/How-AI-is-unlocking-ROI-in-customer-service/"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Freshworks CX Benchmark Report 2025
                      </a>{" "}
                      — 55% reduction in average first-response time for CX
                      teams.
                    </span>
                  </li>
                  <li>
                    <sup>3</sup>
                    <span>
                      <a
                        href="https://yourgpt.ai/blog/growth/ai-customer-service-statistics"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        YourGPT 2026
                      </a>{" "}
                      — 70% of mid-sized businesses see 40%+ CSAT jump within 3
                      months of AI adoption.
                    </span>
                  </li>
                  <li>
                    <sup>4</sup>
                    <span>
                      <a
                        href="https://www.nexgencloud.com/blog/case-studies/how-ai-and-rag-chatbots-cut-customer-service-costs-by-millions"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        NexGen Cloud / Klarna case study
                      </a>{" "}
                      — average resolution time dropped from 11 min to ~2 min.
                    </span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        <section className="cn-svc">
          <div className="meta">
            <span className="pill">02 — Readiness</span>
            <dl className="kv">
              <dt>Audience</dt>
              <dd>Stakeholders</dd>
              <dt>Output</dt>
              <dd>Technical build plan + roadmap</dd>
            </dl>
          </div>
          <div className="body">
            <p className="hd">
              Technical scoping — what to build, what it costs, and what&apos;s actually worth the effort.
            </p>
            <p>
              A four-week technical scoping engagement for organizations ready to build something real. I get into your data, your tools and systems, your security posture, and your team&apos;s actual capacity — and deliver a{" "}
              <b>
                technical build plan with a prioritized roadmap and a clear list of what to stop doing before you start
              </b>
              . Works for small teams. You don&apos;t need a technical staff for this —
              that&apos;s kind of the point.
            </p>
            <ul>
              <li>
                <span>
                  <b>Data.</b> What you have, what&apos;s clean, and
                  what an honest baseline looks like.
                </span>
              </li>
              <li>
                <span>
                  <b>Your tools and systems.</b> What you&apos;re running on, what it can
                  actually support, and what the integration complexity looks like.
                </span>
              </li>
              <li>
                <span>
                  <b>Org &amp; risk.</b> Who owns what when something the AI built goes wrong
                  in front of a customer.
                </span>
              </li>
              <li>
                <span>
                  <b>Roadmap.</b> Three things to build in 90 days.
                  One to actually ship in the next few months.
                </span>
              </li>
            </ul>
          </div>
          <div className="cn-detail">
            <div className="cn-score">
              <div className="ttl">Sample readiness scorecard</div>
              <div className="row">
                <div className="nm">Data hygiene</div>
                <div className="bar">
                  <i style={{ width: "72%" }} />
                </div>
                <div className="sc">7.2</div>
              </div>
              <div className="row">
                <div className="nm">Platform &amp; infra</div>
                <div className="bar">
                  <i style={{ width: "81%" }} />
                </div>
                <div className="sc">8.1</div>
              </div>
              <div className="row">
                <div className="nm">Observability</div>
                <div className="bar">
                  <i style={{ width: "55%" }} />
                </div>
                <div className="sc">5.5</div>
              </div>
              <div className="row">
                <div className="nm">Risk &amp; review</div>
                <div className="bar">
                  <i style={{ width: "38%" }} />
                </div>
                <div className="sc">3.8</div>
              </div>
              <div className="row">
                <div className="nm">Talent &amp; ownership</div>
                <div className="bar">
                  <i style={{ width: "66%" }} />
                </div>
                <div className="sc">6.6</div>
              </div>
              <div className="totalRow">
                <span className="lbl">Composite</span>
                <span className="big">
                  <em>5.9</em> / 10
                </span>
              </div>
              <div className="verdict">
                Verdict: <b>cautiously ready</b>. Here&apos;s what to build first — and what to skip.
              </div>
            </div>
          </div>
        </section>

        <section className="cn-svc">
          <div className="meta">
            <span className="pill">03 — Nonprofit</span>
            <dl className="kv">
              <dt>Audience</dt>
              <dd>ED, board, ops lead</dd>
              <dt>Output</dt>
              <dd>Running pilot + handoff docs</dd>
            </dl>
          </div>
          <div className="body">
            <p className="hd">
              Nonprofit AI implementation — small budgets, one real pilot, no platform lock-in.
            </p>
            <p>
              Nonprofits are being sold AI tools that require maintaining.
              I work with executive directors and program leads to
              <b> scope, build, and run one actual pilot</b> — designed for your
              staff capacity, your budget, and the people you serve — without
              the platform commitments that require a full-time engineer to keep running.
            </p>
            <ul>
              <li>
                <span>
                  <b>Figuring out what&apos;s actually worth building.</b> And which programs are
                  quietly risky or not worth the engineering overhead.
                </span>
              </li>
              <li>
                <span>
                  <b>What you&apos;re being sold.</b> Plain-language technical assessment of
                  what&apos;s actually in the contract.
                </span>
              </li>
              <li>
                <span>
                  <b>Donor-ready documentation.</b> A short written summary the board and
                  funders can read and actually understand.
                </span>
              </li>
              <li>
                <span>
                  <b>One scoped pilot.</b> Built, measured, and designed to be reversible.
                  No platform commitments you&apos;ll be stuck maintaining.
                </span>
              </li>
            </ul>
          </div>
          <div className="cn-detail">
            <div className="cn-fn">
              <div className="dt">Field note · Compass Pro Bono · 2024-present</div>
              <div className="body">
                In the 2024 engagement with a four-person volunteer team, the
                work was a Salesforce integration that eliminated four of every
                five manual data-entry steps for a Philadelphia non-profit. The 2025 engagement, as
                Deputy Project Leader for the Children&apos;s Scholarship Fund of
                Philadelphia, is a bigger challenge: scope, timelines, client
                communication, deliverables.{" "}
                <em>
                  The model or the integration is the cheap part
                </em>
                . The honest conversation about what staff time gets reclaimed
                is the work.
              </div>
              <div className="stamp">Pro bono · Compass</div>
              <div className="sig">— pk</div>
            </div>
          </div>
        </section>

        <section className="cn-sec">
          <div className="lbl">
            <span className="num">02</span>
            <span>How an engagement runs</span>
          </div>
          <h2>
            Short, written, and <em>honest about uncertainty</em>.
          </h2>
        </section>
        <section className="cn-process">
          <div className="step">
            <div className="n">Intake</div>
            <h3>A technical discovery call</h3>
            <p>
              We talk through the problem, what you&apos;ve tried, and what a realistic
              build looks like. If it&apos;s not the right fit, I&apos;ll say so and point
              you somewhere better.
            </p>
          </div>
          <div className="step">
            <div className="n">Listen</div>
            <h3>Technical scoping</h3>
            <p>
              I dig into your existing stack, data, and tools. Two to five conversations
              with the people closest to the problem. I&apos;m trying to understand how the
              systems actually work, not how they look on paper.
            </p>
          </div>
          <div className="step">
            <div className="n">Draft</div>
            <h3>Build &amp; iterate</h3>
            <p>
              You get working software early — not a polished document that misses the point.
              We test it against real questions, adjust, and keep going until it reflects
              what you actually need.
            </p>
          </div>
          <div className="step">
            <div className="n">Hand off</div>
            <h3>Deploy + hand off</h3>
            <p>
              You get a running system you can actually use — along with documentation
              your team can maintain. One final walkthrough. After that, it&apos;s yours.
              No retainers, no ongoing dependency on me to keep it working.
            </p>
          </div>
        </section>

        <section className="cn-cta" id="contact">
          <div>
            <div className="eyebrow">◦ open for Q3 2026</div>
            <h2>
              <em>Not sure what to build first?</em> That&apos;s the most common starting point.
              Send me two paragraphs and I&apos;ll tell you what&apos;s actually buildable.
            </h2>
            <p>
              A short note is enough to start. Two paragraphs about the org, the
              problem you&apos;re trying to solve, and a rough timeline. Replies are direct
              and in plain language. I&apos;ll tell you what&apos;s buildable, what it&apos;ll take,
              and whether it&apos;s the right fit.
            </p>
            <div className="actions">
              <MailtoLink
                href="mailto:pratik-kubal@outlook.com?subject=Advisor%20inquiry"
                className="p"
              >
                pratik-kubal@outlook.com
              </MailtoLink>
            </div>
          </div>
          <div className="ledger">
            <div className="row">
              <span className="k">Based</span>
              <span className="v">Philadelphia, PA</span>
            </div>
            <div className="row">
              <span className="k">Format</span>
              <span className="v">built, at your pace</span>
            </div>
            <div className="row">
              <span className="k">Status</span>
              <span className="v">open · Q3 2026</span>
            </div>
          </div>
        </section>

        <div className="cn-foot">
          <div>© 2026 Pratik Kubal · Independent AI / Technical Solutions</div>
          <div>
            <Link href="/">portfolio</Link> ·{" "}
            <MailtoLink href="mailto:pratik-kubal@outlook.com">
              pratik-kubal@outlook.com
            </MailtoLink>
          </div>
        </div>
      </div>
    </div>
  );
}
