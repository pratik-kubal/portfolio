import { nonprofit, nonprofitHeading } from "@/data/portfolio";

export function Nonprofit() {
  return (
    <>
      <p className="pk-rule">
        {nonprofitHeading}
        <span aria-hidden="true" />
      </p>
      <div id="nonprofit" data-screen-label="Nonprofit" className="pk-np">
        {nonprofit.map((n, i) => (
          <div key={i} className="pk-np-entry">
            <h4>{n.title}</h4>
            {n.body ? <p>{n.body}</p> : null}
            {n.body2 ? <p>{n.body2}</p> : null}
            {n.link ? (
              <p>
                {n.bodyPre}
                <a
                  className="pk-mlink"
                  href={n.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {n.link.text}
                </a>
              </p>
            ) : null}
          </div>
        ))}
      </div>
    </>
  );
}
