
// Mock file system for testing
const fs = {
  readFileSync: (path) => {
    // In a real environment, this would read the actual file.
    // For this example, we'll use the content from PERSONALIZACAO.md.
    if (path === 'index.html') {
      return `
        <div class="nav-brand">
            <i class="fas fa-motorcycle"></i>
            <span>Assistência Técnica</span>
        </div>
        <h1><i class="fas fa-tools"></i> Assistência Técnica Especializada</h1>
        <p>Resolva problemas da sua scooter elétrica de forma rápida e eficiente</p>
        <select id="modelo" name="modelo" required>
            <option value="">Selecione o modelo</option>
            <option value="Modelo A - Urban">Modelo A - Urban</option>
        </select>
        <select id="cor" name="cor" required>
            <option value="">Selecione a cor</option>
            <option value="Preto">Preto</option>
        </select>
        <select id="tipoProblema" name="tipoProblema" required>
            <option value="">Selecione o tipo</option>
            <option value="Bateria não carrega">Bateria não carrega</option>
        </select>
        <footer>
            <div class="container">
                <p>&copy; 2024 Assistência Técnica Scooters Elétricas. Todos os direitos reservados.</p>
            </div>
        </footer>
      `;
    }
    if (path === 'consultar.html') {
      return `
        <div class="nav-brand">
            <i class="fas fa-motorcycle"></i>
            <span>Assistência Técnica</span>
        </div>
        <footer>
            <div class="container">
                <p>&copy; 2024 Assistência Técnica Scooters Elétricas. Todos os direitos reservados.</p>
            </div>
        </footer>
      `;
    }
    if (path === 'admin.html') {
      return `
        <div class="nav-brand">
            <i class="fas fa-motorcycle"></i>
            <span>Assistência Técnica</span>
        </div>
        <select id="modelo" name="modelo" required>
            <option value="">Selecione o modelo</option>
            <option value="Modelo A - Urban">Modelo A - Urban</option>
        </select>
        <select id="cor" name="cor" required>
            <option value="">Selecione a cor</option>
            <option value="Preto">Preto</option>
        </select>
        <div class="login-demo">
            <p><i class="fas fa-info-circle"></i> Usuário demo:</p>
            <p><strong>E-mail:</strong> admin@assistencia.com</p>
            <p><strong>Senha:</strong> admin123</p>
        </div>
        <footer>
            <div class="container">
                <p>&copy; 2024 Assistência Técnica Scooters Elétricas. Todos os direitos reservados.</p>
            </div>
        </footer>
      `;
    }
    if (path === 'style.css') {
      return `
        :root {
            --primary-color: #0891b2;
            --primary-dark: #0e7490;
            --secondary-color: #10b981;
            --secondary-dark: #059669;
            --accent-color: #06b6d4;
        }
      `;
    }
    if (path === 'admin.js') {
      return `
        if (email === 'admin@assistencia.com' && senha === 'admin123') {
            // ...
        }
      `;
    }
    if (path === 'config.js') {
      return `
        function verificarGarantia(dataCompra, mesesGarantia = 12) {
            // ...
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
      `;
    }
    return '';
  },
};

const assert = (condition, message) => {
  if (!condition) {
    console.error(`Assertion failed: ${message}`);
  } else {
    console.log(`Assertion passed: ${message}`);
  }
};

// --- Test Cases ---

// 1. Nome da Empresa e Logo (Navbar)
const indexHtml = fs.readFileSync('index.html');
const consultarHtml = fs.readFileSync('consultar.html');
const adminHtml = fs.readFileSync('admin.html');
assert(
  !indexHtml.includes('<span>Assistência Técnica</span>'),
  'Company name should be changed in index.html'
);
assert(
  !consultarHtml.includes('<span>Assistência Técnica</span>'),
  'Company name should be changed in consultar.html'
);
assert(
  !adminHtml.includes('<span>Assistência Técnica</span>'),
  'Company name should be changed in admin.html'
);

// 2. Cores da Empresa (CSS)
const styleCss = fs.readFileSync('style.css');
assert(
  !styleCss.includes('--primary-color: #0891b2;'),
  'Primary color should be changed in style.css'
);

// 3. Textos e Títulos (index.html)
assert(
  !indexHtml.includes('<h1><i class="fas fa-tools"></i> Assistência Técnica Especializada</h1>'),
  'Hero title should be changed in index.html'
);
assert(
  !indexHtml.includes('<p>Resolva problemas da sua scooter elétrica de forma rápida e eficiente</p>'),
  'Hero slogan should be changed in index.html'
);

// 4. Modelos de Scooter (index.html, admin.html)
assert(
  !indexHtml.includes('<option value="Modelo A - Urban">Modelo A - Urban</option>'),
  'Scooter models should be changed in index.html'
);
assert(
  !adminHtml.includes('<option value="Modelo A - Urban">Modelo A - Urban</option>'),
  'Scooter models should be changed in admin.html'
);

// 5. Cores das Scooters (index.html, admin.html)
assert(
  !indexHtml.includes('<option value="Preto">Preto</option>'),
  'Scooter colors should be changed in index.html'
);
assert(
  !adminHtml.includes('<option value="Preto">Preto</option>'),
  'Scooter colors should be changed in admin.html'
);

// 6. Tipos de Problemas (index.html)
assert(
  !indexHtml.includes('<option value="Bateria não carrega">Bateria não carrega</option>'),
  'Problem types should be changed in index.html'
);

// 7. E-mail de Contato (Rodapé)
assert(
  !indexHtml.includes('<p>&copy; 2024 Assistência Técnica Scooters Elétricas. Todos os direitos reservados.</p>'),
  'Footer should be changed in index.html'
);
assert(
  !consultarHtml.includes('<p>&copy; 2024 Assistência Técnica Scooters Elétricas. Todos os direitos reservados.</p>'),
  'Footer should be changed in consultar.html'
);
assert(
  !adminHtml.includes('<p>&copy; 2024 Assistência Técnica Scooters Elétricas. Todos os direitos reservados.</p>'),
  'Footer should be changed in admin.html'
);

// 8. Credenciais de Admin (admin.js)
const adminJs = fs.readFileSync('admin.js');
assert(
  !adminJs.includes("email === 'admin@assistencia.com' && senha === 'admin123'"),
  'Admin credentials should be changed in admin.js'
);
assert(
  !adminHtml.includes('<strong>E-mail:</strong> admin@assistencia.com'),
  'Demo credentials should be removed from admin.html'
);

// 9. Período de Garantia (config.js)
const configJs = fs.readFileSync('config.js');
assert(
  !configJs.includes('mesesGarantia = 12'),
  'Warranty period should be changed in config.js'
);

// 10. Status Personalizados (config.js)
assert(
  !configJs.includes("'Novo': 'status-novo'"),
  'Custom statuses should be changed in config.js'
);

console.log('All tests executed.');
