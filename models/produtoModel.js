const pool = require('../db');

exports.findAll = async () => {
    const text = 'SELECT idProd, nomeProd, preco, catProd, modelo, fabricante, estoque, locall FROM produtosInfo';
    const result = await pool.query(text);
    return result.rows;
};

exports.create = async (nomeProd, preco, catProd, modelo, fabricante, estoque, locall) => {
    const text = `
    INSERT INTO produtosInfo (nomeProd, preco, catProd, modelo, fabricante, estoque, locall) 
    VALUES ($1, $2, $3, $4, $5, $6, $7) 
    RETURNING *`;
    const values = [nomeProd, preco, catProd, modelo, fabricante, estoque, locall];
    const result = await pool.query(text, values);
    return result.rows[0];
};

exports.update = async (idProd, nomeProd, preco, catProd, modelo, fabricante, estoque, locall) => {
    const text = `
    UPDATE produtosInfo 
    SET nomeProd = $2, preco = $3, catProd = $4, modelo = $5, fabricante = $6, estoque = $7, locall = $8
    WHERE idProd = $1
    RETURNING *`;
    const values = [idProd, nomeProd, preco, catProd, modelo, fabricante, estoque, locall];
    const result = await pool.query(text, values);
    return result.rows[0];
};

exports.delete = async (idProd) => {
    const text = 'DELETE FROM produtosInfo WHERE idProd = $1 RETURNING *';
    const values = [idProd];
    const result = await pool.query(text, values);
    return result.rows[0];
};