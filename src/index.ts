import express from "express"
import { config } from "./config"

const app = express()
const port = config.PORT

app.get("/", (_req, res) => {
  res.send("Hello, world!")
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}/`)
})
