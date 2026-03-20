//não foi possivel criar o banco de dados, por isso não consegui testar a aplicação.
require('dotenv').config(); 
const express = require('express');
const app = express();
const produtoRoutes = require('./routes/produtoRoutes');

app.use(express.json());
app.use('/produtos', produtoRoutes);

app.listen(5000, () => {
    console.log('Servidor rodando em http://localhost:5000/produtos');
});