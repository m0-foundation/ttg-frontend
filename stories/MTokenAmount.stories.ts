import type { Meta, StoryObj } from "@storybook/vue3";

import MTokenAmount from "../components/design-system/MTokenAmount.vue";

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta = {
  title: "Example/MTokenAmount",
  component: MTokenAmount,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: { type: "range", min: 14, max: 72, step: 2 },
    },
  },
  render: (args) => ({
    components: {
      MTokenAmount,
    },
    setup() {
      return { args };
    },
    template: `
      <MTokenAmount v-bind="args">
        Button
      </MTokenAmount>
    `,
  }),
} satisfies Meta<typeof MTokenAmount>;

export default meta;
type Story = StoryObj<typeof meta>;
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */

export const Default: Story = {
  args: {
    size: 40,
    image: "/img/tokens/eth.svg",
    amount: "4000",
    name: "Ethereum",
  },
};

export const NoAmount: Story = {
  args: {
    size: 40,
    image: "/img/tokens/eth.svg",
    name: "Ethereum",
  },
};

export const Size20: Story = {
  args: {
    size: 20,
    image: "/img/tokens/eth.svg",
    amount: "4000",
    name: "Ethereum",
  },
};

export const NoImageButName: Story = {
  args: {
    size: 40,
    amount: "4000",
    name: "Token",
  },
};
