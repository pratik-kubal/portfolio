import Link from "next/link";
import { MailtoLink } from "./mailto-link";

export function AdvisorPage() {
  return (
    <div className="cn-root">
      <div className="cn-wrap">
        <section className="cn-hero">
          <div>
            <div className="eyebrow">Independent AI Advisor / Contractor · 2025 — present</div>
            <h1>
              Helping organizations <em>think carefully</em>{" "}
              about AI.
            </h1>
            <p className="lede">
              I help <b>small businesses and nonprofits</b> cut through the AI noise — figuring out what's actually worth trying, what to ignore, and how to get started without wasting money or time.
            </p>
            <aside className="cn-ground" aria-label="Grounding note">
              <p>
                I work with organizations that have no in-house technical
                staff, limited budgets, and real skepticism about whether AI
                is right for them.{" "}
                <em>That skepticism is healthy. Let&apos;s start there.</em>
              </p>
            </aside>
            <div className="ctas">
              <a href="#contact" className="p">
                Book a discovery call
              </a>
            </div>
          </div>
          <div className="idx-wrap">
            <div className="cn-idx">
              <div className="row">
                <span className="k">Filed under</span>
                <span className="v">
                  <em>advisory · strategy</em>
                </span>
              </div>
              <div className="row">
                <span className="k">Engagements</span>
                <span className="v">3 — 8 weeks</span>
              </div>
              <div className="row">
                <span className="k">Format</span>
                <span className="v">
                  <em>written, at your pace</em>
                </span>
              </div>
              <div className="row">
                <span className="k">Capacity</span>
                <span className="v">2 clients / qtr</span>
              </div>
              <div className="row">
                <span className="k">Status</span>
                <span className="v">
                  <em>open · Q3 2026</em>
                </span>
              </div>
              <div className="row">
                <span className="k">Rate</span>
                <span className="v">on request</span>
              </div>
              <div className="foot">
                <span>CARD 01 / 01</span>
                <span>REV. 04.26</span>
              </div>
            </div>
          </div>
        </section>

        <section className="cn-sec" id="services">
          <div className="lbl">
            <span className="num">§ 01</span>
            <span>The three ways</span>
          </div>
          <h2>
            <em>Three Things</em>{" "}I can help with.
          </h2>
        </section>

        <section className="cn-svc">
          <div className="meta">
            <span className="pill">01 — Fielding questions</span>
            <dl className="kv">
              <dt>Audience</dt>
              <dd>Support, ops, product</dd>
              <dt>Output</dt>
              <dd>Working bot + evals</dd>
            </dl>
          </div>
          <div className="body">
            <p className="hd">
              Answering customer questions automatically through AI — Saving your time
            </p>
            <p>
              I help organizations design and implement <b>chatbots</b>{" "}
              for support, internal knowledge, and customer-facing FAQ. The integration is
              highly customized according to each use-case and technical stack.
            </p>
            <ul>
              <li>
                <span>
                  <b>Pulling in what you already know.</b> Your existing documents, 
                  FAQs, and policies, turned into something a bot can actually use.
                </span>
              </li>
              <li>
                <span>
                  <b>Getting accurate answers.</b> Making sure the bot 
                  doesn't make things up, and knows when to say &ldquo;I don&apos;t know&rdquo;.
                </span>
              </li>
              <li>
                <span>
                  <b>Testing before it goes live.</b> A simple way to check if the bot is 
                  actually helping before your customers see it.
                </span>
              </li>
              <li>
                <span>
                  <b>Knowing when to hand off to a human.</b> So nothing important falls 
                  through the cracks.
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

        <section className="cn-svc alt">
          <div className="meta">
            <span className="pill">02 — Readiness</span>
            <dl className="kv">
              <dt>Audience</dt>
              <dd>Stakeholders</dd>
              <dt>Output</dt>
              <dd>Written report</dd>
            </dl>
          </div>
          <div className="body">
            <p className="hd">
              Is your organization actually ready for AI?
              — An honest look before you commit to anything.
            </p>
            <p>
              A four-week diagnostic for leaders who suspect their
              team is <b>further from</b> (or sometimes closer to) production AI
              than the deck suggests. The work is to sit with your data, your
              platform, your security posture, and your people, and produce a
              written report with{" "}
              <b>
                a roadmap, an evaluation rubric, and a list of things to stop
                doing
              </b>
              . Works for small teams. You don't need a technical staff for this — 
              that's kind of the point.
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
                  <b>Your tools and systems.</b> Your tools and systems. What you're running 
                  on, what it costs, and whether it can handle more.
                </span>
              </li>
              <li>
                <span>
                  <b>Org &amp; risk.</b> Who owns what when the AI gets something wrong
                  in front of a customer.
                </span>
              </li>
              <li>
                <span>
                  <b>Roadmap.</b> Three things to try in 90 days. 
                  One to actually finish in the next few months.
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
                Verdict: <b>cautiously ready</b>. Get one thing running in 90 days.
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
              <dd>Strategy memo + pilot</dd>
            </dl>
          </div>
          <div className="body">
            <p className="hd">
              Nonprofit AI Strategy — small budgets and big stakes.
            </p>
            <p>
              Nonprofits are being sold AI tools by every vendor right now.
              I work with executive directors and program leads to
              figure out <b>what&apos;s worth piloting</b>, what the failure
              modes are for the people you serve, and how to staff this without
              hiring an entire ML team you can&apos;t afford.
            </p>
            <ul>
              <li>
                <span>
                  <b>Figuring out where AI actually helps.</b> and which programs are 
                  quietly risky or not worth the effort.
                </span>
              </li>
              <li>
                <span>
                  <b>What you're being sold.</b> Plain-language assessment of
                  what&apos;s pitched to you.
                </span>
              </li>
              <li>
                <span>
                  <b>Donor-ready memo.</b> A short document the board and
                  funders can actually read.
                </span>
              </li>
              <li>
                <span>
                  <b>One small pilot.</b> Scoped, measured, and reversible. No
                  platform commitments.
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
            <span className="num">§ 02</span>
            <span>How an engagement runs</span>
          </div>
          <h2>
            Short, written, and <em>honest about uncertainty</em>.
          </h2>
        </section>
        <section className="cn-process">
          <div className="step">
            <div className="n">Intake</div>
            <h3>A 45-minute call</h3>
            <p>
              We talk through what's going on, what you've already tried, and 
              what a good outcome looks like. If I'm not the right fit, I'll 
              say so and point you somewhere better.
            </p>
          </div>
          <div className="step">
            <div className="n">Listen</div>
            <h3>Reading &amp; interviews</h3>
            <p>
              I read what you send me & talk to a handful of people on your team
              — usually 3 to 5 short conversations. I'm trying to understand how work 
              actually happens, not how it looks on paper.
            </p>
          </div>
          <div className="step">
            <div className="n">Draft</div>
            <h3>A working document</h3>
            <p>
              You get a draft early. I'd rather you push back on something concrete
              than wait three weeks for a polished document that misses the point. 
              We go back and forth until it reflects reality.
            </p>
          </div>
          <div className="step">
            <div className="n">Hand off</div>
            <h3>Final memo &amp; readout</h3>
            <p>
              You get a short document you can actually use — share it with your board,
              your funders, or your team. We do one final call to walk through it together.
              After that, it's yours. No ongoing fees, no dependency on me to make it work.
            </p>
          </div>
        </section>

        <section className="cn-cta" id="contact">
          <div>
            <div className="eyebrow">◦ open for Q3 2026</div>
            <h2>
              <em>Not sure where to start?</em> That's the most common situation. Send me two 
              paragraphs and I&apos;ll tell you if I can help.
            </h2>
            <p>
              A short note is enough to start. Two paragraphs about the org, the
              question on the table, and a rough timeline. Replies are written,
              in plain language, and I&apos;ll tell you if it&apos;s not a fit.
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
              <span className="v">written, at your pace</span>
            </div>
            <div className="row">
              <span className="k">Status</span>
              <span className="v">open · Q3 2026</span>
            </div>
          </div>
        </section>

        <div className="cn-foot">
          <div>© 2026 Pratik Kubal · Independent AI Advisor / Contractor</div>
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
