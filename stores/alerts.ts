import { MProposal } from "@/lib/api/types";

export const useAlertsStore = defineStore("alerts", () => {
  const reset = ref<{ show: boolean; proposal?: MProposal }>({
    show: false,
    proposal: undefined,
  });

  const items = ref<
    Array<{
      show: boolean;
      message: string;
      id: string;
      type: "success" | "error" | "info";
    }>
  >([]);

  const addAlert = ({
    message,
    type,
  }: {
    message: string;
    type: "success" | "error" | "info";
  }) => {
    const id = Math.random().toString(36).substring(7);
    items.value.push({ show: true, message, type, id });
  };

  const removeAlert = (id: string) => {
    items.value = items.value.filter((alert) => alert.id !== id);
  };

  const successAlert = (message: string) => {
    addAlert({ message, type: "success" });
  };
  const errorAlert = (message: string) => {
    addAlert({ message, type: "error" });
  };

  const showResetAlert = (proposal: MProposal) => {
    reset.value.show = true;
    reset.value.proposal = proposal;
  };
  const hideResetAlert = () => {
    reset.value.show = false;
    reset.value.proposal = undefined;
  };

  return {
    reset,
    showResetAlert,
    hideResetAlert,
    items,
    addAlert,
    removeAlert,
    successAlert,
    errorAlert,
  };
});
