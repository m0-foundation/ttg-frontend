import { MdEditor } from "md-editor-v3";
import "md-editor-v3/lib/style.css";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(MdEditor);
});
