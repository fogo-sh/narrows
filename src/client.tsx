"use client-entry";

import type { ReactNode } from "react";
import { hydrate, fetchRSC } from "@parcel/rsc/client";

let updateRoot = hydrate({
  async callServer(id, args) {
    let { result, root } = await fetchRSC<{ root: ReactNode; result: any }>(
      location.pathname,
      {
        method: "POST",
        headers: {
          "rsc-action-id": id,
        },
        body: args,
      }
    );
    updateRoot(root);
    return result;
  },
  onHmrReload() {
    navigate(location.pathname);
  },
});

async function navigate(pathname: string, push = false) {
  let root = await fetchRSC<ReactNode>(pathname);
  updateRoot(root, () => {
    if (push) {
      history.pushState(null, "", pathname);
    }
  });
}

document.addEventListener("click", (e) => {
  let link = (e.target as Element).closest("a");
  if (
    link &&
    link instanceof HTMLAnchorElement &&
    link.href &&
    (!link.target || link.target === "_self") &&
    link.origin === location.origin &&
    !link.hasAttribute("download") &&
    e.button === 0 &&
    !e.metaKey &&
    !e.ctrlKey &&
    !e.altKey &&
    !e.shiftKey &&
    !e.defaultPrevented
  ) {
    e.preventDefault();
    navigate(link.pathname, true);
  }
});

window.addEventListener("popstate", (e) => {
  navigate(location.pathname);
});
