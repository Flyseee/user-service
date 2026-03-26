import { Router } from 'express';
import {UserController} from "../../func-modules/func-user/user.controller";
import {userService} from "../services";

const router = Router();
const userController = new UserController(userService);

router.get('/', (req, res) => userController.getList(req, res));
router.get('/:id', (req, res) => userController.get(req, res));
router.patch('/:id/status', (req, res) => userController.toggleStatus(req, res));

export default router;