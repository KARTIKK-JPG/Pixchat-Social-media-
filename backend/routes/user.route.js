import express from "express";
import { editProfile, followOrUnfollow, getProfile, getSuggestedUsers, login, logout, registor } from "../controller/user.controller.js";
import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js";


const router = express.Router()

router.route('/registor').post(registor)
router.route('/login').post(login)
router.route('/logout').get(logout)
router.route('/:id/profile').get(isAuth, getProfile)
router.route('/profile/edit').post(isAuth, upload.single('profilePhoto'), editProfile)
router.route('/suggested').get(isAuth, getSuggestedUsers)
router.route('/followorunfollow/:id').post(isAuth, followOrUnfollow)


export default router
