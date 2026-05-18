import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import JSZip from 'jszip';
import {
  Download,
  FolderTree,
  Sparkles,
  Copy,
  Wand2,
  Boxes,
  Smartphone,
  Layers3,
  TerminalSquare,
  Radar,
  Plus,
  FilePlus2,
  FolderPlus,
  Trash2,
  Pencil,
  Save,
  RotateCcw,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import './styles.css';

const projectTypes = ['SaaS','Landing Page','Dashboard','API Backend','App Mobile','IA Generativa','Sistema de Afiliados','Automação','Projeto Custom'];
const stacks = ['React + Vite','Next.js','Node + Express','Python FastAPI','React Native','Flutter','Fullstack Supabase','Custom'];
const aiTargets = ['Claude Code','Cursor','Replit','Codex','Lovable','IA Genérica'];
const modules = ['Auth','Dashboard','Pagamentos','Banco de Dados','Upload','Admin','IA','Landing Page','Notificações','API','Mobile','Docs'];

const templateMap = {
  'SaaS': ['README.md','docs/briefing.md','docs/architecture.md','docs/tasks.md','prompts/master-prompt.md','src/app/.gitkeep','src/components/.gitkeep','src/lib/.gitkeep','src/services/.gitkeep','database/schema.sql','assets/.gitkeep','tests/.gitkeep'],
  'Landing Page': ['README.md','docs/copy.md','docs/references.md','prompts/design-prompt.md','src/sections/.gitkeep','src/components/.gitkeep','src/styles/.gitkeep','assets/images/.gitkeep'],
  'Dashboard': ['README.md','docs/architecture.md','docs/tasks.md','src/app/dashboard/.gitkeep','src/components/charts/.gitkeep','src/components/cards/.gitkeep','src/services/.gitkeep','database/schema.sql'],
  'API Backend': ['README.md','docs/endpoints.md','docs/architecture.md','src/routes/.gitkeep','src/controllers/.gitkeep','src/services/.gitkeep','src/middlewares/.gitkeep','database/schema.sql','tests/api/.gitkeep'],
  'App Mobile': ['README.md','docs/screens.md','docs/navigation.md','src/screens/.gitkeep','src/components/.gitkeep','src/services/.gitkeep','src/store/.gitkeep','assets/icons/.gitkeep'],
  'IA Generativa': ['README.md','docs/model-flow.md','docs/prompts.md','prompts/system-prompt.md','prompts/user-prompt.md','src/ai/.gitkeep','src/pipelines/.gitkeep','src/services/.gitkeep','assets/outputs/.gitkeep'],
  'Sistema de Afiliados': ['README.md','docs/business-rules.md','docs/commission-rules.md','docs/tasks.md','src/app/programs/.gitkeep','src/app/affiliates/.gitkeep','src/app/admin/.gitkeep','src/services/payments.md','database/schema.sql','prompts/master-prompt.md'],
  'Automação': ['README.md','docs/workflows.md','docs/tasks.md','src/workflows/.gitkeep','src/triggers/.gitkeep','src/actions/.gitkeep','src/services/.gitkeep','logs/.gitkeep'],
  'Projeto Custom': ['README.md','docs/briefing.md','docs/architecture.md','docs/tasks.md','prompts/master-prompt.md','src/.gitkeep','assets/.gitkeep']
};

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function slugify(value) {
  return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'meu-projeto';
}

function makeNode(name, type='folder', children=[]) {
  return { id: uid(), name, type, content: '', children, open: true };
}

function nodesFromPaths(paths) {
  const root = [];
  const ensure = (parts, index, list) => {
    const name = parts[index];
    const isLast = index === parts.length - 1;
    const type = isLast && !name.includes('.') ? 'folder' : isLast ? 'file' : 'folder';
    let node = list.find((item) => item.name === name && item.type === type);
    if (!node) {
      node = makeNode(name, type, type === 'folder' ? [] : undefined);
      list.push(node);
    }
    if (!isLast) ensure(parts, index + 1, node.children);
  };
  paths.forEach((path) => ensure(path.split('/'), 0, root));
  return root;
}

function generateFileContent(path, config) {
  const selectedModules = config.modules.length ? config.modules : ['Base'];
  const name = config.name || 'Meu Projeto IA';
  const desc = config.description || 'Projeto organizado para ser desenvolvido por uma IA programadora.';

  if (path.endsWith('README.md')) return `# ${name}\n\n${desc}\n\n## Tipo\n${config.type}\n\n## Stack\n${config.stack}\n\n## IA alvo\n${config.aiTarget}\n\n## Módulos\n${selectedModules.map((m) => `- ${m}`).join('\n')}\n`;
  if (path.includes('architecture')) return `# Arquitetura\n\nProjeto: ${name}\nStack: ${config.stack}\n\n## Direção\n- Separar responsabilidades por pastas.\n- Preservar documentação.\n- Criar componentes pequenos e reutilizáveis.\n- Evitar apagar arquivos sem necessidade.\n`;
  if (path.includes('tasks')) return `# Tasks\n\n${selectedModules.map((m) => `## ${m}\n- [ ] Planejar\n- [ ] Implementar\n- [ ] Testar\n- [ ] Documentar\n`).join('\n')}`;
  if (path.includes('master-prompt')) return `Você é uma IA engenheira de software.\n\nObjetivo: desenvolver o projeto ${name}.\n\nDescrição:\n${desc}\n\nRegras:\n- Siga a stack ${config.stack}.\n- Não apague documentação sem motivo.\n- Trabalhe por etapas.\n- Atualize README.md e docs/tasks.md.\n- Mantenha a arquitetura organizada.\n`;
  if (path.endsWith('.sql')) return '-- Schema inicial do banco de dados\n';
  if (path.endsWith('.md')) return `# ${path.split('/').pop().replace('.md','')}\n\nConteúdo inicial gerado pelo FolderForge AI.\n`;
  return '';
}

function flattenTree(nodes, base='') {
  const files = {};
  nodes.forEach((node) => {
    const path = base ? `${base}/${node.name}` : node.name;
    if (node.type === 'folder') {
      if (!node.children?.length) files[`${path}/.gitkeep`] = '';
      Object.assign(files, flattenTree(node.children || [], path));
    } else {
      files[path] = node.content || '';
    }
  });
  return files;
}

function updateNode(nodes, id, updater) {
  return nodes.map((node) => {
    if (node.id === id) return updater(node);
    if (node.type === 'folder') return { ...node, children: updateNode(node.children || [], id, updater) };
    return node;
  });
}

function addChild(nodes, parentId, child) {
  if (!parentId) return [...nodes, child];
  return updateNode(nodes, parentId, (node) => node.type === 'folder' ? { ...node, open: true, children: [...(node.children || []), child] } : node);
}

function deleteNode(nodes, id) {
  return nodes.filter((node) => node.id !== id).map((node) => node.type === 'folder' ? { ...node, children: deleteNode(node.children || [], id) } : node);
}

function getNodePath(nodes, id, trail=[]) {
  for (const node of nodes) {
    const next = [...trail, node.name];
    if (node.id === id) return next.join('/');
    if (node.type === 'folder') {
      const found = getNodePath(node.children || [], id, next);
      if (found) return found;
    }
  }
  return '';
}

function TreeEditor({ nodes, setNodes, selectedId, setSelectedId }) {
  const [newName, setNewName] = useState('nova-pasta');

  function add(type, parentId = selectedId) {
    const clean = newName.trim() || (type === 'folder' ? 'nova-pasta' : 'novo-arquivo.md');
    const name = type === 'file' && !clean.includes('.') ? `${clean}.md` : clean;
    setNodes((prev) => addChild(prev, parentId, makeNode(name, type, type === 'folder' ? [] : undefined)));
    setNewName(type === 'folder' ? 'nova-pasta' : 'novo-arquivo.md');
  }

  function rename(id) {
    const name = prompt('Novo nome:');
    if (!name) return;
    setNodes((prev) => updateNode(prev, id, (node) => ({ ...node, name: name.trim() || node.name })));
  }

  function render(nodes, depth=0) {
    return nodes.map((node) => (
      <div key={node.id} className="builder-row-wrap">
        <div className={selectedId === node.id ? 'builder-row selected' : 'builder-row'} style={{ '--depth': depth }} onClick={() => setSelectedId(node.id)}>
          <button className="icon-button" onClick={(e) => { e.stopPropagation(); if (node.type === 'folder') setNodes((prev) => updateNode(prev, node.id, (n) => ({ ...n, open: !n.open }))); }}>
            {node.type === 'folder' ? (node.open ? <ChevronDown size={14}/> : <ChevronRight size={14}/>) : '◇'}
          </button>
          <span className="node-symbol">{node.type === 'folder' ? '▣' : '◇'}</span>
          <span className="node-name">{node.name}</span>
          <div className="row-actions">
            {node.type === 'folder' && <button title="Adicionar arquivo" onClick={(e) => { e.stopPropagation(); add('file', node.id); }}><FilePlus2 size={14}/></button>}
            {node.type === 'folder' && <button title="Adicionar pasta" onClick={(e) => { e.stopPropagation(); add('folder', node.id); }}><FolderPlus size={14}/></button>}
            <button title="Renomear" onClick={(e) => { e.stopPropagation(); rename(node.id); }}><Pencil size={14}/></button>
            <button title="Excluir" onClick={(e) => { e.stopPropagation(); setNodes((prev) => deleteNode(prev, node.id)); }}><Trash2 size={14}/></button>
          </div>
        </div>
        {node.type === 'folder' && node.open && <div>{render(node.children || [], depth + 1)}</div>}
      </div>
    ));
  }

  return (
    <div className="tree-builder">
      <div className="builder-toolbar">
        <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="nome-da-pasta-ou-arquivo.md" />
        <button onClick={() => add('folder', null)}><FolderPlus size={16}/> Pasta raiz</button>
        <button onClick={() => add('file', null)}><FilePlus2 size={16}/> Arquivo raiz</button>
        <button onClick={() => add('folder')}><Plus size={16}/> Dentro do selecionado</button>
      </div>
      <div className="builder-tree">
        {nodes.length ? render(nodes) : <div className="empty-state">Comece adicionando uma pasta raiz.</div>}
      </div>
    </div>
  );
}

function App() {
  const [config, setConfig] = useState({
    name: 'Meu Projeto IA', type: 'SaaS', stack: 'React + Vite', aiTarget: 'Claude Code', modules: ['Auth','Dashboard','IA'], description: 'Um projeto organizado para ser entregue a uma IA programadora.'
  });
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [installPrompt, setInstallPrompt] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [nodes, setNodes] = useState(() => nodesFromPaths(templateMap['SaaS']));
  const [savedAt, setSavedAt] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('folderforge-tree');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        setConfig(data.config || config);
        setNodes(data.nodes || nodesFromPaths(templateMap['SaaS']));
      } catch {}
    }

    if ('serviceWorker' in navigator) navigator.serviceWorker.register('/sw.js').catch(() => {});
    const handle = (event) => { event.preventDefault(); setInstallPrompt(event); };
    window.addEventListener('beforeinstallprompt', handle);
    return () => window.removeEventListener('beforeinstallprompt', handle);
  }, []);

  const projectSlug = useMemo(() => slugify(config.name), [config.name]);
  const files = useMemo(() => {
    const flat = flattenTree(nodes);
    return Object.fromEntries(Object.entries(flat).map(([path, content]) => [path, content || generateFileContent(path, config)]));
  }, [nodes, config]);
  const selectedPath = useMemo(() => getNodePath(nodes, selectedId), [nodes, selectedId]);

  function applyTemplate(type) {
    setConfig((prev) => ({ ...prev, type }));
    setNodes(nodesFromPaths(templateMap[type] || templateMap['Projeto Custom']));
    setSelectedId(null);
  }

  function toggleModule(module) {
    setConfig((prev) => ({ ...prev, modules: prev.modules.includes(module) ? prev.modules.filter((item) => item !== module) : [...prev.modules, module] }));
  }

  function saveLocal() {
    localStorage.setItem('folderforge-tree', JSON.stringify({ config, nodes }));
    setSavedAt(new Date().toLocaleTimeString());
  }

  function resetTree() {
    if (!confirm('Resetar a árvore atual para o template selecionado?')) return;
    setNodes(nodesFromPaths(templateMap[config.type] || templateMap['Projeto Custom']));
  }

  async function downloadZip() {
    const zip = new JSZip();
    Object.entries(files).forEach(([path, content]) => zip.file(`${projectSlug}/${path}`, content));
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${projectSlug}.zip`;
    link.click();
    URL.revokeObjectURL(url);
  }

  async function copyPrompt() {
    const prompt = generateFileContent('prompts/master-prompt.md', config) + `\n\nEstrutura do projeto:\n${Object.keys(files).map((p) => `- ${p}`).join('\n')}`;
    await navigator.clipboard.writeText(prompt);
    alert('Prompt mestre copiado.');
  }

  async function installApp() {
    if (!installPrompt) { alert('No Android, use o menu do navegador e toque em Instalar app ou Adicionar à tela inicial.'); return; }
    installPrompt.prompt(); await installPrompt.userChoice; setInstallPrompt(null);
  }

  function updateParallax(event) {
    const x = (event.clientX / window.innerWidth - 0.5) * 24;
    const y = (event.clientY / window.innerHeight - 0.5) * 24;
    setTilt({ x, y });
  }

  return (
    <main className="app-shell" onMouseMove={updateParallax} style={{ '--mx': `${tilt.x}px`, '--my': `${tilt.y}px` }}>
      <div className="cyber-bg" aria-hidden="true"><div className="grid-layer grid-layer-a"/><div className="grid-layer grid-layer-b"/><div className="orb orb-one"/><div className="orb orb-two"/><div className="scanline"/></div>
      <nav className="topbar"><div className="brand"><img src="/icons/icon-72.png" alt=""/> FolderForge<span>AI</span></div><div className="status-pill"><Radar size={15}/> Architecture Tree Builder</div></nav>

      <section className="hero">
        <div className="hero-copy hologram-card">
          <div className="eyebrow"><Sparkles size={16}/> PROJECT ARCHITECT MODE</div>
          <h1>Crie árvores de projeto e arquiteturas prontas para IA.</h1>
          <p>Monte pastas, arquivos, documentação, prompts e tasks em uma árvore visual. Depois exporte tudo em ZIP e entregue para Claude, Cursor, Replit ou outra IA programadora.</p>
          <div className="hero-actions"><button onClick={downloadZip} className="primary"><Download size={18}/> Baixar ZIP</button><button onClick={saveLocal} className="secondary"><Save size={18}/> Salvar</button><button onClick={copyPrompt} className="secondary"><Copy size={18}/> Copiar prompt</button><button onClick={installApp} className="secondary"><Smartphone size={18}/> Instalar PWA</button></div>
          {savedAt && <p className="save-note">Salvo localmente às {savedAt}</p>}
        </div>
        <aside className="stat-card hologram-card"><img className="app-emblem" src="/icons/icon-192.png" alt="Logo"/><div className="stat-glow"><Boxes size={34}/></div><strong>{Object.keys(files).length}</strong><span>arquivos exportáveis</span><div className="mini-terminal"><span>$ tree --project {projectSlug}</span><span>selected: {selectedPath || 'root'}</span></div></aside>
      </section>

      <section className="grid">
        <div className="panel form-panel hologram-card">
          <h2><Wand2 size={20}/> Configuração</h2>
          <label>Nome do projeto</label><input value={config.name} onChange={(e) => setConfig({ ...config, name: e.target.value })}/>
          <label>Template</label><div className="template-grid">{projectTypes.map((item) => <button key={item} onClick={() => applyTemplate(item)} className={config.type === item ? 'template-chip active' : 'template-chip'}>{item}</button>)}</div>
          <label>Stack</label><select value={config.stack} onChange={(e) => setConfig({ ...config, stack: e.target.value })}>{stacks.map((item) => <option key={item}>{item}</option>)}</select>
          <label>IA alvo</label><select value={config.aiTarget} onChange={(e) => setConfig({ ...config, aiTarget: e.target.value })}>{aiTargets.map((item) => <option key={item}>{item}</option>)}</select>
          <label>Descrição</label><textarea value={config.description} onChange={(e) => setConfig({ ...config, description: e.target.value })}/>
          <label>Módulos</label><div className="chips">{modules.map((module) => <button key={module} onClick={() => toggleModule(module)} className={config.modules.includes(module) ? 'chip active' : 'chip'}>{module}</button>)}</div>
        </div>

        <div className="panel preview-panel hologram-card">
          <h2><FolderTree size={20}/> Editor visual da árvore</h2>
          <div className="terminal-header"><span/><span/><span/><p>/{projectSlug}</p></div>
          <TreeEditor nodes={nodes} setNodes={setNodes} selectedId={selectedId} setSelectedId={setSelectedId}/>
          <div className="tree-footer"><button onClick={resetTree} className="secondary danger-soft"><RotateCcw size={16}/> Resetar template</button><button onClick={downloadZip} className="primary"><Download size={16}/> Exportar árvore</button></div>
        </div>
      </section>

      <section className="panel docs-panel hologram-card">
        <h2><TerminalSquare size={20}/> Arquivos que serão exportados</h2>
        <pre>{Object.keys(files).map((path) => `${projectSlug}/${path}`).join('\n')}</pre>
      </section>
      <section className="feature-strip"><div><Layers3 size={18}/> Templates modulares</div><div><FolderTree size={18}/> Editor de árvore</div><div><Sparkles size={18}/> Prompt pronto para IA</div></section>
    </main>
  );
}

createRoot(document.getElementById('root')).render(<App />);
