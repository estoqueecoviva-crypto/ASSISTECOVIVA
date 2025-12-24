// ===================================
// CONFIGURAÇÃO DO FIREBASE
// ===================================

const firebaseConfig = {
    apiKey: "AIzaSyBrJgrmI01SpclsBLmkLft4DbzKI2gec_A",
    authDomain: "assistecoviva-34968794-f4eed.firebaseapp.com",
    projectId: "assistecoviva-34968794-f4eed",
    storageBucket: "assistecoviva-34968794-f4eed.firebasestorage.app",
    messagingSenderId: "452863874754",
    appId: "1:452863874754:web:473f2a6459075e3fcb0d5b"
};

// Inicializar Firebase
try {
    firebase.initializeApp(firebaseConfig);
    console.log('Firebase inicializado com sucesso!');
} catch (error) {
    console.error('Erro ao inicializar Firebase:', error);
}

// Inicializar serviços
const db = firebase.firestore();
const auth = firebase.auth ? firebase.auth() : null;

// ===================================
// FUNÇÕES AUXILIARES
// ===================================

// Gerar número de protocolo único
function gerarNumeroProtocolo() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `#${timestamp.toString().slice(-6)}${random.toString().padStart(3, '0')}`;
}

// Formatar data para exibição
function formatarData(timestamp) {
    if (!timestamp) return '-';
    
    let date;
    if (timestamp.toDate) {
        date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
        date = timestamp;
    } else {
        date = new Date(timestamp);
    }
    
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Formatar data simples (sem hora)
function formatarDataSimples(timestamp) {
    if (!timestamp) return '-';
    
    let date;
    if (timestamp.toDate) {
        date = timestamp.toDate();
    } else if (timestamp instanceof Date) {
        date = timestamp;
    } else {
        date = new Date(timestamp);
    }
    
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Calcular se está em garantia
function verificarGarantia(dataCompra, mesesGarantia = 12) {
    if (!dataCompra) return false;
    
    const compra = new Date(dataCompra);
    const hoje = new Date();
    const mesesDecorridos = (hoje - compra) / (1000 * 60 * 60 * 24 * 30);
    
    return mesesDecorridos <= mesesGarantia;
}

// Obter classe CSS do status
function getStatusClass(status) {
    const statusMap = {
        'Novo': 'status-novo',
        'Em Análise': 'status-analise',
        'Aguardando Orçamento': 'status-orcamento',
        'Em Reparo': 'status-reparo',
        'Concluído': 'status-concluido'
    };
    return statusMap[status] || 'status-novo';
}

// Validar email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Validar telefone
function validarTelefone(telefone) {
    const regex = /\(\d{2}\)\s?\d{4,5}-?\d{4}/;
    return regex.test(telefone);
}

// Formatar telefone automaticamente
function formatarTelefone(value) {
    value = value.replace(/\D/g, '');
    if (value.length <= 10) {
        value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
}

// Mostrar mensagem de erro
function mostrarErro(mensagem) {
    alert(mensagem);
}

// Mostrar mensagem de sucesso
function mostrarSucesso(mensagem) {
    alert(mensagem);
}

// Fechar modal
function closeModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.style.display = 'none';
        location.reload();
    }
}

// Console log amigável
console.log('%c🚀 Sistema de Chamados Técnicos', 'color: #0891b2; font-size: 20px; font-weight: bold;');
console.log('%c📱 Desenvolvido para Scooters Elétricas', 'color: #10b981; font-size: 14px;');
console.log('%c⚙️ Versão 1.0.0', 'color: #64748b; font-size: 12px;');

// Verificar se o Firebase está configurado corretamente
if (firebaseConfig.apiKey === "SUA_API_KEY_AQUI") {
    console.warn('%c⚠️ ATENÇÃO: Configure suas credenciais do Firebase no arquivo js/config.js', 'color: #f59e0b; font-size: 14px; font-weight: bold;');
}
