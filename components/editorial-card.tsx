"use client";

import { person } from "@/data/person";
import CareerChat from "@/components/ui/career-chat";
import { SpotifyNowPlaying } from "@/components/spotify-now-playing";

export function EditorialCard({
  initialQuestion = "",
}: {
  initialQuestion?: string;
}) {
  return (
    <div className="v3-stage">
      <aside className="v3-card">
        <div className="portrait" />
        <h1 className="v3-name">{person.name}</h1>
        <div className="v3-pron">{person.pronunciation}</div>
        <p className="v3-role">
          {person.role} based in {person.based}.
        </p>

        <div className="v3-rule" />

        <dl className="v3-kv">
          {person.facts.map((f) => (
            <div key={f.k} style={{ display: "contents" }}>
              <dt>{f.k}</dt>
              <dd>{f.v}</dd>
            </div>
          ))}
        </dl>

        <div className="v3-rule" />

        <div className="v3-socgrid">
          {person.socials.map((s) => (
            <a
              key={s.k}
              href={s.url}
              target={s.url.startsWith("http") ? "_blank" : undefined}
              rel={s.url.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              <b>{s.label}</b>
              <span>{s.handle.replace(/^@/, "")}</span>
            </a>
          ))}
        </div>

        <SpotifyNowPlaying endpoint="/api/now-playing" forceState="auto" />
      </aside>

      <main className="v3-main">
        <div className="v3-eyebrow">{person.eyebrow}</div>
        <h2 className="v3-lede">
          {person.ledeBefore}
          <em>{person.ledeEm}</em>
          {person.ledeAfter}
        </h2>
        <p className="v3-dek">
          {person.bio}{" "}
          <b>Currently</b> open to new work.{" "}
          Writes occasionally — see the projects below.
        </p>

        <CareerChat variant="inline" initialQuestion={initialQuestion} />

        <div className="v3-lower">
          <div className="v3-section">
            <h2>Selected projects</h2>
            {person.projects.map((p) => (
              <div className="v3-proj3" key={p.id}>
                <div className="n">{p.name}</div>
                <div className="b">{p.blurb}</div>
                <div className="m">
                  {p.year}
                  <br />
                  {p.metric}
                </div>
              </div>
            ))}
          </div>
          <div className="v3-section">
            <h2>Experience</h2>
            <div className="v3-tl3">
              {person.timeline.map((tl) => (
                <div className="row" key={tl.year + tl.where}>
                  <div className="y">{tl.year}</div>
                  <div>
                    <b>{tl.role}</b>
                    <span>
                      {tl.where} — {tl.what}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
