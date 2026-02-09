import { Router } from 'express';
import { AuthController } from "../../func-modules/func-auth/auth.controller";
import {AuthenticateMiddleware} from "../../common-modules/middleware/authenticate.middleware";
import {authService} from "../services";

const router = Router();
const authController = new AuthController(authService);

router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.get('/refresh', AuthenticateMiddleware, (req, res) => authController.refreshToken(req, res));

export default router;