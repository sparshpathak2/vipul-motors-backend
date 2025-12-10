module.exports = {
    apps: [
        {
            name: "vipul-motors-server",
            script: "src/index.js",
            cwd: "/home/ubuntu/vipul-motors/vipul-motors-api-server",
            watch: false,
            env: {
                NODE_ENV: "production",
                PORT: 3003
            }
        }
    ]
}