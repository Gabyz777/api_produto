const produtoModel = require('../models/produtoModel');

exports.getProdutos = async (req, res) => {
    try {
        const produtos = await produtoModel.findAll();
        res.json(produtos);
    } catch (err) {
        console.error('Erro ao buscar produtos:', err);
        res.status(500).json({ error: 'Erro interno ao buscar os produtos' });
    }
};

exports.createProduto = async (req, res) => {
    const { nomeProd, preco, catProd, modelo, fabricante, estoque, locall } = req.body;

    if (!nomeProd || !preco || !catProd || !modelo || !fabricante || !estoque || !locall) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    try {
        const produto = await produtoModel.create(nomeProd, preco, catProd, modelo, fabricante, estoque, locall);
        res.status(201).json(produto);
    } catch (err) {
        console.error('Erro ao criar produto:', err);
        res.status(500).json({ error: 'Erro interno ao criar o produto' });
    }
};

exports.updateProduto = async (req, res) => {
    const { id } = req.params;
    const { nomeProd, preco, catProd, modelo, fabricante, estoque, locall } = req.body;

    if (!nomeProd || !preco || !catProd || !modelo || !fabricante || !estoque || !locall) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    try {
        // CORREÇÃO: Passando os argumentos individualmente, sem as chaves {}
        const updatedProduto = await produtoModel.update(id, nomeProd, preco, catProd, modelo, fabricante, estoque, locall);

        if (!updatedProduto) {
            return res.status(404).json({ error: 'Produto não encontrado' });
        }

        res.json(updatedProduto);
    } catch (err) {
        console.error('Erro ao atualizar produto:', err);
        res.status(500).json({ error: 'Erro interno ao atualizar o produto' });
    }
};

exports.deleteProduto = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedProduto = await produtoModel.delete(id);

        if (!deletedProduto) {
            return res.status(404).json({ error: 'Produto não encontrado para exclusão' });
        }
        res.json({ message: 'Produto excluído com sucesso', produto: deletedProduto });
    } catch (err) {
        console.error('Erro ao excluir produto:', err);
        res.status(500).json({ error: 'Erro interno ao excluir o produto' });
    }
};