
// ===================================
// CONFIGURAÇÃO CENTRAL DE E-MAIL
// Usando EmailJS: https://www.emailjs.com/
// ===================================

const EMAIL_CONFIG = {
    // Chaves da sua conta EmailJS
    serviceId: 'service_anyi0ud',
    publicKey: 'QoBVZW4MHQ4vnSBD1',

    // IDs dos templates de e-mail que você criou no EmailJS
    templates: {
        // E-mail enviado para o ADMIN quando um novo chamado é criado
        novoChamadoAdmin: 'template_0n5jdir',

        // E-mail enviado para o CLIENTE para confirmar la apertura del llamado
        confirmacaoCliente: 'template_z3e5wj2',

        // E-mail enviado para o CLIENTE quando o status do chamado muda
        atualizacaoStatus: 'DEIXE_EM_BRANCO_POR_ENQUANTO',

        // E-mail enviado para o CLIENTE quando o chamado é concluído
        chamadoConcluido: 'DEIXE_EM_BRANCO_POR_ENQUANTO'
    },

    // Informações da sua empresa
    // E-mail para onde as notificações de "Novo Chamado" serão enviadas
    emailAdmin: 'estoqueecoviva@gmail.com',
    nomeEmpresa: 'AssisTecOViva',

    // Links importantes (geralmente não precisam ser alterados)
    links: {
        consulta: 'https://assistecoviva-34968794-f4eed.web.app/consultar.html',
        painelAdmin: 'https://assistecoviva-34968794-f4eed.web.app/admin.html'
    }
};


// ===================================
// FUNÇÕES DE ENVIO DE E-MAIL
// (Não altere o código abaixo)
// ===================================

// Inicializa o EmailJS com a sua Public Key
(function() {
    if (EMAIL_CONFIG.publicKey && EMAIL_CONFIG.publicKey !== 'SUA_PUBLIC_KEY') {
        emailjs.init(EMAIL_CONFIG.publicKey);
    }
})();

/**
 * Verifica se a configuração básica do EmailJS está presente.
 * @returns {boolean} True se configurado, false caso contrário.
 */
function isEmailConfigurado() {
    const isConfigurado = EMAIL_CONFIG.serviceId && EMAIL_CONFIG.serviceId !== 'SEU_SERVICE_ID' &&
                          EMAIL_CONFIG.publicKey && EMAIL_CONFIG.publicKey !== 'SUA_PUBLIC_KEY';
    if (!isConfigurado) {
        console.warn("EmailJS não está configurado. Preencha o arquivo 'js/email-notifications.js'. As notificações por e-mail estão desativadas.");
    }
    return isConfigurado;
}

/**
 * Envia as notificações quando um novo chamado é criado.
 * 1. Envia um e-mail para o administrador.
 * 2. Envia um e-mail de confirmação para o cliente.
 * @param {object} dadosChamado - O objeto contendo todos os dados do chamado.
 */
async function enviarNotificacaoNovoChamado(dadosChamado) {
    if (!isEmailConfigurado()) return;

    // 1. Enviar para o Admin
    if (EMAIL_CONFIG.templates.novoChamadoAdmin && EMAIL_CONFIG.templates.novoChamadoAdmin.startsWith('template_')) {
        const adminParams = {
            ...dadosChamado,
            to_email: EMAIL_CONFIG.emailAdmin,
            reply_to: dadosChamado.email,
            empresa_nome: EMAIL_CONFIG.nomeEmpresa,
            link_painel: EMAIL_CONFIG.links.painelAdmin,
            dataAbertura: dadosChamado.dataAbertura.toDate().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
        };
        try {
            await emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templates.novoChamadoAdmin, adminParams);
            console.log("E-mail de notificação para o admin enviado com sucesso!");
        } catch (error) {
            console.error("Falha ao enviar e-mail para o admin:", JSON.stringify(error));
        }
    }

    // 2. Enviar para o Cliente
    if (EMAIL_CONFIG.templates.confirmacaoCliente && EMAIL_CONFIG.templates.confirmacaoCliente.startsWith('template_')) {
        const clienteParams = {
            ...dadosChamado,
            to_email: dadosChamado.email,
            to_name: dadosChamado.nomeCliente,
            reply_to: EMAIL_CONFIG.emailAdmin,
            empresa_nome: EMAIL_CONFIG.nomeEmpresa,
            link_consulta: `${EMAIL_CONFIG.links.consulta}?protocolo=${dadosChamado.protocolo}`,
            dataAbertura: dadosChamado.dataAbertura.toDate().toLocaleDateString('pt-BR')
        };
        try {
            await emailjs.send(EMAIL_CONFIG.serviceId, EMAIL_CONFIG.templates.confirmacaoCliente, clienteParams);
            console.log("E-mail de confirmação para o cliente enviado com sucesso!");
        } catch (error) {
            console.error("Falha ao enviar e-mail de confirmação para o cliente:", JSON.stringify(error));
        }
    }
}


/**
 * Envia notificação para o cliente sobre a atualização de status.
 * @param {object} dadosChamado - Dados completos do chamado.
 * @param {string} statusAntigo - O status anterior do chamado.
 */
async function enviarNotificacaoAtualizacaoStatus(dadosChamado, statusAntigo) {
    if (!isEmailConfigurado()) return;

    const templateId = dadosChamado.status === 'Concluído' 
        ? EMAIL_CONFIG.templates.chamadoConcluido 
        : EMAIL_CONFIG.templates.atualizacaoStatus;

    if (!templateId || !templateId.startsWith('template_')) {
        console.log(`Envio de e-mail para status '${dadosChamado.status}' pulado. Template não configurado.`);
        return;
    }

    const params = {
        protocolo: dadosChamado.protocolo,
        to_name: dadosChamado.nomeCliente,
        to_email: dadosChamado.email,
        status_novo: dadosChamado.status,
        status_anterior: statusAntigo,
        laudo_tecnico: dadosChamado.laudoTecnico || 'Não informado.',
        data_atualizacao: dadosChamado.dataUltimaAtualizacao.toDate().toLocaleString('pt-BR'),
        modeloEquipamento: dadosChamado.modeloEquipamento,
        empresa_nome: EMAIL_CONFIG.nomeEmpresa,
        link_consulta: `${EMAIL_CONFIG.links.consulta}?protocolo=${dadosChamado.protocolo}`,
        reply_to: EMAIL_CONFIG.emailAdmin,
    };

    try {
        await emailjs.send(EMAIL_CONFIG.serviceId, templateId, params);
        console.log(`E-mail de atualização ('${dadosChamado.status}') enviado para o cliente.`);
    } catch (error) {
        console.error("Falha ao enviar e-mail de atualização:", JSON.stringify(error));
    }
}
