import { marked } from "marked";
import xss from "xss";

export const useParsedDescription = (description: string) => {
  return { html: xss(marked.parse(description)) };
};
