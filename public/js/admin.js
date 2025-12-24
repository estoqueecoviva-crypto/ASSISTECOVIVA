
// admin.js - Versão final corrigida e segura

import { db, collection, getDocs, doc, updateDoc, query, orderBy, serverTimestamp, auth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from './config.js';
import { formatarData, getStatusClass } from './config.js';

// ===================================
// VARIÁVEIS GLOBAIS
// ===================================
let todosOsChamados = [];
let idChamadoAberto = null;

// ===================================
// AUTENTICAÇÃO FIREBASE (SEGURO)
// ===================================

// Monitora o estado da autenticação em tempo real
onAuthStateChanged(auth, user => {
    const loginScreen = document.getElementById('loginScreen');
    const adminDashboard = document.getElementById('adminDashboard');

    if (user) {
        // Usuário está logado
        console.log('✅ Usuário autenticado:', user.email);
        loginScreen.style.display = 'none';
        adminDashboard.style.display = 'block';
        document.getElementById('userEmail').textContent = user.email;
        atualizarLista(); // Carrega os dados do dashboard
    } else {
        // Usuário está deslogado
        console.log('ℹ️ Nenhum usuário autenticado.');
        loginScreen.style.display = 'flex';
        adminDashboard.style.display = 'none';
    }
});

// Adiciona o listener para o formulário de login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const submitButton = loginForm.querySelector('button[type="submit"]');
        const originalBtnText = submitButton.innerHTML;

        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...';
        
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // O onAuthStateChanged vai lidar com a exibição do dashboard
        } catch (error) {
            console.error('❌ Erro no login:', error.code, error.message);
            alert('E-mail ou senha inválidos. Tente novamente.');
            submitButton.disabled = false;
            submitButton.innerHTML = originalBtnText;
        }
    });
}

// Função de Logout
async function logout() {
    if (confirm('Tem certeza que deseja sair?')) {
        try {
            await signOut(auth);
            console.log('✅ Logout realizado com sucesso.');
            // O onAuthStateChanged vai redirecionar para a tela de login
        } catch (error) {
            console.error('❌ Erro no logout:', error);
            alert('Erro ao tentar sair. Por favor, tente novamente.');
        }
    }
}

// ===================================
// CARREGAMENTO E EXIBIÇÃO DE DADOS
// ===================================

async function atualizarLista() {
    const tbody = document.getElementById('chamadosTableBody');
    tbody.innerHTML = '<tr><td colspan="8" class="text-center"><i class="fas fa-spinner fa-spin"></i> Carregando chamados...</td></tr>';

    try {
        const q = query(collection(db, "chamados"), orderBy("dataCriacao", "desc"));
        const querySnapshot = await getDocs(q);
        
        todosOsChamados = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (todosOsChamados.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center">Nenhum chamado encontrado.</td></tr>';
        } else {
            exibirListaChamados(todosOsChamados);
            atualizarEstatisticas(todosOsChamados);
        }
    } catch (error) {
        console.error("Erro ao carregar chamados: ", error);
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">Erro ao carregar chamados. Tente novamente.</td></tr>';
    }
}

function exibirListaChamados(chamados) {
    const tbody = document.getElementById('chamadosTableBody');
    tbody.innerHTML = '';

    if (chamados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">Nenhum chamado corresponde aos filtros.</td></tr>';
        return;
    }

    chamados.forEach(chamado => {
        const statusClass = getStatusClass(chamado.status);
        const tr = document.createElement('tr');
        tr.dataset.id = chamado.id; // Adiciona o ID ao TR para referência
        tr.innerHTML = `
            <td>${chamado.protocolo}</td>
            <td>${chamado.nome}</td>
            <td>${chamado.modelo}</td>
            <td>${chamado.cor}</td>
            <td>${chamado.tipoProblema}</td>
            <td>${formatarData(chamado.dataCriacao)}</td>
            <td><span class="status-badge ${statusClass}">${chamado.status}</span></td>
            <td class="text-center">
                <button class="btn-icon view-details-btn" title="Ver Detalhes">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function atualizarEstatisticas(chamados) {
    document.getElementById('totalChamados').textContent = chamados.length;
    document.getElementById('chamadosNovos').textContent = chamados.filter(c => c.status === 'Novo').length;
    const emAndamento = chamados.filter(c => ['Em Análise', 'Aguardando Orçamento', 'Em Reparo'].includes(c.status)).length;
    document.getElementById('chamadosAndamento').textContent = emAndamento;
    document.getElementById('chamadosConcluidos').textContent = chamados.filter(c => c.status === 'Concluído').length;
}

// ===================================
// FILTROS
// ===================================

function filtrarChamados() {
    const termoBusca = document.getElementById('searchInput').value.toLowerCase();
    const statusFiltro = document.getElementById('filterStatus').value;
    const modeloFiltro = document.getElementById('filterModelo').value;

    const chamadosFiltrados = todosOsChamados.filter(chamado => {
        const buscaOk = termoBusca === '' ||
            (chamado.protocolo && chamado.protocolo.toLowerCase().includes(termoBusca)) ||
            (chamado.nome && chamado.nome.toLowerCase().includes(termoBusca)) ||
            (chamado.modelo && chamado.modelo.toLowerCase().includes(termoBusca));
        
        const statusOk = statusFiltro === '' || chamado.status === statusFiltro;
        const modeloOk = modeloFiltro === '' || chamado.modelo === modeloFiltro;

        return buscaOk && statusOk && modeloOk;
    });

    exibirListaChamados(chamadosFiltrados);
}

function limparFiltros() {
    document.getElementById('searchInput').value = '';
    document.getElementById('filterStatus').value = '';
    document.getElementById('filterModelo').value = '';
    exibirListaChamados(todosOsChamados);
}

// ===================================
// MODAL DE DETALHES E ATUALIZAÇÃO
// ===================================

function abrirDetalhes(chamadoId) {
    const chamado = todosOsChamados.find(c => c.id === chamadoId);
    if (!chamado) return;

    idChamadoAberto = chamadoId;

    document.getElementById('modalProtocolo').textContent = chamado.protocolo;
    document.getElementById('detNome').textContent = chamado.nome;
    document.getElementById('detEmail').textContent = chamado.email;
    document.getElementById('detTelefone').textContent = chamado.telefone;
    document.getElementById('detDataCompra').textContent = chamado.dataCompra;
    document.getElementById('detModelo').textContent = chamado.modelo;
    document.getElementById('detCor').textContent = chamado.cor;
    document.getElementById('detNumeroSerie').textContent = chamado.numeroSerie || 'N/A';
    document.getElementById('detTipoProblema').textContent = chamado.tipoProblema;
    document.getElementById('detDescricao').textContent = chamado.descricao;
    
    document.getElementById('detStatus').value = chamado.status;
    document.getElementById('detDiagnostico').value = chamado.diagnosticoTecnico || '';
    document.getElementById('detGarantia').value = chamado.infoGarantia || '';
    document.getElementById('detOrcamento').value = chamado.orcamento || '';
    document.getElementById('detPecas').value = chamado.pecasUtilizadas || '';
    document.getElementById('detObservacoes').value = chamado.observacoes || '';

    document.getElementById('detalhesModal').style.display = 'flex';
}

function fecharModal() {
    document.getElementById('detalhesModal').style.display = 'none';
    idChamadoAberto = null;
}

async function handleUpdateChamado(e) {
    e.preventDefault();
    if (!idChamadoAberto) return;

    const statusAntigo = todosOsChamados.find(c => c.id === idChamadoAberto)?.status;
    const novoStatus = document.getElementById('detStatus').value;

    const dadosAtualizados = {
        status: novoStatus,
        diagnosticoTecnico: document.getElementById('detDiagnostico').value,
        infoGarantia: document.getElementById('detGarantia').value,
        orcamento: document.getElementById('detOrcamento').value,
        pecasUtilizadas: document.getElementById('detPecas').value,
        observacoes: document.getElementById('detObservacoes').value,
        dataAtualizacao: serverTimestamp(),
    };
    
    if (statusAntigo !== novoStatus) {
        const historicoAtual = todosOsChamados.find(c => c.id === idChamadoAberto)?.historico || [];
        dadosAtualizados.historico = [...historicoAtual, {
            acao: `Status alterado para: ${novoStatus}`,
            data: new Date().toISOString(),
            responsavel: 'Admin'
        }];
    }
    
    try {
        const chamadoRef = doc(db, "chamados", idChamadoAberto);
        await updateDoc(chamadoRef, dadosAtualizados);
        
        alert('Chamado atualizado com sucesso!');
        fecharModal();
        await atualizarLista(); // Recarrega e re-renderiza a lista
    } catch (error) {
        console.error("Erro ao atualizar chamado: ", error);
        alert('Falha ao atualizar o chamado. Tente novamente.');
    }
}

// ===================================
// EVENT LISTENERS GLOBAIS
// ===================================
document.getElementById('logoutButton').addEventListener('click', logout);
document.getElementById('updateListButton').addEventListener('click', atualizarLista);
document.getElementById('searchButton').addEventListener('click', filtrarChamados);
document.getElementById('clearFiltersButton').addEventListener('click', limparFiltros);
document.getElementById('filterStatus').addEventListener('change', filtrarChamados);
document.getElementById('filterModelo').addEventListener('change', filtrarChamados);
document.getElementById('closeModalButton').addEventListener('click', fecharModal);
document.getElementById('cancelButton').addEventListener('click', fecharModal);
document.getElementById('atendimentoForm').addEventListener('submit', handleUpdateChamado);

// Event listener para a tabela (delegação de eventos)
document.getElementById('chamadosTableBody').addEventListener('click', (e) => {
    const viewButton = e.target.closest('.view-details-btn');
    if (viewButton) {
        const chamadoId = viewButton.closest('tr').dataset.id;
        abrirDetalhes(chamadoId);
    }
});
