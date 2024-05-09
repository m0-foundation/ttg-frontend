import maxBy from "lodash/maxBy";
import { useProposalsStore } from "@/stores/proposals";
import { useAlertsStore } from "@/stores/alerts";

export const watchForExecutedResetProposal = () => {
  const proposals = useProposalsStore();
  const alerts = useAlertsStore();
  const ttg = useSpogStore();

  const resetProposals = computed(() => {
    return proposals.data.filter(
      (p) =>
        ["resetToPowerHolders", "resetToZeroHolders"].includes(
          p.proposalType,
        ) && p.state === "Executed",
    );
  });

  watch(resetProposals, (resetProposals) => {
    const lastestResetProposal = maxBy(resetProposals, "blockNumber");

    if (lastestResetProposal) {
      if (lastestResetProposal.voteEnd! + 6 >= ttg.epoch.current.asNumber) {
        alerts.showResetAlert(lastestResetProposal);
      } else {
        alerts.hideResetAlert();
      }
    }
  });
};
