
const router = require('express').Router()
const {catchErrors} = require('../handlers/errorHandlers')
const userController = require('../controllers/userController')
const auth = require('../middlewares/auth')


router.post("/login",catchErrors(userController.login))
router.post("/verifyLogin",auth,catchErrors(userController.verifyLogin))
router.post("/register",auth,catchErrors(userController.register))
router.post("/updateUser",catchErrors(userController.updateUser))
router.get("/getAllUsers",catchErrors(userController.getAllUsers))

module.exports = router;