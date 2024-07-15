import { Request, Response } from "express"

const handle404Error = (req: Request, res: Response) =>
    res.status(404).json({ error: "Resource not found" })
export { handle404Error }
