# 🎨 Guia de Personalização do Sistema

## Customize o sistema de acordo com sua empresa

---

## 🏷️ Nome da Empresa e Logo

### Navbar (Todas as páginas)

**Arquivo**: `index.html`, `consultar.html`, `admin.html`

**Encontre**:
```html
<div class="nav-brand">
    <i class="fas fa-motorcycle"></i>
    <span>Assistência Técnica</span>
</div>
```

**Mude para**:
```html
<div class="nav-brand">
    <i class="fas fa-motorcycle"></i>
    <span>SUA EMPRESA AQUI</span>
</div>
```

Ou adicione sua logo:
```html
<div class="nav-brand">
    <img src="images/logo.png" alt="Logo" style="height: 40px;">
    <span>SUA EMPRESA</span>
</div>
```

---

## 🎨 Cores da Empresa

### Arquivo de Cores Principal

**Arquivo**: `css/style.css`

**Encontre** (no topo do arquivo):
```css
:root {
    --primary-color: #0891b2;      /* Azul principal */
    --primary-dark: #0e7490;       /* Azul escuro */
    --secondary-color: #10b981;    /* Verde */
    --secondary-dark: #059669;     /* Verde escuro */
    --accent-color: #06b6d4;       /* Azul claro */
}
```

### Exemplos de Paletas de Cores:

#### 🔵 Azul Corporativo (Padrão Atual)
```css
--primary-color: #0891b2;
--primary-dark: #0e7490;
--secondary-color: #10b981;
```

#### 🟢 Verde Sustentável
```css
--primary-color: #059669;
--primary-dark: #047857;
--secondary-color: #10b981;
```

#### 🔴 Vermelho Energia
```css
--primary-color: #dc2626;
--primary-dark: #b91c1c;
--secondary-color: #f59e0b;
```

#### 🟣 Roxo Moderno
```css
--primary-color: #7c3aed;
--primary-dark: #6d28d9;
--secondary-color: #a78bfa;
```

#### ⚫ Preto e Amarelo
```css
--primary-color: #1f2937;
--primary-dark: #111827;
--secondary-color: #fbbf24;
```

---

## 📝 Textos e Títulos

### Página Principal (index.html)

**Hero Section**:
```html
<h1><i class="fas fa-tools"></i> Assistência Técnica Especializada</h1>
<p>Resolva problemas da sua scooter elétrica de forma rápida e eficiente</p>
```

**Mude para**:
```html
<h1><i class="fas fa-tools"></i> [NOME DA SUA EMPRESA]</h1>
<p>[SEU SLOGAN AQUI]</p>
```

**Cards Informativos**:
```html
<div class="info-card">
    <i class="fas fa-clock"></i>
    <h3>Atendimento Rápido</h3>
    <p>Resposta em até 24 horas úteis</p>
</div>
```

Personalize com seus diferenciais!

---

## 🛴 Modelos de Scooter

### Arquivo: `index.html` e `admin.html`

**Encontre**:
```html
<select id="modelo" name="modelo" required>
    <option value="">Selecione o modelo</option>
    <option value="Modelo A - Urban">Modelo A - Urban</option>
    <option value="Modelo B - Sport">Modelo B - Sport</option>
    <option value="Modelo C - Pro">Modelo C - Pro</option>
    <option value="Modelo D - Max">Modelo D - Max</option>
    <option value="Modelo E - Compact">Modelo E - Compact</option>
    <option value="Modelo F - Premium">Modelo F - Premium</option>
    <option value="Modelo G - Elite">Modelo G - Elite</option>
</select>
```

**Substitua pelos seus modelos reais**:
```html
<option value="Xiaomi Mi Scooter">Xiaomi Mi Scooter</option>
<option value="Segway Ninebot">Segway Ninebot</option>
<option value="[SEU MODELO AQUI]">[SEU MODELO AQUI]</option>
```

⚠️ **IMPORTANTE**: Atualize em **AMBOS** os arquivos (index.html e admin.html)!

---

## 🎨 Cores das Scooters

### Arquivo: `index.html` e `admin.html`

**Encontre**:
```html
<select id="cor" name="cor" required>
    <option value="">Selecione a cor</option>
    <option value="Preto">Preto</option>
    <option value="Branco">Branco</option>
    <option value="Azul">Azul</option>
    <option value="Vermelho">Vermelho</option>
    <option value="Verde">Verde</option>
    <option value="Cinza">Cinza</option>
    <option value="Carbono">Carbono</option>
</select>
```

**Personalize** com as cores que você trabalha.

---

## 🔧 Tipos de Problemas

### Arquivo: `index.html`

**Encontre**:
```html
<select id="tipoProblema" name="tipoProblema" required>
    <option value="">Selecione o tipo</option>
    <option value="Bateria não carrega">Bateria não carrega</option>
    <option value="Motor não funciona">Motor não funciona</option>
    <!-- ... -->
</select>
```

**Adicione ou remova** tipos de problemas conforme sua experiência.

---

## 📧 E-mail de Contato

### Rodapé (Todas as páginas)

**Encontre**:
```html
<footer>
    <div class="container">
        <p>&copy; 2024 Assistência Técnica Scooters Elétricas. Todos os direitos reservados.</p>
    </div>
</footer>
```

**Mude para**:
```html
<footer>
    <div class="container">
        <p>&copy; 2024 [SUA EMPRESA]. Todos os direitos reservados.</p>
        <p>E-mail: contato@suaempresa.com | Tel: (11) 99999-9999</p>
    </div>
</footer>
```

---

## 🔐 Credenciais de Admin

### Arquivo: `js/admin.js`

**Encontre** (por volta da linha 60):
```javascript
if (email === 'admin@assistencia.com' && senha === 'admin123') {
```

**Mude para**:
```javascript
if (email === 'seu@email.com' && senha === 'suaSenhaSegura123') {
```

⚠️ **IMPORTANTE**: Use uma senha forte em produção!

### Atualizar tela de login (admin.html):

**Encontre**:
```html
<div class="login-demo">
    <p><i class="fas fa-info-circle"></i> Usuário demo:</p>
    <p><strong>E-mail:</strong> admin@assistencia.com</p>
    <p><strong>Senha:</strong> admin123</p>
</div>
```

**Opção 1**: Mude para suas credenciais  
**Opção 2**: Remova completamente (para produção)

---

## ⏱️ Período de Garantia

### Arquivo: `js/config.js`

**Encontre**:
```javascript
function verificarGarantia(dataCompra, mesesGarantia = 12) {
```

**Mude** o número 12 para a quantidade de meses de garantia que você oferece:
```javascript
function verificarGarantia(dataCompra, mesesGarantia = 6) {  // 6 meses
```
ou
```javascript
function verificarGarantia(dataCompra, mesesGarantia = 24) {  // 24 meses
```

---

## 🖼️ Adicionar Logo/Imagens

### 1. Crie uma pasta de imagens:

```
projeto/
├── images/
│   ├── logo.png
│   └── favicon.ico
```

### 2. Adicione a logo na navbar:

```html
<div class="nav-brand">
    <img src="images/logo.png" alt="Logo" style="height: 40px; margin-right: 10px;">
    <span>Sua Empresa</span>
</div>
```

### 3. Adicione favicon (ícone da aba):

No `<head>` de todas as páginas HTML:
```html
<link rel="icon" type="image/x-icon" href="images/favicon.ico">
```

---

## 📱 Informações de Contato

### Página de Consulta (consultar.html)

**Encontre** a seção de ajuda:
```html
<div class="help-card">
    <i class="fas fa-headset"></i>
    <h4>Suporte direto</h4>
    <p>Em caso de urgência, entre em contato pelo telefone ou WhatsApp.</p>
</div>
```

**Mude para**:
```html
<div class="help-card">
    <i class="fas fa-headset"></i>
    <h4>Suporte direto</h4>
    <p>WhatsApp: (11) 99999-9999<br>
    E-mail: suporte@suaempresa.com<br>
    Horário: Seg-Sex 9h-18h</p>
</div>
```

---

## 🎭 Ícones

### Mudar ícones do Font Awesome:

Visite: https://fontawesome.com/icons

**Exemplo atual**:
```html
<i class="fas fa-motorcycle"></i>
```

**Opções**:
- `fa-motorcycle` - Moto
- `fa-bolt` - Raio (elétrico)
- `fa-plug` - Tomada
- `fa-battery-full` - Bateria
- `fa-tools` - Ferramentas
- `fa-wrench` - Chave inglesa

---

## 📊 Status Personalizados

### Arquivo: `js/config.js`

**Encontre**:
```javascript
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
```

**Se mudar os nomes dos status**, atualize aqui também!

---

## 🌐 Meta Tags e SEO

### Adicione no `<head>` de cada página:

```html
<meta name="description" content="Sistema de assistência técnica para scooters elétricas - [SUA EMPRESA]">
<meta name="keywords" content="scooter elétrica, assistência técnica, reparo, manutenção">
<meta name="author" content="[SUA EMPRESA]">

<!-- Open Graph (Facebook/WhatsApp) -->
<meta property="og:title" content="Assistência Técnica - [SUA EMPRESA]">
<meta property="og:description" content="Sistema profissional de gestão de chamados técnicos">
<meta property="og:image" content="images/logo.png">
<meta property="og:url" content="https://seusite.com">
```

---

## 📝 Checklist de Personalização

Use esta lista para garantir que personalizou tudo:

- [ ] Nome da empresa na navbar (3 páginas)
- [ ] Logo adicionada (opcional)
- [ ] Cores corporativas atualizadas
- [ ] Modelos de scooter personalizados
- [ ] Cores disponíveis atualizadas
- [ ] Tipos de problemas ajustados
- [ ] Textos e slogans personalizados
- [ ] Informações de contato atualizadas
- [ ] Credenciais de admin alteradas
- [ ] Período de garantia ajustado
- [ ] Rodapé personalizado
- [ ] Favicon adicionado
- [ ] Meta tags configuradas

---

## 🎨 Dica Final

**Mantenha a consistência!** Se mudar o nome da empresa na navbar, mude em todas as páginas. O mesmo vale para cores, ícones e informações de contato.

---

**💡 Lembre-se**: Após fazer alterações, teste todas as funcionalidades para garantir que tudo continua funcionando!
