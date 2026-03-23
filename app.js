/**
 * ================================================================
 * APP.JS - Aplicação Principal (SPA)
 * ================================================================
 * Responsável por:
 * - Coordenar o toggle Cliente/Admin
 * - Gerenciar abas dentro de cada visão
 * - Expor API global para callbacks HTML
 * ================================================================
 */

const app = {
    // Estado global
    state: {
        visaoAtual: 'cliente',
        abaAtual: 'minha-conta'
    },

    /**
     * Inicializa a aplicação
     */
    init() {
        console.log('🚀 NomadWear iniciando...');

        // Inicializar módulos
        ClientModule.init();
        AdminModule.init();

        // Configurar eventos principais
        this.configurarToggleVisoes();
        this.configurarAbas();

        console.log('✅ Aplicação iniciada com sucesso');
    },

    /**
     * ================================================================
     * TOGGLE CLIENTE/ADMIN
     * ================================================================
     */

    configurarToggleVisoes() {
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.target.dataset.view;
                this.mudarVisao(view);
            });
        });
    },

    mudarVisao(visao) {
        if (visao === this.state.visaoAtual) return;

        // Atualizar estado
        this.state.visaoAtual = visao;

        // Atualizar botões
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-view="${visao}"]`).classList.add('active');

        // Mostrar/ocultar visões
        document.getElementById('viewCliente').style.display = visao === 'cliente' ? 'block' : 'none';
        document.getElementById('viewAdmin').style.display = visao === 'admin' ? 'block' : 'none';

        // Se cliente, voltar para página de login se não autenticado
        if (visao === 'cliente' && !ClientModule.state.usuarioLogado) {
            document.getElementById('authSection').style.display = 'block';
            document.getElementById('dashboardCliente').style.display = 'none';
        }

        console.log(`Mudança de visão: ${visao}`);
    },

    /**
     * ================================================================
     * ABAS (DENTRO DE CADA VISÃO)
     * ================================================================
     */

    configurarAbas() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tab = e.target.dataset.tab;
                this.mudarAba(tab);
            });
        });
    },

    mudarAba(novaAba) {
        // Ocultar todo os tabs
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
        });

        // Desativar todos os botões
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // Ativar nova aba
        const novaAbaDom = document.getElementById(`tab${this.capitalizarPrimeiraLetra(novaAba)}`);
        if (novaAbaDom) {
            novaAbaDom.classList.add('active');

            // Ativar botão correspondente
            document.querySelector(`[data-tab="${novaAba}"]`).classList.add('active');

            // Carregar dados se necessário
            if (novaAba === 'enderecos') {
                ClientModule.carregarEnderecos();
            } else if (novaAba === 'cartoes') {
                ClientModule.carregarCartoes();
            }

            this.state.abaAtual = novaAba;
            console.log(`Nova aba: ${novaAba}`);
        }
    },

    capitalizarPrimeiraLetra(txt) {
        return txt.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('');
    },

    /**
     * ================================================================
     * MÉTODOS EXPOSTOS PARA HTML (callbacks)
     * ================================================================
     * Métodos do Cliente
     */

    editarEndereco(id) {
        ClientModule.editarEndereco(id);
        this.mudarAba('enderecos');
    },

    deletarEnderecoConfirm(id) {
        if (confirm('Tem certeza que deseja deletar este endereço?')) {
            ClientModule.deletarEndereco(id);
        }
    },

    editarCartao(id) {
        ClientModule.editarCartao(id);
        this.mudarAba('cartoes');
    },

    deletarCartaoConfirm(id) {
        if (confirm('Tem certeza que deseja deletar este cartão?')) {
            ClientModule.deletarCartao(id);
        }
    },

    adicionarAoCarrinho(produtoId) {
        if (!ClientModule.state.usuarioLogado) {
            alert('Por favor, faça login para adicionar itens ao carrinho');
            this.mudarVisao('cliente');
            return;
        }
        ClientModule.adicionarAoCarrinho(produtoId);
    },

    atualizarQuantidade(produtoId, quantidade) {
        ClientModule.atualizarQuantidade(produtoId, quantidade);
    },

    removerDoCarrinho(produtoId) {
        ClientModule.removerDoCarrinho(produtoId);
    },

    /**
     * Métodos do Admin
     */

    editarProduto(id) {
        AdminModule.editarProduto(id);
    },

    deletarProdutoConfirm(id) {
        if (confirm('Tem certeza que deseja deletar este produto?')) {
            AdminModule.deletarProduto(id);
        }
    }
};

/**
 * ================================================================
 * INICIALIZAÇÃO
 * ================================================================
 * Aguarda DOM estar pronto e inicializa a aplicação
 */

document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

/**
 * ================================================================
 * LOGGING E DEBUGGING
 * ================================================================
 */

console.log(`
╔═══════════════════════════════════════╗
║   🧳 NOMADWEAR - E-COMMERCE APP 🧳   ║
╚═══════════════════════════════════════╝

Backend URL: http://localhost:8080
Status: ✅ Pronto para integração

API Endpoints disponíveis:
  • GET/POST/PUT/DELETE /clientes
  • GET/POST/PUT/DELETE /enderecos
  • GET/POST/PUT/DELETE /telefones
  • GET/POST/PUT/DELETE /cartoes

Para começar:
  1. Faça login ou crie uma conta
  2. Gerencie seus dados pessoais, endereços e cartões
  3. Navegue pela loja de produtos
  4. Adicione itens ao carrinho

Para admin:
  • Clique no botão "⚙️ Admin" no menu
  • Gerencie produtos e visualize métricas
`);
