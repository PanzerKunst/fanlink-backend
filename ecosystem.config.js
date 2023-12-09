module.exports = {
  apps: [{
    name: "BackstagePassBackendTest",
    script: "npm",
    args: "run start",
    env: {
      NODE_ENV: "production"
    },
    pre_exec: "npm run build",
    out_file: "~/fanlink-backend-test/log/app.log",
    error_file: "~/fanlink-backend-test/log/error.log",
    merge_logs: true
  }]
}
