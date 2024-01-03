import { httpStatusCode } from "../Util/HttpUtils"
import { Router } from "express"
import { exec } from "node:child_process"

export function githubWebhookRoutes(router: Router) {
  router.post("/webhook", (req, res) => {
    try {
      // TODO: remove
      console.log("Received webhook")

      exec("/home/panzerkunst/fanlink-backend-test/deploy-test.sh", (err) => {
        if (err) {
          throw new Error("The Github webkook failed")
        }

        // TODO: remove
        console.log("Deployed!")
        res.status(200).send("Deployed!")
      })
    } catch (error) {
      console.error(error)
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(error)
    }
  })
}
