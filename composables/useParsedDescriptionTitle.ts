export const useParsedDescriptionTitle = (description: string) => {
  const { html } = useParsedDescription(description);
  const domParser = new DOMParser();

  const title = computed(() => {
    const dom = domParser.parseFromString(html, "text/html");
    const titleHtml = dom.getElementsByTagName("h1")[0];
    const firstParagraph = dom.getElementsByTagName("p")[0];
    if (titleHtml) {
      return titleHtml.innerHTML;
    }
    if (firstParagraph) {
      return firstParagraph.innerHTML;
    }
    return "";
  });

  const descriptionNoTitle = computed(() => {
    const dom = domParser.parseFromString(html, "text/html");
    const titleHtml = dom.getElementsByTagName("h1")[0];
    if (titleHtml) {
      titleHtml.remove();
    }
    return dom.body.innerHTML;
  });

  return {
    html,
    title: title.value,
    descriptionNoTitle: descriptionNoTitle.value,
  };
};
