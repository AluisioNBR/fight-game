import express from "express"
import { router } from "./router"

const server = express(), port = 3000

server
.use(express.json())
.use(router)
.use(express.static('public'))

.listen(port, () => {
  console.log(`Server started at http://localhost:${port}/`)
})