import express from "express";
import cookieParser from "cookie-parser";
import cors from 'cors';
import authRoute from './routes/auth.route';
import postRoute from './routes/post.route';
import testRoute from './routes/test.route';

const app = express();

app.use(cors({origin: 'http://localhost:5173', credentials:true}))
app.use(express.json());
app.use(cookieParser());

app.use("/api/posts", postRoute);
app.use("/api/auth", authRoute);
app.use("/api/test", testRoute)

app.listen(8800, () => {
    console.log("Server is running!");
});