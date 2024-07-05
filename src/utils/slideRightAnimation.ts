import type { TransitionConfig } from "svelte/transition";
import { quintOut } from "svelte/easing";

export function slideRightAnimation(
  node: HTMLElement,
  { duration }: { duration: number }
): TransitionConfig {
  return {
    duration,
    css: (t: number) => {
      const eased = quintOut(t);
      return `
	      transform: translateX(${(eased - 1) * 100}%);
	    `;
    },
  };
}
