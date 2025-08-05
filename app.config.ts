export default defineAppConfig({
  name: 'Governance',
  ui: {
    primary: 'blue',
    gray: 'customGray',
    variables: {
      slide: {
        height: '5rem',
      },
      light: {
        background: '243 248 252',
      },
    },
    badge: {
      rounded: 'rounded-none',
    },
    button: {
      rounded: 'rounded-none',
      color: {
        gray: {
          solid:
            'disabled:bg-grey-200 disabled:text-grey-500 disabled:border-none bg-[#E9F0F7] hover:bg-grey-200 ring-grey-200 shadow-none',
        },
        primary: {
          solid: 'bg-accent-blue hover:bg-blue-400 ring-none text-white shadow-none',
        },
      },
      default: {
        color: 'gray',
      },
    },
    card: {
      rounded: 'rounded-none',
    },
    container: {
      constrained: 'max-w-[1344px]',
    },
    dropdown: {
      rounded: 'rounded-none',
      width: 'w-fit max-w-72',
    },
    header: {
      container: 'gap-8 h-[70px] max-w-none border-b border-b-grey-100',
      logo: 'text-900 text-[20px] font-semibold font-ppformula',
      wrapper: 'bg-white text-grey-900 border-none',
      panel: {
        wrapper: 'bg-white',
      },
      button: {
        base: 'text-grey-900 hover:bg-slate-100',
      },
      links: {
        base: 'font-medium py-3 text-sm',
        inactive: 'hover:text-grey-500 text-grey-900',
        active: 'text-grey-500',
      },
    },
    horizontalNavigation: {
      inner: 'min-w-min',
      container: 'overflow-x-auto',
    },
    input: {
      rounded: 'rounded-none',
      color: {
        white: {
          outline: 'shadow-none',
        },
      },
    },
    popover: {
      rounded: 'rounded-none',
    },
    select: {
      rounded: 'rounded-none',
      color: {
        white: {
          outline: 'shadow-none',
        },
      },
    },
    selectMenu: {
      rounded: 'rounded-none',
      label: 'block',
      popper: {
        placement: 'bottom',
        padding: '6',
      },
    },
    tabs: {
      tab: {
        font: 'font-normal',
      },
    },
    table: {
      divide: 'divide-gray-200 dark:divide-gray-800',
      default: {
        sortButton: {
          class: 'text-grey-600 font-normal',
        },
      },
      th: {
        color: 'text-grey-600',
        font: 'font-normal',
      },
      td: {
        base: 'text-wrap',
        color: 'text-grey-900',
      },
      tr: {
        selected: 'bg-grey-200 dark:bg-grey-800/50',
        active: 'hover:bg-grey-200 dark:hover:bg-grey-800/50 cursor-pointer',
      },
    },
  },
  footer: {
    credits: `© ${new Date().getFullYear()} M0 FOUNDATION`,
    links: [
      {
        icon: 'i-simple-icons-x',
        to: 'https://x.com/m0',
        target: '_blank',
        'aria-label': 'X - Twitter',
      },
      {
        icon: 'i-simple-icons-linkedin',
        to: 'https://www.linkedin.com/company/m0-labs/',
        target: '_blank',
        'aria-label': 'LinkedIn',
      },
      {
        icon: 'i-simple-icons-github',
        to: 'https://github.com/m0-foundation',
        target: '_blank',
        'aria-label': 'Github',
      },
    ],
  },
})
