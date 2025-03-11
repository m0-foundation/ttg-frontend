import type { Meta, StoryObj } from '@storybook/vue3'

import MButton from '../components/design-system/MButton.vue'

// More on how to set up stories at: https://storybook.js.org/docs/vue/writing-stories/introduction
const meta = {
  title: 'DS/MButton',
  component: MButton,
  // This component will have an automatically generated docsPage entry: https://storybook.js.org/docs/vue/writing-docs/autodocs
  tags: ['autodocs'],
  argTypes: {
    version: {
      control: 'select',
      options: [
        'primary',
        'secondary-light',
        'secondary-dark',
        'outline-light',
        'outline-dark',
      ],
    },
    isLoading: {
      control: 'boolean',
      options: [false, true],
    },
  },
  render: (args) => ({
    components: {
      MButton,
    },
    setup() {
      return { args }
    },
    template: `
      <MButton v-bind="args">
        Button
      </MButton>
    `,
  }),
} satisfies Meta<typeof MButton>

export default meta
type Story = StoryObj<typeof meta>
/*
 *👇 Render functions are a framework specific feature to allow you control on how the component renders.
 * See https://storybook.js.org/docs/vue/api/csf
 * to learn how to use render functions.
 */

export const Primary: Story = {
  args: {
    version: 'primary',
  },
}

export const SecondaryLight: Story = {
  args: {
    version: 'secondary-light',
  },
}

export const SecondaryDark: Story = {
  args: {
    version: 'secondary-dark',
  },
}

export const OutlineLight: Story = {
  args: {
    version: 'outline-light',
  },
}

export const OutlineDark: Story = {
  args: {
    version: 'outline-dark',
  },
}
