import { describe, it, expect } from "vitest";
import { nextChatScroll, type ChatScrollState } from "./chat-scroll";

const baseState: ChatScrollState = {
  inner: { scrollTop: 0, scrollHeight: 200, clientHeight: 200 },
  inputClientBottom: 500,
  viewportHeight: 900,
  stickInner: true,
  follow: true,
};

describe("nextChatScroll", () => {
  it("does not scroll the window while the chat is expanding and the input is still within the viewport", () => {
    // Scenario: user scrolled down, sent a question. Chat box is below
    // max-height, input still above viewport bottom — this must NOT jump.
    const action = nextChatScroll({
      ...baseState,
      inputClientBottom: 500,
      viewportHeight: 900,
      follow: true,
    });
    expect(action.windowScrollBy).toBe(0);
  });

  it("does not scroll the window when the input sits exactly at the viewport bottom", () => {
    const action = nextChatScroll({
      ...baseState,
      inputClientBottom: 900,
      viewportHeight: 900,
    });
    expect(action.windowScrollBy).toBe(0);
  });

  it("scrolls the window by the overflow amount once the input is pushed below the viewport", () => {
    const action = nextChatScroll({
      ...baseState,
      inputClientBottom: 945,
      viewportHeight: 900,
    });
    expect(action.windowScrollBy).toBe(45);
  });

  it("does not scroll the window when follow is disabled, even if input is below the viewport", () => {
    const action = nextChatScroll({
      ...baseState,
      inputClientBottom: 1200,
      viewportHeight: 900,
      follow: false,
    });
    expect(action.windowScrollBy).toBe(0);
  });

  it("pins inner scroll to the bottom when stickInner is true", () => {
    const action = nextChatScroll({
      ...baseState,
      inner: { scrollTop: 100, scrollHeight: 2000, clientHeight: 700 },
      stickInner: true,
    });
    expect(action.innerScrollTo).toBe(2000);
  });

  it("leaves inner scroll alone when stickInner is false (user scrolled the inner container up)", () => {
    const action = nextChatScroll({
      ...baseState,
      inner: { scrollTop: 100, scrollHeight: 2000, clientHeight: 700 },
      stickInner: false,
    });
    expect(action.innerScrollTo).toBeNull();
  });

  it("keeps window anchored and hands off to inner scroll after the chat hits its max-height", () => {
    // Once the chat's inner container is at max-height, its clientHeight no
    // longer grows, the input's page position stabilizes, and overflow
    // spills into the inner scroll. The window should stop scrolling; the
    // inner container takes over.
    const action = nextChatScroll({
      inner: { scrollTop: 400, scrollHeight: 1800, clientHeight: 1271 },
      inputClientBottom: 880,
      viewportHeight: 900,
      stickInner: true,
      follow: true,
    });
    expect(action.windowScrollBy).toBe(0);
    expect(action.innerScrollTo).toBe(1800);
  });
});
