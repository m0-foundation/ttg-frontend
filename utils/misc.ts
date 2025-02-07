export const copyToClipboard = (text: undefined | string | number) => {
  if (!text) return;
  const content = String(text);
  if (navigator?.clipboard) {
    return navigator.clipboard.writeText(content);
  } else {
    const textarea = document.createElement("textarea");
    textarea.value = content;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    return Promise.resolve();
  }
};

export const generateRandomId = () =>
  Math.random().toString(32).substring(2, 5) +
  Math.random().toString(32).substring(2, 5);

export const shortenText = (text: string, maxLength = 10): string => {
  if (!text) return "";
  if (text.length <= maxLength) {
    return text;
  } else {
    const slicedText = text.slice(0, 6) + "..." + text.slice(-6);
    return slicedText;
  }
};

export const wait = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
