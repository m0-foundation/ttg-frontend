export const useParsedDescriptionTitle = (description: string) => {
  const { html } = useParsedDescription(description)
  const domParser = new DOMParser()

  const title = computed(() => {
    const dom = domParser.parseFromString(html, 'text/html')
    const titleHtml = dom.getElementsByTagName('h1')[0]
    const firstParagraph = dom.getElementsByTagName('p')[0]
    if (titleHtml) {
      return titleHtml.innerText
    }
    if (firstParagraph) {
      return firstParagraph.innerText
    }
    return ''
  })

  const onlyDescription = computed(() => {
    const dom = domParser.parseFromString(html, 'text/html')
    const titleHtml = dom.getElementsByTagName('h1')[0]
    if (titleHtml) {
      titleHtml.remove()
    }
    return dom.body.innerText
  })

  const onlyDescriptionHtml = computed(() => {
    const dom = domParser.parseFromString(html, 'text/html')
    const titleHtml = dom.getElementsByTagName('h1')[0]
    if (titleHtml) {
      titleHtml.remove()
    }
    return dom.body.innerHTML
  })

  return {
    html,
    title: title.value,
    onlyDescription: onlyDescription.value,
    onlyDescriptionHtml: onlyDescriptionHtml.value,
  }
}
