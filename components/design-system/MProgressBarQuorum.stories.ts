import type { Meta, StoryObj } from "@storybook/vue3";

import MProgressBarQuorum from "./MProgressBarQuorum.vue";

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta = {
  title: "DS/MProgressBarQuorum",
  component: MProgressBarQuorum,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ["autodocs"],
  argTypes: {
    yes: {
      control: "number",
    },
    no: {
      control: "number",
    },
    quorum: {
      control: "number",
    },
  },
  render: (args) => ({
    components: {
      MProgressBarQuorum,
    },
    setup() {
      return { args };
    },
    template: `
      <MProgressBarQuorum v-bind="args" />
    `,
  }),
} satisfies Meta<typeof MProgressBarQuorum>;

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
    yes: 1000,
    no: 0,
    quorum: 0.5,
  },
};
