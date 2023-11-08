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
      options: ["Power", "Emergency", "Zero", "Double"],
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
        yes: 1000n,
        no: 0n,
      },
      zero: {
        yes: 0n,
        no: 0n,
      },
    },
  },
};

export const PowerYes30: Story = {
  args: {
    tallies: {
      power: {
        yes: 300n,
        no: 700n,
      },
      zero: {
        yes: 0n,
        no: 0n,
      },
    },
  },
};

export const PowerNo100: Story = {
  args: {
    tallies: {
      power: {
        yes: 0n,
        no: 1000n,
      },
      zero: {
        yes: 0n,
        no: 0n,
      },
    },
  },
};

export const PowerQuorumReachedEmergency: Story = {
  args: {
    version: "Emergency",
    tallies: {
      power: {
        yes: 550n,
        no: 100n,
      },
      zero: {
        yes: 0n,
        no: 0n,
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
        yes: 550n,
        no: 100n,
      },
      zero: {
        yes: 0n,
        no: 0n,
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
        yes: 0n,
        no: 0n,
      },
      zero: {
        yes: 70n,
        no: 30n,
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
        yes: 0n,
        no: 0n,
      },
      zero: {
        yes: 10n,
        no: 50n,
      },
    },

    zeroQuorum: 0.5,
    zeroTotalSupply: 120n,
  },
};

export const DoubleQuorumReachedAll: Story = {
  args: {
    version: "Double",
    tallies: {
      power: {
        yes: 550n,
        no: 100n,
      },
      zero: {
        yes: 80n,
        no: 30n,
      },
    },
    powerQuorum: 0.5,
    zeroQuorum: 0.5,

    powerTotalSupply: 1000n,
    zeroTotalSupply: 150n,
  },
};

export const DoubleQuorumPowerReachedZeroNotReached: Story = {
  args: {
    version: "Double",
    tallies: {
      power: {
        yes: 550n,
        no: 100n,
      },
      zero: {
        yes: 30n,
        no: 30n,
      },
    },

    powerQuorum: 0.5,
    zeroQuorum: 0.5,

    powerTotalSupply: 1000n,
    zeroTotalSupply: 150n,
  },
};

export const DoubleQuorumPowerNotReachedZeroReached: Story = {
  args: {
    version: "Double",
    tallies: {
      power: {
        yes: 150n,
        no: 100n,
      },
      zero: {
        yes: 80n,
        no: 30n,
      },
    },

    powerQuorum: 0.5,
    zeroQuorum: 0.5,

    powerTotalSupply: 1000n,
    zeroTotalSupply: 150n,
  },
};

export const DoubleQuorumNoneNotReached: Story = {
  args: {
    version: "Double",
    tallies: {
      power: {
        yes: 50n,
        no: 100n,
      },
      zero: {
        yes: 20n,
        no: 30n,
      },
    },

    powerQuorum: 0.5,
    zeroQuorum: 0.5,

    powerTotalSupply: 1000n,
    zeroTotalSupply: 150n,
  },
};
