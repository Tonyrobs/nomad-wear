/**
 * ================================================================
 * APP.JS - Aplicação Principal (SPA) - VERSÃO BLINDADA
 * ================================================================
 */
const app = {
    state: {
        visaoAtual: 'cliente',
        abaAtual: 'minha-conta'
    },

    init() {
        console.log('🚀 NomadWear iniciando...');

        // 1. Tenta iniciar o Cliente com segurança
        try {
            if (typeof ClientModule !== 'undefined') {
                ClientModule.init();
                console.log('✅ ClientModule iniciado');
            } else {
                console.error('ERRO: ClientModule não existe. Verifique o client.js');
            }
        } catch (error) {
            console.error('ERRO FATAL no ClientModule:', error);
        }

        // 2. Tenta iniciar o Admin com segurança
        try {
            if (typeof AdminModule !== 'undefined') {
                AdminModule.init();
                console.log('✅ AdminModule iniciado');
            } else {
                console.warn('AVISO: AdminModule não existe. A tela admin pode falhar.');
            }
        } catch (error) {
            console.error('ERRO FATAL no AdminModule:', error);
        }

        // 3. ATIVA OS BOTÕES DA TELA (Agora vai rodar mesmo se der erro acima!)
        this.configurarToggleVisoes();
        this.configurarAbas();

        console.log('✅ Aplicação iniciada com sucesso! Botões ativados.');
    },

    configurarToggleVisoes() {
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.mudarVisao(e.target.dataset.view);
            });
        });
    },

    mudarVisao(visao) {
        if (visao === this.state.visaoAtual) return;
        this.state.visaoAtual = visao;

        document.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-view="${visao}"]`).classList.add('active');

        document.getElementById('viewCliente').style.display = visao === 'cliente' ? 'block' : 'none';
        document.getElementById('viewAdmin').style.display = visao === 'admin' ? 'block' : 'none';

        // Tenta carregar dados do admin se ele existir
        if (visao === 'admin' && typeof AdminModule !== 'undefined' && typeof AdminModule.carregarClientes === 'function') {
            AdminModule.carregarClientes();
        }

        // Verifica se cliente está logado
        const isLogado = typeof ClientModule !== 'undefined' && ClientModule.state && ClientModule.state.usuarioLogado;
        if (visao === 'cliente' && !isLogado) {
            document.getElementById('authSection').style.display = 'block';
            document.getElementById('dashboardCliente').style.display = 'none';
        }
    },

    configurarAbas() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.mudarAba(e.target.dataset.tab);
            });
        });
    },

    mudarAba(novaAba) {
        const idProcurado = `tab${novaAba.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('')}`;
        const novaAbaDom = document.getElementById(idProcurado);

        if (!novaAbaDom) return;

        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

        novaAbaDom.classList.add('active');
        document.querySelector(`.tab-btn[data-tab="${novaAba}"]`)?.classList.add('active');

        if (novaAba === 'carrinho' && typeof carregarDadosCheckout === 'function') {
            carregarDadosCheckout();
        }

        if (novaAba === 'meus-pedidos' && typeof ClientModule !== 'undefined') {
                ClientModule.carregarPedidos();
        }
    },

    // Callbacks protegidos para o HTML
    editarEndereco(id) { if(typeof ClientModule!=='undefined') ClientModule.editarEndereco(id); },
    deletarEndereco(id) { if(typeof ClientModule!=='undefined') ClientModule.deletarEndereco(id); },
    editarTelefone(id) { if(typeof ClientModule!=='undefined') ClientModule.editarTelefone(id); },
    deletarTelefoneConfirm(id) { if(typeof ClientModule!=='undefined') ClientModule.deletarTelefoneConfirm(id); },
    editarCartao(id) { if(typeof ClientModule!=='undefined') ClientModule.editarCartao(id); },
    deletarCartaoConfirm(id) { if(typeof ClientModule!=='undefined') ClientModule.deletarCartaoConfirm(id); },
    adicionarAoCarrinho(pid) { if(typeof ClientModule!=='undefined') ClientModule.adicionarAoCarrinho(pid); },
    atualizarQuantidade(pid, qtd) { if(typeof ClientModule!=='undefined') ClientModule.atualizarQuantidade(pid, qtd); },
    removerDoCarrinho(pid) { if(typeof ClientModule!=='undefined') ClientModule.removerDoCarrinho(pid); },

    editarProduto(id) { if(typeof AdminModule!=='undefined') AdminModule.editarProduto(id); },
    deletarProdutoConfirm(id) { if(typeof AdminModule!=='undefined') AdminModule.deletarProdutoConfirm(id); }
};

/**
 * ================================================================
 * PREPARAR CHECKOUT DINÂMICO
 * ================================================================
 */
function carregarDadosCheckout() {
    if (typeof ClientModule === 'undefined') return;

    const clienteLogado = ClientModule.state.usuarioLogado;
    const enderecos = ClientModule.state.enderecos;
    const cartoes = ClientModule.state.cartoes;

    if (!clienteLogado) return;

    const inputClienteId = document.getElementById('input-cliente-id');
    if (inputClienteId) inputClienteId.value = clienteLogado.id;

    const selectEndereco = document.getElementById('select-endereco');
    if (selectEndereco) {
        selectEndereco.innerHTML = '';
        if (enderecos && enderecos.length > 0) {
            enderecos.forEach(end => {
                selectEndereco.innerHTML += `<option value="${end.id}">${end.rua}, ${end.numero} - ${end.cidade}</option>`;
            });
        } else {
            selectEndereco.innerHTML = '<option value="">Nenhum endereço cadastrado</option>';
        }
    }

    const selectCartao1 = document.getElementById('select-cartao-1');
    const selectCartao2 = document.getElementById('select-cartao-2');

    if (selectCartao1 && selectCartao2) {
        selectCartao1.innerHTML = '';
        selectCartao2.innerHTML = '<option value="">Não dividir (Deixe R$ 0,00)</option>';

        if (cartoes && cartoes.length > 0) {
            cartoes.forEach(cartao => {
                const ultimos = cartao.numeroCartao ? cartao.numeroCartao.slice(-4) : 'XXXX';
                const opcao = `<option value="${cartao.id}">${cartao.bandeira} final ${ultimos}</option>`;
                selectCartao1.innerHTML += opcao;
                selectCartao2.innerHTML += opcao;
            });
        } else {
            selectCartao1.innerHTML = '<option value="">Nenhum cartão cadastrado</option>';
        }
    }

    let subtotal = 0;
        if (ClientModule.state.carrinho) {
            ClientModule.state.carrinho.forEach(item => {
                subtotal += (item.preco * item.quantidade);
            });
        }
        const frete = 20.00;
        const total = subtotal + frete;

    if(document.getElementById('subtotal')) document.getElementById('subtotal').innerText = subtotal.toFixed(2);
    if(document.getElementById('frete')) document.getElementById('frete').innerText = frete.toFixed(2);
    if(document.getElementById('total')) document.getElementById('total').innerText = total.toFixed(2);

    const inputCartao1 = document.getElementById('valor-cartao-1');
    const inputCartao2 = document.getElementById('valor-cartao-2');

    if (inputCartao1) inputCartao1.value = total.toFixed(2);
    if (inputCartao2) inputCartao2.value = "0.00";
}

/**
 * ================================================================
 * LÓGICA DO CUPOM DE DESCONTO
 * ================================================================
 */
let descontoAplicado = 0; // 👈 guarda o desconto globalmente

function aplicarCupom() {
    const inputCupom = document.getElementById('input-cupom');
    if (!inputCupom) return;

    const codigo = inputCupom.value.trim().toUpperCase();

    let subtotal = 0;
    if (ClientModule.state.carrinho) {
        ClientModule.state.carrinho.forEach(item => {
            subtotal += (item.preco * item.quantidade);
        });
    }

    const frete = 20.00;
    descontoAplicado = 0;

    if (codigo === 'BEMVINDO10') {
        descontoAplicado = 15.00;
        alert('Cupom BEMVINDO10 aplicado! Desconto de R$ 15,00.');
    } else if (codigo !== '') {
        alert('Cupom inválido ou expirado.');
        inputCupom.value = '';
    }

    const total = subtotal + frete - descontoAplicado;
    if (document.getElementById('total')) document.getElementById('total').innerText = total.toFixed(2);
    if (document.getElementById('valor-cartao-1')) document.getElementById('valor-cartao-1').value = total.toFixed(2);
    if (document.getElementById('valor-cartao-2')) document.getElementById('valor-cartao-2').value = "0.00";
}

function alternarTipoPagamento() {
    const tipo = document.getElementById('select-tipo-pagamento')?.value;
    document.getElementById('secaoCartao').style.display = tipo === 'CARTAO' ? 'block' : 'none';
    document.getElementById('secaoPix').style.display = tipo === 'PIX' ? 'block' : 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    const inputCupom = document.getElementById('input-cupom');
    if (inputCupom) {
        // Aplica tanto ao sair do campo quanto ao pressionar Enter
        inputCupom.addEventListener('blur', aplicarCupom);
        inputCupom.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); aplicarCupom(); }
        });
    }
});

/**
 * ================================================================
 * INICIALIZAÇÃO E CHECKOUT
 * ================================================================
 */
document.addEventListener('DOMContentLoaded', () => {
    app.init();

    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();

            // Validações básicas
            const clienteId = document.getElementById('input-cliente-id')?.value;
            const enderecoId = document.getElementById('select-endereco')?.value;
            const cartaoId = document.getElementById('select-cartao-1')?.value;

            if (!clienteId) {
                alert('Faça login antes de finalizar a compra.');
                return;
            }

            if (!enderecoId) {
                alert('Selecione um endereço de entrega.');
                return;
            }

            const metodoSelecionado = document.getElementById('select-tipo-pagamento')?.value || 'CARTAO';

            if (metodoSelecionado === 'CARTAO' && !cartaoId) {
                alert('Selecione um cartão de pagamento.');
                return;
            }

            if (!ClientModule.state.carrinho || ClientModule.state.carrinho.length === 0) {
                alert('Seu carrinho está vazio.');
                return;
            }

            checkoutBtn.disabled = true;
            checkoutBtn.innerText = "Processando...";

            try {
                // Aplica cupom se houver antes de finalizar
                aplicarCupom();

                const total = parseFloat(document.getElementById('total').innerText);

                // Monta os itens do carrinho
                const itens = ClientModule.state.carrinho.map(item => ({
                    variacaoProdutoId: item.id,
                    quantidade: item.quantidade
                }));

const pedidoRequest = {
                    clienteId,
                    enderecoId,
                    cupomCodigo: document.getElementById('input-cupom')?.value || null,
                    valorFrete: 20.00,
                    desconto: descontoAplicado,
                    total,
                    tipoPagamento: metodoSelecionado, // 👈 Avisa o Java qual foi a escolha!
                    itens,
                    pagamentos: []
                };

                if (metodoSelecionado === 'CARTAO') {
                    const cartao1Valor = parseFloat(document.getElementById('valor-cartao-1')?.value || 0);
                    if (cartao1Valor > 0) {
                        pedidoRequest.pagamentos.push({
                            cartaoId: document.getElementById('select-cartao-1').value,
                            valorCobrado: cartao1Valor
                        });
                    }

                    const cartao2Valor = parseFloat(document.getElementById('valor-cartao-2')?.value || 0);
                    if (cartao2Valor > 0 && document.getElementById('select-cartao-2')?.value) {
                        pedidoRequest.pagamentos.push({
                            cartaoId: document.getElementById('select-cartao-2').value,
                            valorCobrado: cartao2Valor
                        });
                    }
                }

                console.log('📦 Pedido a ser enviado:', pedidoRequest);

                // Envia para o backend se o endpoint existir, senão simula sucesso
                if (typeof window.enviarPedidoCheckout === 'function') {
                    const resposta = await window.enviarPedidoCheckout(pedidoRequest);
                    alert(`Pedido realizado!\nNúmero: ${resposta.idPedido || 'N/A'}\nStatus: ${resposta.status || 'Aprovado'}`);
                } else {
                    // Simulação enquanto o endpoint não existe
                    alert(`Pedido simulado com sucesso!\nTotal: R$ ${total.toFixed(2)}\nItens: ${itens.length}`);
                }

                // Limpa o carrinho após compra
                ClientModule.state.carrinho = [];
                ClientModule.atualizarCarrinho();

                ClientModule.carregarProdutosReais();
            } catch (error) {
                alert(`Falha na compra: ${error.message}`);
                console.error("Erro no checkout:", error);
            } finally {
                checkoutBtn.disabled = false;
                checkoutBtn.innerText = "Finalizar Compra";
            }
        });
    }
});