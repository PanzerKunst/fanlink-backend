module.exports = {
  apps: [{
    name: "BackstagePassBackendTest",
    script: "npm",
    args: "run start",
    env: {
      NODE_ENV: "production"
    },
    out_file: "/home/panzerkunst/fanlink-backend-test/log/app.log",
    error_file: "/home/panzerkunst/fanlink-backend-test/log/error.log",
    merge_logs: true
  }]
}