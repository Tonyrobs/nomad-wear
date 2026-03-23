/**
 * ================================================================
 * ADMIN MODULE - Lógica da Visão Admin
 * ================================================================
 * Responsável por:
 * - Dashboard com métricas fictícias
 * - CRUD de Produtos
 * - Visualização de pedidos e vendas
 * ================================================================
 */

const AdminModule = {
    state: {
        produtos: []
    },

    /**
     * Inicializa o módulo admin
     */
    init() {
        this.carregarProdutosMock();
        this.configurarEventos();
    },

    /**
     * Configura event listeners do admin
     */
    configurarEventos() {
        // Produtos
        document.getElementById('btnNovoProduto')?.addEventListener('click', () => this.mostrarFormProduto());
        document.getElementById('cancelarProduto')?.addEventListener('click', () => this.ocultarFormProduto());
        document.getElementById('formProduto')?.addEventListener('submit', (e) => this.handleSalvarProduto(e));
    },

    /**
     * ================================================================
     * PRODUTOS (CRUD)
     * ================================================================
     */

    carregarProdutosMock() {
        this.state.produtos = [
            {
                id: 'prod-1',
                nome: 'Camiseta Premium Travel',
                categoria: 'camisetas',
                preco: 89.90,
                estoque: 15,
                descricao: 'Camiseta técnica perfeita para viagens'
            },
            {
                id: 'prod-2',
                nome: 'Calça Cargo Nomad',
                categoria: 'calcas',
                preco: 199.90,
                estoque: 8,
                descricao: 'Calça com múltiplos bolsos para viajantes'
            },
            {
                id: 'prod-3',
                nome: 'Sneaker Conforto',
                categoria: 'sapatos',
                preco: 249.90,
                estoque: 12,
                descricao: 'Sapato confortável para longas caminhadas'
            },
            {
                id: 'prod-4',
                nome: 'Mochila Viajante 40L',
                categoria: 'mochilas',
                preco: 399.90,
                estoque: 5,
                descricao: 'Mochila resistente com compartimentos inteligentes'
            }
        ];

        this.renderizarProdutos();
    },

    mostrarFormProduto() {
        document.getElementById('formProduto').reset();
        document.getElementById('produtoId').value = '';
        document.getElementById('formNovoProduto').style.display = 'block';
        document.getElementById('formProduto').scrollIntoView({ behavior: 'smooth' });
    },

    ocultarFormProduto() {
        document.getElementById('formNovoProduto').style.display = 'none';
    },

    renderizarProdutos() {
        const tbody = document.getElementById('tabelaProdutos');
        tbody.innerHTML = '';

        this.state.produtos.forEach(produto => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><strong>${produto.nome}</strong></td>
                <td>${produto.categoria}</td>
                <td>R$ ${produto.preco.toFixed(2)}</td>
                <td>${produto.estoque}</td>
                <td>
                    <button class="btn-edit" onclick="app.editarProduto('${produto.id}')">Editar</button>
                    <button class="btn-delete" onclick="app.deletarProdutoConfirm('${produto.id}')">Deletar</button>
                </td>
            `;
            tbody.appendChild(row);
        });
    },

    editarProduto(id) {
        const produto = this.state.produtos.find(p => p.id === id);
        if (!produto) return;

        const form = document.getElementById('formProduto');
        form.id.value = produto.id;
        form.nome.value = produto.nome;
        form.categoria.value = produto.categoria;
        form.preco.value = produto.preco;
        form.estoque.value = produto.estoque;
        form.descricao.value = produto.descricao;

        this.mostrarFormProduto();
    },

    async handleSalvarProduto(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const dados = Object.fromEntries(formData);
        const id = dados.id;

        try {
            if (!dados.nome || !dados.categoria || !dados.preco) {
                throw new Error('Preencha todos os campos obrigatórios');
            }

            if (id) {
                // Update
                const index = this.state.produtos.findIndex(p => p.id === id);
                if (index >= 0) {
                    this.state.produtos[index] = {
                        ...this.state.produtos[index],
                        nome: dados.nome,
                        categoria: dados.categoria,
                        preco: parseFloat(dados.preco),
                        estoque: parseInt(dados.estoque),
                        descricao: dados.descricao
                    };
                }
                this.mostrarMensagemAdmin('Produto atualizado com sucesso!', 'success');
            } else {
                // Create
                this.state.produtos.push({
                    id: 'prod-' + Date.now(),
                    nome: dados.nome,
                    categoria: dados.categoria,
                    preco: parseFloat(dados.preco),
                    estoque: parseInt(dados.estoque),
                    descricao: dados.descricao
                });
                this.mostrarMensagemAdmin('Produto criado com sucesso!', 'success');
            }

            this.renderizarProdutos();
            this.ocultarFormProduto();
        } catch (error) {
            this.mostrarMensagemAdmin('Erro ao salvar: ' + error.message, 'error');
        }
    },

    deletarProdutoConfirm(id) {
        if (confirm('Tem certeza que deseja deletar este produto?')) {
            this.deletarProduto(id);
        }
    },

    async deletarProduto(id) {
        try {
            this.state.produtos = this.state.produtos.filter(p => p.id !== id);
            this.renderizarProdutos();
            this.mostrarMensagemAdmin('Produto deletado com sucesso!', 'success');
        } catch (error) {
            this.mostrarMensagemAdmin('Erro ao deletar: ' + error.message, 'error');
        }
    },

    /**
     * ================================================================
     * UI HELPERS
     * ================================================================
     */

    mostrarMensagemAdmin(texto, tipo) {
        const msg = document.createElement('div');
        msg.className = `message-container ${tipo}`;
        msg.textContent = texto;
        msg.style.position = 'fixed';
        msg.style.top = '80px';
        msg.style.right = '20px';
        msg.style.zIndex = '9999';
        msg.style.maxWidth = '400px';

        document.body.appendChild(msg);

        setTimeout(() => {
            msg.remove();
        }, 4000);
    }
};
