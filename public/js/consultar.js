// ===================================
// PÁGINA DE CONSULTA DE CHAMADO (v9+ COMPATIBLE)
// ===================================

import { db, collection, query, where, getDocs, formatarData, getStatusClass } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    const consultaForm = document.getElementById('consultaForm');
    consultaForm?.addEventListener('submit', consultarChamado);
});

/**
 * Lida com a submissão do formulário de consulta.
 * @param {Event} e - O evento de submissão do formulário.
 */
async function consultarChamado(e) {
    e.preventDefault();

    const protocolo = document.getElementById('protocoloInput').value.trim();
    const resultadoDiv = document.getElementById('resultadoConsulta');
    const loadingDiv = document.getElementById('consultaLoading');

    if (!protocolo) {
        resultadoDiv.innerHTML = '<p class="error-message">Por favor, digite um número de protocolo.</p>';
        return;
    }

    resultadoDiv.innerHTML = '';
    loadingDiv.style.display = 'block';

    try {
        const q = query(collection(db, "chamados"), where("protocolo", "==", protocolo));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            resultadoDiv.innerHTML = '<p class="error-message">Nenhum chamado encontrado com este protocolo. Verifique o número e tente novamente.</p>';
        } else {
            const chamadoDoc = querySnapshot.docs[0];
            renderizarResultado(chamadoDoc.data());
        }
    } catch (error) {
        console.error("❌ Erro ao consultar chamado:", error);
        resultadoDiv.innerHTML = '<p class="error-message">Ocorreu um erro ao buscar seu chamado. Tente novamente mais tarde.</p>';
    } finally {
        loadingDiv.style.display = 'none';
    }
}

/**
 * Renderiza os detalhes e o histórico do chamado na página.
 * @param {object} chamado - O objeto de dados do chamado retornado do Firestore.
 */
function renderizarResultado(chamado) {
    const resultadoDiv = document.getElementById('resultadoConsulta');
    const statusClass = getStatusClass(chamado.status);

    // Garante que o histórico exista e esteja em ordem cronológica (mais recente primeiro)
    const historicoOrdenado = (chamado.historico || []).sort((a, b) => new Date(b.data) - new Date(a.data));

    resultadoDiv.innerHTML = `
        <div class="resultado-card">
            <div class="resultado-header">
                <h3>Protocolo: ${chamado.protocolo}</h3>
                <span class="status-tag ${statusClass}">${chamado.status}</span>
            </div>
            <div class="resultado-body">
                <p><strong>Cliente:</strong> ${chamado.nome}</p>
                <p><strong>Modelo da Scooter:</strong> ${chamado.modelo}</p>
                <p><strong>Data de Abertura:</strong> ${formatarData(chamado.dataCriacao)}</p>
                
                <h4><i class="fas fa-history"></i> Histórico de Atualizações</h4>
                ${historicoOrdenado.length > 0 ? `
                    <ul class="historico-list">
                        ${historicoOrdenado.map(h => 
                            `<li>
                                <span class="historico-data">${formatarData(h.data, true)}</span>
                                <p>${h.acao}</p>
                            </li>`
                        ).join('')}
                    </ul>
                ` : '<p>Nenhuma atualização no histórico deste chamado.</p>'}
            </div>
        </div>
    `;
}
