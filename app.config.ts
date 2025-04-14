export default defineAppConfig({
  name: 'Governance',
  ui: {
    primary: 'blue',
    gray: 'customGray',
    variables: {
      slide: {
        height: '5rem',
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
          solid: 'bg-accent-blue hover:bg-blue-400 ring-none text-white',
        },
      },
      default: {
        color: 'gray',
      },
    },
    card: {
      rounded: 'rounded-none',
    },
    dropdown: {
      rounded: 'rounded-none',
      width: 'w-fit max-w-72',
    },
    header: {
      container: 'gap-8 h-[72px]',
      left: 'lg:flex-initial',
      logo: 'text-white text-[20px] font-medium',
      wrapper: 'bg-grey-1000 border-none',
      button: {
        base: 'text-white',
      },
      links: {
        wrapper: 'gap-x-3',
        base: 'font-normal px-3 py-1.5 text-gray-200 text-[16px]',
        active: 'text-gray-200 bg-gray-800',
        inactive: 'hover:text-gray-200',
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
      labe: 'block',
      popper: {
        placement: 'bottom-start',
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
          class: 'text-grey-500 font-normal',
        },
      },
      th: {
        color: 'text-grey-500',
        font: 'font-normal',
      },
      td: {
        base: 'text-wrap',
        color: 'text-black',
      },
    },
  },
  footer: {
    credits: '© 2024 M0 FOUNDATION',
    links: [
      {
        icon: 'i-simple-icons-x',
        to: 'https://x.com/m0foundation',
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
