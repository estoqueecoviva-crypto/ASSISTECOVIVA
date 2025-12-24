// ===================================
// ABERTURA DE CHAMADOS
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    
    // Formatar telefone automaticamente
    const telefoneInput = document.getElementById('telefone');
    if (telefoneInput) {
        telefoneInput.addEventListener('input', function(e) {
            e.target.value = formatarTelefone(e.target.value);
        });
    }
    
    // Limitar data de compra (não pode ser futura)
    const dataCompraInput = document.getElementById('dataCompra');
    if (dataCompraInput) {
        const hoje = new Date().toISOString().split('T')[0];
        dataCompraInput.setAttribute('max', hoje);
    }
    
    // Submissão do formulário
    const form = document.getElementById('chamadoForm');
    if (form) {
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            // Validar formulário
            if (!validarFormulario()) {
                return;
            }
            
            // Desabilitar botão de envio
            const submitBtn = form.querySelector('button[type="submit"]');
            const btnOriginalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            
            try {
                // Coletar dados do formulário
                const chamado = {
                    protocolo: gerarNumeroProtocolo(),
                    
                    // Dados do cliente
                    nome: document.getElementById('nome').value.trim(),
                    email: document.getElementById('email').value.trim().toLowerCase(),
                    telefone: document.getElementById('telefone').value.trim(),
                    dataCompra: document.getElementById('dataCompra').value,
                    
                    // Dados da scooter
                    modelo: document.getElementById('modelo').value,
                    cor: document.getElementById('cor').value,
                    numeroSerie: document.getElementById('numeroSerie').value.trim() || 'Não informado',
                    
                    // Dados do problema
                    tipoProblema: document.getElementById('tipoProblema').value,
                    descricao: document.getElementById('descricao').value.trim(),
                    
                    // Status e controle
                    status: 'Novo',
                    emGarantia: verificarGarantia(document.getElementById('dataCompra').value),
                    
                    // Campos de atendimento (vazios inicialmente)
                    diagnostico: '',
                    garantiaInfo: '',
                    orcamento: '',
                    pecasUtilizadas: '',
                    observacoes: '',
                    
                    // Metadados
                    dataCriacao: firebase.firestore.FieldValue.serverTimestamp(),
                    dataAtualizacao: firebase.firestore.FieldValue.serverTimestamp(),
                    
                    // Histórico
                    historico: [
                        {
                            data: new Date().toISOString(),
                            acao: 'Chamado aberto',
                            status: 'Novo'
                        }
                    ]
                };
                
                // Salvar no Firestore
                const docRef = await db.collection('chamados').add(chamado);
                console.log('Chamado criado com ID:', docRef.id);
                
                // 📧 NOVO: Enviar notificações por e-mail
                if (typeof enviarNotificacaoChamadoAberto === 'function') {
                    try {
                        submitBtn.innerHTML = '<i class="fas fa-envelope fa-spin"></i> Enviando notificações...';
                        const resultadosEmail = await enviarNotificacaoChamadoAberto(chamado);
                        
                        if (resultadosEmail.admin?.success) {
                            console.log('✅ E-mail enviado para admin');
                        }
                        if (resultadosEmail.cliente?.success) {
                            console.log('✅ E-mail enviado para cliente');
                        }
                    } catch (emailError) {
                        console.warn('⚠️ Erro ao enviar e-mails (chamado foi salvo):', emailError);
                    }
                }
                
                // Limpar formulário
                form.reset();
                
                // Mostrar modal de sucesso
                mostrarModalSucesso(chamado.protocolo);
                
            } catch (error) {
                console.error('Erro ao criar chamado:', error);
                
                // Verificar se é problema de configuração do Firebase
                if (error.code === 'unavailable' || error.message.includes('Firebase')) {
                    mostrarErro('⚠️ Sistema em configuração. Por favor, verifique se o Firebase foi configurado corretamente no arquivo js/config.js');
                } else {
                    mostrarErro('Erro ao criar chamado. Por favor, tente novamente.');
                }
                
                // Reabilitar botão
                submitBtn.disabled = false;
                submitBtn.innerHTML = btnOriginalText;
            }
        });
    }
});

// Validar formulário
function validarFormulario() {
    const nome = document.getElementById('nome').value.trim();
    const email = document.getElementById('email').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const dataCompra = document.getElementById('dataCompra').value;
    const modelo = document.getElementById('modelo').value;
    const cor = document.getElementById('cor').value;
    const tipoProblema = document.getElementById('tipoProblema').value;
    const descricao = document.getElementById('descricao').value.trim();
    
    // Validar campos obrigatórios
    if (!nome) {
        mostrarErro('Por favor, informe seu nome completo.');
        return false;
    }
    
    if (!email || !validarEmail(email)) {
        mostrarErro('Por favor, informe um e-mail válido.');
        return false;
    }
    
    if (!telefone) {
        mostrarErro('Por favor, informe seu telefone.');
        return false;
    }
    
    if (!dataCompra) {
        mostrarErro('Por favor, informe a data de compra da scooter.');
        return false;
    }
    
    // Validar se a data não é futura
    const dataCompraObj = new Date(dataCompra);
    const hoje = new Date();
    if (dataCompraObj > hoje) {
        mostrarErro('A data de compra não pode ser no futuro.');
        return false;
    }
    
    if (!modelo) {
        mostrarErro('Por favor, selecione o modelo da scooter.');
        return false;
    }
    
    if (!cor) {
        mostrarErro('Por favor, selecione a cor da scooter.');
        return false;
    }
    
    if (!tipoProblema) {
        mostrarErro('Por favor, selecione o tipo de problema.');
        return false;
    }
    
    if (!descricao || descricao.length < 20) {
        mostrarErro('Por favor, descreva o problema com mais detalhes (mínimo 20 caracteres).');
        return false;
    }
    
    return true;
}

// Mostrar modal de sucesso
function mostrarModalSucesso(protocolo) {
    const modal = document.getElementById('successModal');
    const ticketNumber = document.getElementById('ticketNumber');
    
    if (modal && ticketNumber) {
        ticketNumber.textContent = protocolo;
        modal.style.display = 'flex';
        modal.classList.add('active');
    }
}

// Fechar modal e recarregar página
function closeModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.style.display = 'none';
        modal.classList.remove('active');
    }
}

// Fechar modal ao clicar fora dele
window.addEventListener('click', function(e) {
    const modal = document.getElementById('successModal');
    if (e.target === modal) {
        closeModal();
    }
});
