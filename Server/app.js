import express from "express"
import dotenv from "dotenv"
import flowchartRoute from "./route/flowchart.route.js";
import cors from "cors"
dotenv.config();
const app = express();

const port = process.env.PORT;

app.use(
  cors({
    origin: process.env.FRONT_END_URL,
    allowedHeaders: true,
    credentials: true,
    methods: ["POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());
app.use("/api/v1", flowchartRoute);


app.listen(port, () => {
  console.log(`Server is listeneing at ${port}`);
});

