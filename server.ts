import express, { urlencoded } from "express"
import mongoose from "mongoose"
import configKeys from "./config/configKeys"
import employeRoute from "./routes/userRoute"
import managerRoute from "./routes/managerRoute"
import morgan from "morgan"
import cors from "cors"
import errorHandlingMiddleware from "./middlewares/errorHandling"

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan("dev"))

mongoose
  .connect(configKeys.MONGO_DB_URL)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Failed to connect to MongoDB:", err))

const corsConfig = {
  origin: true,
  credentials: true,
}

app.use(cors(corsConfig))

app.use("/", employeRoute)
app.use("/manager", managerRoute)
app.use(errorHandlingMiddleware)
app.listen(configKeys.PORT, () => {
  console.log(`server running on http://localhost:${configKeys.PORT}`)
})
