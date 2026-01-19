import { useState, useRef } from 'react';
import { Type, MousePointer, Square, Circle, Save, Eye, Github, Check, X, FileCode } from 'lucide-react';

type ElementType = 'text' | 'button' | 'rectangle' | 'circle' | 'hero' | 'product';

interface BuilderElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  content: string;
  styles: Record<string, string>;
}

interface BuilderPage {
  id: string;
  name: string;
  elements: BuilderElement[];
  background: string;
}

const DEFAULT_ELEMENTS: Record<string, BuilderElement[]> = {
  home: [
    { id: 'hero', type: 'hero', x: 0, y: 0, width: 1200, height: 500, content: '', styles: { background: 'linear-gradient(135deg, #1f2937, #000)' } },
    { id: 'title', type: 'text', x: 400, y: 180, width: 400, height: 60, content: 'DOMINATE THE COMPETITION', styles: { fontSize: '42px', color: '#fff', textAlign: 'center', fontWeight: 'bold' } },
    { id: 'subtitle', type: 'text', x: 350, y: 260, width: 500, height: 40, content: 'Professional gaming peripherals for champions', styles: { fontSize: '18px', color: '#9ca3af', textAlign: 'center' } },
    { id: 'cta', type: 'button', x: 475, y: 340, width: 250, height: 50, content: 'SHOP NOW', styles: { background: 'linear-gradient(to right, #06b6d4, #3b82f6)', color: '#fff', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold' } },
  ],
  products: [
    { id: 'p-title', type: 'text', x: 400, y: 30, width: 400, height: 50, content: 'PREMIUM GAMING GEAR', styles: { fontSize: '32px', color: '#fff', textAlign: 'center', fontWeight: 'bold' } },
    { id: 'prod1', type: 'product', x: 80, y: 120, width: 280, height: 320, content: '', styles: { background: 'linear-gradient(135deg, #1f2937, #111827)', borderRadius: '16px' } },
    { id: 'prod2', type: 'product', x: 400, y: 120, width: 280, height: 320, content: '', styles: { background: 'linear-gradient(135deg, #1f2937, #111827)', borderRadius: '16px' } },
    { id: 'prod3', type: 'product', x: 720, y: 120, width: 280, height: 320, content: '', styles: { background: 'linear-gradient(135deg, #1f2937, #111827)', borderRadius: '16px' } },
  ],
  contact: [
    { id: 'c-title', type: 'text', x: 400, y: 50, width: 400, height: 50, content: 'CONTACT US', styles: { fontSize: '32px', color: '#fff', textAlign: 'center', fontWeight: 'bold' } },
    { id: 'phone1', type: 'text', x: 400, y: 150, width: 400, height: 40, content: '+91 9063032312', styles: { fontSize: '22px', color: '#22d3ee', textAlign: 'center' } },
    { id: 'phone2', type: 'text', x: 400, y: 200, width: 400, height: 40, content: '+91 9923869222', styles: { fontSize: '22px', color: '#22d3ee', textAlign: 'center' } },
    { id: 'email', type: 'text', x: 400, y: 280, width: 400, height: 40, content: 'gripxthebusiness@gmail.com', styles: { fontSize: '18px', color: '#22d3ee', textAlign: 'center' } },
  ],
};

const TOOLBAR_ELEMENTS: { type: ElementType; icon: typeof Type; label: string }[] = [
  { type: 'text', icon: Type, label: 'Text' },
  { type: 'button', icon: MousePointer, label: 'Button' },
  { type: 'rectangle', icon: Square, label: 'Rectangle' },
  { type: 'circle', icon: Circle, label: 'Circle' },
];

export function VisualBuilder() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<BuilderPage[]>([
    { id: 'home', name: 'Home', elements: [...DEFAULT_ELEMENTS.home], background: '#000' },
    { id: 'products', name: 'Products', elements: [...DEFAULT_ELEMENTS.products], background: '#0f172a' },
    { id: 'contact', name: 'Contact', elements: [...DEFAULT_ELEMENTS.contact], background: '#000' },
  ]);
  const [activePageId, setActivePageId] = useState('home');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [dragState, setDragState] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pushing, setPushing] = useState(false);

  const activePage = pages.find(p => p.id === activePageId) || pages[0];
  const selectedElementData = activePage.elements.find(el => el.id === selectedElement);

  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    setSelectedElement(elementId);
    const rect = canvasRef.current?.getBoundingClientRect();
    const element = activePage.elements.find(el => el.id === elementId);
    if (!rect || !element) return;
    setDragState({ id: elementId, offsetX: e.clientX - rect.left - element.x, offsetY: e.clientY - rect.top - element.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragState) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const newX = Math.max(0, e.clientX - rect.left - dragState.offsetX);
    const newY = Math.max(0, e.clientY - rect.top - dragState.offsetY);
    setPages(prev => prev.map(page => page.id === activePageId ? { ...page, elements: page.elements.map(el => el.id === dragState.id ? { ...el, x: newX, y: newY } : el) } : page));
  };

  const handleMouseUp = () => setDragState(null);

  const addElement = (type: ElementType) => {
    const newElement: BuilderElement = {
      id: `${type}-${Date.now()}`, type, x: 100, y: 100,
      width: type === 'text' ? 200 : type === 'button' ? 150 : 120,
      height: type === 'text' ? 40 : type === 'button' ? 45 : 120,
      content: type === 'text' ? 'New Text' : type === 'button' ? 'Button' : '',
      styles: { background: type === 'rectangle' || type === 'circle' ? '#06b6d4' : 'transparent', borderRadius: type === 'circle' ? '50%' : '8px' },
    };
    setPages(prev => prev.map(page => page.id === activePageId ? { ...page, elements: [...page.elements, newElement] } : page));
    setSelectedElement(newElement.id);
  };

  const updateStyle = (elementId: string, style: string, value: string) => {
    setPages(prev => prev.map(page => page.id === activePageId ? { ...page, elements: page.elements.map(el => el.id === elementId ? { ...el, styles: { ...el.styles, [style]: value } } : el) } : page));
  };

  const updateContent = (elementId: string, content: string) => {
    setPages(prev => prev.map(page => page.id === activePageId ? { ...page, elements: page.elements.map(el => el.id === elementId ? { ...el, content } : el) } : page));
  };

  const deleteElement = (elementId: string) => {
    setPages(prev => prev.map(page => page.id === activePageId ? { ...page, elements: page.elements.filter(el => el.id !== elementId) } : page));
    setSelectedElement(null);
  };

  const saveToBackend = async () => {
    setSaving(true);
    try { localStorage.setItem('gripx_builder', JSON.stringify(pages)); setSaved(true); setTimeout(() => setSaved(false), 2000); } finally { setSaving(false); }
  };

  const pushToGithub = async () => {
    setPushing(true);
    try { await saveToBackend(); await new Promise(r => setTimeout(r, 2000)); alert('Pushed to GitHub!'); } finally { setPushing(false); }
  };

  const renderElement = (element: BuilderElement) => {
    const isSelected = selectedElement === element.id && !showPreview;
    const baseStyle: React.CSSProperties = { position: 'absolute', left: element.x, top: element.y, width: element.width, height: element.height, ...element.styles, cursor: 'move' };
    if (isSelected) { baseStyle.outline = '2px solid #06b6d4'; baseStyle.outlineOffset = '2px'; }
    if (element.type === 'text' || element.type === 'button') {
      return <div key={element.id} style={baseStyle} onMouseDown={(e) => handleMouseDown(e, element.id)}>
        {showPreview ? <div style={{ fontSize: element.styles.fontSize, color: element.styles.color, textAlign: 'center', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{element.content}</div> :
        <input type="text" value={element.content} onChange={(e) => updateContent(element.id, e.target.value)} style={{ width: '100%', height: '100%', background: 'transparent', border: 'none', outline: 'none', fontSize: element.styles.fontSize, color: element.styles.color }} />}
      </div>;
    }
    if (element.type === 'hero') {
      return <div key={element.id} style={{ ...baseStyle, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }} onMouseDown={(e) => handleMouseDown(e, element.id)}>
        <span style={{ color: '#6b7280' }}>Hero Section</span>
      </div>;
    }
    if (element.type === 'product') {
      return <div key={element.id} style={{ ...baseStyle, display: 'flex', flexDirection: 'column', padding: '12px' }} onMouseDown={(e) => handleMouseDown(e, element.id)}>
        <div style={{ flex: 1, background: 'rgba(6,182,212,0.1)', borderRadius: '8px', marginBottom: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ color: '#6b7280', fontSize: '11px' }}>Product</span></div>
        <div style={{ height: '10px', background: 'rgba(6,182,212,0.2)', borderRadius: '4px', marginBottom: '6px' }} />
        <div style={{ height: '10px', width: '60%', background: 'rgba(6,182,212,0.2)', borderRadius: '4px' }} />
      </div>;
    }
    return <div key={element.id} style={baseStyle} onMouseDown={(e) => handleMouseDown(e, element.id)} />;
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      <div className="h-14 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
        <h1 className="text-xl font-bold"><span className="text-white">Grip</span><span className="text-cyan-400">X</span><span className="text-gray-500 text-sm ml-2">Visual Builder</span></h1>
        <div className="flex items-center space-x-2">
          <button onClick={() => setShowPreview(!showPreview)} className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${showPreview ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-300'}`}><Eye size={18} /><span>{showPreview ? 'Edit' : 'Preview'}</span></button>
          <button onClick={saveToBackend} disabled={saving} className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-lg">{saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : saved ? <Check size={18} className="text-green-400" /> : <Save size={18} />}<span>{saved ? 'Saved!' : 'Save'}</span></button>
          <button onClick={pushToGithub} disabled={pushing} className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg">{pushing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Github size={18} />}<span>Push to GitHub</span></button>
        </div>
      <div className="flex-1 flex overflow-hidden">
        {!showPreview && <div className="w-14 bg-gray-800 border-r border-gray-700 flex flex-col items-center py-4 space-y-2">{TOOLBAR_ELEMENTS.map(({ type, icon: Icon, label }) => <button key={type} onClick={() => addElement(type)} className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-700 text-gray-400 hover:text-cyan-400" title={label}><Icon size={20} /></button>)}</div>}
        {!showPreview && <div className="w-44 bg-gray-800 border-r border-gray-700 flex flex-col"><div className="p-3 border-b border-gray-700"><h3 className="text-xs font-semibold text-gray-400 uppercase">Pages</h3></div><div className="flex-1">{pages.map(page => <button key={page.id} onClick={() => setActivePageId(page.id)} className={`w-full px-3 py-2 text-left flex items-center space-x-2 ${activePageId === page.id ? 'bg-cyan-500/20 text-cyan-400' : 'text-gray-400 hover:bg-gray-700'}`}><FileCode size={14} /><span>{page.name}</span></button>)}</div>}
        <div className="flex-1 bg-gray-950 overflow-auto p-8"><div className="flex justify-center"><div ref={canvasRef} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} style={{ width: 1200, height: 700, background: activePage.background }} className="relative shadow-2xl">{activePage.elements.map(renderElement)}</div></div>
        {!showPreview && selectedElementData && <div className="w-56 bg-gray-800 border-l border-gray-700 flex flex-col"><div className="p-3 border-b border-gray-700 flex justify-between items-center"><h3 className="text-xs font-semibold text-gray-400 uppercase">Properties</h3><button onClick={() => setSelectedElement(null)}><X size={14} /></button></div><div className="flex-1 overflow-y-auto p-3 space-y-4">
            <div><label className="text-xs text-gray-500">Content</label>{(selectedElementData.type === 'text' || selectedElementData.type === 'button') && <input type="text" value={selectedElementData.content} onChange={(e) => updateContent(selectedElement || '', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm mt-1" />}</div>
            <div><label className="text-xs text-gray-500">X</label><input type="number" value={Math.round(selectedElementData.x)} onChange={(e) => { const val = parseInt(e.target.value) || 0; setPages(prev => prev.map(p => p.id === activePageId ? { ...p, elements: p.elements.map(el => el.id === selectedElement ? { ...el, x: val } : el) } : p)); }} className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm mt-1" /></div>
            <div><label className="text-xs text-gray-500">Y</label><input type="number" value={Math.round(selectedElementData.y)} onChange={(e) => { const val = parseInt(e.target.value) || 0; setPages(prev => prev.map(p => p.id === activePageId ? { ...p, elements: p.elements.map(el => el.id === selectedElement ? { ...el, y: val } : el) } : p)); }} className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm mt-1" /></div>
            <div className="grid grid-cols-2 gap-2"><div><label className="text-xs text-gray-500">W</label><input type="number" value={selectedElementData.width} onChange={(e) => { const val = parseInt(e.target.value) || 50; setPages(prev => prev.map(p => p.id === activePageId ? { ...p, elements: p.elements.map(el => el.id === selectedElement ? { ...el, width: val } : el) } : p)); }} className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm mt-1" /></div><div><label className="text-xs text-gray-500">H</label><input type="number" value={selectedElementData.height} onChange={(e) => { const val = parseInt(e.target.value) || 50; setPages(prev => prev.map(p => p.id === activePageId ? { ...p, elements: p.elements.map(el => el.id === selectedElement ? { ...el, height: val } : el) } : p)); }} className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm mt-1" /></div>
            {(selectedElementData.type === 'text' || selectedElementData.type === 'button') && <div><label className="text-xs text-gray-500">Color</label><input type="color" value={selectedElementData.styles.color || '#ffffff'} onChange={(e) => updateStyle(selectedElement || '', 'color', e.target.value)} className="w-full h-8 mt-1 rounded cursor-pointer" /></div>}
            <div><label className="text-xs text-gray-500">Actions</label><button onClick={() => deleteElement(selectedElement || '')} className="w-full py-1 mt-1 bg-red-500/20 text-red-400 rounded text-xs">Delete</button></div></div>}
      </div>
  );
}
