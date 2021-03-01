
const router = require('express').Router()
const {catchErrors} = require('../handlers/errorHandlers')
const routeController = require('../controllers/routeController')
const auth = require('../middlewares/auth')


router.get("/getRoutesById",auth,catchErrors(routeController.getRoutesById))

module.exports = router;