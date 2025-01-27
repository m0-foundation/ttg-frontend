export default defineAppConfig({
  name: "Governance",
  ui: {
    primary: "blue",
    gray: "customGray",
    variables: {
      slide: {
        height: "5rem",
      },
    },
    badge: {
      rounded: "rounded-none",
    },
    button: {
      rounded: "rounded-none",
      default: {
        color: "gray",
      },
    },
    card: {
      rounded: "rounded-none",
    },
    dropdown: {
      rounded: "rounded-none",
      width: "w-fit max-w-72",
    },
    header: {
      container: "gap-8",
      left: "lg:flex-initial",
      logo: "text-white text-[20px] font-medium",
      wrapper: "bg-black",
      links: {
        wrapper: "gap-x-2 pt-1",
        base: "font-medium px-2.5 py-0.5 text-gray-200",
        active: "text-gray-200 bg-gray-700",
        inactive: "hover:text-gray-200",
      },
    },
    horizontalNavigation: {
      inner: "min-w-min",
      container: "overflow-x-auto",
    },
    input: {
      rounded: "rounded-none",
    },
    popover: {
      rounded: "rounded-none",
    },
    select: {
      rounded: "rounded-none",
    },
    selectMenu: {
      rounded: "rounded-none",
      popper: {
        placement: "bottom-start",
      },
    },
    table: {
      td: {
        base: "text-wrap",
      },
    },
  },
  footer: {
    credits: "© 2024 M^0 FOUNDATION",
    links: [
      {
        icon: "i-simple-icons-x",
        to: "https://x.com/m0foundation",
        target: "_blank",
        "aria-label": "X - Twitter",
      },
      {
        icon: "i-simple-icons-linkedin",
        to: "https://www.linkedin.com/company/m0-labs/",
        target: "_blank",
        "aria-label": "LinkedIn",
      },
      {
        icon: "i-simple-icons-github",
        to: "https://github.com/m0-foundation",
        target: "_blank",
        "aria-label": "Github",
      },
    ],
  },
});
