module.exports = {
    apps: [
        {
            name: "morgan-mallet-backend",
            cwd: "/var/www/morgan-mallet-crm",
            script: "./dist/back/main.js",
            instances: 1,
            exec_mode: "fork",
            max_memory_restart: "1G",
            env: {
                NODE_ENV: "production",
                PORT: 3037,
                TZ: "UTC"
            },
            error_file: "logs/backend-error.log",
            out_file: "logs/backend-out.log",
            log_date_format: "YYYY-MM-DD HH:mm:ss Z",
            merge_logs: true,
            autorestart: true,
            watch: false
        }
    ]
};