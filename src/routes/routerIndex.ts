import { Router } from "express"
import { userRouter } from "./routerUser"
import { handle405Error } from "../middlewares/wrong-method-handler"

const mainRouter = Router()

mainRouter.use("/users", userRouter)

mainRouter.all("/status", handle405Error)

export default mainRouter