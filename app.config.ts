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
    },
    card: {
      rounded: "rounded-none",
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
