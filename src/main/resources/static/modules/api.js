/**
 * ================================================================
 * API MODULE - Integração com Backend Java (Spring Boot)
 * ================================================================
 * Este módulo cuida de todas as chamadas fetch() para o backend
 * URLs: http://localhost:8080
 *
 * Entidades mapeadas:
 * - /clientes (GET, POST, PUT, DELETE)
 * - /enderecos (GET, POST, PUT, DELETE)
 * - /telefones (GET, POST, PUT, DELETE)
 * - /cartoes (GET, POST, PUT, DELETE)
 * ================================================================
 */

const BASE_URL = "https://nomad-wear-web.onrender.com";

const API = {
    BASE_URL: "https://nomad-wear-web.onrender.com",
    TIMEOUT: 5000,

    async request(endpoint, options = {}) {
        const url = `${this.BASE_URL}${endpoint}`;
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
            },
            ...options
        };

        console.log(`📤 [API] ${options.method || 'GET'} ${url}`, options.body ? JSON.parse(options.body) : '');

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);

            const response = await fetch(url, {
                ...defaultOptions,
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            console.log(`📥 [API] Response Status: ${response.status} ${response.statusText}`);

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`❌ [API] Error Response:`, errorText);
                throw new Error(`HTTP ${response.status}: ${response.statusText} - ${errorText}`);
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                const data = await response.json();
                console.log(`✅ [API] Response Data:`, data);
                return data;
            }
            console.log(`✅ [API] Response (No Content)`);
            return null;
        } catch (error) {
            console.error(`❌ [API] Erro na requisição ${endpoint}:`, error.message);
            throw error;
        }
    },


    async listarClientes() {
        return this.request('/clientes', { method: 'GET' });
    },

    async criarCliente(clienteData) {
        return this.request('/clientes', {
            method: 'POST',
            body: JSON.stringify(clienteData)
        });
    },

    async atualizarCliente(id, clienteData) {
        return this.request(`/clientes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(clienteData)
        });
    },

    async deletarCliente(id) {
        return this.request(`/clientes/${id}`, { method: 'DELETE' });
    },

    async listarEnderecos(clienteId) {
        return this.request(`/clientes/${clienteId}/enderecos`, { method: 'GET' });
    },

    async criarEndereco(clienteId, enderecoData) {
        return this.request(`/clientes/${clienteId}/enderecos`, {
            method: 'POST',
            body: JSON.stringify(enderecoData)
        });
    },

    async atualizarEndereco(clienteId, id, enderecoData) {
        return this.request(`/clientes/${clienteId}/enderecos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(enderecoData)
        });
    },

    async deletarEndereco(clienteId, enderecoId) {
        const response = await fetch(`${this.BASE_URL}/clientes/${clienteId}/enderecos/${enderecoId}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Erro ao deletar endereço');
        return true;
    },

    async listarTelefones(clienteId) {
        return this.request(`/clientes/${clienteId}/telefones`, { method: 'GET' });
    },

    async criarTelefone(clienteId, telefoneData) {
        return this.request(`/clientes/${clienteId}/telefones`, {
            method: 'POST',
            body: JSON.stringify(telefoneData)
        });
    },

    async atualizarTelefone(clienteId, id, telefoneData) {
        return this.request(`/clientes/${clienteId}/telefones/${id}`, {
            method: 'PUT',
            body: JSON.stringify(telefoneData)
        });
    },

    async deletarTelefone(clienteId, id) {
        return this.request(`/clientes/${clienteId}/telefones/${id}`, { method: 'DELETE' });
    },

  async listarCartoes(clienteId) {
      return this.request(`/clientes/${clienteId}/cartoes`, { method: 'GET' });
  },

  async criarCartao(clienteId, cartaoData) {
      return this.request(`/clientes/${clienteId}/cartoes`, {
          method: 'POST',
          body: JSON.stringify(cartaoData)
      });
  },

  async atualizarCartao(clienteId, id, cartaoData) {
      return this.request(`/clientes/${clienteId}/cartoes/${id}`, {
          method: 'PUT',
          body: JSON.stringify(cartaoData)
      });
  },

  async deletarCartao(clienteId, id) {
      return this.request(`/clientes/${clienteId}/cartoes/${id}`, { method: 'DELETE' });
  },

    async listarVariacoes() {
         return this.request('/variacoes', { method: 'GET' }); // Busca os SKUs reais!
        },

    async listarPedidosCliente(clienteId) { // 👈 adicione aqui
         return this.request(`/pedidos/cliente/${clienteId}`, { method: 'GET' });
       },
};

// ================================================================
// LÓGICA DO CHECKOUT (Tem que ficar FORA do objeto API)
// ================================================================
window.enviarPedidoCheckout = async (pedidoData) => {
    try {
        const response = await fetch('https://nomad-wear-web.onrender.com/pedidos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(pedidoData)
        });

        if (!response.ok) {
            const erro = await response.json();
            throw new Error(erro.message || "Erro ao processar o pagamento.");
        }

        return await response.json();
    } catch (error) {
        console.error("Erro no checkout:", error);
        throw error;
    }
};