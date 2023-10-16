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
    votes: {
      power: {
        yes: {
          control: "number",
        },
        no: {
          control: "number",
        },
      },
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
    votes: {
      power: {
        yes: 1000,
        no: 0,
        total: 1000,
      },
      zero: {
        yes: 0,
        no: 0,
        total: 0,
      },
    },
  },
};

export const PowerNo100: Story = {
  args: {
    votes: {
      power: {
        yes: 0,
        no: 1000,
        total: 1000,
      },
      zero: {
        yes: 0,
        no: 0,
        total: 0,
      },
    },
  },
};

export const ZeroQuorumReached: Story = {
  args: {
    version: "Zero",
    votes: {
      power: {
        yes: 0,
        no: 0,
        total: 0,
      },
      zero: {
        yes: 70,
        no: 30,
        total: 100,
      },
    },

    zeroQuorum: 0.5,
  },
};

export const ZeroQuorumNotReached: Story = {
  args: {
    version: "Zero",
    votes: {
      power: {
        yes: 0,
        no: 0,
        total: 0,
      },
      zero: {
        yes: 10,
        no: 50,
        total: 60,
      },
    },

    zeroQuorum: 0.5,
  },
};

export const DoubleQuorumReachedAll: Story = {
  args: {
    version: "Double",
    votes: {
      power: {
        yes: 100,
        no: 10,
        total: 110,
      },
      zero: {
        yes: 70,
        no: 30,
        total: 100,
      },
    },
    powerQuorum: 0.5,
    zeroQuorum: 0.5,
  },
};

export const DoubleQuorumPowerReachedZeroNotReached: Story = {
  args: {
    version: "Double",
    votes: {
      power: {
        yes: 100,
        no: 10,
        total: 110,
      },
      zero: {
        yes: 10,
        no: 50,
        total: 60,
      },
    },
    powerQuorum: 0.5,
    zeroQuorum: 0.5,
  },
};

export const DoubleQuorumPowerNotReachedZeroReached: Story = {
  args: {
    version: "Double",
    votes: {
      power: {
        yes: 10,
        no: 40,
        total: 50,
      },
      zero: {
        yes: 70,
        no: 30,
        total: 100,
      },
    },
    powerQuorum: 0.5,
    zeroQuorum: 0.5,
  },
};

export const DoubleQuorumNoneNotReached: Story = {
  args: {
    version: "Double",
    votes: {
      power: {
        yes: 20,
        no: 0,
        total: 100,
      },
      zero: {
        yes: 10,
        no: 0,
        total: 100,
      },
    },
    powerQuorum: 0.5,
    zeroQuorum: 0.5,
  },
};
