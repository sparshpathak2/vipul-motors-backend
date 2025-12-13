module.exports = {
    apps: [
        {
            name: "vipul-motors-server",

            script: "src/index.js",
            cwd: "/home/ubuntu/vipul-motors/vipul-motors-backend",

            // ---- Security ----
            watch: false,
            autorestart: true,
            max_memory_restart: "300M",

            // ---- Environment ----
            env: {
                NODE_ENV: "production",
                PORT: 3003,
                HOST: "127.0.0.1"
            },

            // ---- Hardening ----
            exec_mode: "fork",
            instances: 1,
            kill_timeout: 5000,
            listen_timeout: 5000,
            time: true
        }
    ]
};