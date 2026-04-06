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
        telefones: [],
        cartoes: [],
        carrinho: [],
        produtos: []
    },

    // Inicializa o módulo cliente
    init() {
        this.carregarProdutosReais();
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

        document.getElementById('formAlterarSenha')?.addEventListener('submit', (e) => this.handleAlterarSenha(e));

        document.getElementById('cpfCadastro')?.addEventListener('input', (e) => {
            let valor = e.target.value.replace(/\D/g, '');
            valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
            valor = valor.replace(/(\d{3})(\d)/, '$1.$2');
            valor = valor.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            e.target.value = valor;
        });

        // Endereços
        document.getElementById('btnNovoEndereco')?.addEventListener('click', () => this.mostrarFormEndereco());
        document.getElementById('cancelarEndereco')?.addEventListener('click', () => this.ocultarFormEndereco());
        document.getElementById('formEndereco')?.addEventListener('submit', (e) => this.handleSalvarEndereco(e));

        // Telefones
        document.getElementById('btnNovoTelefone')?.addEventListener('click', () => this.mostrarFormTelefone());
        document.getElementById('cancelarTelefone')?.addEventListener('click', () => this.ocultarFormTelefone());
        document.getElementById('formTelefone')?.addEventListener('submit', (e) => this.handleSalvarTelefone(e));

        // Cartões
        document.getElementById('btnNovoCartao')?.addEventListener('click', () => this.mostrarFormCartao());
        document.getElementById('cancelarCartao')?.addEventListener('click', () => this.ocultarFormCartao());
        document.getElementById('formCartao')?.addEventListener('submit', (e) => this.handleSalvarCartao(e));

        // Filtros da loja
        document.getElementById('filtroNome')?.addEventListener('input', () => this.filtrarProdutos());
        document.getElementById('filtroCategoria')?.addEventListener('change', () => this.filtrarProdutos());

        document.getElementById('btnDeletarConta')?.addEventListener('click', () => {
                if (confirm('Tem certeza? Essa ação não pode ser desfeita.')) {
                    this.deletarConta();
                }
            });

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
            // 📌 Fazer login com endpoint dedicado
            const response = await fetch('http://localhost:8080/clientes/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: dados.email,
                    senha: dados.senha
                })
            });

            if (!response.ok) {
                const errorMsg = await response.text();
                throw new Error(errorMsg || 'Email ou senha incorretos');
            }

            const cliente = await response.json();
            
            this.state.usuarioLogado = cliente;
            this.mostrarDashboardCliente();
            this.carregarDadosCliente();
            this.carregarPedidos();
            e.target.reset();
            this.mostrarMensagem('Login realizado com sucesso!', 'success');

        } catch (error) {
            console.error('Erro no login:', error);
            this.mostrarMensagem('Erro ao fazer login: ' + error.message, 'error');
        }
    },

    async handleRegister(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const dados = Object.fromEntries(formData);

            const cpfLimpo = dados.cpf.replace(/\D/g, '');
            dados.cpf = cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');

            try {
                const response = await fetch('http://localhost:8080/clientes', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nome: dados.nome,
                        email: dados.email,
                        senha: dados.senha,
                        cpf: dados.cpf,
                        dataNascimento: dados.dataNascimento,
                        genero: dados.genero
                    })
                });

                if (!response.ok) {
                    const erro = await response.text();
                    throw new Error(erro);
                }

                const clienteSalvo = await response.json();
                this.state.usuarioLogado = clienteSalvo;

                if (dados.ddd && dados.telefone) {
                    try {
                        await API.criarTelefone(clienteSalvo.id, { ddd: dados.ddd, numero: dados.telefone });
                    } catch (err) {
                        console.warn("Erro ao salvar telefone inicial", err);
                    }
                }

                alert('Conta criada com sucesso! Redirecionando...');

                // Faz a transição de tela corretamente
                this.carregarDadosCliente();
                this.mostrarDashboardCliente();
                app.mudarAba('minha-conta');
                e.target.reset();

            } catch (error) {
                alert('Erro ao cadastrar: ' + error.message);
            }
        },

    async deletarConta() {
            const id = this.state.usuarioLogado.id;
            try {
                const response = await fetch(`http://localhost:8080/clientes/${id}`, { method: 'DELETE' });

                if (!response.ok) {
                    const erroTexto = await response.text();
                    throw new Error(erroTexto || 'O banco de dados bloqueou a exclusão (Cliente possui filhos).');
                }

                this.handleLogout();
                this.mostrarMensagem('Conta deletada com sucesso.', 'success');
            } catch (error) {
                this.mostrarMensagem('Erro ao deletar conta: ' + error.message, 'error');
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
        this.carregarTelefones();
        this.carregarPedidos();
    },

    async handleAtualizarDados(e) {
        e.preventDefault();
        const formData = new FormData(e.target);
        const dados = Object.fromEntries(formData);
        const id = this.state.usuarioLogado.id;

        const cpfLimpo = dados.cpf.replace(/\D/g, '');
        dados.cpf = cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');

        try {
            const response = await fetch(`http://localhost:8080/clientes/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    nome: dados.nome,
                    email: dados.email,
                    cpf: dados.cpf,
                    dataNascimento: dados.dataNascimento,
                    genero: dados.genero
                })
            });

            if (!response.ok) {
                const erroTexto = await response.text(); // 👈 pega o erro real do backend
                throw new Error(erroTexto);
            }

            const clienteAtualizado = await response.json();
            this.state.usuarioLogado = clienteAtualizado;
            this.mostrarMensagem('Dados atualizados com sucesso!', 'success');

     } catch (error) {
         this.mostrarMensagem('Erro ao atualizar: ' + error.message, 'error');
         }
     },
    async handleAlterarSenha(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const dados = Object.fromEntries(formData);
            const id = this.state.usuarioLogado.id;

            if (dados.novaSenha !== dados.confirmarSenha) {
                this.mostrarMensagem('As senhas novas não coincidem!', 'error');
                return;
            }

            try {
                const response = await fetch(`http://localhost:8080/clientes/${id}/senha`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        senhaAtual: dados.senhaAtual,
                        novaSenha: dados.novaSenha
                    })
                });

                if (!response.ok) {
                    const erroTexto = await response.text();
                    throw new Error(erroTexto);
                }

                this.mostrarMensagem('Senha atualizada com sucesso!', 'success');
                e.target.reset();

            } catch (error) {
                this.mostrarMensagem('Erro ao alterar senha: ' + error.message, 'error');
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
            const id = this.state.usuarioLogado.id; // 👈 adiciona
            this.state.enderecos = await API.listarEnderecos(id); // 👈 passa id
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
                    <button class="btn-delete" onclick="app.deletarEndereco('${endereco.id}')">Deletar</button>
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
            const clienteId = this.state.usuarioLogado.id;

            try {
                // Mandando "dados" direto, pois o seu Java (Endereco.java) já usa "rua", "cidade", etc!
                if (id) {
                    await API.atualizarEndereco(clienteId, id, dados);
                    this.mostrarMensagem('Endereço atualizado com sucesso!', 'success');
                } else {
                    await API.criarEndereco(clienteId, dados);
                    this.mostrarMensagem('Endereço adicionado com sucesso!', 'success');
                }
                this.state.enderecos = await API.listarEnderecos(clienteId);
                this.renderizarEnderecos();
                this.ocultarFormEndereco();
            } catch (error) {
                this.mostrarMensagem('Erro ao salvar endereço.', 'error');
                console.error(error);
            }
        },
    async deletarEndereco(id) {
            if (!confirm('Tem certeza que deseja remover este endereço?')) return;

            const clienteId = this.state.usuarioLogado.id;
            try {
                // Chamando a API passando os dois IDs necessários
                await API.deletarEndereco(clienteId, id);

                // Atualiza a lista local e a tela
                this.state.enderecos = await API.listarEnderecos(clienteId);
                this.renderizarEnderecos();
                this.mostrarMensagem('Endereço deletado com sucesso!', 'success');
            } catch (error) {
                this.mostrarMensagem('Erro ao deletar endereço: ' + error.message, 'error');
            }
        },

    // ================================================================
    // TELEFONES (CRUD)
    // ================================================================

    mostrarFormTelefone() {
        document.getElementById('formTelefone').reset();
        document.getElementById('telefoneId').value = '';
        document.getElementById('formNovoTelefone').style.display = 'block';
    },

    ocultarFormTelefone() {
        document.getElementById('formNovoTelefone').style.display = 'none';
    },

    async carregarTelefones() {
        try {
            const clienteId = this.state.usuarioLogado.id;
            this.state.telefones = await API.listarTelefones(clienteId);
            this.renderizarTelefones();
        } catch (error) {
            console.error('Erro ao carregar telefones:', error);
        }
    },

    renderizarTelefones() {
        const container = document.getElementById('listaTelefones');
        container.innerHTML = '';

        this.state.telefones.forEach(telefone => {
            const card = document.createElement('div');
            card.className = 'item-card';
            card.innerHTML = `
                <h4>📱 (${telefone.ddd}) ${telefone.numero}</h4>
                <div class="item-actions">
                    <button class="btn-edit" onclick="app.editarTelefone('${telefone.id}')">Editar</button>
                    <button class="btn-delete" onclick="app.deletarTelefoneConfirm('${telefone.id}')">Deletar</button>
                </div>
            `;
            container.appendChild(card);
        });
    },

    editarTelefone(id) {
        const telefone = this.state.telefones.find(t => t.id === id);
        if (!telefone) return;

        const form = document.getElementById('formTelefone');
        form.telefoneId.value = telefone.id;
        form.ddd.value = telefone.ddd;
        form.numeroTelefone.value = telefone.numero;

        document.getElementById('formNovoTelefone').style.display = 'block';
        document.getElementById('formTelefone').scrollIntoView({ behavior: 'smooth' });
    },

    async handleSalvarTelefone(e) {
            e.preventDefault();
            const formData = new FormData(e.target);
            const dados = Object.fromEntries(formData);
            const id = dados.id;
            const clienteId = this.state.usuarioLogado.id;

            try {
                if (id) {
                    await API.atualizarTelefone(clienteId, id, dados);
                    this.mostrarMensagem('Telefone atualizado com sucesso!', 'success');
                } else {
                    await API.criarTelefone(clienteId, dados);
                    this.mostrarMensagem('Telefone adicionado com sucesso!', 'success');
                }

                this.state.telefones = await API.listarTelefones(clienteId);
                this.renderizarTelefones();
                this.ocultarFormTelefone();
            } catch (error) {
                this.mostrarMensagem('Erro ao salvar telefone.', 'error');
                console.error(error);
            }
        },

    deletarTelefoneConfirm(id) {
        if (confirm('Tem certeza que deseja deletar este telefone?')) {
            this.deletarTelefone(id);
        }
    },

    async deletarTelefone(id) {
        const clienteId = this.state.usuarioLogado.id;
        try {
            await API.deletarTelefone(clienteId, id);
            this.state.telefones = await API.listarTelefones(clienteId);
            this.renderizarTelefones();
            this.mostrarMensagem('Telefone deletado com sucesso!', 'success');
        } catch (error) {
            this.mostrarMensagem('Erro ao deletar telefone: ' + error.message, 'error');
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
            const clienteId = this.state.usuarioLogado.id; // 👈
            this.state.cartoes = await API.listarCartoes(clienteId); // 👈
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
        const clienteId = this.state.usuarioLogado?.id; // 👈

        if (!clienteId) {
            this.mostrarMensagem('Você precisa estar logado.', 'error');
            return;
        }

        try {
            dados.dataValidade = this.converterDataValidade(dados.dataValidade);

            if (id) {
                await API.atualizarCartao(clienteId, id, dados); // 👈
                this.mostrarMensagem('Cartão atualizado com sucesso!', 'success');
            } else {
                await API.criarCartao(clienteId, dados); // 👈
                this.mostrarMensagem('Cartão adicionado com sucesso!', 'success');
            }

            this.state.cartoes = await API.listarCartoes(clienteId); // 👈
            this.renderizarCartoes();
            document.getElementById('formCartao').reset();
            this.ocultarFormCartao();
        } catch (error) {
            this.mostrarMensagem('Erro ao salvar cartão: ' + error.message, 'error');
            console.error(error);
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
        const clienteId = this.state.usuarioLogado.id; // 👈
        try {
            await API.deletarCartao(clienteId, id); // 👈
            this.state.cartoes = await API.listarCartoes(clienteId); // 👈
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
async carregarProdutosReais() {
        try {
            // Vai no Spring Boot e busca as variações reais do banco!
            const variacoesDB = await API.listarVariacoes();

            // Converte os dados do Java para o formato que a sua tela espera
            this.state.produtos = variacoesDB.map(v => ({
                id: v.id, // O UUID real para o checkout!
                nome: v.produto ? v.produto.nome : 'Camiseta Nomad',
                categoria: v.produto && v.produto.categoria ? v.produto.categoria.toLowerCase() : 'camisetas',
                preco: v.produto ? v.produto.valorVenda : 75.00,
                descricao: `Tamanho ${v.tamanho} - Cor ${v.cor}`, // Mostra o tamanho e cor na tela
                estoque: v.quantidadeEstoque, // O ESTOQUE DE VERDADE!
                emoji: '👕'
            }));

            this.renderizarProdutos();

        } catch (error) {
            console.warn("Aviso: Não conseguiu buscar do banco. Usando produtos de mentira.", error);
            // Se o Java estiver desligado ou der erro, ele mostra os falsos para a tela não ficar em branco
            this.carregarProdutosMock();
        }
    },

carregarProdutosMock() {
    this.state.produtos = [
        {
            id: '210b45bc-095f-495f-b375-a8c13138b2ed', // variacaoProdutoId PRETO M
            produtoId: '590d0c11-4ffe-4ba0-86fb-6962fbf7ea...',
            nome: 'Camiseta Nomad Classic - Preto M',
            categoria: 'camisetas',
            preco: 75.00,
            descricao: 'Camiseta 100% algodão, perfeita para o dia a dia',
            estoque: 50,
            emoji: '👕'
        },
        {
            id: '9cea8731-29b4-4b39-98ec-ad6df1a5dc53', // variacaoProdutoId BRANCO G
            produtoId: '590d0c11-4ffe-4ba0-86fb-6962fbf7ea...',
            nome: 'Camiseta Nomad Classic - Branco G',
            categoria: 'camisetas',
            preco: 75.00,
            descricao: 'Camiseta 100% algodão, perfeita para o dia a dia',
            estoque: 20,
            emoji: '👕'
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
    // ================================================================
    // PEDIDOS
    // ================================================================

    async carregarPedidos() {
        try {
            const clienteId = this.state.usuarioLogado.id;
            const pedidos = await API.listarPedidosCliente(clienteId);
            this.renderizarPedidos(pedidos);
        } catch (error) {
            console.error('Erro ao carregar pedidos:', error);
        }
    },

    renderizarPedidos(pedidos) {
        const container = document.getElementById('listaPedidos');
        if (!container) return;
        container.innerHTML = '';

        if (!pedidos || pedidos.length === 0) {
            container.innerHTML = '<p style="color: #666; font-style: italic;">Nenhum pedido encontrado.</p>';
            return;
        }

        pedidos.forEach(pedido => {
            const data = new Date(pedido.dataPedido).toLocaleDateString('pt-BR');
            const card = document.createElement('div');
            card.style.cssText = `
                border: 1px solid #dee2e6;
                border-left: 4px solid #0056b3;
                border-radius: 4px;
                margin-bottom: 12px;
                background: #fff;
                overflow: hidden;
            `;
            card.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px 16px; background: #f8f9fa; border-bottom: 1px solid #dee2e6;">
                    <div>
                        <span style="font-weight: 600; font-size: 0.95em; color: #212529;">Pedido #${pedido.idPedido.substring(0, 8).toUpperCase()}</span>
                        <span style="color: #6c757d; font-size: 0.85em; margin-left: 12px;">📅 ${data}</span>
                    </div>
                    <span style="background: #e8f0fe; color: #0056b3; padding: 3px 10px; border-radius: 3px; font-size: 0.8em; font-weight: 600; letter-spacing: 0.3px;">
                        ${pedido.status}
                    </span>
                </div>
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="border-bottom: 1px solid #dee2e6;">
                            <th style="padding: 8px 16px; text-align: left; font-size: 0.82em; color: #6c757d; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Produto</th>
                            <th style="padding: 8px 16px; text-align: center; font-size: 0.82em; color: #6c757d; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Qtd</th>
                            <th style="padding: 8px 16px; text-align: right; font-size: 0.82em; color: #6c757d; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${pedido.itens.map(item => `
                            <tr style="border-bottom: 1px solid #f1f3f5;">
                                <td style="padding: 10px 16px; font-size: 0.9em; color: #212529;">
                                    ${item.nomeProduto}
                                    <span style="color: #adb5bd; font-size: 0.8em; display: block;">${item.sku}</span>
                                </td>
                                <td style="padding: 10px 16px; text-align: center; font-size: 0.9em; color: #495057;">${item.quantidade}</td>
                                <td style="padding: 10px 16px; text-align: right; font-size: 0.9em; color: #212529;">R$ ${item.subtotal.toFixed(2)}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
                <div style="padding: 10px 16px; text-align: right; border-top: 1px solid #dee2e6; background: #f8f9fa;">
                    <span style="font-size: 0.85em; color: #6c757d;">Total do pedido: </span>
                    <span style="font-weight: 700; font-size: 1em; color: #212529;">R$ ${pedido.valorTotal.toFixed(2)}</span>
                </div>
            `;
            container.appendChild(card);
        });
    },


    /**
     * ================================================================
     * UI HELPERS
     * ================================================================
     */

    mostrarDashboardCliente() {
            const authSection = document.getElementById('authSection');
            const dashboard = document.getElementById('dashboardCliente');
            const userDisplay = document.getElementById('userDisplay');
            const logoutBtn = document.getElementById('logoutBtn');

            if (authSection) authSection.style.display = 'none';
            if (dashboard) dashboard.style.display = 'block';

            // Garante que o nome do usuário apareça no topo
            if (this.state.usuarioLogado) {
                if (userDisplay) userDisplay.textContent = `👤 ${this.state.usuarioLogado.nome}`;
                if (logoutBtn) logoutBtn.style.display = 'inline-block';
            }
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
