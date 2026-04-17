// models/produtoModel.js 
const pool = require('../db'); 

// 1. GET (Listar todos)
exports.findAll = async () => { 
    const text = 'SELECT idProd, nomeProd, preco, catProd, modelo, fabricante, estoque, locall FROM produtosInfo ORDER BY idProd'; 
    const result = await pool.query(text); 
    return result.rows;  
};

// 1.1 GET (Buscar por nomeProd)
exports.findByName = async (nomeProd) => {
    const text = 'SELECT idProd, nomeProd, preco, catProd, modelo, fabricante, estoque, locall FROM produtosInfo WHERE LOWER(nomeProd) LIKE LOWER($1) ORDER BY idProd';
    const values = [`%${nomeProd}%`];
    const result = await pool.query(text, values);
    return result.rows;
};

// 1.2 GET (Buscar por idProd)
exports.findById = async (idProd) => {
    const text = 'SELECT idProd, nomeProd, preco, catProd, modelo, fabricante, estoque, locall FROM produtosInfo WHERE idProd = $1';
    const values = [idProd];
    const result = await pool.query(text, values);
    return result.rows;
};

// 2. POST (Criar novo)
exports.create = async (nomeProd, preco, catProd, modelo, fabricante, estoque, locall) => { 
    const text = `
        INSERT INTO produtosInfo(nomeProd, preco, catProd, modelo, fabricante, estoque, locall) 
        VALUES($1, $2, $3, $4, $5, $6, $7) 
        RETURNING *`; 
    const values = [nomeProd, preco, catProd, modelo, fabricante, estoque, locall];  
    const result = await pool.query(text, values); 
    return result.rows[0]; 
};

// 3. PUT (Atualizar existente)
exports.update = async (idProd, nomeProd, preco, catProd, modelo, fabricante, estoque, locall) => {
    const text = `
        UPDATE produtosInfo 
        SET nomeProd = $1, preco = $2, catProd = $3, modelo = $4, fabricante = $5, estoque = $6, locall = $7 
        WHERE idProd = $8 
        RETURNING *`;
    const values = [nomeProd, preco, catProd, modelo, fabricante, estoque, locall, idProd];
    const result = await pool.query(text, values);
    return result.rows[0]; 
};

// 4. DELETE (Remover registro)
exports.delete = async (idProd) => {
    const text = 'DELETE FROM produtosInfo WHERE idProd = $1 RETURNING *';
    const values = [idProd];
    const result = await pool.query(text, values);
    return result.rows[0]; 
};