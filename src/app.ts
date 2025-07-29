import cors from "cors";
import express, { Request, Response } from "express";
import { router } from "./app/route";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";

const app = express()

app.use(express.json())
app.use(cors())

app.use("/api/v1", router)

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to Percel Delivery Software Backend :)"
    })
})

app.use(globalErrorHandler)

export default app