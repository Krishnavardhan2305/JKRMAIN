import express from "express";
import { addclients, getClients, login, logout } from "../controllers/admincontroller.js";

const router = express.Router();
router.get("/getclients", getClients);
router.post("/addclients", addclients);
router.post("/login", login);
router.get("/logout", logout);

export default router;