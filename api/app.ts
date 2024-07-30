import express from "express";
import authRoute from './routes/auth.route';
import postRoute from './routes/post.route';

const app = express();

app.use(express.json());

app.use("/api/posts", postRoute);
app.use("/api/auth", authRoute);

app.listen(8800, () => {
    console.log("Server is running!");
});