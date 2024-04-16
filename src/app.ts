import "dotenv/config";
import express from "express";
import guest from "./routes/guest";
import errorMiddleware from "./middlewares/errorMiddleware";
import isAuthenticated from "./middlewares/isAuthenticated";
import types from "./routes/types";
import lodgings from "./routes/lodgings";
import histories from "./routes/histories";
import publics from "./routes/publics";
import cors from "cors";
import users from "./routes/users";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/public", publics);

app.use(guest);

app.use(isAuthenticated);
app.use("/", users);
app.use("/types", types);
app.use("/lodgings", lodgings);
app.use("/histories", histories);

app.use(errorMiddleware);

export default app;
