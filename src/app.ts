import express, { json } from "express"
import cookieParser from 'cookie-parser';
import mainRouter from "./routes/routerIndex";
import helmet from "helmet";
import { handle404Error } from "./middlewares/wrong-url-handler";

const app = express();

app.use(helmet());
app.use(cookieParser());
app.use(json());
app.use("/", mainRouter);
app.use("*", handle404Error);

export default app;