import { createApp } from "vue";

export const useComponentToHtml = (
  Component: Component,
  props: Data | null | undefined,
) => {
  const component = document.createElement("div");
  createApp(Component, props).mount(component);

  return { html: component.innerHTML };
};
