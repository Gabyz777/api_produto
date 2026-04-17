// controllers/produtoController.js
const produtoModel = require('../models/produtoModel'); 

// 1. READ (GET /produtos) - Buscar todos 
exports.getProdutos = async (req, res) => { 
  try { 
    const produtos = await produtoModel.findAll(); 
    res.json(produtos);  
  } catch (err) { 
    console.error('Erro ao buscar produtos:', err); 
    res.status(500).json({ error: 'Erro interno ao buscar produtos' }); 
  } 
}; 

// 1.1 READ (GET /produtos/buscar?tipo=nomeProd&valor=...)
exports.searchProdutos = async (req, res) => {
  const { tipo, valor } = req.query;

  if (!tipo || !valor) {
    return res.status(400).json({ error: 'Parâmetros tipo e valor são obrigatórios.' });
  }

  if (tipo !== 'nomeProd' && tipo !== 'idProd') {
    return res.status(400).json({ error: 'Tipo deve ser "nomeProd" ou "idProd".' });
  }

  try {
    let produtos;
    if (tipo === 'nomeProd') {
      produtos = await produtoModel.findByName(valor);
    } else {
      produtos = await produtoModel.findById(parseInt(valor));
    }
    res.json(produtos);
  } catch (err) {
    console.error('Erro ao buscar produtos:', err);
    res.status(500).json({ error: 'Erro interno ao buscar produtos' });
  }
}; 

// 2. CREATE (POST /produtos) - Criar novo 
exports.createProduto = async (req, res) => { 
    const { nomeProd, preco, catProd, modelo, fabricante, estoque, locall } = req.body;  
     
    if (!nomeProd || preco === undefined || !catProd || !modelo || !fabricante || estoque === undefined || !locall) { 
        return res.status(400).json({ error: 'Todos os campos são obrigatórios.' }); 
    } 

    try { 
        const newProduto = await produtoModel.create(nomeProd, preco, catProd, modelo, fabricante, estoque, locall); 
        res.status(201).json(newProduto);  
    } catch (err) { 
        console.error('Erro ao criar produto:', err); 
        res.status(500).json({ error: 'Erro interno ao criar produto' }); 
    } 
}; 

// 3. UPDATE (PUT /produtos/:id) - Atualizar existente 
exports.updateProduto = async (req, res) => { 
    const idProd = req.params.id; 
    const { nomeProd, preco, catProd, modelo, fabricante, estoque, locall } = req.body; 
     
    if (!nomeProd || preco === undefined || !catProd || !modelo || !fabricante || estoque === undefined || !locall) { 
        return res.status(400).json({ error: 'Todos os campos são necessários para atualização.' }); 
    } 

    try { 
        const updatedProduto = await produtoModel.update(idProd, nomeProd, preco, catProd, modelo, fabricante, estoque, locall); 
         
        if (!updatedProduto) { 
            return res.status(404).json({ error: 'Produto não encontrado.' }); 
        } 

        res.json(updatedProduto);  
    } catch (err) { 
        console.error('Erro ao atualizar produto:', err); 
        res.status(500).json({ error: 'Erro interno ao atualizar produto' }); 
    } 
}; 

// 4. DELETE (DELETE /produtos/:id) - Remover existente 
exports.deleteProduto = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProduto = await produtoModel.delete(id);
        
        if (!deletedProduto) {
            return res.status(404).json({ error: 'Produto não encontrado para exclusão.' });
        }
        
        res.json({ message: 'Produto removido com sucesso', produto: deletedProduto });
    } catch (err) {
        console.error('Erro ao deletar produto:', err);
        res.status(500).json({ error: 'Erro interno ao deletar produto' });
    }
};