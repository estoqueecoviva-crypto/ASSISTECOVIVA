
// Dependências de teste: QUnit e Sinon.js (devem ser incluídos no seu HTML de teste)
// <script src="https://code.jquery.com/qunit/qunit-2.19.4.js"></script>
// <script src="https://unpkg.com/sinon@15.2.0/pkg/sinon.js"></script>

QUnit.module('Notificações por E-mail', (hooks) => {

    // Mock do objeto global emailjs
    const mockEmailJs = {
        init: () => {},
        send: () => Promise.resolve({ status: 200, text: 'OK' }),
    };

    let emailJsInitSpy;
    let emailJsSendStub;
    let consoleWarnSpy;
    let consoleErrorSpy;
    let consoleLogSpy;
    let originalEmailConfig;

    hooks.beforeEach(() => {
        // Salva a configuração original
        originalEmailConfig = { ...window.EMAIL_CONFIG };

        // Espiona os métodos do mock e do console
        emailJsInitSpy = sinon.spy(mockEmailJs, 'init');
        emailJsSendStub = sinon.stub(mockEmailJs, 'send').resolves({ status: 200, text: 'OK' });
        consoleWarnSpy = sinon.spy(console, 'warn');
        consoleErrorSpy = sinon.spy(console, 'error');
        consoleLogSpy = sinon.spy(console, 'log');


        // Atribui o mock ao objeto window para que o script principal o utilize
        window.emailjs = mockEmailJs;
    });

    hooks.afterEach(() => {
        // Restaura a configuração original e os espiões
        window.EMAIL_CONFIG = originalEmailConfig;
        sinon.restore();
    });

    // ===================================
    // TESTES DA FUNÇÃO isEmailConfigurado()
    // ===================================
    QUnit.test('isEmailConfigurado(): Deve retornar true com configuração válida', (assert) => {
        // Configuração válida
        window.EMAIL_CONFIG.serviceId = 'service_valid';
        window.EMAIL_CONFIG.publicKey = 'publicKey_valid';

        assert.ok(isEmailConfigurado(), 'Retornou true para configuração válida');
        assert.ok(consoleWarnSpy.notCalled, 'Não deve exibir aviso no console');
    });

    QUnit.test('isEmailConfigurado(): Deve retornar false e avisar se serviceId for inválido', (assert) => {
        // Configuração inválida
        window.EMAIL_CONFIG.serviceId = 'SEU_SERVICE_ID';
        window.EMAIL_CONFIG.publicKey = 'publicKey_valid';

        assert.notOk(isEmailConfigurado(), 'Retornou false para serviceId inválido');
        assert.ok(consoleWarnSpy.calledOnce, 'Deve exibir um aviso no console');
    });

    QUnit.test('isEmailConfigurado(): Deve retornar false e avisar se publicKey for inválido', (assert) => {
        // Configuração inválida
        window.EMAIL_CONFIG.serviceId = 'service_valid';
        window.EMAIL_CONFIG.publicKey = 'SUA_PUBLIC_KEY';

        assert.notOk(isEmailConfigurado(), 'Retornou false para publicKey inválido');
        assert.ok(consoleWarnSpy.calledOnce, 'Deve exibir um aviso no console');
    });


    // ===================================
    // TESTES DA FUNÇÃO enviarNotificacaoNovoChamado()
    // ===================================
    QUnit.module('enviarNotificacaoNovoChamado()', (nestedHooks) => {

        const mockChamado = {
            protocolo: 'TESTE-001',
            nomeCliente: 'Cliente Teste',
            email: 'cliente@teste.com',
            dataAbertura: { toDate: () => new Date() },
        };

        nestedHooks.beforeEach(() => {
            // Configuração válida por padrão para estes testes
            window.EMAIL_CONFIG.serviceId = 'service_valid';
            window.EMAIL_CONFIG.publicKey = 'publicKey_valid';
            window.EMAIL_CONFIG.emailAdmin = 'admin@teste.com';
            window.EMAIL_CONFIG.templates.novoChamadoAdmin = 'template_admin';
            window.EMAIL_CONFIG.templates.confirmacaoCliente = 'template_cliente';
        });

        QUnit.test('Não deve enviar e-mails se a configuração for inválida', async (assert) => {
            window.EMAIL_CONFIG.serviceId = 'SEU_SERVICE_ID'; // Invalida a config

            await enviarNotificacaoNovoChamado(mockChamado);

            assert.ok(emailJsSendStub.notCalled, 'A função emailjs.send não deve ser chamada');
            assert.ok(consoleWarnSpy.calledOnce, 'Um aviso de configuração deve ser exibido');
        });

        QUnit.test('Deve enviar e-mail para Admin e Cliente com sucesso', async (assert) => {
            await enviarNotificacaoNovoChamado(mockChamado);

            assert.ok(emailJsSendStub.calledTwice, 'emailjs.send foi chamada duas vezes');

            // Valida a chamada para o Admin
            const adminCall = emailJsSendStub.getCall(0);
            assert.equal(adminCall.args[0], 'service_valid', 'Service ID correto para Admin');
            assert.equal(adminCall.args[1], 'template_admin', 'Template ID correto para Admin');
            assert.equal(adminCall.args[2].to_email, 'admin@teste.com', 'E-mail do Admin correto');
            assert.equal(adminCall.args[2].protocolo, 'TESTE-001', 'Protocolo correto para Admin');

            // Valida a chamada para o Cliente
            const clientCall = emailJsSendStub.getCall(1);
            assert.equal(clientCall.args[0], 'service_valid', 'Service ID correto para Cliente');
            assert.equal(clientCall.args[1], 'template_cliente', 'Template ID correto para Cliente');
            assert.equal(clientCall.args[2].to_email, 'cliente@teste.com', 'E-mail do Cliente correto');
            assert.ok(clientCall.args[2].link_consulta.includes('TESTE-001'), 'Link de consulta inclui o protocolo');
        });

        QUnit.test('Deve pular o envio para Admin se o template for inválido', async (assert) => {
            window.EMAIL_CONFIG.templates.novoChamadoAdmin = 'DEIXE_EM_BRANCO'; // Template inválido

            await enviarNotificacaoNovoChamado(mockChamado);

            assert.ok(emailJsSendStub.calledOnce, 'emailjs.send foi chamada apenas uma vez (para o cliente)');
            assert.equal(emailJsSendStub.getCall(0).args[1], 'template_cliente', 'A chamada feita foi para o cliente');
        });

        QUnit.test('Deve pular o envio para Cliente se o template for inválido', async (assert) => {
            window.EMAIL_CONFIG.templates.confirmacaoCliente = ''; // Template inválido

            await enviarNotificacaoNovoChamado(mockChamado);

            assert.ok(emailJsSendStub.calledOnce, 'emailjs.send foi chamada apenas uma vez (para o admin)');
            assert.equal(emailJsSendStub.getCall(0).args[1], 'template_admin', 'A chamada feita foi para o admin');
        });

        QUnit.test('Deve registrar erro no console se o envio falhar', async (assert) => {
            const error = { text: 'Falha no envio' };
            emailJsSendStub.rejects(error); // Força o stub a rejeitar a promessa

            await enviarNotificacaoNovoChamado(mockChamado);

            assert.ok(emailJsSendStub.calledTwice, 'Tentou enviar os dois e-mails');
            assert.ok(consoleErrorSpy.calledTwice, 'Registrou erro no console para ambas as falhas');
            assert.ok(consoleErrorSpy.getCall(0).args[1].includes(JSON.stringify(error)), 'Mensagem de erro correta para o admin');
            assert.ok(consoleErrorSpy.getCall(1).args[1].includes(JSON.stringify(error)), 'Mensagem de erro correta para o cliente');
        });
    });

    // ===================================
    // TESTES DA FUNÇÃO enviarNotificacaoAtualizacaoStatus()
    // ===================================
    QUnit.module('enviarNotificacaoAtualizacaoStatus()', (nestedHooks) => {
        const mockChamado = {
            protocolo: 'TESTE-002',
            nomeCliente: 'Cliente Teste 2',
            email: 'cliente2@teste.com',
            status: 'Concluído',
            laudoTecnico: 'Reparo finalizado.',
            dataUltimaAtualizacao: { toDate: () => new Date() },
        };

        nestedHooks.beforeEach(() => {
            window.EMAIL_CONFIG.serviceId = 'service_valid';
            window.EMAIL_CONFIG.publicKey = 'publicKey_valid';
            window.EMAIL_CONFIG.templates.atualizacaoStatus = 'template_atualizacao';
            window.EMAIL_CONFIG.templates.chamadoConcluido = 'template_concluido';
        });

        QUnit.test('Não deve enviar e-mail se a configuração for inválida', async (assert) => {
            window.EMAIL_CONFIG.publicKey = 'SUA_PUBLIC_KEY'; // Invalida a config

            await enviarNotificacaoAtualizacaoStatus(mockChamado, 'Em Reparo');

            assert.ok(emailJsSendStub.notCalled, 'A função emailjs.send não deve ser chamada');
            assert.ok(consoleWarnSpy.calledOnce, 'Um aviso de configuração deve ser exibido');
        });

        QUnit.test('Deve usar o template de "chamadoConcluido" para o status "Concluído"', async (assert) => {
            await enviarNotificacaoAtualizacaoStatus(mockChamado, 'Em Reparo');

            assert.ok(emailJsSendStub.calledOnce, 'emailjs.send foi chamada');
            const args = emailJsSendStub.getCall(0).args;
            assert.equal(args[1], 'template_concluido', 'Usou o template correto para chamado concluído');
            assert.equal(args[2].protocolo, 'TESTE-002', 'Protocolo correto');
            assert.equal(args[2].status_novo, 'Concluído', 'Status novo correto');
            assert.equal(args[2].status_anterior, 'Em Reparo', 'Status anterior correto');
        });

        QUnit.test('Deve usar o template de "atualizacaoStatus" para outros status', async (assert) => {
            mockChamado.status = 'Aguardando Peça';
            await enviarNotificacaoAtualizacaoStatus(mockChamado, 'Em Análise');

            assert.ok(emailJsSendStub.calledOnce, 'emailjs.send foi chamada');
            const args = emailJsSendStub.getCall(0).args;
            assert.equal(args[1], 'template_atualizacao', 'Usou o template correto para atualização de status');
            assert.equal(args[2].status_novo, 'Aguardando Peça', 'Status novo correto');
            assert.equal(args[2].status_anterior, 'Em Análise', 'Status anterior correto');
        });

        QUnit.test('Não deve enviar e-mail se o template apropriado não estiver configurado', async (assert) => {
            window.EMAIL_CONFIG.templates.chamadoConcluido = 'DEIXE_EM_BRANCO_POR_ENQUANTO';
            
            await enviarNotificacaoAtualizacaoStatus(mockChamado, 'Em Reparo');

            assert.ok(emailJsSendStub.notCalled, 'emailjs.send não foi chamada');
            assert.ok(consoleLogSpy.calledWith(sinon.match(/Template não configurado/)), 'Logou a mensagem de pulo de envio');
        });
    });
});
