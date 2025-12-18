# 🚀 Início Rápido - 5 Minutos

## ⚡ Configure seu sistema em 5 passos simples

---

### 1️⃣ Criar Projeto Firebase (2 minutos)

1. Acesse: https://console.firebase.google.com/
2. Clique em **"Adicionar projeto"**
3. Nome: `assistencia-scooters` (ou outro nome)
4. Desmarque Google Analytics
5. Clique em **"Criar projeto"**

✅ **Projeto criado!**

---

### 2️⃣ Ativar Firestore (1 minuto)

1. Menu lateral: **"Firestore Database"**
2. Clique em **"Criar banco de dados"**
3. Modo: **"Iniciar no modo de produção"**
4. Localização: **"southamerica-east1 (São Paulo)"**
5. Clique em **"Ativar"**

✅ **Banco de dados ativado!**

---

### 3️⃣ Configurar Regras (30 segundos)

1. Ainda no Firestore, clique em **"Regras"**
2. Cole este código:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /chamados/{chamado} {
      allow create, read, update: if true;
    }
  }
}
```

3. Clique em **"Publicar"**

✅ **Regras configuradas!**

---

### 4️⃣ Copiar Credenciais (1 minuto)

1. Clique no ícone **⚙️** > **"Configurações do projeto"**
2. Role até **"Seus aplicativos"**
3. Clique no ícone **"</>"** (Web)
4. Nome: `Assistencia Web`
5. **NÃO** marque Firebase Hosting
6. Clique em **"Registrar app"**
7. **COPIE as credenciais** que aparecem

✅ **Credenciais copiadas!**

---

### 5️⃣ Configurar o Sistema (30 segundos)

1. Abra o arquivo **`js/config.js`**
2. Encontre esta parte:

```javascript
const firebaseConfig = {
    apiKey: "SUA_API_KEY_AQUI",
    authDomain: "SEU_PROJECT_ID.firebaseapp.com",
    projectId: "SEU_PROJECT_ID",
    // ...
};
```

3. **Substitua** pelas suas credenciais do passo 4
4. **Salve o arquivo**

✅ **Sistema configurado!**

---

## 🎉 Pronto! Seu sistema está funcionando!

### Agora teste:

1. **Abra `index.html`** no navegador
2. **Preencha o formulário** com dados de teste
3. **Clique em "Enviar Chamado"**
4. **Veja o número do protocolo** gerado

✅ Se apareceu o protocolo, está funcionando!

---

## 🔍 Testar Consulta

1. **Abra `consultar.html`**
2. **Digite o protocolo** recebido
3. **Clique em "Buscar"**

✅ Se apareceram os dados, a consulta funciona!

---

## 👨‍💼 Testar Painel Admin

1. **Abra `admin.html`**
2. **Login**:
   - E-mail: `admin@assistencia.com`
   - Senha: `admin123`
3. **Veja o dashboard** com estatísticas
4. **Clique no ícone 👁️** para ver detalhes
5. **Atualize o status** e salve

✅ Se conseguiu atualizar, tudo está funcionando!

---

## 🌐 Fazer Deploy (Opcional)

### Opção mais fácil - Vercel:

1. Acesse: https://vercel.com
2. Crie conta (pode usar GitHub)
3. Clique em **"New Project"**
4. **Arraste a pasta do projeto**
5. Clique em **"Deploy"**

🎉 **Pronto! Seu site está online!**

URL: `https://seu-projeto.vercel.app`

---

## 📚 Precisa de mais ajuda?

- **Guia completo**: Leia `GUIA_FIREBASE.md`
- **Dados de teste**: Veja `DADOS_TESTE.md`
- **Documentação**: Confira `README.md`

---

## 🆘 Problemas?

### Erro ao criar chamado?
- Verifique se as credenciais estão corretas em `js/config.js`
- Abra o Console do navegador (F12) para ver erros

### Chamado não aparece?
- Verifique as regras do Firestore (passo 3)
- Veja se o chamado aparece no Firebase Console

### Precisa de ajuda?
- Revise o `GUIA_FIREBASE.md` passo a passo
- Veja a seção "Problemas Comuns" no README.md

---

**⏱️ Tempo total: ~5 minutos**  
**💰 Custo: R$ 0,00 (100% gratuito)**  
**🎯 Resultado: Sistema completo funcionando!**

---

🚀 **Sucesso! Comece a usar seu sistema agora mesmo!**
