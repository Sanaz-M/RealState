import express from "express";
import { shouldBeAdmin, shouldBeLoggedIn } from "../controllers/test.controller";
import { verifyToken } from "../middleware/verifyToken";

const router = express.Router();

router.get("/is-loggedin", verifyToken, shouldBeLoggedIn);
router.get("/is-admin", shouldBeAdmin);


export default router;
