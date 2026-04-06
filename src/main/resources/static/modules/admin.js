const AdminModule = {
    state: {
        clientes: [],
        produtos: []
    },

    init() {
        console.log('⚙️ AdminModule iniciado com sucesso');
        this.configurarEventos();
        this.carregarClientes();
        this.carregarProdutosMock();
    },

    configurarEventos() {
        document.getElementById('btnNovoProduto')?.addEventListener('click', () => this.mostrarFormProduto());
        document.getElementById('cancelarProduto')?.addEventListener('click', () => this.ocultarFormProduto());
        document.getElementById('formProduto')?.addEventListener('submit', (e) => this.handleSalvarProduto(e));
    },

    async carregarClientes() {
        try {
            console.log("Buscando clientes no banco...");
            const response = await fetch('https://nomad-wear-web.onrender.com/clientes');
            if (!response.ok) throw new Error('Erro ao buscar clientes');

            const clientes = await response.json();
            this.state.clientes = clientes;
            this.renderizarTabelaClientes();
        } catch (error) {
            console.error('Erro no AdminModule:', error);
        }
    },

    renderizarTabelaClientes() {
        const tbody = document.getElementById('listaClientesAdmin');
        if (!tbody) {
            console.warn("Aviso: tbody 'listaClientesAdmin' não encontrado no HTML");
            return;
        }

        tbody.innerHTML = '';
        this.state.clientes.forEach(cliente => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${cliente.nome}</td>
                <td>${cliente.email}</td>
                <td>${cliente.cpf}</td>
                <td>
                    <span class="badge ${cliente.ativo ? 'active' : 'inactive'}">
                        ${cliente.ativo ? 'Ativo' : 'Inativo'}
                    </span>
                </td>
                <td>
                    <button class="btn-toggle ${cliente.ativo ? 'btn-danger' : 'btn-success'}"
                            onclick="AdminModule.alternarStatus('${cliente.id}', ${cliente.ativo})">
                        ${cliente.ativo ? '🚫 Desativar' : '✅ Ativar'}
                    </button>
                </td>`;
            tbody.appendChild(tr);
        });
    },

    async alternarStatus(id, statusAtual) {
        const acao = statusAtual ? 'desativar' : 'ativar';
        if (!confirm(`Deseja realmente ${acao} este cliente?`)) return;

        try {
            const response = await fetch(`https://nomad-wear-web.onrender.com/clientes/${id}/${acao}`, {
                method: 'PUT'
            });

            if (!response.ok) throw new Error('Erro na resposta do servidor');

            app.mostrarMensagem(`Cliente ${statusAtual ? 'desativado' : 'ativado'}!`, 'success');
            this.carregarClientes();
        } catch (error) {
            alert('Erro ao mudar status: ' + error.message);
        }
    },

    carregarProdutosMock() {
        this.state.produtos = [
            { id: 'p1', nome: 'Camiseta Nomad', categoria: 'Camisas', preco: 89.9, estoque: 10 }
        ];
        this.renderizarTabelaProdutos();
    },

    renderizarTabelaProdutos() {
        const tbody = document.getElementById('tabelaProdutos');
        if (!tbody) return;
        tbody.innerHTML = '';
        this.state.produtos.forEach(p => {
            const tr = document.createElement('tr');
            tr.innerHTML = `<td>${p.nome}</td><td>${p.categoria}</td><td>R$ ${p.preco}</td><td>${p.estoque}</td><td>-</td>`;
            tbody.appendChild(tr);
        });
    },

    mostrarFormProduto() { document.getElementById('formNovoProduto').style.display = 'block'; },
    ocultarFormProduto() { document.getElementById('formNovoProduto').style.display = 'none'; },
    handleSalvarProduto(e) { e.preventDefault(); alert('Em breve!'); }
};