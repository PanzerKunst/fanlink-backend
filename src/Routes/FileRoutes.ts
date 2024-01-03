import { httpStatusCode } from "../Util/HttpUtils"
import { Request, Response, Router } from "express"
import dayjs from "dayjs"
import path from "node:path"
import { config } from "../config"
import fs from "fs"
import { getContentTypeFromFilePath } from "../Util/FileUtils"
import { formDataFileUploader } from "../index"

export function fileRoutes(router: Router) {
  router.post("/file/image/base64", (req: Request, res: Response) => {
    try {
      const base64 = req.body.base64 as string // eslint-disable-line @typescript-eslint/no-unsafe-member-access

      const matches = base64.match(/^data:([A-Za-z-+/]+);base64,(.+)$/)

      if (!matches || matches.length !== 3) {
        res.status(httpStatusCode.BAD_REQUEST).send("Invalid base64 string")
        return
      }

      const todayYyyyMmDd = dayjs().format("YYYY-MM-DD")
      const directoryPath = path.join(config.UPLOADS_DIR, todayYyyyMmDd)
      fs.mkdirSync(directoryPath, { recursive: true })

      const contentType = matches[1]!
      const extension = contentType.split("/")[1]
      const timestamp = Date.now()
      const fileName = `image-${timestamp}.${extension}`
      const absolutePath = path.join(directoryPath, fileName)

      const base64Data = matches[2]!
      const buffer = Buffer.from(base64Data, "base64")
      fs.writeFileSync(absolutePath, buffer)

      res.status(httpStatusCode.OK).json(`${todayYyyyMmDd}/${fileName}`)
    } catch (error) {
      console.error(error)
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(error)
    }
  })

  router.post("/file/image/form-data", formDataFileUploader.single("image"), (req: Request, res: Response) => {
    try {
      const file = req.file

      if (!file) {
        res.status(httpStatusCode.BAD_REQUEST).send("No file uploaded.")
        return
      }

      const filePathWithoutUploadsDir = file.path.replace(config.UPLOADS_DIR, "")
      const filePathWithoutLeadingBackslash = filePathWithoutUploadsDir.substring(1)

      res.status(httpStatusCode.OK).json(filePathWithoutLeadingBackslash.replace(/\\/g, "/"))
    } catch (error) {
      console.error(error)
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(error)
    }
  })

  router.get("/file/:dir/:fileName", (req, res) => {
    try {
      const { dir, fileName } = req.params

      if (dir === "" || fileName === "") {
        res.status(httpStatusCode.BAD_REQUEST).send("Missing 'dir' or 'fileName' in path")
        return
      }

      const absolutePath = path.join(config.UPLOADS_DIR, dir, fileName)

      if (!fs.existsSync(absolutePath)) {
        res.sendStatus(httpStatusCode.NO_CONTENT)
        return
      }

      res.setHeader("Content-Type", getContentTypeFromFilePath(absolutePath))
      fs.createReadStream(absolutePath).pipe(res)
    } catch (error) {
      console.error(error)
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(error)
    }
  })

  router.delete("/file/:dir/:fileName", (req, res) => {
    try {
      const { dir, fileName } = req.params

      if (dir === "" || fileName === "") {
        res.status(httpStatusCode.BAD_REQUEST).send("Missing 'dir' or 'fileName' in path")
        return
      }

      const absolutePath = path.join(config.UPLOADS_DIR, dir, fileName)

      if (!fs.existsSync(absolutePath)) {
        res.sendStatus(httpStatusCode.NO_CONTENT)
        return
      }

      fs.unlinkSync(absolutePath)

      res.sendStatus(httpStatusCode.OK)
    } catch (error) {
      console.error(error)
      res.status(httpStatusCode.INTERNAL_SERVER_ERROR).json(error)
    }
  })
}
