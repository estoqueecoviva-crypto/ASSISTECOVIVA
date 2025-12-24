
// Mocking the dependencies for the tests
const firebase = {
  initializeApp: () => {},
  firestore: () => {},
  auth: () => {},
};

// Functions from js/config.js to be tested
function gerarNumeroProtocolo() {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    return `#${timestamp.toString().slice(-6)}${random.toString().padStart(3, '0')}`;
}

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

function verificarGarantia(dataCompra, mesesGarantia = 12) {
    if (!dataCompra) return false;

    const compra = new Date(dataCompra);
    const hoje = new Date();
    const mesesDecorridos = (hoje - compra) / (1000 * 60 * 60 * 24 * 30);

    return mesesDecorridos <= mesesGarantia;
}

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

function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validarTelefone(telefone) {
    const regex = /\(\d{2}\)\s?\d{4,5}-?\d{4}/;
    return regex.test(telefone);
}

function formatarTelefone(value) {
    value = value.replace(/\D/g, '');
    if (value.length <= 10) {
        value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    } else {
        value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return value;
}


// Simple assertion function for testing
function assert(condition, message) {
    if (!condition) {
        throw new Error(message || "Assertion failed");
    }
}

// Test suite
console.log('Running tests for config.js...');

// Test for gerarNumeroProtocolo
try {
    const protocolo = gerarNumeroProtocolo();
    assert(typeof protocolo === 'string' && protocolo.startsWith('#') && protocolo.length > 7, 'gerarNumeroProtocolo should return a valid protocol number');
    console.log('✓ Test for gerarNumeroProtocolo passed');
} catch (error) {
    console.error('✗ Test for gerarNumeroProtocolo failed:', error.message);
}

// Test for formatarData
try {
    const date = new Date();
    const formattedDate = formatarData(date);
    assert(typeof formattedDate === 'string' && formattedDate.includes('/'), 'formatarData should return a formatted date string');
    console.log('✓ Test for formatarData passed');
} catch (error) {
    console.error('✗ Test for formatarData failed:', error.message);
}

// Test for formatarDataSimples
try {
    const date = new Date();
    const formattedDate = formatarDataSimples(date);
    assert(typeof formattedDate === 'string' && formattedDate.includes('/'), 'formatarDataSimples should return a formatted date string');
    console.log('✓ Test for formatarDataSimples passed');
} catch (error) {
    console.error('✗ Test for formatarDataSimples failed:', error.message);
}


// Test for verificarGarantia
try {
    const today = new Date();
    const inWarranty = new Date(today.setMonth(today.getMonth() - 6));
    const outOfWarranty = new Date(today.setFullYear(today.getFullYear() - 2));
    assert(verificarGarantia(inWarranty) === true, 'verificarGarantia should return true for a date within warranty');
    assert(verificarGarantia(outOfWarranty) === false, 'verificarGarantia should return false for a date outside of warranty');
    console.log('✓ Test for verificarGarantia passed');
} catch (error) {
    console.error('✗ Test for verificarGarantia failed:', error.message);
}

// Test for getStatusClass
try {
    assert(getStatusClass('Novo') === 'status-novo', "getStatusClass('Novo') should return 'status-novo'");
    assert(getStatusClass('Em Análise') === 'status-analise', "getStatusClass('Em Análise') should return 'status-analise'");
    assert(getStatusClass('Inexistente') === 'status-novo', "getStatusClass with unknown status should return 'status-novo'");
    console.log('✓ Test for getStatusClass passed');
} catch (error) {
    console.error('✗ Test for getStatusClass failed:', error.message);
}


// Test for validarEmail
try {
    assert(validarEmail('test@example.com') === true, 'validarEmail should return true for a valid email');
    assert(validarEmail('invalid-email') === false, 'validarEmail should return false for an invalid email');
    console.log('✓ Test for validarEmail passed');
} catch (error) {
    console.error('✗ Test for validarEmail failed:', error.message);
}

// Test for validarTelefone
try {
    assert(validarTelefone('(11) 98765-4321') === true, 'validarTelefone should return true for a valid phone number');
    assert(validarTelefone('123456') === false, 'validarTelefone should return false for an invalid phone number');
    console.log('✓ Test for validarTelefone passed');
} catch (error) {
    console.error('✗ Test for validarTelefone failed:', error.message);
}

// Test for formatarTelefone
try {
    assert(formatarTelefone('11987654321') === '(11) 98765-4321', 'formatarTelefone should format a long phone number correctly');
    assert(formatarTelefone('1112345678') === '(11) 1234-5678', 'formatarTelefone should format a short phone number correctly');
    console.log('✓ Test for formatarTelefone passed');
} catch (error) {
    console.error('✗ Test for formatarTelefone failed:', error.message);
}

console.log('All tests for config.js completed.');
