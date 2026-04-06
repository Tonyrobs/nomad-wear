/**
 * ================================================================
 * APP.JS - Aplicação Principal (SPA) - VERSÃO CUPÃO DE TROCA
 * ================================================================
 */
const app = {
    state: { visaoAtual: 'cliente', abaAtual: 'minha-conta' },

    init() {
        console.log('🚀 NomadWear iniciando...');
        try { if (typeof ClientModule !== 'undefined') ClientModule.init(); } catch (e) { console.error(e); }
        try { if (typeof AdminModule !== 'undefined') AdminModule.init(); } catch (e) { console.error(e); }

        this.configurarToggleVisoes();
        this.configurarAbas();
        console.log('✅ Aplicação iniciada!');
    },

    configurarToggleVisoes() {
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.mudarVisao(e.target.dataset.view));
        });
    },

    mudarVisao(visao) {
        if (visao === this.state.visaoAtual) return;
        this.state.visaoAtual = visao;

        document.querySelectorAll('.toggle-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-view="${visao}"]`).classList.add('active');

        document.getElementById('viewCliente').style.display = visao === 'cliente' ? 'block' : 'none';
        document.getElementById('viewAdmin').style.display = visao === 'admin' ? 'block' : 'none';

        if (visao === 'admin' && typeof AdminModule !== 'undefined' && typeof AdminModule.carregarClientes === 'function') {
            AdminModule.carregarClientes();
        }

        const isLogado = typeof ClientModule !== 'undefined' && ClientModule.state && ClientModule.state.usuarioLogado;
        if (visao === 'cliente' && !isLogado) {
            document.getElementById('authSection').style.display = 'block';
            document.getElementById('dashboardCliente').style.display = 'none';
        }
    },

    configurarAbas() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.mudarAba(e.target.dataset.tab));
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

        if (novaAba === 'carrinho' && typeof carregarDadosCheckout === 'function') carregarDadosCheckout();
        if (novaAba === 'meus-pedidos' && typeof ClientModule !== 'undefined') ClientModule.carregarPedidos();
    },

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
 * LÓGICA DE PRECIFICAÇÃO E RESUMO DA COMPRA
 * ================================================================
 */
let descontoAplicado = 0;
let freteAplicado = 0.00;
let cuponsTrocaAplicados = []; // 👈 NOVA LISTA: Guarda os cupões de troca validados

// Simula chamada à Base de Dados para validar cupão de troca
function adicionarCupomTroca() {
    const input = document.getElementById('input-cupom-troca');
    const codigo = input.value.trim().toUpperCase();
    if (!codigo) return;

    // Verifica se já adicionou este cupão
    if (cuponsTrocaAplicados.find(c => c.codigo === codigo)) {
        alert('Este cupão de troca já foi adicionado a esta compra.');
        input.value = '';
        return;
    }

    // Mock: Na vida real o Javascript chamaria o Java (GET /cupons/{codigo}).
    // Para o teste, vamos simular que ele encontrou o "TROCA50" que você criou na base de dados.
    if (codigo === 'TROCA50') {
        cuponsTrocaAplicados.push({ codigo: 'TROCA50', valor: 50.00 });
        alert('Crédito de R$ 50,00 aplicado com sucesso!');
    } else {
        alert('Cupão de troca não encontrado ou já utilizado.');
    }

    input.value = '';

    // Atualiza a interface visual
    const divLista = document.getElementById('lista-cupons-troca');
    if (divLista) {
        divLista.innerHTML = cuponsTrocaAplicados.map(c =>
            `<div>✔ ${c.codigo} - Crédito de R$ ${c.valor.toFixed(2).replace('.', ',')}</div>`
        ).join('');
    }

    atualizarResumoCompra();
}

function simularCalculoDeFrete() {
    const selectEndereco = document.getElementById('select-endereco');
    const divInfoFrete = document.getElementById('info-frete-dinamico');

    if (!selectEndereco || !selectEndereco.value) {
        freteAplicado = 0.00;
        if(divInfoFrete) divInfoFrete.innerHTML = '<em>Selecione um endereço de entrega para calcularmos o frete.</em>';
        atualizarResumoCompra();
        return;
    }

    const enderecoIdStr = selectEndereco.value;
    const ultimoDigito = parseInt(enderecoIdStr.slice(-1)) || 0;

    const simulacoes = [
        { valor: 18.50, prazo: '4 a 6 dias úteis', transportadora: 'Correios PAC' },
        { valor: 32.90, prazo: '1 a 3 dias úteis', transportadora: 'Correios SEDEX' },
        { valor: 15.00, prazo: '3 a 5 dias úteis', transportadora: 'Jadlog' },
        { valor: 25.00, prazo: '2 a 4 dias úteis', transportadora: 'Loggi' }
    ];

    const regra = simulacoes[ultimoDigito % simulacoes.length];
    freteAplicado = regra.valor;

    if(divInfoFrete) {
        divInfoFrete.innerHTML = `
            <span style="color: green; font-weight: bold;">✔ Frete Calculado</span><br>
            <strong>Envio via ${regra.transportadora}</strong><br>
            Prazo estimado: ${regra.prazo}<br>
            Valor: R$ ${freteAplicado.toFixed(2).replace('.', ',')}
        `;
    }

    atualizarResumoCompra();
}

function atualizarResumoCompra() {
    let subtotal = 0;
    if (ClientModule && ClientModule.state.carrinho) {
        ClientModule.state.carrinho.forEach(item => {
            subtotal += (item.preco * item.quantidade);
        });
    }

    // 👈 AQUI ESTÁ A MÁGICA EM CASCATA: Subtotal + Frete - Desconto - TROCAS
    let totalCreditoTroca = cuponsTrocaAplicados.reduce((acc, cupom) => acc + cupom.valor, 0);

    let total = subtotal + freteAplicado - descontoAplicado - totalCreditoTroca;

    if (total < 0) total = 0; // Se o cliente tiver mais crédito que o valor da compra, o cartão zera.

    if (document.getElementById('subtotal')) document.getElementById('subtotal').innerText = subtotal.toFixed(2);
    if (document.getElementById('frete')) document.getElementById('frete').innerText = freteAplicado.toFixed(2);

    // Atualiza o texto do Total a Pagar no ecrã
    if (document.getElementById('total')) {
        document.getElementById('total').innerText = total.toFixed(2);
    }

    if (document.getElementById('valor-cartao-1')) document.getElementById('valor-cartao-1').value = total.toFixed(2);
    if (document.getElementById('valor-cartao-2')) document.getElementById('valor-cartao-2').value = "0.00";
}

function carregarDadosCheckout() {
    if (typeof ClientModule === 'undefined') return;

    const clienteLogado = ClientModule.state.usuarioLogado;
    const enderecos = ClientModule.state.enderecos;
    const cartoes = ClientModule.state.cartoes;

    if (!clienteLogado) return;

    const selectEndereco = document.getElementById('select-endereco');
    if (selectEndereco) {
        selectEndereco.innerHTML = '<option value="">Selecione um endereço...</option>';
        if (enderecos && enderecos.length > 0) {
            enderecos.forEach(end => {
                selectEndereco.innerHTML += `<option value="${end.id}">${end.rua}, ${end.numero} - ${end.cidade}</option>`;
            });
        }
        selectEndereco.removeEventListener('change', simularCalculoDeFrete);
        selectEndereco.addEventListener('change', simularCalculoDeFrete);
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

    // Reseta fretes e cupões ao recarregar a vista
    freteAplicado = 0.00;
    cuponsTrocaAplicados = [];

    const divInfoFrete = document.getElementById('info-frete-dinamico');
    if(divInfoFrete) divInfoFrete.innerHTML = '<em>Selecione um endereço de entrega para calcularmos o frete.</em>';

    const divListaTroca = document.getElementById('lista-cupons-troca');
    if(divListaTroca) divListaTroca.innerHTML = '';

    atualizarResumoCompra();
}

function aplicarCupom(silencioso = false) {
    const inputCupom = document.getElementById('input-cupom');
    if (!inputCupom) return;

    const codigo = inputCupom.value.trim().toUpperCase();
    descontoAplicado = 0;

    if (codigo === 'BEMVINDO10') {
        descontoAplicado = 15.00;
        if (!silencioso) alert('Cupom BEMVINDO10 aplicado! Desconto de R$ 15,00.');
    } else if (codigo !== '') {
        if (!silencioso) alert('Cupom inválido ou expirado.');
        inputCupom.value = '';
    }

    atualizarResumoCompra();
}

function alternarTipoPagamento() {
    const tipo = document.getElementById('select-tipo-pagamento')?.value;
    document.getElementById('secaoCartao').style.display = tipo === 'CARTAO' ? 'block' : 'none';
    document.getElementById('secaoPix').style.display = tipo === 'PIX' ? 'block' : 'none';
}

document.addEventListener('DOMContentLoaded', () => {
    const inputCupom = document.getElementById('input-cupom');
    if (inputCupom) {
        inputCupom.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                aplicarCupom(false);
            }
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

            const clienteId = document.getElementById('input-cliente-id')?.value;
            const enderecoId = document.getElementById('select-endereco')?.value;
            const cartaoId = document.getElementById('select-cartao-1')?.value;
            const metodoSelecionado = document.getElementById('select-tipo-pagamento')?.value || 'CARTAO';

            if (!clienteId) {
                alert('Faça login antes de finalizar a compra.');
                return;
            }

            if (!enderecoId) {
                alert('Selecione um endereço de entrega para calcularmos o frete.');
                return;
            }

            const totalParaPagar = parseFloat(document.getElementById('total').innerText);

            // Só exige cartão de crédito se o total a pagar for MAIOR que zero!
            if (metodoSelecionado === 'CARTAO' && !cartaoId && totalParaPagar > 0) {
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
                aplicarCupom(true);

                const itens = ClientModule.state.carrinho.map(item => ({
                    variacaoProdutoId: item.id,
                    quantidade: item.quantidade
                }));

                const pedidoRequest = {
                    clienteId,
                    enderecoId,
                    cupomCodigo: document.getElementById('input-cupom')?.value || null,
                    valorFrete: freteAplicado,
                    desconto: descontoAplicado,
                    total: totalParaPagar,
                    tipoPagamento: metodoSelecionado,
                    itens,
                    pagamentos: [],
                    // 👈 ENVIAMOS A LISTA DE CUPÕES DE TROCA PARA O JAVA!
                    cuponsTroca: cuponsTrocaAplicados.map(c => c.codigo)
                };

                // Só processa cartões se o total for maior que zero
                if (metodoSelecionado === 'CARTAO' && totalParaPagar > 0) {
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

                console.log('Pedido a ser enviado:', pedidoRequest);

                if (typeof window.enviarPedidoCheckout === 'function') {
                    const resposta = await window.enviarPedidoCheckout(pedidoRequest);
                    alert(`Pedido realizado!\nNúmero: ${resposta.idPedido || 'N/A'}\nStatus: ${resposta.status || 'Aprovado'}`);
                } else {
                    alert(`Pedido simulado com sucesso!\nTotal Cobrado no Cartão/PIX: R$ ${totalParaPagar.toFixed(2)}`);
                }

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