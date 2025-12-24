
// Mocking document and window objects for testing outside a browser environment
const { JSDOM } = require('jsdom');
const dom = new JSDOM(`
    <!DOCTYPE html>
    <html>
        <body>
            <div id="loginScreen"></div>
            <div id="adminDashboard" style="display: none;"></div>
            <div id="userEmail"></div>
            <form id="loginForm">
                <input id="loginEmail" value="admin@assistencia.com">
                <input id="loginPassword" value="admin123">
            </form>
            <div id="totalChamados"></div>
            <div id="chamadosNovos"></div>
            <div id="chamadosAndamento"></div>
            <div id="chamadosConcluidos"></div>
            <div id="chamadosTableBody"></div>
            <div id="detalhesModal"></div>
            <div id="modalProtocolo"></div>
            <div id="detNome"></div>
            <div id="detEmail"></div>
            <div id="detTelefone"></div>
            <div id="detDataCompra"></div>
            <div id="detModelo"></div>
            <div id="detCor"></div>
            <div id="detNumeroSerie"></div>
            <div id="detTipoProblema"></div>
            <div id="detDescricao"></div>
            <div id="detStatus"></div>
            <div id="detDiagnostico"></div>
            <div id="detGarantia"></div>
            <div id="detOrcamento"></div>
            <div id="detPecas"></div>
            <div id="detObservacoes"></div>
            <form id="atendimentoForm">
                <button type="submit"></button>
            </form>
        </body>
    </html>
`);

global.document = dom.window.document;
global.window = dom.window;
global.sessionStorage = {
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
};
global.db = {
    collection: jest.fn(() => ({
        orderBy: jest.fn(() => ({
            get: jest.fn(),
        })),
    })),
};
global.firebase = {
    firestore: {
        FieldValue: {
            serverTimestamp: jest.fn(),
        },
    },
};

const {
    verificarAutenticacao,
    mostrarTelaLogin,
    mostrarDashboard,
    handleLogin,
    logout,
    atualizarEstatisticas,
    exibirListaChamados,
    abrirDetalhes,
    fecharModal,
} = require('../js/admin.js');

describe('Admin Panel Tests', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('Authentication', () => {
        it('should show login screen if user is not authenticated', () => {
            sessionStorage.getItem.mockReturnValueOnce(null);
            verificarAutenticacao();
            expect(document.getElementById('loginScreen').style.display).toBe('flex');
            expect(document.getElementById('adminDashboard').style.display).toBe('none');
        });

        it('should show dashboard if user is authenticated', () => {
            sessionStorage.getItem.mockReturnValueOnce('admin@assistencia.com');
            mostrarDashboard('admin@assistencia.com');
            expect(document.getElementById('loginScreen').style.display).toBe('none');
            expect(document.getElementById('adminDashboard').style.display).toBe('block');
        });

        it('should login successfully with correct credentials', async () => {
            const preventDefault = jest.fn();
            await handleLogin({ preventDefault });
            expect(sessionStorage.setItem).toHaveBeenCalledWith('usuarioLogado', 'admin@assistencia.com');
        });

        it('should fail to login with incorrect credentials', async () => {
            const preventDefault = jest.fn();
            document.getElementById('loginPassword').value = 'wrongpassword';
            await handleLogin({ preventDefault });
            expect(sessionStorage.setItem).not.toHaveBeenCalled();
        });

        it('should logout successfully', () => {
            window.confirm = jest.fn(() => true);
            logout();
            expect(sessionStorage.removeItem).toHaveBeenCalledWith('usuarioLogado');
        });
    });

    describe('Dashboard', () => {
        const todosOsChamados = [
            { id: '1', status: 'Novo' },
            { id: '2', status: 'Em Análise' },
            { id: '3', status: 'Aguardando Orçamento' },
            { id: '4', status: 'Em Reparo' },
            { id: '5', status: 'Concluído' },
        ];

        it('should update statistics correctly', () => {
            atualizarEstatisticas(todosOsChamados);
            expect(document.getElementById('totalChamados').textContent).toBe('5');
            expect(document.getElementById('chamadosNovos').textContent).toBe('1');
            expect(document.getElementById('chamadosAndamento').textContent).toBe('3');
            expect(document.getElementById('chamadosConcluidos').textContent).toBe('1');
        });
    });

    describe('Chamados List', () => {
        it('should display a message if there are no chamados', () => {
            exibirListaChamados([]);
            const tbody = document.getElementById('chamadosTableBody');
            expect(tbody.innerHTML).toContain('Nenhum chamado encontrado');
        });

        it('should display a list of chamados', () => {
            const chamados = [
                { id: '1', protocolo: '123', nome: 'John Doe', modelo: 'Model X', cor: 'Black', tipoProblema: 'Bateria', dataCriacao: new Date(), status: 'Novo' },
            ];
            exibirListaChamados(chamados);
            const tbody = document.getElementById('chamadosTableBody');
            expect(tbody.innerHTML).toContain('John Doe');
        });
    });

    describe('Detalhes do Chamado', () => {
        const todosOsChamados = [
            { id: '1', protocolo: '123', nome: 'John Doe', email: 'john@example.com', telefone: '123456789', dataCompra: new Date(), modelo: 'Model X', cor: 'Black', numeroSerie: 'SN123', tipoProblema: 'Bateria', descricao: 'Não liga', status: 'Novo' },
        ];

        it('should open the details modal with the correct information', () => {
            abrirDetalhes('1', todosOsChamados);
            expect(document.getElementById('detalhesModal').style.display).toBe('flex');
            expect(document.getElementById('modalProtocolo').textContent).toBe('123');
            expect(document.getElementById('detNome').textContent).toBe('John Doe');
        });

        it('should close the details modal', () => {
            fecharModal();
            expect(document.getElementById('detalhesModal').style.display).toBe('none');
        });
    });
});
