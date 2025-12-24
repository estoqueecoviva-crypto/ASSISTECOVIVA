
// chamados.js - Versão Corrigida e Funcional

// Importa as funções necessárias do config.js
import { db, collection, addDoc, serverTimestamp, Timestamp } from './config.js';

document.addEventListener('DOMContentLoaded', () => {
    const chamadoForm = document.getElementById('chamadoForm');
    if (chamadoForm) {
        chamadoForm.addEventListener('submit', handleNewTicket);
    }
});

/**
 * Lida com a submissão do formulário de novo chamado.
 * @param {Event} e O evento de submit.
 */
async function handleNewTicket(e) {
    e.preventDefault();
    const form = e.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalButtonText = submitButton.innerHTML;
    
    // Desabilita o botão e mostra um status de carregamento
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';

    try {
        const formData = new FormData(form);
        const dadosChamado = {};
        formData.forEach((value, key) => {
            dadosChamado[key] = value;
        });

        // Gera protocolo e adiciona metadados
        dadosChamado.protocolo = gerarProtocolo();
        dadosChamado.status = 'Novo';
        dadosChamado.dataCriacao = serverTimestamp();
        dadosChamado.dataAtualizacao = serverTimestamp();
        
        // Converte a data de string para Timestamp do Firestore
        if (dadosChamado.dataCompra) {
            const dateParts = dadosChamado.dataCompra.split('-');
            const utcDate = new Date(Date.UTC(dateParts[0], dateParts[1] - 1, dateParts[2]));
            dadosChamado.dataCompra = Timestamp.fromDate(utcDate);
        } else {
             delete dadosChamado.dataCompra;
        }

        // Adiciona um histórico inicial
        dadosChamado.historico = [{
            acao: 'Chamado criado pelo cliente.',
            data: new Date().toISOString(),
            responsavel: 'Sistema'
        }];
        
        // Salva no Firestore
        await addDoc(collection(db, "chamados"), dadosChamado);
        
        // Mostra o modal de sucesso
        showSuccessModal(dadosChamado.protocolo);

        form.reset();

    } catch (error) {
        console.error("❌ Erro ao abrir chamado: ", error);
        alert("Ocorreu um erro ao enviar seu chamado. Por favor, verifique os dados e tente novamente.");
    } finally {
        // Restaura o botão
        submitButton.disabled = false;
        submitButton.innerHTML = originalButtonText;
    }
}

/**
 * Gera um número de protocolo único.
 * @returns {string} O número do protocolo.
 */
function gerarProtocolo() {
    const timestamp = Date.now();
    const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `#${(timestamp & 0xFFFFF).toString(10)}${randomPart}`;
}

/**
 * Exibe o modal de sucesso com o número do protocolo.
 * @param {string} ticketNumber - O número do protocolo.
 */
function showSuccessModal(ticketNumber) {
    const modal = document.getElementById('successModal');
    const ticketElement = document.getElementById('ticketNumber');
    if (modal && ticketElement) {
        ticketElement.textContent = ticketNumber;
        modal.style.display = 'flex';
    }
}

/**
 * Fecha o modal de sucesso.
 * Esta função é chamada pelo `onclick` no HTML.
 */
window.closeModal = function() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.style.display = 'none';
    }
}
