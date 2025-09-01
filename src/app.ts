import cors from "cors";
import express, { Request, Response } from "express";
import { router } from "./app/route";
import { globalErrorHandler } from "./app/middlewares/globalErrorHandler";
import { swaggerSpec, swaggerUi } from "./app/config/swaggerConfig";
import { envVars } from "./app/config/env";
import cookieParser from "cookie-parser";


const app = express()

app.use(cookieParser());
app.use(express.json())
app.use(cors({
  origin: "*",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1", router)

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        message: "Welcome to Parcel Delivery Software Backend :)"
    })
})

app.use(globalErrorHandler)

export default app