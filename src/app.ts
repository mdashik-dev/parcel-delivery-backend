import cors from "cors";
import express, { Request, Response } from "express";
import { router } from "./app/route";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { swaggerSpec, swaggerUi } from "./app/config/swaggerConfig";


const app = express()

app.use(express.json())
app.use(cors())
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1", router)

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to Parcel Delivery Software Backend :)"
    })
})

app.use(globalErrorHandler)

export default app