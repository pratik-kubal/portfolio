import { bellaDemoMsgs, bellaDemoNotes, type Project } from "@/data/portfolio";

// The SCRIPTED right-column Bella demo. Messages reveal + the feed auto-scrolls
// as the card scrolls past (useBellaDemoScrub), the annotation cards slide in,
// and the window/bubbles/avatars/notes are repainted hand-drawn with rough.js.
// Distinct from the real interactive <BellaWidget/>. With no JS the full
// conversation is shown (final state). The data-r markers tag elements for the
// rough.js repaint.
export function BellaDemoConversation({ project }: { project: Project }) {
  return (
    <div className="pk-viz bella">
      <p className="pk-viz-top">{project.vizTop}</p>

      <div data-bella-demo="" className="pk-bd-wrap">
        <div className="pk-demo-win" data-r="win">
          <div className="pk-demo-head" data-r="head">
            <span className="pk-demo-ava" data-r="ava" aria-hidden="true">
              B
            </span>
            <div className="meta">
              <b>Bella</b>
              <span>AI assistant</span>
            </div>
          </div>

          <div className="pk-demo-vp" data-bd-viewport="">
            <div className="pk-demo-feed" data-bd-feed="">
              {bellaDemoMsgs.map((m, i) =>
                m.who === "r" ? (
                  <div key={i} className="pk-demo-row u" data-bd-row="">
                    <div className="pk-demo-bub u" data-r="u">
                      {m.text}
                    </div>
                  </div>
                ) : (
                  <div key={i} className="pk-demo-row b" data-bd-row="">
                    <span className="pk-demo-ava" data-r="ava" aria-hidden="true">
                      B
                    </span>
                    <div
                      className="pk-demo-bub b"
                      data-r="b"
                      dangerouslySetInnerHTML={{ __html: m.html ?? "" }}
                    />
                  </div>
                ),
              )}
            </div>
          </div>

          <div className="pk-demo-input" data-r="inp">
            <div className="pk-demo-pill" data-r="pill">
              Ask about Pratik…
            </div>
            <div className="pk-demo-send" data-r="send">
              SEND
            </div>
          </div>
        </div>

        <div className="pk-demo-notes">
          {bellaDemoNotes.map((n, i) => (
            <div
              key={i}
              className="pk-demo-note"
              data-r="note"
              data-bd-note=""
              data-at={n.at}
            >
              <div className="tag">{n.tag}</div>
              <div className="txt">{n.text}</div>
            </div>
          ))}
        </div>
      </div>

      {project.vizCaption ? (
        <p className="pk-viz-caption">
          <b>{project.vizCaption.bold}</b>
          {project.vizCaption.rest}
        </p>
      ) : null}
    </div>
  );
}
