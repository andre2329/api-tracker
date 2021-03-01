const mongoose = require("mongoose")

const clientSchema = mongoose.Schema({
    nombreComercial:{
        type:String,
    },
    ruc:{
        type:String
    },
    razonSocial:{
        type:String
    },
    direccion:{
        type:String
    },
    direccionExacta:{
        type:String
    },
    referencia:{
        type:String,
    },
    distrito:{
        type:String,
    },
    provincia:{
        type:String,
    },
    departamento:{
        type:String,
    },
    pais:{
        type:String,
    },
    latitud:{
        type:Number,
    },
    longitud:{
        type:Number,
    },
    latitudLast:{
        type:Number,
    },
    longitudLast:{
        type:Number,
    },
    telefono:{
        type:Number,
    },
    adicional:{
        type:String,
    },
    vendedor:{
        type:String
    },
    vendedorID:{
        type:String
    },
    creadorID:{
        type:String
    },
    historial:
        [
            {
            fechaVisita: { type : Date, default: Date.now },
            latitud: {type: Number, required: true},
            longitud: {type: Number, required: true},
            calificacion:{type:Number},
            idVendedor:{type:String}
            }
        ]
    ,

},{
    timestamps:true
}
)

module.exports = mongoose.model("Client",clientSchema)