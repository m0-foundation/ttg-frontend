import { MProposal } from "@/lib/api/types";
import { defineStore } from "pinia";
import { randomBytes } from "@ethersproject/random";

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
    const id = generateRandomId();
    items.value.unshift({ show: true, message, type, id });

    setTimeout(() => {
      removeAlert(id);
    }, 10_000); // 10 seconds to automatically close the alert
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
  const infoAlert = (message: string) => {
    addAlert({ message, type: "info" });
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
    infoAlert,
    errorAlert,
  };
});
