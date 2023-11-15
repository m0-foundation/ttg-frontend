import { MProposal } from "@/lib/api/types";

export const useAlertsStore = defineStore("alerts", () => {
  const reset = ref<{ show: boolean; proposal?: MProposal }>({
    show: false,
    proposal: undefined,
  });

  const showResetAlert = (proposal: MProposal) => {
    reset.value.show = true;
    reset.value.proposal = proposal;
  };
  const hideResetAlert = () => (reset.value.show = false);

  return { reset, showResetAlert, hideResetAlert };
});
