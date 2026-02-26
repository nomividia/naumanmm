module.exports = {
    apps: [
        {
            name: "mmi-val",
            cwd: "./",
            script: "./back/main.js",
            exec_mode: "fork",
            // exec_mode: "cluster",
            // instances: 2,
            max_memory_restart: "900M",
            node_args: "--max_old_space_size=1024",
            env: {
                NODE_ENV: "production",
                TZ: 'utc',
            },
            env_production: {
                NODE_ENV: "production",
                TZ: 'utc',
            },
            // error_file: 'pm2-err.log',
            // out_file: 'pm2-out.log',
        },
    ],
    deploy: {
        // "production" is the environment name
        production: {
        },
    },
};

//this file is for PM2