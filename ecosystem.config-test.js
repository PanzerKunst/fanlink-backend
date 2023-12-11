module.exports = {
  apps: [{
    name: "BackstagePassBackendTest",
    script: "npm",
    args: "run start",
    time: true,
    env: {
      NODE_ENV: "production",
      PORT: "3000",
      DATABASE_URL: "postgresql://postgres:6gW^tm@4MC1T@localhost:5432/backstage_pass_test",
      FRONTEND_URL: "https://fanlink-murex.vercel.app"
    },
    out_file: "/home/panzerkunst/fanlink-backend-test/log/app.log",
    error_file: "/home/panzerkunst/fanlink-backend-test/log/error.log",
    merge_logs: true
  }]
}
