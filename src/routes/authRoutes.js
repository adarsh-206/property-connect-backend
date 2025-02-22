import express from "express";
import {
  signup,
  login,
  checkAuth,
  logout,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/check-auth", checkAuth);
router.post("/logout", logout);

export default router;
