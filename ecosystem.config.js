module.exports = {
  apps: [{
    name: "BackstagePassBackend",
    script: "npm",
    args: "run start",
    env: {
      NODE_ENV: "production"
    },
    pre_exec: "npm run build",
    out_file: "~/fanlink-backend/log/test.log",
    error_file: "~/fanlink-backend/log/error.log",
    merge_logs: true
  }]
}
