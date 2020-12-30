
const router = require('express').Router()
const {catchErrors} = require('../handlers/errorHandlers')
const clientController = require('../controllers/clientController')
const auth = require('../middlewares/auth')


router.post("/register",auth,catchErrors(clientController.register))
router.get("/getClientsById",auth,catchErrors(clientController.getClientsById))
router.post("/updateVisit",auth,catchErrors(clientController.updateVisit))

module.exports = router;