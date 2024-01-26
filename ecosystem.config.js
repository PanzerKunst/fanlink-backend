module.exports = {
  apps: [{
    name: "BackstagePassBackendTest",
    script: "npm",
    args: "run start",
    out_file: "/home/panzerkunst/fanlink-backend-test/logs/out.log",
    error_file: "/home/panzerkunst/fanlink-backend-test/logs/error.log",
    merge_logs: true,
    time: true
  }]
}
