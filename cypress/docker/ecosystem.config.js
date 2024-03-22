module.exports = {
  apps: [
    {
      name: "ttg-frontend",
      title: "ttg-frontend",
      script: "yarn",
      args: "dev",
      interpreter: "none",
      autorestart: true,
      watch: false,
      max_memory_restart: "1G",
      env: {
        NODE_ENV: "production",
        PORT: 3000, // Set the port if needed
      },
    },
  ],
};
