module.exports = {
  apps: [
    {
      name: "lexiforge-web",
      script: "node_modules/.bin/next",
      args: "start -p 3000",
      cwd: "/var/www/lexiforge",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      error_file: "/var/log/lexiforge/web-error.log",
      out_file: "/var/log/lexiforge/web-out.log",
    },
  ],
};
