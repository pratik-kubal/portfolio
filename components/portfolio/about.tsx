import { about, aboutHeading } from "@/data/portfolio";

export function About() {
  return (
    <>
      <p className="pk-rule">
        {aboutHeading}
        <span aria-hidden="true" />
      </p>
      <div id="about" data-screen-label="My Story & Pitch" className="pk-about">
        {about.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </>
  );
}
