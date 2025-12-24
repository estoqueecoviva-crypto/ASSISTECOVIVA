
// Mock HTML elements for testing
document.body.innerHTML = `
  <div id="successModal" style="display: none;">
    <span id="ticketNumber"></span>
  </div>
  <div id="error-message" style="display: none;"></div>
  <input id="nome" />
  <input id="email" />
  <input id="telefone" />
  <input id="dataCompra" />
  <input id="modelo" />
  <input id="cor" />
  <input id="tipoProblema" />
  <textarea id="descricao"></textarea>
`;

const mockSuccessModal = document.getElementById('successModal');
const mockTicketNumber = document.getElementById('ticketNumber');
const mockErrorMessage = document.getElementById('error-message');
const mockNome = document.getElementById('nome');
const mockEmail = document.getElementById('email');
const mockTelefone = document.getElementById('telefone');
const mockDataCompra = document.getElementById('dataCompra');
const mockModelo = document.getElementById('modelo');
const mockCor = document.getElementById('cor');
const mockTipoProblema = document.getElementById('tipoProblema');
const mockDescricao = document.getElementById('descricao');

// Mock functions
const mostrarErro = (mensagem) => {
  mockErrorMessage.textContent = mensagem;
  mockErrorMessage.style.display = 'block';
};

const validarEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

// --- Test Suite ---

const runTests = () => {
  console.log('--- Running Test Suite for chamados.js ---');

  // Test for mostrarModalSucesso
  console.log('Testing mostrarModalSucesso...');
  mostrarModalSucesso('TEST-12345');
  console.assert(mockSuccessModal.style.display === 'flex', 'Test Failed: Success modal should be visible.');
  console.assert(mockTicketNumber.textContent === 'TEST-12345', 'Test Failed: Ticket number should be displayed.');
  console.log('...mostrarModalSucesso tests passed.');

  // Test for closeModal
  console.log('Testing closeModal...');
  closeModal();
  console.assert(mockSuccessModal.style.display === 'none', 'Test Failed: Success modal should be hidden.');
  console.log('...closeModal tests passed.');

  // Tests for validarFormulario
  console.log('Testing validarFormulario...');
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + 1);

  const testCases = [
    { description: 'should fail if name is empty', setup: () => { mockNome.value = ''; }, expected: false, expectedMsg: 'Por favor, informe seu nome completo.' },
    { description: 'should fail if email is invalid', setup: () => { mockNome.value = 'Test'; mockEmail.value = 'invalid-email'; }, expected: false, expectedMsg: 'Por favor, informe um e-mail válido.' },
    { description: 'should fail if phone is empty', setup: () => { mockEmail.value = 'test@test.com'; mockTelefone.value = ''; }, expected: false, expectedMsg: 'Por favor, informe seu telefone.' },
    { description: 'should fail if purchase date is empty', setup: () => { mockTelefone.value = '1234567890'; mockDataCompra.value = ''; }, expected: false, expectedMsg: 'Por favor, informe a data de compra da scooter.' },
    { description: 'should fail if purchase date is in the future', setup: () => { mockDataCompra.value = futureDate.toISOString().split('T')[0]; }, expected: false, expectedMsg: 'A data de compra não pode ser no futuro.' },
    { description: 'should fail if model is empty', setup: () => { mockDataCompra.value = today.toISOString().split('T')[0]; mockModelo.value = ''; }, expected: false, expectedMsg: 'Por favor, selecione o modelo da scooter.' },
    { description: 'should fail if color is empty', setup: () => { mockModelo.value = 'Model X'; mockCor.value = ''; }, expected: false, expectedMsg: 'Por favor, selecione a cor da scooter.' },
    { description: 'should fail if problem type is empty', setup: () => { mockCor.value = 'Black'; mockTipoProblema.value = ''; }, expected: false, expectedMsg: 'Por favor, selecione o tipo de problema.' },
    { description: 'should fail if description is too short', setup: () => { mockTipoProblema.value = 'Bateria'; mockDescricao.value = 'short'; }, expected: false, expectedMsg: 'Por favor, descreva o problema com mais detalhes (mínimo 20 caracteres).' },
    { description: 'should pass a valid form', setup: () => { mockDescricao.value = 'This is a valid description of the problem.'; }, expected: true, expectedMsg: '' }
  ];

  testCases.forEach(test => {
    test.setup();
    const result = validarFormulario();
    console.assert(result === test.expected, `Test Failed: ${test.description}`);
    if (!test.expected) {
      console.assert(mockErrorMessage.textContent === test.expectedMsg, `Test Failed: Incorrect error message for ${test.description}`);
    }
  });

  console.log('...validarFormulario tests passed.');
  console.log('--- Test Suite Finished ---');
};

runTests();
