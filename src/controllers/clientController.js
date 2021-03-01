const mongoose = require("mongoose")
const Client = mongoose.model("Client")
exports.register = async (req, res) => {
    const { nombreComercial,
        razonSocial,
        direccion,
        referencia,
        distrito,
        provincia,
        departamento,
        pais,
        latitud,
        ruc,
        longitud,
        telefono,
        adicional,
        vendedor,
        vendedorID,
        direccionExacta,
    } = req.body;
    if (nombreComercial.lenght < 4) {
        throw "nombreLenght"
    }
    else {
        const cliente = new Client({
            nombreComercial,
            ruc,
            razonSocial,
            direccion,
            referencia,
            distrito,
            provincia,
            departamento,
            pais,
            latitud,
            longitud,
            telefono,
            adicional,
            vendedor,
            vendedorID,
            direccionExacta,
            creadorID: req.payload.id
        })
        await cliente.save()
        res.json({ message: "clientCreated" })
    }
}

exports.getClientsById = async (req, res) => {
    const chatrooms = await Client.find({ vendedorID: req.headers.id })
    res.json(chatrooms)
}
exports.updateVisit = async (req, res) => {
    try {
        await Client.findByIdAndUpdate(
            { _id: req.body.id },
            {
                $push: {
                    historial: {
                        latitud: req.body.latitudLast,
                        longitud: req.body.longitudLast,
                        calificacion: req.body.calificacion,
                        idVendedor:req.headers.id,
                        // fechaVisita:dateLima
                    }
                }
            }, {useFindAndModify: false})
        res.json({ message: 'success' })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message:"Error"
        })
    }
}
exports.setRoute = async (req, res) => {
    try {
        console.log(req.body)
    } catch (error) {
        console.log(error)
    }
}
exports.getAllVisitsByIdSeller = async (req, res) => {
    // console.log(typeof(req.headers.userid))

    try {
        let idVendedor = req.headers.userid
        let visitas = await Client.find(
            {"historial.idVendedor": idVendedor}
            )
        res.json({visitas})
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message:"Error"
        })
    }
}
exports.getAllClients = async (req, res) => {
    try {
        let clientes = await Client.find({})
        res.json({clientes})
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message:"Error"
        })
    }
}
exports.updateClient = async (req, res) => {

    try {
        const {client,id} = req.body
        let clientes = await Client.findOneAndUpdate({
            _id:id
        },client)
        
        res.json({message:'success'})
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message:"Error"
        })
    }
}