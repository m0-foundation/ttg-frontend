module.exports = {
  apps: [
    {
      name: 'ttg-frontend',
      title: 'ttg-frontend',
      script: 'yarn',
      args: 'dev',
      interpreter: 'none',
      autorestart: true,
      watch: false,
      max_memory_restart: '2G',
      env: {
        NODE_ENV: 'production',
        BUILD_ENV: 'local',
        PORT: 3000, // Set the port if needed
      },
    },
  ],
}
