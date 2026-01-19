import { useState, useRef } from 'react';
import { Type, MousePointer, Square, Circle, Save, Eye, Check, X, FileCode } from 'lucide-react';

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

export function VisualBuilder() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [pages, setPages] = useState<BuilderPage[]>([
    { id: 'home', name: 'Home', elements: [], background: '#000' },
    { id: 'products', name: 'Products', elements: [], background: '#0f172a' },
    { id: 'contact', name: 'Contact', elements: [], background: '#000' },
  ]);
  const [activePageId, setActivePageId] = useState('home');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [dragState, setDragState] = useState<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  
  const activePage = pages.find(p => p.id === activePageId) || pages[0];

  // ... rest of component code

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      <div className="h-14 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
        <h1 className="text-xl font-bold">
          <span className="text-white">Grip</span>
          <span className="text-cyan-400">X</span>
          <span className="text-gray-500 text-sm ml-2">Visual Builder</span>
        </h1>
      </div>
      <div className="flex-1 flex overflow-hidden">
        {/* ... content */}
      </div>
  );
}