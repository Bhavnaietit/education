import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/mongodb.js";
// initialize express
const app = express();
// port
const PORT = process.env.PORT || 5000;

await connectDB();

// middlewares
app.use(cors());

// Routes
app.get("/", (req, res) => {
	res.send("api working");
});


app.listen(PORT, () => {
	console.log("server started! at port", PORT);
});
