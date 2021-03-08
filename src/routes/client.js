
const router = require('express').Router()
const {catchErrors} = require('../handlers/errorHandlers')
const clientController = require('../controllers/clientController')
const auth = require('../middlewares/auth')



router.get("/getClientsById",auth,catchErrors(clientController.getClientsById))
router.get("/getAllVisitsByIdSeller",auth,catchErrors(clientController.getAllVisitsByIdSeller))
router.get("/getAllClients",auth,catchErrors(clientController.getAllClients))
router.post("/register",auth,catchErrors(clientController.register))
router.post("/updateVisit",auth,catchErrors(clientController.updateVisit))
router.post("/updateClient",auth,catchErrors(clientController.updateClient))
router.post("/setRoute",catchErrors(clientController.setRoute))
router.delete("/",auth,catchErrors(clientController.delete))

module.exports = router;