import { marked } from "marked";
import xss from "xss";

export const useParsedDescription = (description: string) => {
  const html = xss(marked.parse(description));
  const div = document.createElement("div");
  div.innerHTML = html;
  const text = div.textContent || div.innerText;

  return { html, text };
};
