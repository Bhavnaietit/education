import express, { raw } from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
import { clerkWehooks, stripeWebhooks } from "./controllers/webhooks.js";
import educatorRouter from "./routes/educatorRoutes.js";
import { clerkMiddleware } from "@clerk/express";
import connectCloudinary from "./configs/cloudinary.js";
import courseRouter from "./routes/courseRoute.js";
import userRouter from "./routes/userRoute.js";
// initialize express
const app = express();
// port
const PORT = process.env.PORT || 5000;

await connectDB();
await connectCloudinary();

// middlewares
app.use(cors());
app.use(clerkMiddleware());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
	res.send("api working");
});

app.post('/clerk', express.json(), clerkWehooks);
app.use('/api/educator', express.json(), educatorRouter);
app.use('/api/course', express.json(), courseRouter);
app.use("/api/user", express.json(), userRouter);

app.listen(PORT, () => {
	console.log("server started! at port", PORT);
});
