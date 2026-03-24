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

const API = {
    BASE_URL: 'http://localhost:8080',
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

    async listarCartoes() {
        return this.request('/cartoes', { method: 'GET' });
    },

    async criarCartao(cartaoData) {
        return this.request('/cartoes', {
            method: 'POST',
            body: JSON.stringify(cartaoData)
        });
    },

    async atualizarCartao(id, cartaoData) {
        return this.request(`/cartoes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(cartaoData)
        });
    },

    async deletarCartao(id) {
        return this.request(`/cartoes/${id}`, { method: 'DELETE' });
    }
};
