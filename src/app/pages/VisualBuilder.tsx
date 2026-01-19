import { useState, useRef } from 'react';
import { Type, MousePointer, Square, Circle, Save, Eye, Check, X } from 'lucide-react';

type ElementType = 'text' | 'button' | 'rectangle' | 'circle';

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

export function VisualBuilder() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [elements, setElements] = useState<BuilderElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [dragState, setDragState] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const selectedElementData = elements.find(el => el.id === selectedElement);

  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    setSelectedElement(elementId);
    const rect = canvasRef.current?.getBoundingClientRect();
    const element = elements.find(el => el.id === elementId);
    if (!rect || !element) return;
    setDragState({ id: elementId, offsetX: e.clientX - rect.left - element.x, offsetY: e.clientY - rect.top - element.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragState) return;
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const newX = Math.max(0, e.clientX - rect.left - dragState.offsetX);
    const newY = Math.max(0, e.clientY - rect.top - dragState.offsetY);
    setElements(prev => prev.map(el => el.id === dragState.id ? { ...el, x: newX, y: newY } : el));
  };

  const handleMouseUp = () => setDragState(null);

  const addElement = (type: ElementType) => {
    const newElement: BuilderElement = {
      id: `${type}-${Date.now()}`,
      type,
      x: 100,
      y: 100,
      width: type === 'text' ? 200 : type === 'button' ? 150 : 120,
      height: type === 'text' ? 40 : type === 'button' ? 45 : 120,
      content: type === 'text' ? 'Edit this text' : type === 'button' ? 'Click Me' : '',
      styles: {
        background: type === 'rectangle' || type === 'circle' ? '#06b6d4' : 'transparent',
        borderRadius: type === 'circle' ? '50%' : '8px',
        color: '#ffffff',
        fontSize: '16px'
      },
    };
    setElements(prev => [...prev, newElement]);
    setSelectedElement(newElement.id);
  };

  const updateStyle = (elementId: string, style: string, value: string) => {
    setElements(prev => prev.map(el => el.id === elementId ? { ...el, styles: { ...el.styles, [style]: value } } : el));
  };

  const updateContent = (elementId: string, content: string) => {
    setElements(prev => prev.map(el => el.id === elementId ? { ...el, content } : el));
  };

  const deleteElement = (elementId: string) => {
    setElements(prev => prev.filter(el => el.id !== elementId));
    setSelectedElement(null);
  };

  const saveToBackend = async () => {
    setSaving(true);
    try {
      localStorage.setItem('gripx_builder', JSON.stringify(elements));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const renderElement = (element: BuilderElement) => {
    const isSelected = selectedElement === element.id && !showPreview;
    const baseStyle: React.CSSProperties = {
      position: 'absolute',
      left: element.x,
      top: element.y,
      width: element.width,
      height: element.height,
      ...element.styles,
      cursor: 'move',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    };
    if (isSelected) {
      baseStyle.outline = '2px solid #06b6d4';
      baseStyle.outlineOffset = '2px';
    }
    if (element.type === 'text' || element.type === 'button') {
      return (
        <div key={element.id} style={baseStyle} onMouseDown={(e) => handleMouseDown(e, element.id)}>
          {showPreview ? (
            element.content
          ) : (
            <input
              type="text"
              value={element.content}
              onChange={(e) => updateContent(element.id, e.target.value)}
              style={{
                width: '100%',
                height: '100%',
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: element.styles.color,
                fontSize: element.styles.fontSize,
                textAlign: 'center'
              }}
            />
          )}
        </div>
      );
    }
    return (
      <div key={element.id} style={baseStyle} onMouseDown={(e) => handleMouseDown(e, element.id)} />
    );
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      <div className="h-14 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
        <h1 className="text-xl font-bold">
          <span className="text-white">Grip</span>
          <span className="text-cyan-400">X</span>
          <span className="text-gray-500 text-sm ml-2">Visual Builder</span>
        </h1>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowPreview(!showPreview)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${showPreview ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            <Eye size={18} />
            <span>{showPreview ? 'Edit' : 'Preview'}</span>
          </button>
          <button onClick={saveToBackend} disabled={saving} className="flex items-center space-x-2 px-4 py-2 bg-gray-700 text-white rounded-lg">
            {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : saved ? <Check size={18} className="text-green-400" /> : <Save size={18} />}
            <span>{saved ? 'Saved!' : 'Save'}</span>
          </button>
        </div>
      <div className="flex-1 flex overflow-hidden">
        {!showPreview && (
          <div className="w-14 bg-gray-800 border-r border-gray-700 flex flex-col items-center py-4 space-y-2">
            <button onClick={() => addElement('text')} className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-700 text-gray-400 hover:text-cyan-400" title="Text"><Type size={20} /></button>
            <button onClick={() => addElement('button')} className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-700 text-gray-400 hover:text-cyan-400" title="Button"><MousePointer size={20} /></button>
            <button onClick={() => addElement('rectangle')} className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-700 text-gray-400 hover:text-cyan-400" title="Rectangle"><Square size={20} /></button>
            <button onClick={() => addElement('circle')} className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-700 text-gray-400 hover:text-cyan-400" title="Circle"><Circle size={20} /></button>
          </div>
        )}
        <div className="flex-1 bg-gray-950 overflow-auto p-8">
          <div className="flex justify-center">
            <div ref={canvasRef} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} style={{ width: 1200, height: 700, background: '#000000' }} className="relative shadow-2xl">
              {elements.map(renderElement)}
            </div>
        </div>
        {!showPreview && selectedElementData && (
          <div className="w-56 bg-gray-800 border-l border-gray-700 flex flex-col">
            <div className="p-3 border-b border-gray-700 flex justify-between items-center">
              <h3 className="text-xs font-semibold text-gray-400 uppercase">Properties</h3>
              <button onClick={() => setSelectedElement(null)}><X size={14} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
              <div>
                <label className="text-xs text-gray-500">Content</label>
                <input type="text" value={selectedElementData.content} onChange={(e) => updateContent(selectedElement || '', e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm mt-1" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="text-xs text-gray-500">X</label><input type="number" value={Math.round(selectedElementData.x)} onChange={(e) => setElements(prev => prev.map(el => el.id === selectedElement ? { ...el, x: parseInt(e.target.value) || 0 } : el))} className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm mt-1" /></div>
                <div><label className="text-xs text-gray-500">Y</label><input type="number" value={Math.round(selectedElementData.y)} onChange={(e) => setElements(prev => prev.map(el => el.id === selectedElement ? { ...el, y: parseInt(e.target.value) || 0 } : el))} className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white text-sm mt-1" /></div>
              <div><label className="text-xs text-gray-500">Text Color</label><input type="color" value={selectedElementData.styles.color || '#ffffff'} onChange={(e) => updateStyle(selectedElement || '', 'color', e.target.value)} className="w-full h-8 mt-1 rounded cursor-pointer" /></div>
              <div><label className="text-xs text-gray-500">Background</label><input type="color" value={selectedElementData.styles.background || '#000000'} onChange={(e) => updateStyle(selectedElement || '', 'background', e.target.value)} className="w-full h-8 mt-1 rounded cursor-pointer" /></div>
              <div><button onClick={() => deleteElement(selectedElement || '')} className="w-full py-1 mt-1 bg-red-500/20 text-red-400 rounded text-xs">Delete Element</button></div>
          </div>
        )}
      </div>
  );
}
