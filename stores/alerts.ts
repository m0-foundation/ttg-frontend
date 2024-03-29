import { MProposal } from "@/lib/api/types";
import { defineStore } from "pinia";

export const useAlertsStore = defineStore("alerts", () => {
  const reset = ref<{ show: boolean; proposal?: MProposal }>({
    show: false,
    proposal: undefined,
  });

  const items = ref<
    Array<{
      show: boolean;
      message: string;
      id: number;
      type: "success" | "error" | "info";
    }>
  >([]);

  const count = computed(() => items.value.length);

  const addAlert = ({
    message,
    type,
  }: {
    message: string;
    type: "success" | "error" | "info";
  }) => {
    const id = count.value + 1;
    items.value.unshift({ show: true, message, type, id });
  };

  const removeAlert = (id: number) => {
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
