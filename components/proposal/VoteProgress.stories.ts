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
    yes: {
      control: "number",
    },
    no: {
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

export const Yes100: Story = {
  args: {
    yes: 100,
    no: 0,
  },
};

export const No100: Story = {
  args: {
    yes: 0,
    no: 100,
  },
};

export const Quorum70Reached: Story = {
  args: {
    yes: 150,
    no: 50,
    version: "quorum",
    quorum: 0.7,
  },
};

export const Quorum50Reached: Story = {
  args: {
    yes: 150,
    no: 50,
    version: "quorum",
    quorum: 0.5,
  },
};

export const QuorumNo: Story = {
  args: {
    yes: 0,
    no: 100,
    version: "quorum",
    quorum: 0.5,
  },
};
