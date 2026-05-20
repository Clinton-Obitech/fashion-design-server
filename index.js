import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import UserAuth from "./routes/user/auth.Route.js";
import getUser from "./routes/user/user.Route.js";
import designer from "./routes/user/designer.Route.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));

app.use("/api", UserAuth);
app.use("/api", getUser);
app.use("/api", designer);

app.listen(port, () => {
    console.log(`server is live on port ${port} successfully`)
})