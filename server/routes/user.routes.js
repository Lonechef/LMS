const express = require('express');
//const Router = express.Router;
const router = express.Router();
const {isLoggedin}=require('../middlewares/auth.middleware')
const {
    register,
    login,
    logout,
    getProfile

}=require("../controllers/user.controllers")

//Creting instance of the router


router.post('/register',register);
router.post('./login',login);
router.get('./logout',logout);
router.get('./me',isLoggedin,getProfile);

module.exports=router;