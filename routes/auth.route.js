import express from 'express';
import {signUpWithPassword, login, logout} from '../controllers/auth.controller.js';
const router = express.Router();

router.post("/signup", signUpWithPassword);

router.post("/login", login);

router.post("/logout", logout);


export default router;