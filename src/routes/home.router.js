import { Router } from "express";
import { passportCall } from "../utils/utils.js";
import { iniHome } from "../controllers/home.controller.js";

const router = Router();

router.get('/', passportCall('jwt'), iniHome);

export default router;
