import express from "express";
import cors from "cors";
import "dotenv/config";
import { clerkMiddleware } from "@clerk/express";
import connectDB from "./configs/mongodb.js";
import { clerkWehooks } from "./controllers/webhooks.js";

// initialize express
const app = express();

// port
const PORT = process.env.PORT || 5000;

// connect to DB
await connectDB();
// await connectCloudinary();

// middlewares
app.use(cors());
app.use(clerkMiddleware());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
	res.send("api working");
});

// app.post("/clerk", express.json(), clerkWehooks);

app.listen(PORT, () => {
	console.log("server started! at port", PORT);
});
