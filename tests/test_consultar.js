
// Mocking Firestore
const mockDb = {
    collection: (name) => ({
        where: (field, op, value) => ({
            get: () => {
                const protocol = value.toUpperCase();
                if (protocol === '#VALID-123') {
                    return Promise.resolve({
                        empty: false,
                        docs: [{
                            data: () => ({
                                protocolo: '#VALID-123',
                                status: 'Em andamento',
                                dataCriacao: '2024-01-01T12:00:00Z',
                                nome: 'John Doe',
                                email: 'john.doe@example.com',
                                telefone: '123456789',
                                dataCompra: '2023-12-01',
                                modelo: 'Scooter X',
                                cor: 'Preto',
                                tipoProblema: 'Bateria',
                                descricao: 'Não liga.',
                                historico: [
                                    { data: '2024-01-02T10:00:00Z', acao: 'Análise inicial', status: 'Em andamento' },
                                    { data: '2024-01-01T12:00:00Z', acao: 'Abertura', status: 'Aberto' }
                                ]
                            })
                        }]
                    });
                }
                if (protocol === '#COMPLETE-456') {
                    return Promise.resolve({
                        empty: false,
                        docs: [{
                            data: () => ({
                                protocolo: '#COMPLETE-456',
                                status: 'Finalizado',
                                dataCriacao: '2024-02-01T10:00:00Z',
                                nome: 'Jane Smith',
                                email: 'jane.smith@example.com',
                                telefone: '987654321',
                                dataCompra: '2023-11-01',
                                modelo: 'Scooter Y',
                                cor: 'Branco',
                                tipoProblema: 'Freio',
                                descricao: 'Barulho no freio.',
                                diagnostico: 'Pastilhas gastas.',
                                garantiaInfo: 'Fora da garantia.',
                                orcamento: 'R$ 150,00',
                                pecasUtilizadas: 'Pastilhas de freio',
                                historico: []
                            })
                        }]
                    });
                }
                if (protocol === '#NO-HISTORY-789') {
                     return Promise.resolve({
                        empty: false,
                        docs: [{
                            data: () => ({
                                protocolo: '#NO-HISTORY-789',
                                status: 'Aberto',
                                dataCriacao: '2024-03-01T09:00:00Z',
                                nome: 'Peter Jones',
                                email: 'peter.jones@example.com',
                                telefone: '555-1234',
                                dataCompra: '2024-02-15',
                                modelo: 'Scooter Z',
                                cor: 'Azul',
                                tipoProblema: 'Pneu',
                                descricao: 'Pneu furado.',
                                historico: null
                            })
                        }]
                    });
                }
                return Promise.resolve({ empty: true, docs: [] });
            }
        })
    })
};

// Mock global functions that are not part of consultar.js
function getStatusClass(status) {
    if (status === 'Aberto') return 'status-aberto';
    if (status === 'Em andamento') return 'status-andamento';
    if (status === 'Finalizado') return 'status-finalizado';
    return '';
}

function formatarData(dateString) {
    return new Date(dateString).toLocaleString();
}

function formatarDataSimples(dateString) {
    return new Date(dateString).toLocaleDateString();
}

function mostrarErro(mensagem) {
    const errorDiv = document.createElement('div');
    errorDiv.id = 'error-message';
    errorDiv.textContent = mensagem;
    document.body.appendChild(errorDiv);
}

// Set up the mock 'db' object
window.db = mockDb;

QUnit.module('Consulta de Chamados', function(hooks) {
    hooks.beforeEach(function() {
        const fixture = document.getElementById('qunit-fixture');
        fixture.innerHTML = `
            <input id="searchTicket" type="text">
            <div id="resultadoArea" style="display: none;">
                <span id="protocoloNum"></span>
                <span id="statusBadge"></span>
                <span id="dataAbertura"></span>
                <span id="clienteNome"></span>
                <span id="clienteEmail"></span>
                <span id="clienteTelefone"></span>
                <span id="dataCompraInfo"></span>
                <span id="modeloInfo"></span>
                <span id="corInfo"></span>
                <span id="tipoProblemaInfo"></span>
                <span id="descricaoInfo"></span>
                <div id="diagnosticoSection" style="display: none;"><span id="diagnosticoInfo"></span></div>
                <div id="garantiaSection" style="display: none;"><span id="garantiaInfo"></span></div>
                <div id="orcamentoSection" style="display: none;"><span id="orcamentoInfo"></span></div>
                <div id="pecasSection" style="display: none;"><span id="pecasInfo"></span></div>
                <div id="timelineContent"></div>
            </div>
            <div id="notFoundArea" style="display: none;"></div>
        `;
        const errorMsg = document.getElementById('error-message');
        if(errorMsg) {
            errorMsg.remove();
        }
    });

    QUnit.test('buscarChamado - protocolo válido com #', async function(assert) {
        document.getElementById('searchTicket').value = '#VALID-123';
        await buscarChamado();

        assert.equal(document.getElementById('resultadoArea').style.display, 'block', 'Área de resultado deve ser visível');
        assert.equal(document.getElementById('notFoundArea').style.display, 'none', 'Área de não encontrado deve estar oculta');
        assert.equal(document.getElementById('protocoloNum').textContent, '#VALID-123', 'Protocolo exibido corretamente');
        assert.equal(document.getElementById('clienteNome').textContent, 'John Doe', 'Nome do cliente exibido corretamente');
    });

    QUnit.test('buscarChamado - protocolo válido sem #', async function(assert) {
        document.getElementById('searchTicket').value = 'VALID-123';
        await buscarChamado();

        assert.equal(document.getElementById('resultadoArea').style.display, 'block', 'Área de resultado deve ser visível');
        assert.equal(document.getElementById('protocoloNum').textContent, '#VALID-123', 'Protocolo formatado e exibido corretamente');
    });

    QUnit.test('buscarChamado - protocolo inválido', async function(assert) {
        document.getElementById('searchTicket').value = '#INVALID-999';
        await buscarChamado();

        assert.equal(document.getElementById('resultadoArea').style.display, 'none', 'Área de resultado deve estar oculta');
        assert.equal(document.getElementById('notFoundArea').style.display, 'block', 'Área de não encontrado deve ser visível');
    });

    QUnit.test('buscarChamado - protocolo vazio', async function(assert) {
        document.getElementById('searchTicket').value = ' ';
        await buscarChamado();
        
        assert.ok(document.getElementById('error-message'), 'Mensagem de erro para protocolo vazio deve ser exibida');
        assert.equal(document.getElementById('error-message').textContent, 'Por favor, digite o número do protocolo.', 'Texto da mensagem de erro correto');
    });

    QUnit.test('exibirChamado - exibição de todos os campos', async function(assert) {
        document.getElementById('searchTicket').value = '#COMPLETE-456';
        await buscarChamado();

        assert.equal(document.getElementById('diagnosticoSection').style.display, 'block', 'Seção de diagnóstico visível');
        assert.equal(document.getElementById('diagnosticoInfo').textContent, 'Pastilhas gastas.', 'Informação de diagnóstico correta');

        assert.equal(document.getElementById('garantiaSection').style.display, 'block', 'Seção de garantia visível');
        assert.equal(document.getElementById('garantiaInfo').textContent, 'Fora da garantia.', 'Informação de garantia correta');
        
        assert.equal(document.getElementById('orcamentoSection').style.display, 'block', 'Seção de orçamento visível');
        assert.equal(document.getElementById('orcamentoInfo').textContent, 'R$ 150,00', 'Informação de orçamento correta');

        assert.equal(document.getElementById('pecasSection').style.display, 'block', 'Seção de peças visível');
        assert.equal(document.getElementById('pecasInfo').textContent, 'Pastilhas de freio', 'Informação de peças correta');
    });

    QUnit.test('exibirTimeline - ordenação do histórico', async function(assert) {
        document.getElementById('searchTicket').value = '#VALID-123';
        await buscarChamado();
        
        const timeline = document.getElementById('timelineContent');
        const firstItem = timeline.querySelector('.timeline-item:first-child .timeline-date');
        const secondItem = timeline.querySelector('.timeline-item:last-child .timeline-date');

        assert.ok(firstItem.textContent.includes(new Date('2024-01-02T10:00:00Z').toLocaleDateString()), 'Item mais recente do histórico é exibido primeiro.');
        assert.ok(secondItem.textContent.includes(new Date('2024-01-01T12:00:00Z').toLocaleDateString()), 'Item mais antigo do histórico é exibido por último.');
    });

    QUnit.test('exibirTimeline - histórico vazio ou nulo', async function(assert) {
        document.getElementById('searchTicket').value = '#NO-HISTORY-789';
        await buscarChamado();
        
        const timeline = document.getElementById('timelineContent');
        assert.equal(timeline.textContent, 'Nenhuma atualização registrada.', 'Mensagem para histórico vazio é exibida.');
    });
});
