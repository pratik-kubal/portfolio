import Link from "next/link";

export function ConsultingPage() {
  return (
    <div className="cn-root">
      <div className="cn-wrap">
        <section className="cn-hero">
          <div>
            <div className="eyebrow">Independent practice · 2025 — present</div>
            <h1>
              A small consultancy for organizations <em>thinking carefully</em>{" "}
              about AI.
            </h1>
            <p className="lede">
              I help leadership teams move from <b>vague AI ambition</b> to a
              concrete plan: what to build, what to buy, what to leave alone,
              and who should do the work. Engagements are short, written, and
              honest about uncertainty.
            </p>
            <div className="ctas">
              <a href="#contact" className="p">
                Book a discovery call
              </a>
              <a href="#services" className="s">
                See the two practices
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
                  <em>written, async-first</em>
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
            <span>The two practices</span>
          </div>
          <h2>
            Two engagements I do well, and a long list of{" "}
            <em>things I don&apos;t</em>.
          </h2>
        </section>

        <section className="cn-svc">
          <div className="meta">
            <span className="pill">№ 01 — Readiness</span>
            <dl className="kv">
              <dt>Length</dt>
              <dd>3–4 weeks</dd>
              <dt>Audience</dt>
              <dd>CTO, VP Eng</dd>
              <dt>Output</dt>
              <dd>Written report</dd>
              <dt>Team size</dt>
              <dd>20 — 400</dd>
            </dl>
          </div>
          <div className="body">
            <p className="hd">
              AI Readiness Assessments — an honest look at whether your
              organization can actually ship.
            </p>
            <p>
              A four-week diagnostic for engineering leaders who suspect their
              team is <b>further from</b> (or sometimes closer to) production AI
              than the deck suggests. The work is to sit with your data, your
              platform, your security posture, and your people, and produce a
              written report with{" "}
              <b>
                a roadmap, an evaluation rubric, and a list of things to stop
                doing
              </b>
              .
            </p>
            <ul>
              <li>
                <span>
                  <b>Data &amp; evals.</b> What you have, what&apos;s clean, and
                  what an honest baseline looks like.
                </span>
              </li>
              <li>
                <span>
                  <b>Platform readiness.</b> Inference, vector stores,
                  observability, cost controls. The unglamorous half.
                </span>
              </li>
              <li>
                <span>
                  <b>Org &amp; risk.</b> Who owns what when something
                  hallucinates in front of a customer.
                </span>
              </li>
              <li>
                <span>
                  <b>Roadmap.</b> Three things to ship in 90 days. One thing to
                  kill this quarter.
                </span>
              </li>
            </ul>
          </div>
          <div className="cn-detail">
            <div className="cn-rubric">
              <div className="ttl">What we evaluate</div>
              <div className="row">Data hygiene</div>
              <div className="row">Eval discipline</div>
              <div className="row">Platform &amp; infra</div>
              <div className="row">Observability</div>
              <div className="row">Risk &amp; review</div>
              <div className="row">Talent &amp; ownership</div>
              <div className="foot">
                Each dimension scored <b>1–10</b> in the final report, with
                evidence and a 90-day action attached.
              </div>
            </div>
          </div>
        </section>

        <section className="cn-svc alt">
          <div className="meta">
            <span className="pill">№ 02 — Nonprofit</span>
            <dl className="kv">
              <dt>Length</dt>
              <dd>6–8 weeks</dd>
              <dt>Audience</dt>
              <dd>ED, board, ops lead</dd>
              <dt>Output</dt>
              <dd>Strategy memo + pilot</dd>
              <dt>Pricing</dt>
              <dd>Sliding scale</dd>
            </dl>
          </div>
          <div className="body">
            <p className="hd">
              Nonprofit AI Strategy — small budgets, big stakes, and an aversion
              to magical thinking.
            </p>
            <p>
              Nonprofits are getting pitched generative AI by every vendor in
              the room. I work with executive directors and program leads to
              figure out <b>what&apos;s worth piloting</b>, what the failure
              modes are for the people you serve, and how to staff this without
              hiring an entire ML team you can&apos;t afford.
            </p>
            <ul>
              <li>
                <span>
                  <b>Use-case triage.</b> Which programs benefit, which
                  don&apos;t, and which are quietly risky.
                </span>
              </li>
              <li>
                <span>
                  <b>Vendor &amp; tool review.</b> Plain-language assessment of
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
              <div className="dt">Field note · Compass Pro Bono · 2024–present</div>
              <div className="body">
                In the 2024 engagement with a four-person volunteer team, the
                work was a Salesforce integration that eliminated four of every
                five manual data-entry steps for a Philadelphia non-profit — and
                a step-by-step runbook so non-technical staff could keep it
                running without an engineer in the room. The 2025 engagement, as
                Deputy Project Leader for the Children&apos;s Scholarship Fund of
                Philadelphia, is a step up the ladder: scope, timelines, client
                communication, deliverables. Pattern across both:{" "}
                <em>
                  the model and the integration are the cheap part
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
            <div className="n">Week 0 — Intake</div>
            <h3>A 45-minute call</h3>
            <p>
              We talk. If I&apos;m not the right person, I tell you and
              recommend two people who are.
            </p>
          </div>
          <div className="step">
            <div className="n">Week 1 — Listen</div>
            <h3>Reading &amp; interviews</h3>
            <p>
              I read everything you&apos;ll let me read and talk to 6–10 people
              across the org.
            </p>
          </div>
          <div className="step">
            <div className="n">Week 2–3 — Draft</div>
            <h3>A working document</h3>
            <p>
              You see the draft early. We disagree in writing. The document gets
              sharper.
            </p>
          </div>
          <div className="step">
            <div className="n">Week 4 — Hand off</div>
            <h3>Final memo &amp; readout</h3>
            <p>
              One memo, one 60-minute readout, and a follow-up call 30 days
              later. No retainers.
            </p>
          </div>
        </section>

        <section className="cn-cta" id="contact">
          <div>
            <div className="eyebrow">◦ open for Q3 2026</div>
            <h2>
              Tell me what you&apos;re <em>actually</em> trying to figure out.
            </h2>
            <p>
              A short note is enough to start. Two paragraphs about the org, the
              question on the table, and a rough timeline. Replies are written,
              in plain language, and I&apos;ll tell you if it&apos;s not a fit.
            </p>
            <div className="actions">
              <a
                href="mailto:pratik-kubal@outlook.com?subject=Consulting%20inquiry"
                className="p"
              >
                pratik-kubal@outlook.com
              </a>
            </div>
          </div>
          <div className="ledger">
            <div className="row">
              <span className="k">Based</span>
              <span className="v">Philadelphia, PA</span>
            </div>
            <div className="row">
              <span className="k">Format</span>
              <span className="v">written, async-first</span>
            </div>
            <div className="row">
              <span className="k">Status</span>
              <span className="v">open · Q3 2026</span>
            </div>
          </div>
        </section>

        <div className="cn-foot">
          <div>© 2026 Pratik Kubal · independent practice</div>
          <div>
            <Link href="/">portfolio</Link> ·{" "}
            <a href="mailto:pratik-kubal@outlook.com">
              pratik-kubal@outlook.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
