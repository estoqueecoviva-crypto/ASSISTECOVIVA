# 🛴 Sistema de Gestão de Chamados Técnicos - Scooters Elétricas

Sistema web completo e profissional para gestão de assistência técnica de scooters elétricas importadas da China. Solução gratuita, online e totalmente funcional para gerenciar chamados técnicos, desde a abertura até a conclusão do atendimento.

![Status](https://img.shields.io/badge/Status-Pronto-success)
![Versão](https://img.shields.io/badge/Versão-1.0.0-blue)
![Custo](https://img.shields.io/badge/Hospedagem-100%25%20Gratuita-green)

---

## 🚀 INÍCIO RÁPIDO

**Primeira vez aqui?** Comece por um destes arquivos:

- 📖 **`LEIA-ME-PRIMEIRO.md`** - Visão geral rápida e próximos passos
- ⚡ **`INICIO_RAPIDO.md`** - Configure em 5 minutos
- 📚 **`GUIA_FIREBASE.md`** - Passo a passo detalhado de configuração

**Já configurou?** Continue lendo este README para detalhes completos.

---

## 🎯 Sobre o Projeto

Este sistema foi desenvolvido especialmente para empresas que importam e comercializam scooters elétricas, resolvendo o problema crítico de gestão de assistência técnica de forma:

- ✅ **Gratuita** - Sem custos mensais ou licenças
- ✅ **Online** - Acessível de qualquer lugar
- ✅ **Profissional** - Interface moderna e intuitiva
- ✅ **Completa** - Todas as funcionalidades necessárias

---

## 📋 Funcionalidades Implementadas

### 🌐 Portal do Cliente (index.html)
- ✅ Formulário completo para abertura de chamados técnicos
- ✅ Campos para dados do cliente (nome, e-mail, telefone, data de compra)
- ✅ Seleção de modelo da scooter (7 modelos disponíveis)
- ✅ Seleção de cor (preto, branco, azul, vermelho, verde, cinza, carbono)
- ✅ Categorização do tipo de problema
- ✅ Geração automática de número de protocolo único
- ✅ Validação completa de formulário
- ✅ Modal de confirmação com número do protocolo
- ✅ Design responsivo (mobile-friendly)

### 🔍 Consulta de Status (consultar.html)
- ✅ Busca de chamado por número de protocolo
- ✅ Visualização completa dos dados do chamado
- ✅ Status atualizado em tempo real
- ✅ Histórico de atualizações (timeline)
- ✅ Informações de diagnóstico, garantia e orçamento
- ✅ Lista de peças utilizadas (quando aplicável)
- ✅ Interface intuitiva e informativa

### 👨‍💼 Painel Administrativo (admin.html)
- ✅ Sistema de login seguro (demo: admin@assistencia.com / admin123)
- ✅ Dashboard com estatísticas em tempo real:
  - Total de chamados
  - Chamados novos
  - Chamados em andamento
  - Chamados concluídos
- ✅ Lista completa de todos os chamados
- ✅ Filtros avançados:
  - Por status (Novo, Em Análise, Aguardando Orçamento, Em Reparo, Concluído)
  - Por modelo de scooter
  - Busca por protocolo, nome ou modelo
- ✅ Visualização detalhada de cada chamado
- ✅ Edição completa do atendimento:
  - Atualização de status
  - Registro de diagnóstico técnico
  - Informações de garantia
  - Geração de orçamento
  - Registro de peças utilizadas
  - Observações adicionais
- ✅ Histórico automático de mudanças
- ✅ Interface profissional e responsiva

---

## 🎨 Design e UX

- **Cores corporativas**: Azul (#0891b2) e Verde (#10b981) - representando tecnologia e sustentabilidade
- **Tipografia**: Inter (Google Fonts) - moderna e legível
- **Ícones**: Font Awesome 6.4.0
- **Layout responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- **Animações suaves**: Transições e efeitos de hover elegantes
- **Cards e sombras**: Design clean e moderno

---

## 🚀 Estrutura do Projeto

```
projeto/
│
├── index.html              # Portal do cliente - Abertura de chamados
├── consultar.html          # Consulta de status de chamados
├── admin.html              # Painel administrativo
│
├── css/
│   └── style.css          # Estilos completos e responsivos
│
├── js/
│   ├── config.js          # Configuração do Firebase e funções auxiliares
│   ├── chamados.js        # Lógica de abertura de chamados
│   ├── consultar.js       # Lógica de consulta de status
│   └── admin.js           # Lógica do painel administrativo
│
└── README.md              # Documentação (este arquivo)
```

---

## ⚙️ Tecnologias Utilizadas

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Database**: Firebase Firestore (NoSQL em tempo real)
- **Hospedagem**: Vercel / Netlify / Firebase Hosting (gratuita)
- **Fontes**: Google Fonts (Inter)
- **Ícones**: Font Awesome 6.4.0
- **Bibliotecas**: Firebase SDK 10.7.1

---

## 🔧 Configuração e Instalação

### 1️⃣ Criar Projeto no Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em "Adicionar projeto"
3. Digite um nome (ex: "assistencia-scooters")
4. Desabilite Google Analytics (não é necessário)
5. Clique em "Criar projeto"

### 2️⃣ Configurar Firestore Database

1. No menu lateral, vá em **"Firestore Database"**
2. Clique em **"Criar banco de dados"**
3. Selecione **"Iniciar no modo de produção"**
4. Escolha a localização (ex: southamerica-east1)
5. Clique em **"Ativar"**

### 3️⃣ Configurar Regras de Segurança

No Firestore, vá em **"Regras"** e cole o seguinte:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura e escrita para chamados (temporário para desenvolvimento)
    match /chamados/{chamado} {
      allow read, write: if true;
    }
  }
}
```

⚠️ **ATENÇÃO**: Em produção, implemente regras de segurança mais restritivas!

### 4️⃣ Obter Credenciais do Firebase

1. No Firebase Console, clique no ícone de **engrenagem** ⚙️ > **Configurações do projeto**
2. Role até **"Seus aplicativos"**
3. Clique no ícone **"</>"** (Web)
4. Registre o app com um nome (ex: "Assistencia Web")
5. **NÃO** marque "Firebase Hosting"
6. Clique em **"Registrar app"**
7. **Copie as credenciais** que aparecem

### 5️⃣ Configurar o Projeto

Abra o arquivo **`js/config.js`** e substitua as credenciais:

```javascript
const firebaseConfig = {
    apiKey: "SUA_API_KEY_AQUI",
    authDomain: "SEU_PROJECT_ID.firebaseapp.com",
    projectId: "SEU_PROJECT_ID",
    storageBucket: "SEU_PROJECT_ID.appspot.com",
    messagingSenderId: "SEU_MESSAGING_SENDER_ID",
    appId: "SEU_APP_ID"
};
```

### 6️⃣ Testar Localmente

1. Abra o arquivo **`index.html`** no navegador
2. Preencha e envie um chamado de teste
3. Verifique no Firebase Console se o chamado foi criado
4. Teste a consulta em **`consultar.html`**
5. Acesse **`admin.html`** e faça login:
   - E-mail: `admin@assistencia.com`
   - Senha: `admin123`

---

## 🌐 Deploy Gratuito

### Opção 1: Vercel (Recomendado) ⭐

1. Acesse [vercel.com](https://vercel.com)
2. Crie uma conta (pode usar GitHub)
3. Clique em **"New Project"**
4. Importe seu projeto (via GitHub ou upload direto)
5. Clique em **"Deploy"**
6. Pronto! Seu site estará online em segundos

**URL final**: `https://seu-projeto.vercel.app`

### Opção 2: Netlify

1. Acesse [netlify.com](https://netlify.com)
2. Crie uma conta
3. Arraste a pasta do projeto para o Netlify Drop
4. Aguarde o deploy automático
5. Seu site estará online!

**URL final**: `https://seu-projeto.netlify.app`

### Opção 3: Firebase Hosting

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login no Firebase
firebase login

# Inicializar projeto
firebase init hosting

# Deploy
firebase deploy
```

**URL final**: `https://seu-projeto.web.app`

---

## 📱 Como Usar o Sistema

### Para Clientes:

1. **Abrir Chamado**:
   - Acesse a página inicial
   - Preencha todos os dados do formulário
   - Clique em "Enviar Chamado"
   - Guarde o número do protocolo recebido

2. **Consultar Status**:
   - Acesse "Consultar Status"
   - Digite o número do protocolo
   - Visualize todas as informações e atualizações

### Para Operadores/Técnicos:

1. **Fazer Login**:
   - Acesse "Área Admin"
   - Use as credenciais de acesso
   - E-mail demo: `admin@assistencia.com`
   - Senha demo: `admin123`

2. **Visualizar Dashboard**:
   - Veja estatísticas em tempo real
   - Identifique chamados pendentes

3. **Gerenciar Chamados**:
   - Clique no ícone 👁️ para ver detalhes
   - Atualize o status conforme o atendimento
   - Adicione diagnóstico técnico
   - Informe se está em garantia
   - Gere orçamento se necessário
   - Registre peças utilizadas
   - Salve as alterações

4. **Filtrar e Buscar**:
   - Use os filtros por status e modelo
   - Busque por protocolo, nome ou modelo
   - Limpe os filtros quando necessário

---

## 📊 Fluxo de Trabalho Completo

```
1. Cliente abre chamado
   ↓
2. Sistema gera protocolo único
   ↓
3. Chamado aparece no painel admin com status "Novo"
   ↓
4. Operador visualiza e atualiza para "Em Análise"
   ↓
5. Operador adiciona diagnóstico técnico
   ↓
6. Define se é garantia ou gera orçamento
   ↓
7. Atualiza status para "Em Reparo"
   ↓
8. Registra peças utilizadas
   ↓
9. Marca como "Concluído"
   ↓
10. Cliente consulta e vê histórico completo
```

---

## 🔐 Segurança e Autenticação

### Implementação Atual (Demo):
- Sistema de autenticação simplificado com sessionStorage
- Credenciais fixas para demonstração
- Adequado para MVP e testes

### Recomendações para Produção:

1. **Implementar Firebase Authentication**:
```javascript
// Substituir o login simplificado por:
firebase.auth().signInWithEmailAndPassword(email, senha)
    .then((userCredential) => {
        // Login bem-sucedido
    })
    .catch((error) => {
        // Erro no login
    });
```

2. **Atualizar Regras do Firestore**:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /chamados/{chamado} {
      // Clientes podem criar
      allow create: if true;
      // Apenas admins autenticados podem ler/atualizar
      allow read, update: if request.auth != null;
    }
  }
}
```

3. **Adicionar controle de usuários**:
   - Criar sistema de cadastro de operadores
   - Definir permissões e níveis de acesso
   - Implementar logs de auditoria

---

## 📈 Próximas Melhorias Sugeridas

### Alta Prioridade:
- [ ] Implementar Firebase Authentication real
- [ ] Adicionar notificações por e-mail (SendGrid/EmailJS)
- [ ] Sistema de upload de fotos do problema
- [ ] Exportação de relatórios (PDF/Excel)
- [ ] Impressão de ordem de serviço

### Média Prioridade:
- [ ] Chat/comentários no chamado
- [ ] Notificações push no navegador
- [ ] Sistema de avaliação do atendimento
- [ ] Integração com WhatsApp Business API
- [ ] Dashboard com gráficos (Chart.js)

### Baixa Prioridade:
- [ ] App mobile (PWA)
- [ ] Sistema de estoque de peças
- [ ] Agendamento de visitas técnicas
- [ ] Múltiplos idiomas
- [ ] Tema escuro

---

## 🐛 Solução de Problemas

### Erro: "Firebase não está configurado"
**Solução**: Verifique se você substituiu as credenciais no arquivo `js/config.js`

### Erro: "Permission denied"
**Solução**: Verifique as regras do Firestore no Firebase Console

### Erro: "Missing or insufficient permissions"
**Solução**: Configure as regras de segurança conforme o passo 3 da instalação

### Chamados não aparecem no admin
**Solução**: 
1. Verifique se há índices pendentes no Firestore
2. Verifique o console do navegador para erros
3. Tente recarregar a página

### Modal não fecha
**Solução**: Clique fora do modal ou no botão X

---

## 💰 Custos de Hospedagem

### 🟢 100% GRATUITO para sempre:

**Firebase (Plano Spark - Grátis)**:
- ✅ 1GB de armazenamento Firestore
- ✅ 50.000 leituras por dia
- ✅ 20.000 escritas por dia
- ✅ 20.000 exclusões por dia
- ✅ 10GB de transferência por mês

**Vercel/Netlify (Plano Free)**:
- ✅ Hospedagem ilimitada
- ✅ 100GB de banda por mês
- ✅ SSL gratuito
- ✅ Deploy automático

**Estimativa de capacidade**:
- Com o plano gratuito do Firebase, você pode gerenciar facilmente **1.000+ chamados por mês**
- Suficiente para empresas pequenas e médias

---

## 📞 Suporte e Contato

### Recursos de Ajuda:
- 📚 [Documentação do Firebase](https://firebase.google.com/docs)
- 🎓 [Tutoriais Vercel](https://vercel.com/docs)
- 💬 [Stack Overflow](https://stackoverflow.com)

### Sobre o Desenvolvedor:
Este sistema foi desenvolvido especificamente para resolver o problema de gestão de assistência técnica de scooters elétricas, fornecendo uma solução profissional, gratuita e completa.

---

## 📄 Licença

Este projeto é de código aberto e está disponível para uso comercial e pessoal.

---

## 🎉 Conclusão

Você agora tem um **sistema completo e profissional** de gestão de chamados técnicos, totalmente **gratuito** e pronto para uso. 

### O que você conquistou:
✅ Sistema online e acessível de qualquer lugar  
✅ Interface moderna e profissional  
✅ Gestão completa do fluxo de atendimento  
✅ Histórico e rastreamento de chamados  
✅ Dashboard administrativo com estatísticas  
✅ Zero custo de implementação e hospedagem  

**🚀 Implante agora e revolucione sua assistência técnica!**

---

**Desenvolvido com ❤️ para transformar a gestão de assistência técnica de scooters elétricas**

*Versão 1.0.0 - Dezembro 2024*
