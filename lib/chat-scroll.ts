export type ChatScrollState = {
  inner: {
    scrollTop: number;
    scrollHeight: number;
    clientHeight: number;
  };
  inputClientBottom: number;
  viewportHeight: number;
  stickInner: boolean;
  follow: boolean;
};

export type ChatScrollAction = {
  innerScrollTo: number | null;
  windowScrollBy: number;
};

export function nextChatScroll(state: ChatScrollState): ChatScrollAction {
  const innerScrollTo = state.stickInner ? state.inner.scrollHeight : null;
  const overflow = state.inputClientBottom - state.viewportHeight;
  const windowScrollBy = state.follow && overflow > 0 ? overflow : 0;
  return { innerScrollTo, windowScrollBy };
}
