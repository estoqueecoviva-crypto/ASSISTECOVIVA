
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const emailjs = require("@emailjs/nodejs");
const cors = require("cors")({ origin: true });

// Inicializa o app do Firebase para ter acesso ao Firestore, etc.
admin.initializeApp();

// =================================================================================
// NOTA DE CONFIGURAÇÃO IMPORTANTE
// =================================================================================
// Para esta função funcionar, você PRECISA configurar as variáveis de ambiente
// no seu projeto Firebase. Execute os seguintes comandos no seu terminal,
// substituindo 'SUA_PRIVATE_KEY' pela sua chave privada do EmailJS:
//
// firebase functions:config:set emailjs.service_id="service_anyi0ud"
// firebase functions:config:set emailjs.template_admin="template_0n5jdir"
// firebase functions:config:set emailjs.template_cliente="template_z3e5wj2"
// firebase functions:config:set emailjs.private_key="SUA_PRIVATE_KEY"
// firebase functions:config:set emailjs.public_key="QoBVZW4MHQ4vnSBD1"
//
// A Public Key não é usada para envio, mas é bom tê-la configurada.
// A Private Key NUNCA deve ser escrita diretamente no código.
// =================================================================================

// Obtém as configurações do ambiente do Firebase
const EMAILJS_CONFIG = {
    SERVICE_ID: functions.config().emailjs.service_id,
    TEMPLATE_ADMIN: functions.config().emailjs.template_admin,
    TEMPLATE_CLIENTE: a=functions.config().emailjs.template_cliente,
    PRIVATE_KEY: functions.config().emailjs.private_key,
    PUBLIC_KEY: functions.config().emailjs.public_key, // Chave pública para o SDK
};

const EMAIL_INFO = {
    ADMIN_EMAIL: "estoqueecoviva@gmail.com",
    EMPRESA_NOME: "AssisTecOViva",
    LINK_CONSULTA: "https://assistecoviva-34968794-f4eed.web.app/consultar.html",
    LINK_PAINEL: "https://assistecoviva-34968794-f4eed.web.app/admin.html",
};

/**
 * Função HTTP "callable" para enviar os e-mails de notificação de um novo chamado.
 * Ela é mais segura que uma função HTTP simples.
 */
exports.enviarEmailChamado = functions.https.onCall(async (data, context) => {
    
    // Log para depuração
    console.log("Iniciando envio de e-mail para o protocolo:", data.protocolo);
    console.log("Dados recebidos:", JSON.stringify(data));

    // Validar se as chaves essenciais estão configuradas
    if (!EMAILJS_CONFIG.SERVICE_ID || !EMAILJS_CONFIG.PRIVATE_KEY || !EMAILJS_CONFIG.TEMPLATE_ADMIN || !EMAILJS_CONFIG.TEMPLATE_CLIENTE) {
        console.error("Configuração de ambiente do EmailJS está incompleta. Verifique as variáveis de ambiente.");
        throw new functions.https.HttpsError(
            "internal",
            "O servidor de e-mails não está configurado corretamente."
        );
    }
    
    // Inicializa o EmailJS com a Private Key
    emailjs.init({
        publicKey: EMAILJS_CONFIG.PUBLIC_KEY,
        privateKey: EMAILJS_CONFIG.PRIVATE_KEY
    });

    // 1. Preparar e enviar e-mail para o ADMINISTRADOR
    const adminParams = {
        protocolo: data.protocolo,
        nomeCliente: data.nome,
        email: data.email,
        telefone: data.telefone,
        modelo: data.modelo,
        problema: data.tipoProblema,
        descricao: data.descricao,
        dataAbertura: new Date().toLocaleDateString("pt-BR"),
        link_painel: EMAIL_INFO.LINK_PAINEL,
        reply_to: data.email,
    };

    try {
        await emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_ADMIN, adminParams);
        console.log("E-mail para o admin enviado com sucesso!");
    } catch (error) {
        console.error("Erro ao enviar e-mail para o admin:", JSON.stringify(error));
        // Não joga erro aqui para tentar enviar o do cliente mesmo assim
    }

    // 2. Preparar e enviar e-mail de confirmação para o CLIENTE
    const clienteParams = {
        protocolo: data.protocolo,
        to_name: data.nome,
        to_email: data.email,
        empresa_nome: EMAIL_INFO.EMPRESA_NOME,
        link_consulta: `${EMAIL_INFO.LINK_CONSULTA}?protocolo=${data.protocolo}`,
        dataAbertura: new Date().toLocaleDateString("pt-BR"),
        reply_to: EMAIL_INFO.ADMIN_EMAIL,
    };

    try {
        await emailjs.send(EMAILJS_CONFIG.SERVICE_ID, EMAILJS_CONFIG.TEMPLATE_CLIENTE, clienteParams);
        console.log("E-mail de confirmação para o cliente enviado com sucesso!");
    } catch (error) {
        console.error("Erro ao enviar e-mail para o cliente:", JSON.stringify(error));
        // Se falhou aqui, o admin já foi notificado (esperamos)
        // Lançar um erro aqui notificará o front-end
        throw new functions.https.HttpsError(
            "internal",
            "Falha ao enviar o e-mail de confirmação para o cliente.",
            JSON.stringify(error)
        );
    }

    // Retorna sucesso se pelo menos o e-mail do cliente foi enviado
    return { success: true, message: "E-mails processados." };
});
