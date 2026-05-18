import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import JSZip from 'jszip';
import { Download, FolderTree, Sparkles, Copy, Wand2, Boxes, Smartphone, Cpu, Layers3, TerminalSquare, Radar } from 'lucide-react';
import './styles.css';

const projectTypes = [
  'SaaS',
  'Landing Page',
  'Dashboard',
  'API Backend',
  'App Mobile',
  'IA Generativa',
  'Sistema de Afiliados',
  'Automação'
];

const stacks = ['React + Vite', 'Next.js', 'Node + Express', 'Python FastAPI', 'React Native', 'Flutter', 'Fullstack Supabase'];
const aiTargets = ['Claude Code', 'Cursor', 'Replit', 'Codex', 'Lovable', 'IA Genérica'];
const modules = ['Auth', 'Dashboard', 'Pagamentos', 'Banco de Dados', 'Upload', 'Admin', 'IA', 'Landing Page', 'Notificações'];

function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'meu-projeto';
}

function buildStructure(config) {
  const projectSlug = slugify(config.name);
  const selectedModules = config.modules.length ? config.modules : ['Base'];

  const docs = {
    'README.md': `# ${config.name}\n\nProjeto base gerado pelo FolderForge AI.\n\n## Tipo\n${config.type}\n\n## Stack\n${config.stack}\n\n## IA alvo\n${config.aiTarget}\n\n## Módulos\n${selectedModules.map((m) => `- ${m}`).join('\n')}\n`,
    'docs/briefing.md': `# Briefing\n\n## Ideia\n${config.description || 'Descreva aqui a ideia central do projeto.'}\n\n## Objetivo\nCriar uma base organizada para uma IA desenvolver o produto com clareza.\n`,
    'docs/architecture.md': `# Arquitetura\n\nStack escolhida: ${config.stack}\n\nOrganização sugerida:\n- frontend em src/app e src/components\n- regras em src/lib\n- serviços externos em src/services\n- documentação em docs\n- prompts em prompts\n`,
    'docs/roadmap.md': `# Roadmap\n\n## MVP\n- Criar layout inicial\n- Implementar módulos selecionados\n- Conectar persistência\n- Validar fluxo principal\n\n## Próximas versões\n- Melhorar UI\n- Criar testes\n- Adicionar logs\n- Preparar deploy\n`,
    'docs/tasks.md': `# Tasks\n\n${selectedModules.map((m) => `## ${m}\n- [ ] Definir requisitos\n- [ ] Criar componentes\n- [ ] Integrar com dados\n- [ ] Testar fluxo\n`).join('\n')}`,
    'prompts/master-prompt.md': `Você é uma IA engenheira de software.\n\nLeia toda a estrutura do projeto e desenvolva o produto do início ao fim.\n\nRegras:\n- Não apague arquivos de documentação sem necessidade.\n- Siga a stack: ${config.stack}.\n- Priorize o MVP.\n- Crie código limpo, modular e fácil de evoluir.\n- Sempre atualize README.md e docs/tasks.md conforme implementar.\n\nDescrição do projeto:\n${config.description || 'Projeto ainda sem descrição detalhada.'}\n`,
    'prompts/frontend-prompt.md': `Crie o frontend com visual moderno, responsivo, organizado e coerente com o tipo de projeto: ${config.type}.`,
    'prompts/backend-prompt.md': `Crie a camada backend/serviços necessária para os módulos: ${selectedModules.join(', ')}.`,
    '.env.example': '# Adicione variáveis de ambiente aqui\n',
    'src/app/.gitkeep': '',
    'src/components/.gitkeep': '',
    'src/lib/.gitkeep': '',
    'src/services/.gitkeep': '',
    'src/styles/.gitkeep': '',
    'database/schema.sql': '-- Escreva o schema do banco aqui\n',
    'assets/.gitkeep': '',
    'tests/.gitkeep': ''
  };

  if (config.stack.includes('React') || config.stack.includes('Next')) {
    docs['src/components/ui-notes.md'] = '# UI Notes\n\nUse componentes reutilizáveis, cards, sidebar, estados vazios e design responsivo.\n';
  }

  return { projectSlug, files: docs };
}

function treeFromFiles(files) {
  const root = {};
  Object.keys(files).forEach((path) => {
    const parts = path.split('/');
    let node = root;
    parts.forEach((part, index) => {
      node[part] ??= index === parts.length - 1 ? null : {};
      if (node[part] !== null) node = node[part];
    });
  });
  return root;
}

function renderTree(node, depth = 0) {
  return Object.entries(node).map(([name, child]) => (
    <div key={`${depth}-${name}`} style={{ '--depth': depth }} className="tree-line">
      <span className="tree-icon">{child === null ? '◇' : '▣'}</span>
      <span>{name}</span>
      {child && renderTree(child, depth + 1)}
    </div>
  ));
}

function App() {
  const [config, setConfig] = useState({
    name: 'Meu Projeto IA',
    type: 'SaaS',
    stack: 'React + Vite',
    aiTarget: 'Claude Code',
    modules: ['Auth', 'Dashboard', 'IA'],
    description: 'Um projeto organizado para ser entregue a uma IA programadora.'
  });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [installPrompt, setInstallPrompt] = useState(null);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }

    const handleBeforeInstallPrompt = (event) => {
      event.preventDefault();
      setInstallPrompt(event);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const structure = useMemo(() => buildStructure(config), [config]);
  const tree = useMemo(() => treeFromFiles(structure.files), [structure]);

  function toggleModule(module) {
    setConfig((prev) => ({
      ...prev,
      modules: prev.modules.includes(module)
        ? prev.modules.filter((item) => item !== module)
        : [...prev.modules, module]
    }));
  }

  async function downloadZip() {
    const zip = new JSZip();
    Object.entries(structure.files).forEach(([path, content]) => {
      zip.file(`${structure.projectSlug}/${path}`, content);
    });
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${structure.projectSlug}.zip`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function copyPrompt() {
    await navigator.clipboard.writeText(structure.files['prompts/master-prompt.md']);
    alert('Prompt mestre copiado.');
  }

  async function installApp() {
    if (!installPrompt) {
      alert('No Android, abra o menu do navegador e toque em Instalar app ou Adicionar à tela inicial.');
      return;
    }
    installPrompt.prompt();
    await installPrompt.userChoice;
    setInstallPrompt(null);
  }

  function updateParallax(event) {
    const x = (event.clientX / window.innerWidth - 0.5) * 24;
    const y = (event.clientY / window.innerHeight - 0.5) * 24;
    setTilt({ x, y });
  }

  return (
    <main className="app-shell" onMouseMove={updateParallax} style={{ '--mx': `${tilt.x}px`, '--my': `${tilt.y}px` }}>
      <div className="cyber-bg" aria-hidden="true">
        <div className="grid-layer grid-layer-a" />
        <div className="grid-layer grid-layer-b" />
        <div className="orb orb-one" />
        <div className="orb orb-two" />
        <div className="scanline" />
      </div>

      <nav className="topbar">
        <div className="brand"><img src="/icons/icon-72.png" alt="" /> FolderForge<span>AI</span></div>
        <div className="status-pill"><Radar size={15} /> Cyber Skeleton Builder</div>
      </nav>

      <section className="hero">
        <div className="hero-copy hologram-card">
          <div className="eyebrow"><Sparkles size={16} /> PROJECT ARCHITECT MODE</div>
          <h1>Monte estruturas prontas para uma IA começar a codar.</h1>
          <p>Transforme uma ideia em pastas, arquivos-guia, documentação, prompts e tasks. A IA recebe o terreno limpo, iluminado e com a planta na mesa.</p>
          <div className="hero-actions">
            <button onClick={downloadZip} className="primary"><Download size={18} /> Baixar ZIP</button>
            <button onClick={installApp} className="secondary"><Smartphone size={18} /> Instalar PWA</button>
            <button onClick={copyPrompt} className="secondary"><Copy size={18} /> Copiar prompt</button>
          </div>
        </div>

        <aside className="stat-card hologram-card">
          <img className="app-emblem" src="/icons/icon-192.png" alt="Logo do app" />
          <div className="stat-glow"><Boxes size={34} /></div>
          <strong>{Object.keys(structure.files).length}</strong>
          <span>arquivos e marcadores gerados</span>
          <div className="mini-terminal">
            <span>$ forge --target {config.aiTarget}</span>
            <span>status: ready_to_ship</span>
          </div>
        </aside>
      </section>

      <section className="grid">
        <div className="panel form-panel hologram-card">
          <h2><Wand2 size={20} /> Configuração</h2>
          <label>Nome do projeto</label>
          <input value={config.name} onChange={(e) => setConfig({ ...config, name: e.target.value })} />

          <label>Tipo de projeto</label>
          <select value={config.type} onChange={(e) => setConfig({ ...config, type: e.target.value })}>
            {projectTypes.map((item) => <option key={item}>{item}</option>)}
          </select>

          <label>Stack</label>
          <select value={config.stack} onChange={(e) => setConfig({ ...config, stack: e.target.value })}>
            {stacks.map((item) => <option key={item}>{item}</option>)}
          </select>

          <label>IA alvo</label>
          <select value={config.aiTarget} onChange={(e) => setConfig({ ...config, aiTarget: e.target.value })}>
            {aiTargets.map((item) => <option key={item}>{item}</option>)}
          </select>

          <label>Descrição</label>
          <textarea value={config.description} onChange={(e) => setConfig({ ...config, description: e.target.value })} />

          <label>Módulos</label>
          <div className="chips">
            {modules.map((module) => (
              <button key={module} onClick={() => toggleModule(module)} className={config.modules.includes(module) ? 'chip active' : 'chip'}>
                {module}
              </button>
            ))}
          </div>
        </div>

        <div className="panel preview-panel hologram-card">
          <h2><FolderTree size={20} /> Preview da estrutura</h2>
          <div className="terminal-header">
            <span /> <span /> <span />
            <p>/{structure.projectSlug}</p>
          </div>
          <div className="tree-root">{renderTree({ [structure.projectSlug]: tree })}</div>
        </div>
      </section>

      <section className="panel docs-panel hologram-card">
        <h2><TerminalSquare size={20} /> Prompt mestre gerado</h2>
        <pre>{structure.files['prompts/master-prompt.md']}</pre>
      </section>

      <section className="feature-strip">
        <div><Layers3 size={18} /> Templates modulares</div>
        <div><FolderTree size={18} /> Árvore exportável</div>
        <div><Sparkles size={18} /> Prompt pronto para IA</div>
      </section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
