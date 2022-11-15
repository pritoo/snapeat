const express = require('express');
const router = express.Router();
const multer =require('multer');
const controller = require('../../Controllers/userControllers/userController');

const {authorization_restro} = require('../../Middlewares/auth');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
       cb(null, 'image');
    },
    filename: function (req, file, cb) {
       cb(null, Date.now() + '-' + file.originalname);
    }
 });
 let upload = multer({ storage: storage });

router.route('/register').post(controller.registerUsers);

router.put('/profileupdate/:id',upload.single('profile_id'),authorization_restro,controller.updateUserProfile);

router.get('/userdetail/:id',authorization_restro,controller.getUserDetails);

router.route('/getAllUser').get(controller.getAllUser);

router.route('/login').post(controller.logIn);

router.route('/logout').post(controller.logOut);

router.route('/changepassword/:id').put(controller.changePassword);

module.exports = router;
