import type { Meta, StoryObj } from "@storybook/vue3";

import MButtonRadio from "../components/design-system/MButtonRadio.vue";

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta = {
  title: "Example/MButtonRadio",
  component: MButtonRadio,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ["autodocs"],

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
    disabled: false,
    modelValue: 1,
    text: "Default",
    value: 0,
  },
};

export const DefaultDisabled: Story = {
  args: {
    disabled: true,
    modelValue: 1,
    text: "Disabled",
    value: 0,
  },
};

export const Checked: Story = {
  args: {
    disabled: false,
    modelValue: 1,
    text: "Checked",
    value: 1,
  },
};

export const CheckedDisabled: Story = {
  args: {
    disabled: 1,
    modelValue: 1,
    text: "Checked Disabled",
    value: 1,
  },
};
