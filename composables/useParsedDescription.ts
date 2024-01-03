import { marked } from "marked";
import { gfmHeadingId } from "marked-gfm-heading-id";
import { mangle } from "marked-mangle";
import xss from "xss";

const options = {
  prefix: "header-",
};

marked.use(gfmHeadingId(options));
marked.use(mangle());

export const useParsedDescription = (description: string) => {
  const html = xss(marked.parse(description));
  const div = document.createElement("div");
  div.innerHTML = html;
  const text = div.textContent || div.innerText;

  return { html, text };
};
