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
        longitud,
        telefono,
        adicional,
        vendedor,
        vendedorID,
    } = req.body;
    if (nombreComercial.lenght < 4) {
        throw "nombreLenght"
    }
    else {
        const cliente = new Client({
            nombreComercial,
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
            creadorID: req.payload.id
        })
        // console.log(cliente)
        // console.log(req.payload)
        await cliente.save();
        // let busqueda = await Client.find({creadorID:null})
        // console.log(busqueda)
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
                        calificacion: req.body.calificacion
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
exports.getAllVisitsByIdSeller = async (req, res) => {
    console.log(req.req.headers.userId)
    try {
        let visitas = await Client.find(
            {
                historial: {
                        _id:req.headers.userId
                    }
            })
        res.json({visitas})
    } catch (error) {
        console.log(error)
        res.status(500).json({
            message:"Error"
        })
    }
}