// ========================================
// VARIÁVEIS GLOBAIS
// ========================================

let produtoEmEdicao = null;

// ========================================
// FUNÇÕES AUXILIARES
// ========================================

// Mostra uma mensagem modal
function mostrarMensagem(mensagem, tipo = 'info') {
    const modal = document.getElementById('modalMessage');
    const modalText = document.getElementById('modalText');
    
    modalText.textContent = mensagem;
    modal.style.display = 'flex';
    
    if (tipo === 'sucesso') {
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    } else if (tipo === 'erro') {
        modal.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    }
}

// Fecha o modal de mensagens
function fecharModal() {
    document.getElementById('modalMessage').style.display = 'none';
}

// Limpa o formulário
function limparFormulario() {
    document.getElementById('productForm').reset();
    produtoEmEdicao = null;
    document.querySelector('.form-section h2').textContent = 'Adicionar ou Editar Produto';
}

// Formata Moeda (Preço)
function formatarPreco(valor) {
    if (valor === undefined || valor === null) return '';
    return parseFloat(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// ========================================
// OPERAÇÕES COM A API
// ========================================

// Busca todos os produtos
async function carregarProdutos() {
    const loadingMessage = document.getElementById('loadingMessage');
    const emptyMessage = document.getElementById('emptyMessage');
    const produtosList = document.getElementById('produtosList');
    
    loadingMessage.style.display = 'block';
    produtosList.innerHTML = '';
    
    try {
        const resposta = await fetch('/produtos'); // Mudou de /clientes para /produtos
        
        if (!resposta.ok) throw new Error('Erro ao buscar produtos');
        
        const produtos = await resposta.json();
        loadingMessage.style.display = 'none';
        
        if (produtos.length === 0) {
            emptyMessage.style.display = 'block';
            produtosList.innerHTML = '';
        } else {
            emptyMessage.style.display = 'none';
            exibirTabela(produtos);
        }
    } catch (erro) {
        loadingMessage.style.display = 'none';
        emptyMessage.style.display = 'block';
        console.error('Erro:', erro);
        mostrarMensagem('Erro ao carregar os produtos. Tente novamente.', 'erro');
    }
}

// Cria um novo produto
async function criarProduto(dados) {
    try {
        const resposta = await fetch('/produtos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        
        if (!resposta.ok) {
            const erro = await resposta.json();
            throw new Error(erro.error || 'Erro ao criar produto');
        }
        
        mostrarMensagem('Produto cadastrado com sucesso!', 'sucesso');
        limparFormulario();
        carregarProdutos();
    } catch (erro) {
        console.error('Erro:', erro);
        mostrarMensagem('Erro: ' + erro.message, 'erro');
    }
}

// Atualiza um produto
async function atualizarProduto(id, dados) {
    try {
        const resposta = await fetch(`/produtos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(dados)
        });
        
        if (!resposta.ok) {
            const erro = await resposta.json();
            throw new Error(erro.error || 'Erro ao atualizar produto');
        }
        
        mostrarMensagem('Produto atualizado com sucesso!', 'sucesso');
        limparFormulario();
        carregarProdutos();
    } catch (erro) {
        console.error('Erro:', erro);
        mostrarMensagem('Erro: ' + erro.message, 'erro');
    }
}

// Deleta um produto
async function deletarProduto(id) {
    if (!confirm('Tem certeza que deseja deletar este produto?')) return;
    
    try {
        const resposta = await fetch(`/produtos/${id}`, { method: 'DELETE' });
        
        if (!resposta.ok) {
            const erro = await resposta.json();
            throw new Error(erro.error || 'Erro ao deletar produto');
        }
        
        mostrarMensagem('Produto removido com sucesso!', 'sucesso');
        carregarProdutos();
    } catch (erro) {
        console.error('Erro:', erro);
        mostrarMensagem('Erro: ' + erro.message, 'erro');
    }
}

// ========================================
// EXIBIÇÃO DE DADOS
// ========================================

// Exibe a tabela de produtos
function exibirTabela(produtos) {
    const produtosList = document.getElementById('produtosList');
    
    let html = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nome</th>
                    <th>Preço</th>
                    <th>Categoria</th>
                    <th>Modelo</th>
                    <th>Fabricante</th>
                    <th>Estoque</th>
                    <th>Local</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    produtos.forEach(prod => {
        // Preparar os parâmetros para a função editar (escapando aspas)
        const paramsStr = `${prod.idprod}, '${prod.nomeprod}', ${prod.preco}, '${prod.catprod}', '${prod.modelo}', '${prod.fabricante}', ${prod.estoque}, '${prod.locall}'`;
        
        html += `
            <tr>
                <td>#${prod.idprod}</td>
                <td>${prod.nomeprod}</td>
                <td>${formatarPreco(prod.preco)}</td>
                <td>${prod.catprod}</td>
                <td>${prod.modelo}</td>
                <td>${prod.fabricante}</td>
                <td>${prod.estoque}</td>
                <td>${prod.locall}</td>
                <td class="acoes">
                    <button class="btn btn-edit" onclick="editarProduto(${paramsStr})">✏️ Editar</button>
                    <button class="btn btn-danger" onclick="deletarProduto(${prod.idprod})">🗑️ Deletar</button>
                </td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
    `;
    
    produtosList.innerHTML = html;
}

// Carrega os dados do produto no formulário para edição
function editarProduto(idProd, nomeProd, preco, catProd, modelo, fabricante, estoque, locall) {
    produtoEmEdicao = idProd;
    
    document.getElementById('nomeProd').value = nomeProd;
    document.getElementById('preco').value = preco;
    document.getElementById('catProd').value = catProd;
    document.getElementById('modelo').value = modelo;
    document.getElementById('fabricante').value = fabricante;
    document.getElementById('estoque').value = estoque;
    document.getElementById('locall').value = locall;
    
    document.querySelector('.form-section h2').textContent = `Editando Produto #${idProd}`;
    
    // Scroll até o formulário
    document.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
}

// ========================================
// BUSCA E FILTRO
// ========================================

// Busca produtos no backend
async function buscarProdutos(tipo, valor) {
    const loadingMessage = document.getElementById('loadingMessage');
    const emptyMessage = document.getElementById('emptyMessage');
    const produtosList = document.getElementById('produtosList');
    
    loadingMessage.style.display = 'block';
    produtosList.innerHTML = '';
    
    try {
        const resposta = await fetch(`/produtos/buscar?tipo=${tipo}&valor=${encodeURIComponent(valor)}`);
        
        if (!resposta.ok) throw new Error('Erro ao buscar produtos');
        
        const produtos = await resposta.json();
        loadingMessage.style.display = 'none';
        
        if (produtos.length === 0) {
            emptyMessage.style.display = 'block';
            produtosList.innerHTML = '';
        } else {
            emptyMessage.style.display = 'none';
            exibirTabela(produtos);
        }
    } catch (erro) {
        loadingMessage.style.display = 'none';
        emptyMessage.style.display = 'block';
        console.error('Erro:', erro);
        mostrarMensagem('Erro ao buscar os produtos. Tente novamente.', 'erro');
    }
}

function filtrarProdutos() {
    const searchInput = document.getElementById('searchInput');
    const searchType = document.getElementById('searchType');
    const valor = searchInput.value.trim();
    
    if (valor === '') {
        carregarProdutos();
    } else {
        buscarProdutos(searchType.value, valor);
    }
}

// ========================================
// EVENT LISTENERS
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Carrega os produtos ao abrir a página
    carregarProdutos();
    
    // Formulário de envio
    document.getElementById('productForm').addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const nomeProd = document.getElementById('nomeProd').value.trim();
        const preco = parseFloat(document.getElementById('preco').value);
        const catProd = document.getElementById('catProd').value.trim();
        const modelo = document.getElementById('modelo').value.trim();
        const fabricante = document.getElementById('fabricante').value.trim();
        const estoque = parseInt(document.getElementById('estoque').value, 10);
        const locall = document.getElementById('locall').value.trim();
        
        // Validação básica
        if (!nomeProd || isNaN(preco) || !catProd || !modelo || !fabricante || isNaN(estoque) || !locall) {
            mostrarMensagem('Por favor, preencha todos os campos corretamente!', 'erro');
            return;
        }
        
        const dados = { nomeProd, preco, catProd, modelo, fabricante, estoque, locall };
        
        if (produtoEmEdicao) {
            atualizarProduto(produtoEmEdicao, dados);
        } else {
            criarProduto(dados);
        }
    });
    
    // Botões
    document.getElementById('btnLimpar').addEventListener('click', limparFormulario);
    document.getElementById('btnRecarregar').addEventListener('click', carregarProdutos);
    document.getElementById('btnBuscar').addEventListener('click', filtrarProdutos);
    
    document.getElementById('searchInput').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            filtrarProdutos();
        }
    });
    
    document.getElementById('modalMessage').addEventListener('click', function(e) {
        if (e.target === this) fecharModal();
    });
});