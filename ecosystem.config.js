module.exports = {
  apps: [{
    name: "BackstagePassBackend",
    script: "npm",
    args: "run start",
    env: {
      NODE_ENV: "production"
    },
    pre_exec: "npm run build"
  }]
}
