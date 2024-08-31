require('dotenv').config()

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');
const clienteRoutes = require('./routes/clienteRoutes');
const saleRoutes = require('./routes/saleRoutes');

// express app
const app = express();

// Configurar o CORS
// Configurar o CORS
app.use(cors({
    origin:  ['http://localhost:3000', 'http://192.168.56.1:3000'], // Permitir solicitações apenas do frontend em localhost:3000
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'], // Adicione PATCH aqui
    allowedHeaders: ['Content-Type'], // Cabeçalhos permitidos
}));


// middleware   
app.use(express.json())

app.use((req,res, next) =>{
    console.log(req.path, req.method)
    next()
})

// routes
app.use('/api/products', productRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/sales', saleRoutes);


//conect to de db
mongoose.connect(process.env.MONGO_URI)
    .then(() =>{
        app.listen(process.env.PORT, () => {
            console.log ('connected to db & listening on port', process.env.PORT)
        })
    })
    .catch((error) => {
        console.log(error)
    }) 

// listen for requestes 


