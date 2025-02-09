import { Title, type SinnerTitle } from "../constants.js";

export function isSinnerTitle(title: Title | SinnerTitle) {
  return ![
    Title.ARCHITECT,
    Title.DUKE,
    Title.JUSTICE,
    Title.SCIENTIST,
  ].includes(title as never);
}
