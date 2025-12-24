
// Importa as funções do SDK do Firebase que você precisa
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, query, where, doc, updateDoc, serverTimestamp, Timestamp, orderBy } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// A configuração do seu aplicativo da web do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBrJgrmI01SpclsBLmkLft4DbzKI2gec_A",
  authDomain: "assistecoviva-34968794-f4eed.firebaseapp.com",
  projectId: "assistecoviva-34968794-f4eed",
  storageBucket: "assistecoviva-34968794-f4eed.firebasestorage.app",
  messagingSenderId: "452863874754",
  appId: "1:452863874754:web:473f2a6459075e3fcb0d5b"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Exporta as variáveis e funções para serem usadas em outros scripts
export { 
    db, 
    collection, 
    addDoc, 
    getDocs, 
    query, 
    where, 
    doc, 
    updateDoc, 
    serverTimestamp, 
    Timestamp, 
    orderBy,
    formatarData, 
    getStatusClass
};


// ===================================
// FUNÇÕES AUXILIARES REUTILIZÁVEIS
// ===================================

/**
 * Formata um objeto de timestamp do Firebase ou um objeto Date para uma string legível.
 * @param {object|Date} timestamp - O timestamp para formatar.
 * @returns {string} A data formatada (DD/MM/AAAA HH:mm) ou '-' se a entrada for inválida.
 */
function formatarData(timestamp) {
    if (!timestamp) return '-';

    let date;
    if (timestamp.toDate) { // Verifica se é um timestamp do Firestore
        date = timestamp.toDate();
    } else if (timestamp instanceof Date) { // Verifica se já é um objeto Date
        date = timestamp;
    } else {
        try {
            date = new Date(timestamp); // Tenta converter de string/número
        } catch (e) {
            return '-'; // Retorna se a conversão falhar
        }
    }

    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

/**
 * Retorna uma classe CSS com base no status do chamado.
 * @param {string} status - O status do chamado.
 * @returns {string} O nome da classe CSS.
 */
function getStatusClass(status) {
    const statusMap = {
        'Novo': 'status-novo',
        'Em Análise': 'status-analise',
        'Aguardando Orçamento': 'status-orcamento',
        'Em Reparo': 'status-reparo',
        'Concluído': 'status-concluido'
    };
    return statusMap[status] || 'status-novo'; // Retorna 'status-novo' como padrão
}
