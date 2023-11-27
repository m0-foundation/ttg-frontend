import type { Meta, StoryObj } from "@storybook/vue3";

import ProposalVoteProgress from "../../components/proposal/VoteProgress.vue";
import MProgressBar from "../../components/design-system/MProgressBar.vue";

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta = {
  title: "Proposal/ProposalVoteProgress",
  component: ProposalVoteProgress,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ["autodocs"],
  argTypes: {
    tallies: {
      power: {
        yes: {
          control: "number",
        },
        no: {
          control: "number",
        },
      },
      zero: {
        yes: {
          control: "number",
        },
        no: {
          control: "number",
        },
      },
    },
    version: {
      control: "select",
      options: ["Standard", "Emergency", "Zero"],
    },

    zeroQuorum: {
      control: "number",
    },
    powerQuorum: {
      control: "number",
    },
    powerTotalSupply: {
      control: "number",
    },
    zeroTotalSupply: {
      control: "number",
    },
  },
  render: (args) => ({
    components: {
      MProgressBar,
      ProposalVoteProgress,
    },
    setup() {
      return { args };
    },
    template: `
      <ProposalVoteProgress v-bind="args" />
    `,
  }),
} satisfies Meta<typeof ProposalVoteProgress>;

export default meta;
type Story = StoryObj<typeof meta>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */

export const Default: Story = {};

export const PowerYes100: Story = {
  args: {
    tallies: {
      power: {
        yes: "1000",
        no: "0",
      },
      zero: {
        yes: "0",
        no: "0",
      },
    },
  },
};

export const PowerYes30: Story = {
  args: {
    tallies: {
      power: {
        yes: "300",
        no: "700",
      },
      zero: {
        yes: "0",
        no: "0",
      },
    },
  },
};

export const PowerNo100: Story = {
  args: {
    tallies: {
      power: {
        yes: "0",
        no: "1000",
      },
      zero: {
        yes: "0",
        no: "0",
      },
    },
  },
};

export const PowerQuorumReachedEmergency: Story = {
  args: {
    version: "Emergency",
    tallies: {
      power: {
        yes: "550",
        no: "100",
      },
      zero: {
        yes: "0",
        no: "0",
      },
    },

    powerQuorum: 0.45,
    powerTotalSupply: 1000n,
  },
};

export const PowerQuorumNotReachedEmergency: Story = {
  args: {
    version: "Emergency",
    tallies: {
      power: {
        yes: "550",
        no: "100",
      },
      zero: {
        yes: "0",
        no: "0",
      },
    },

    powerQuorum: 0.85,
    powerTotalSupply: 1000n,
  },
};

export const ZeroQuorumReached: Story = {
  args: {
    version: "Zero",
    tallies: {
      power: {
        yes: "0",
        no: "0",
      },
      zero: {
        yes: "70",
        no: "30",
      },
    },

    zeroQuorum: 0.5,
    zeroTotalSupply: 120n,
  },
};

export const ZeroQuorumNotReached: Story = {
  args: {
    version: "Zero",
    tallies: {
      power: {
        yes: "0",
        no: "0",
      },
      zero: {
        yes: "10",
        no: "50",
      },
    },

    zeroQuorum: 0.5,
    zeroTotalSupply: 120n,
  },
};
