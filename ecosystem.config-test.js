module.exports = {
  apps: [{
    name: "BackstagePassBackendTest",
    script: "npm",
    args: "run start",
    time: true,
    out_file: "/home/panzerkunst/fanlink-backend-test/log/appp.log",
    error_file: "/home/panzerkunst/fanlink-backend-test/log/error.log",
    merge_logs: true
  }]
}
