import type { Meta, StoryObj } from "@storybook/vue3";

import MButtonRadio from "../components/design-system/MButtonRadio.vue";

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta = {
  title: "Example/MButtonRadio",
  component: MButtonRadio,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ["autodocs"],
  argTypes: {
    version: {
      control: "select",
      options: ["default", "active"],
    },
    disabled: {
      control: "boolean",
      options: [false, true],
    },
  },

  render: (args) => ({
    components: {
      MButtonRadio,
    },
    setup() {
      return { args };
    },
    template: `
      <MButtonRadio v-bind="args">
        Button
      </MButtonRadio>
    `,
  }),
} satisfies Meta<typeof MButtonRadio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    version: "default",
  },
};

export const Active: Story = {
  args: {
    version: "active",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
