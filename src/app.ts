import express from 'express';
import 'reflect-metadata';
import userRoutes from "./server/routes/user.routes";
import authRoutes from "./server/routes/auth.routes";
import {ErrorMiddleware} from "./common-modules/middleware/error.middleware";
import {AuthenticateMiddleware} from "./common-modules/middleware/authenticate.middleware";

export const app = express();

app.use(express.json());
app.use('/auth', authRoutes);
app.use(AuthenticateMiddleware);
app.use('/user', userRoutes);
app.use(ErrorMiddleware);
