/**
 * ================================================================
 * CLIENT MODULE - Lógica da Visão Cliente
 * ================================================================
 * Responsável por:
 * - Gerenciar dados pessoais (CRUD)
 * - Gerenciar endereços (CRUD)
 * - Gerenciar cartões (CRUD)
 * - Gerenciar carrinho de compras
 * - Listar produtos e permitir adição ao carrinho
 * ================================================================
 */

const ClientModule = {
    // Estado da aplicação
    state: {
        usuarioLogado: null,
        enderecos: [],
        cartoes: [],
        carrinho: [],
        produtos: []
    },

    /**
     * Inicializa o módulo cliente
     */
    init() {
        this.carregarProdutosMock();
        this.configurarEventos();
    },

    /**
     * Configura todos os event listeners
     */
    configurarEventos() {
        // Forms de autenticação
        document.getElementById('loginForm')?.addEventListener('submit', (e) => this.handleLogin(e));
        document.getElementById('registerForm')?.addEventListener('submit', (e) => this.handleRegister(e));

        // Dados pessoais
        document.getElementById('formClienteDados')?.addEventListener('submit', (e) => this.handleAtualizarDados(e));

        // Endereços
        document.getElementById('btnNovoEndereco')?.addEventListener('click', () => this.mostrarFormEndereco());
        document.getElementById('cancelarEndereco')?.addEventListener('click', () => this.ocultarFormEndereco());
        document.getElementById('formEndereco')?.addEventListener('submit', (e) => this.handleSalvarEndereco(e));

        // Cartões
        document.getElementById('btnNovoCartao')?.addEventListener('click', () => this.mostrarFormCartao());
        document.getElementById('cancelarCartao')?.addEventListener('click', () => this.ocultarFormCartao());
        document.getElementById('formCartao')?.addEventListener('submit', (e) => this.handleSalvarCartao(e));

        // Filtros da loja
        document.getElementById('filtroNome')?.addEventListener('input', () => this.filtrarProdutos());
        document.getElementById('filtroCategoria')?.addEventListener('change', () => this.filtrarProdutos());

        // Logout
        document.getElementById('logoutBtn')?.addEventListener('click', () => this.handleLogout());
    },

    /**
     * ================================================================
     * AUTENTICAÇÃO
     * ================================================================
     */

    async handleLogin(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const dados = Object.fromEntries(formData);

        try {
            // Simulação: busca cliente com esse email
            const clientes = [];
            
            // Mock: Assume que o login foi bem-sucedido
            this.state.usuarioLogado = {
                email: dados.email,
                nome: 'Cliente Demo',
                id: 'user-123'
            };

            this.mostrarDashboardCliente();
            this.carregarDadosCliente();
            e.target.reset();

            this.mostrarMensagem('Login realizado com sucesso!', 'success');
        } catch (error) {
            this.mostrarMensagem('Erro ao fazer login: ' + error.message, 'error');
        }
    },

    async handleRegister(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const dados = Object.fromEntries(formData);

        try {
            // Chamada para backend (futura)
            // const novoCliente = await API.criarCliente(dados);

            // Mock: Assumir sucesso
            this.state.usuarioLogado = {
                nome: dados.nome,
                email: dados.email,
                cpf: dados.cpf,
                dataNascimento: dados.dataNascimento,
                genero: dados.genero,
                id: 'user-' + Date.now()
            };

            this.mostrarDashboardCliente();
            e.target.reset();
            this.mostrarMensagem('Cadastro realizado com sucesso!', 'success');
        } catch (error) {
            this.mostrarMensagem('Erro ao cadastrar: ' + error.message, 'error');
        }
    },

    handleLogout() {
        this.state.usuarioLogado = null;
        this.state.carrinho = [];
        document.getElementById('authSection').style.display = 'block';
        document.getElementById('dashboardCliente').style.display = 'none';
        document.getElementById('userDisplay').textContent = 'Não autenticado';
        document.getElementById('logoutBtn').style.display = 'none';
        this.mostrarMensagem('Logout realizado com sucesso!', 'success');
    },

    /**
     * ================================================================
     * DADOS PESSOAIS
     * ================================================================
     */

    carregarDadosCliente() {
        if (!this.state.usuarioLogado) return;

        const form = document.getElementById('formClienteDados');
        if (form) {
            form.nome.value = this.state.usuarioLogado.nome || '';
            form.email.value = this.state.usuarioLogado.email || '';
            form.cpf.value = this.state.usuarioLogado.cpf || '';
            form.dataNascimento.value = this.state.usuarioLogado.dataNascimento || '';
            form.genero.value = this.state.usuarioLogado.genero || '';
        }

        // Atualizar nome no header
        document.getElementById('userDisplay').textContent = `👤 ${this.state.usuarioLogado.nome}`;
        document.getElementById('logoutBtn').style.display = 'inline-block';

        // Carregar dados relacionados
        this.carregarEnderecos();
        this.carregarCartoes();
    },

    async handleAtualizarDados(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const dados = Object.fromEntries(formData);

        try {
            // Futura chamada: API.atualizarCliente(id, dados)
            
            // Mock: Atualizar estado local
            this.state.usuarioLogado = { ...this.state.usuarioLogado, ...dados };
            this.mostrarMensagem('Dados atualizados com sucesso!', 'success');
        } catch (error) {
            this.mostrarMensagem('Erro ao atualizar dados: ' + error.message, 'error');
        }
    },

    /**
     * ================================================================
     * ENDEREÇOS (CRUD)
     * ================================================================
     */

    mostrarFormEndereco() {
        document.getElementById('formEndereco').reset();
        document.getElementById('enderecoId').value = '';
        document.getElementById('formNovoEndereco').style.display = 'block';
    },

    ocultarFormEndereco() {
        document.getElementById('formNovoEndereco').style.display = 'none';
    },

    async carregarEnderecos() {
        try {
            this.state.enderecos = await API.listarEnderecos();
            
            this.renderizarEnderecos();
        } catch (error) {
            console.error('Erro ao carregar endereços:', error);
        }
    },

    renderizarEnderecos() {
        const container = document.getElementById('listaEnderecos');
        container.innerHTML = '';

        this.state.enderecos.forEach(endereco => {
            const card = document.createElement('div');
            card.className = 'item-card';
            card.innerHTML = `
                <h4>${endereco.rua}, ${endereco.numero}</h4>
                <div class="item-info">
                    <span>${endereco.bairro} - ${endereco.cidade}</span>
                    <span>${endereco.estado}</span>
                    <span>${endereco.cep}</span>
                </div>
                <p>${endereco.complemento ? 'Complemento: ' + endereco.complemento : ''}</p>
                <p><small>${endereco.observacoes || ''}</small></p>
                <div class="item-actions">
                    <button class="btn-edit" onclick="app.editarEndereco('${endereco.id}')">Editar</button>
                    <button class="btn-delete" onclick="app.deletarEnderecoConfirm('${endereco.id}')">Deletar</button>
                </div>
            `;
            container.appendChild(card);
        });
    },

    editarEndereco(id) {
        const endereco = this.state.enderecos.find(e => e.id === id);
        if (!endereco) return;

        const form = document.getElementById('formEndereco');
        form.enderecoId.value = endereco.id;
        form.pais.value = endereco.pais;
        form.cep.value = endereco.cep;
        form.estado.value = endereco.estado;
        form.cidade.value = endereco.cidade;
        form.bairro.value = endereco.bairro;
        form.rua.value = endereco.rua;
        form.numero.value = endereco.numero;
        form.complemento.value = endereco.complemento;
        form.observacoes.value = endereco.observacoes;

        document.getElementById('formNovoEndereco').style.display = 'block';
        document.getElementById('formEndereco').scrollIntoView({ behavior: 'smooth' });
    },

    async handleSalvarEndereco(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const dados = Object.fromEntries(formData);
        const id = dados.id;

        try {
            if (id) {
                await API.atualizarEndereco(id, dados);
                this.mostrarMensagem('Endereço atualizado com sucesso!', 'success');
                this.state.enderecos = await API.listarEnderecos();
            } else {
                await API.criarEndereco(dados);
                this.mostrarMensagem('Endereço adicionado com sucesso!', 'success');
                this.state.enderecos = await API.listarEnderecos();
            }

            this.renderizarEnderecos();
            this.ocultarFormEndereco();
        } catch (error) {
            this.mostrarMensagem('Erro ao salvar endereço: ' + error.message, 'error');
        }
    },

    deletarEnderecoConfirm(id) {
        if (confirm('Tem certeza que deseja deletar este endereço?')) {
            this.deletarEndereco(id);
        }
    },

    async deletarEndereco(id) {
        try {
            await API.deletarEndereco(id);
            this.state.enderecos = await API.listarEnderecos();
            this.renderizarEnderecos();
            this.mostrarMensagem('Endereço deletado com sucesso!', 'success');
        } catch (error) {
            this.mostrarMensagem('Erro ao deletar endereço: ' + error.message, 'error');
        }
    },

    /**
     * ================================================================
     * CARTÕES DE CRÉDITO (CRUD)
     * ================================================================
     */

    mostrarFormCartao() {
        document.getElementById('formCartao').reset();
        document.getElementById('cartaoId').value = '';
        document.getElementById('formNovoCartao').style.display = 'block';
    },

    ocultarFormCartao() {
        document.getElementById('formNovoCartao').style.display = 'none';
    },

    async carregarCartoes() {
        try {
            this.state.cartoes = await API.listarCartoes();

            this.renderizarCartoes();
        } catch (error) {
            console.error('Erro ao carregar cartões:', error);
        }
    },

    renderizarCartoes() {
        const container = document.getElementById('listaCartoes');
        container.innerHTML = '';

        this.state.cartoes.forEach(cartao => {
            const numeroMascarado = this.mascararCartao(cartao.numeroCartao);
            const card = document.createElement('div');
            card.className = 'item-card';
            card.innerHTML = `
                <h4>${cartao.bandeira}</h4>
                <div class="item-info">
                    <span>${numeroMascarado}</span>
                    <span>Válido até ${cartao.dataValidade}</span>
                </div>
                <p>${cartao.nomeTitular}</p>
                <div class="item-actions">
                    <button class="btn-edit" onclick="app.editarCartao('${cartao.id}')">Editar</button>
                    <button class="btn-delete" onclick="app.deletarCartaoConfirm('${cartao.id}')">Deletar</button>
                </div>
            `;
            container.appendChild(card);
        });
    },

    mascararCartao(numero) {
        // Mostra apenas os últimos 4 dígitos
        return '•••• •••• •••• ' + numero.slice(-4);
    },

    editarCartao(id) {
        const cartao = this.state.cartoes.find(c => c.id === id);
        if (!cartao) return;

        const form = document.getElementById('formCartao');
        form.cartaoId.value = cartao.id;
        form.numeroCartao.value = cartao.numeroCartao;
        form.nomeTitular.value = cartao.nomeTitular;
        // Converter data de YYYY-MM para MM/YY para exibição
        form.dataValidade.value = this.converterDataValidadeParaUI(cartao.dataValidade);
        form.codigoSeguranca.value = cartao.codigoSeguranca;
        form.bandeira.value = cartao.bandeira;

        document.getElementById('formNovoCartao').style.display = 'block';
    },

    async handleSalvarCartao(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const dados = Object.fromEntries(formData);
        const id = dados.id || '';

        try {
            console.log('Salvando cartão:', { id, dados });

            // Validar número do cartão (apenas para UI, segurança real seria no backend)
            if (!this.validarNumeroCartao(dados.numeroCartao)) {
                throw new Error('Número de cartão inválido (13-19 dígitos)');
            }

            // Converter data de MM/YY para YYYY-MM (YearMonth do Java)
            dados.dataValidade = this.converterDataValidade(dados.dataValidade);
            console.log('Data convertida:', dados.dataValidade);

            if (id) {
                console.log('Atualizando cartão:', id);
                const resposta = await API.atualizarCartao(id, dados);
                console.log('Atualização bem-sucedida:', resposta);
                this.mostrarMensagem('Cartão atualizado com sucesso!', 'success');
                this.state.cartoes = await API.listarCartoes();
            } else {
                console.log('Criando novo cartão');
                const resposta = await API.criarCartao(dados);
                console.log('Criação bem-sucedida:', resposta);
                this.mostrarMensagem('Cartão adicionado com sucesso!', 'success');
                this.state.cartoes = await API.listarCartoes();
            }

            console.log('Cartões carregados:', this.state.cartoes);
            this.renderizarCartoes();
            document.getElementById('formCartao').reset();
            document.getElementById('cartaoId').value = '';
            this.ocultarFormCartao();
        } catch (error) {
            console.error('Erro ao salvar cartão:', error);
            this.mostrarMensagem('Erro ao salvar cartão: ' + error.message, 'error');
        }
    },

    validarNumeroCartao(numero) {
        // Simples validação: apenas números, 13-19 dígitos
        const numeros = numero.replace(/\D/g, '');
        const valido = numeros.length >= 13 && numeros.length <= 19;
        console.log('Validando cartão:', { numero, numeros, comprimento: numeros.length, valido });
        return valido;
    },

    converterDataValidade(dataValidade) {
        // Converte MM/YY para YYYY-MM (formato YearMonth do Java)
        // Input: "12/25" -> Output: "2025-12"
        if (!dataValidade || !dataValidade.includes('/')) {
            throw new Error('Formato de validade inválido. Use MM/YY');
        }

        const [mes, ano] = dataValidade.split('/');
        const mesNum = parseInt(mes, 10);
        const anoNum = parseInt(ano, 10);

        // Validar mês (1-12)
        if (mesNum < 1 || mesNum > 12) {
            throw new Error('Mês inválido (01-12)');
        }

        // Converter YY para YYYY (assumindo 20XX para YY < 50, 19XX para YY >= 50)
        const anoCompleto = anoNum < 50 ? 2000 + anoNum : 1900 + anoNum;

        // Formatar como YYYY-MM
        const dataBD = `${anoCompleto}-${String(mesNum).padStart(2, '0')}`;
        console.log('Data convertida:', { input: dataValidade, output: dataBD });
        return dataBD;
    },

    converterDataValidadeParaUI(dataValidade) {
        // Converte YYYY-MM para MM/YY (para exibição no formulário)
        // Input: "2025-12" -> Output: "12/25"
        if (!dataValidade || !dataValidade.includes('-')) {
            return dataValidade; // Retorna como está se inválido
        }

        const [ano, mes] = dataValidade.split('-');
        const anoNum = parseInt(ano, 10);
        const anoUI = String(anoNum % 100).padStart(2, '0'); // Pega últimos 2 dígitos

        const dataUI = `${mes}/${anoUI}`;
        console.log('Data convertida para UI:', { input: dataValidade, output: dataUI });
        return dataUI;
    },

    deletarCartaoConfirm(id) {
        if (confirm('Tem certeza que deseja deletar este cartão?')) {
            this.deletarCartao(id);
        }
    },

    async deletarCartao(id) {
        try {
            await API.deletarCartao(id);
            this.state.cartoes = await API.listarCartoes();
            this.renderizarCartoes();
            this.mostrarMensagem('Cartão deletado com sucesso!', 'success');
        } catch (error) {
            this.mostrarMensagem('Erro ao deletar cartão: ' + error.message, 'error');
        }
    },

    /**
     * ================================================================
     * LOJA - PRODUTOS E CARRINHO
     * ================================================================
     */

    carregarProdutosMock() {
        this.state.produtos = [
            {
                id: 'prod-1',
                nome: 'Camiseta Premium Travel',
                categoria: 'camisetas',
                preco: 89.90,
                descricao: 'Camiseta técnica perfeita para viagens',
                estoque: 15,
                emoji: '👕'
            },
            {
                id: 'prod-2',
                nome: 'Calça Cargo Nomad',
                categoria: 'calcas',
                preco: 199.90,
                descricao: 'Calça com múltiplos bolsos para viajantes',
                estoque: 8,
                emoji: '👖'
            },
            {
                id: 'prod-3',
                nome: 'Sneaker Conforto',
                categoria: 'sapatos',
                preco: 249.90,
                descricao: 'Sapato confortável para longas caminhadas',
                estoque: 12,
                emoji: '👟'
            },
            {
                id: 'prod-4',
                nome: 'Mochila Viajante 40L',
                categoria: 'mochilas',
                preco: 399.90,
                descricao: 'Mochila resistente com compartimentos inteligentes',
                estoque: 5,
                emoji: '🎒'
            },
            {
                id: 'prod-5',
                nome: 'Cinto de Segurança',
                categoria: 'acessorios',
                preco: 59.90,
                descricao: 'Cinto RFID anti-roubo para documentos',
                estoque: 20,
                emoji: '⌛'
            }
        ];

        this.renderizarProdutos();
    },

    renderizarProdutos(produtos = this.state.produtos) {
        const container = document.getElementById('vitrineProdutos');
        container.innerHTML = '';

        produtos.forEach(produto => {
            const card = document.createElement('div');
            card.className = 'produto-card';
            card.innerHTML = `
                <div class="produto-imagem">${produto.emoji}</div>
                <div class="produto-info">
                    <span class="produto-categoria">${produto.categoria}</span>
                    <h3 class="produto-nome">${produto.nome}</h3>
                    <p class="produto-descricao">${produto.descricao}</p>
                    <p class="produto-preco">R$ ${produto.preco.toFixed(2)}</p>
                    <p class="produto-estoque">
                        ${produto.estoque > 0 ? `Em estoque (${produto.estoque})` : 'Fora de estoque'}
                    </p>
                    <div class="produto-acoes">
                        <button class="btn-carrinho" 
                            ${produto.estoque === 0 ? 'disabled' : ''}
                            onclick="app.adicionarAoCarrinho('${produto.id}')">
                            ${produto.estoque === 0 ? 'Indisponível' : '🛒 Adicionar'}
                        </button>
                    </div>
                </div>
            `;
            container.appendChild(card);
        });
    },

    filtrarProdutos() {
        const nome = document.getElementById('filtroNome').value.toLowerCase();
        const categoria = document.getElementById('filtroCategoria').value;

        const filtrados = this.state.produtos.filter(p => {
            const matchNome = p.nome.toLowerCase().includes(nome);
            const matchCategoria = !categoria || p.categoria === categoria;
            return matchNome && matchCategoria;
        });

        this.renderizarProdutos(filtrados);
    },

    adicionarAoCarrinho(produtoId) {
        const produto = this.state.produtos.find(p => p.id === produtoId);
        if (!produto || produto.estoque === 0) return;

        const itemExistente = this.state.carrinho.find(item => item.id === produtoId);
        
        if (itemExistente) {
            itemExistente.quantidade++;
        } else {
            this.state.carrinho.push({
                ...produto,
                quantidade: 1
            });
        }

        this.mostrarMensagem(`${produto.nome} adicionado ao carrinho!`, 'success');
        this.atualizarCarrinho();
    },

    atualizarCarrinho() {
        const container = document.getElementById('carrinhoVazio');
        const itens = document.getElementById('carrinhoItens');
        const corpo = document.getElementById('corpoCarrinho');

        if (this.state.carrinho.length === 0) {
            container.style.display = 'block';
            itens.style.display = 'none';
            return;
        }

        container.style.display = 'none';
        itens.style.display = 'block';

        corpo.innerHTML = '';
        let subtotal = 0;

        this.state.carrinho.forEach(item => {
            const subtotalItem = item.preco * item.quantidade;
            subtotal += subtotalItem;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.nome}</td>
                <td>R$ ${item.preco.toFixed(2)}</td>
                <td><input type="number" value="${item.quantidade}" min="1" onchange="app.atualizarQuantidade('${item.id}', this.value)"></td>
                <td>R$ ${subtotalItem.toFixed(2)}</td>
                <td><button class="btn-delete" onclick="app.removerDoCarrinho('${item.id}')">Remover</button></td>
            `;
            corpo.appendChild(row);
        });

        const frete = 10.00;
        const total = subtotal + frete;

        document.getElementById('subtotal').textContent = subtotal.toFixed(2);
        document.getElementById('frete').textContent = frete.toFixed(2);
        document.getElementById('total').textContent = total.toFixed(2);
    },

    atualizarQuantidade(produtoId, novaQuantidade) {
        const item = this.state.carrinho.find(i => i.id === produtoId);
        if (item) {
            item.quantidade = Math.max(1, parseInt(novaQuantidade));
            this.atualizarCarrinho();
        }
    },

    removerDoCarrinho(produtoId) {
        this.state.carrinho = this.state.carrinho.filter(i => i.id !== produtoId);
        this.atualizarCarrinho();
        this.mostrarMensagem('Produto removido do carrinho', 'success');
    },

    /**
     * ================================================================
     * UI HELPERS
     * ================================================================
     */

    mostrarDashboardCliente() {
        document.getElementById('authSection').style.display = 'none';
        document.getElementById('dashboardCliente').style.display = 'block';
    },

    mostrarMensagem(texto, tipo) {
        const container = document.getElementById('messageContainer');
        if (!container) return;

        container.textContent = texto;
        container.className = `message-container ${tipo}`;

        setTimeout(() => {
            container.className = 'message-container';
        }, 4000);
    }
};
