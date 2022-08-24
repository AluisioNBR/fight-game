import {
  Router,
  Request,
  Response
} from "express";

const router = Router()

.get('/', (req: Request, res: Response) => {
  return res.sendFile(`${__dirname}/pages/index.html`)
})

export { router }