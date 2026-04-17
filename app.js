const express = require('express'); 
const app = express(); 
const produtoRoutes = require('./routes/produtoRoutes');  

app.use(express.static('public')); 
app.use(express.json()); 

// Aplica as rotas de produtos com o prefixo '/produtos' 
app.use('/produtos', produtoRoutes);  

app.listen(5000, () => { 
    console.log('Servidor rodando em http://localhost:5000'); 
});