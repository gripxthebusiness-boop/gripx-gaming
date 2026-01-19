
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, Trash2, Edit3, GripVertical, Save, Eye, EyeOff, 
  Layout, Type, Image, Palette, Move, Copy, X, ChevronDown, ChevronUp,
  Monitor, Smartphone, Tablet, Home, ShoppingCart, Phone, User
} from 'lucide-react';
import { useAuth } from '@/app/context/AuthContext';

// Section components that can be added/editable
const SECTION_TYPES = {
  hero: {
    name: 'Hero Banner',
    icon: Layout,
    defaultContent: {
      title: 'Welcome to GripX',
      subtitle: 'Premium Gaming Accessories',
      ctaText: 'Shop Now',
      backgroundImage: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1920&q=80'
    }
  },
  productGrid: {
    name: 'Product Grid',
    icon: ShoppingCart,
    defaultContent: {
      title: 'Featured Products',
      category: 'all'
    }
  },
  features: {
    name: 'Features Section',
    icon: Type,
    defaultContent: {
      title: 'Why Choose GripX',
      features: [
        { icon: '🚀', title: 'Fast Shipping', desc: 'Free shipping on orders over ₹999' },
        { icon: '🛡️', title: 'Quality Guarantee', desc: '1-year warranty on all products' },
        { icon: '💬', title: '24/7 Support', desc: 'Dedicated customer support' }
      ]
    }
  },
  testimonial: {
    name: 'Testimonials',
    icon: User,
    defaultContent: {
      title: 'What Gamers Say',
      testimonials: [
        { name: 'Rahul K.', text: 'Best gaming accessories I have ever used!', rating: 5 },
        { name: 'Priya S.', text: 'Amazing quality and fast delivery', rating: 5 }
      ]
    }
  },
  contact: {
    name: 'Contact Section',
    icon: Phone,
    defaultContent: {
      title: 'Contact Us',
      phone1: '+91 9063032312',
      phone2: '+91 9923869222',
      email: 'gripxthebusiness@gmail.com'
    }
  }
};

export function AdminEditor() {
  const { user, isAuthenticated, isAdmin, loading } = useAuth();
  const [sections, setSections] = useState([
    { id: 'hero-1', type: 'hero', content: { ...SECTION_TYPES.hero.defaultContent }, order: 0 },
    { id: 'products-1', type: 'productGrid', content: { ...SECTION_TYPES.productGrid.defaultContent }, order: 1 },
    { id: 'features-1', type: 'features', content: { ...SECTION_TYPES.features.defaultContent }, order: 2 },
    { id: 'contact-1', type: 'contact', content: { ...SECTION_TYPES.contact.defaultContent }, order: 3 }
  ]);
  const [selectedSection, setSelectedSection] = useState(null);
  const [isPreview, setIsPreview] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [device, setDevice] = useState('desktop'); // desktop, tablet, mobile
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editMode, setEditMode] = useState(true);
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  // No login required - direct access via 5 logo clicks
  // Removed authentication check for easier access

  const handleDragStart = (e, position) => {
    dragItem.current = position;
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnter = (e, position) => {
    dragOverItem.current = position;
  };

  const handleDragEnd = () => {
    if (dragItem.current !== null && dragOverItem.current !== null) {
      const newSections = [...sections];
      const draggedItem = newSections[dragItem.current];
      newSections.splice(dragItem.current, 1);
      newSections.splice(dragOverItem.current, 0, draggedItem);
      newSections.forEach((s, i) => s.order = i);
      setSections(newSections);
    }
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const addSection = (type) => {
    const newSection = {
      id: `${type}-${Date.now()}`,
      type,
      content: { ...SECTION_TYPES[type].defaultContent },
      order: sections.length
    };
    setSections([...sections, newSection]);
    setShowAddMenu(false);
    setSelectedSection(newSection.id);
  };

  const updateSection = (id, content) => {
    setSections(sections.map(s => s.id === id ? { ...s, content: { ...s.content, ...content } } : s));
  };

  const deleteSection = (id) => {
    setSections(sections.filter(s => s.id !== id));
    setSelectedSection(null);
  };

  const duplicateSection = (section) => {
    const newSection = {
      ...section,
      id: `${section.type}-${Date.now()}`,
      content: { ...section.content },
      order: sections.length
    };
    setSections([...sections, newSection]);
  };

  const saveChanges = async () => {
    setSaving(true);
    // In production, save to backend
    await new Promise(resolve => setTimeout(resolve, 1000));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const getDeviceWidth = () => {
    switch (device) {
      case 'mobile': return '375px';
      case 'tablet': return '768px';
      default: return '100%';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Admin Editor Toolbar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gray-800 border-b border-cyan-500/30">
        <div className="max-w-full mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold">
                <span className="text-white">Grip</span>
                <span className="text-cyan-400">X</span>
                <span className="text-gray-500 text-sm ml-2">Admin Editor</span>
              </h1>
              
              {/* Device Toggle */}
              <div className="hidden md:flex items-center space-x-1 bg-gray-700 rounded-lg p-1">
                <button
                  onClick={() => setDevice('desktop')}
                  className={`p-2 rounded ${device === 'desktop' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <Monitor size={18} />
                </button>
                <button
                  onClick={() => setDevice('tablet')}
                  className={`p-2 rounded ${device === 'tablet' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <Tablet size={18} />
                </button>
                <button
                  onClick={() => setDevice('mobile')}
                  className={`p-2 rounded ${device === 'mobile' ? 'bg-cyan-500 text-white' : 'text-gray-400 hover:text-white'}`}
                >
                  <Smartphone size={18} />
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Edit/Preview Toggle */}
              <button
                onClick={() => setEditMode(!editMode)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  editMode ? 'bg-cyan-500 text-white' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {editMode ? <EyeOff size={18} /> : <Eye size={18} />}
                <span>{editMode ? 'Preview' : 'Edit'}</span>
              </button>

              {/* Save Button */}
              <button
                onClick={saveChanges}
                disabled={saving}
                className="flex items-center space-x-2 px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : saved ? (
                  <>
                    <span className="text-green-400">✓</span>
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-16 flex">
        {/* Sidebar - Section List */}
        {editMode && (
          <div className="fixed left-0 top-16 bottom-0 w-72 bg-gray-800 border-r border-gray-700 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-white font-semibold">Sections</h2>
                <div className="relative">
                  <button
                    onClick={() => setShowAddMenu(!showAddMenu)}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
                  >
                    <Plus size={16} />
                    <span className="text-sm">Add</span>
                  </button>
                  
                  <AnimatePresence>
                    {showAddMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute top-full left-0 mt-2 w-48 bg-gray-700 border border-gray-600 rounded-lg shadow-xl z-50 overflow-hidden"
                      >
                        {Object.entries(SECTION_TYPES).map(([key, section]) => {
                          const Icon = section.icon;
                          return (
                            <button
                              key={key}
                              onClick={() => addSection(key)}
                              className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-600 transition-colors text-left"
                            >
                              <Icon size={18} className="text-cyan-400" />
                              <span className="text-gray-200">{section.name}</span>
                            </button>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Sections List */}
              <div className="space-y-2">
                {sections.map((section, index) => {
                  const sectionType = SECTION_TYPES[section.type];
                  const Icon = sectionType?.icon || Layout;
                  const isSelected = selectedSection === section.id;
                  
                  return (
                    <motion.div
                      key={section.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragEnter={(e) => handleDragEnter(e, index)}
                      onDragEnd={handleDragEnd}
                      onClick={() => setSelectedSection(section.id)}
                      className={`flex items-center space-x-3 p-3 rounded-lg cursor-move transition-colors ${
                        isSelected 
                          ? 'bg-cyan-500/20 border border-cyan-500/50' 
                          : 'bg-gray-700/50 hover:bg-gray-700 border border-transparent'
                      }`}
                    >
                      <GripVertical size={18} className="text-gray-500" />
                      <Icon size={18} className="text-cyan-400" />
                      <span className="text-gray-200 flex-1">{sectionType?.name || section.type}</span>
                      {isSelected && (
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={(e) => { e.stopPropagation(); duplicateSection(sections[index]); }}
                            className="p-1 hover:bg-gray-600 rounded text-gray-400 hover:text-white"
                          >
                            <Copy size={14} />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); deleteSection(section.id); }}
                            className="p-1 hover:bg-red-500/20 rounded text-gray-400 hover:text-red-400"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Main Editor Area */}
        <div className={`flex-1 ${editMode ? 'ml-72' : ''} min-h-screen bg-gray-100`}>
          <div className="flex justify-center py-8">
            <div 
              className="bg-white shadow-2xl transition-all duration-300 overflow-hidden"
              style={{ width: getDeviceWidth() }}
            >
              {/* Website Preview */}
              <div className="min-h-screen">
                {sections.sort((a, b) => a.order - b.order).map((section) => {
                  const sectionType = SECTION_TYPES[section.type];
                  const isSelected = selectedSection === section.id;
                  
                  return (
                    <div
                      key={section.id}
                      onClick={() => editMode && setSelectedSection(section.id)}
                      className={`relative group ${isSelected && editMode ? 'ring-2 ring-cyan-500 ring-offset-2' : ''}`}
                    >
                      {/* Edit Overlay */}
                      {isSelected && editMode && (
                        <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
                          <div className="bg-cyan-500 text-white text-xs px-3 py-1 rounded-full">
                            {sectionType?.name}
                          </div>
                        </div>
                      )}
                      
                      {/* Section Content */}
                      {section.type === 'hero' && (
                        <div 
                          className="relative h-96 flex items-center justify-center text-center text-white"
                          style={{
                            backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${section.content.backgroundImage})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                          }}
                        >
                          <div className="max-w-2xl px-4">
                            <h1 className="text-4xl md:text-6xl font-bold mb-4">{section.content.title}</h1>
                            <p className="text-xl mb-8 text-gray-200">{section.content.subtitle}</p>
                            <button className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-700 transition-all">
                              {section.content.ctaText}
                            </button>
                          </div>
                          {editMode && isSelected && (
                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 px-4 py-2 rounded-lg">
                              <span className="text-sm text-white">Hero Banner - Click to edit</span>
                            </div>
                          )}
                        </div>
                      )}

                      {section.type === 'productGrid' && (
                        <div className="p-8">
                          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">{section.content.title}</h2>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                              <div key={i} className="bg-gray-100 rounded-lg p-4">
                                <div className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg mb-3 flex items-center justify-center">
                                  <span className="text-4xl">🎮</span>
                                </div>
                                <p className="font-semibold text-gray-800">Gaming Product {i}</p>
                                <p className="text-cyan-500 font-bold">₹{999 + i * 100}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {section.type === 'features' && (
                        <div className="p-8 bg-gradient-to-br from-gray-900 to-black text-white">
                          <h2 className="text-3xl font-bold text-center mb-8">{section.content.title}</h2>
                          <div className="grid md:grid-cols-3 gap-6">
                            {section.content.features?.map((feature, i) => (
                              <div key={i} className="text-center p-6">
                                <div className="text-5xl mb-4">{feature.icon}</div>
                                <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                                <p className="text-gray-400">{feature.desc}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {section.type === 'contact' && (
                        <div className="p-8 bg-gray-900 text-white text-center">
                          <h2 className="text-3xl font-bold mb-6">{section.content.title}</h2>
                          <div className="space-y-4">
                            <a href={`tel:${section.content.phone1}`} className="block text-2xl text-cyan-400 hover:text-cyan-300">
                              📞 {section.content.phone1}
                            </a>
                            <a href={`tel:${section.content.phone2}`} className="block text-xl text-gray-400">
                              📞 {section.content.phone2}
                            </a>
                            <a href={`mailto:${section.content.email}`} className="block text-cyan-400 hover:text-cyan-300">
                              ✉️ {section.content.email}
                            </a>
                          </div>
                        </div>
                      )}

                      {section.type === 'testimonial' && (
                        <div className="p-8 bg-white">
                          <h2 className="text-3xl font-bold text-center mb-8 text-gray-800">{section.content.title}</h2>
                          <div className="grid md:grid-cols-2 gap-6">
                            {section.content.testimonials?.map((t, i) => (
                              <div key={i} className="bg-gray-50 p-6 rounded-xl">
                                <p className="text-gray-600 mb-4">"{t.text}"</p>
                                <div className="flex items-center justify-between">
                                  <span className="font-semibold text-gray-800">{t.name}</span>
                                  <div className="flex text-yellow-400">{'⭐'.repeat(t.rating)}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Properties Editor */}
        {editMode && selectedSection && (
          <div className="fixed right-0 top-16 bottom-0 w-80 bg-gray-800 border-l border-gray-700 overflow-y-auto">
            <div className="p-4">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white font-semibold">Edit Section</h2>
                <button
                  onClick={() => setSelectedSection(null)}
                  className="p-1 hover:bg-gray-700 rounded"
                >
                  <X size={18} className="text-gray-400" />
                </button>
              </div>

              {(() => {
                const section = sections.find(s => s.id === selectedSection);
                if (!section) return null;

                return (
                  <div className="space-y-6">
                    {section.type === 'hero' && (
                      <>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Title</label>
                          <input
                            type="text"
                            value={section.content.title || ''}
                            onChange={(e) => updateSection(section.id, { title: e.target.value })}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Subtitle</label>
                          <input
                            type="text"
                            value={section.content.subtitle || ''}
                            onChange={(e) => updateSection(section.id, { subtitle: e.target.value })}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Button Text</label>
                          <input
                            type="text"
                            value={section.content.ctaText || ''}
                            onChange={(e) => updateSection(section.id, { ctaText: e.target.value })}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Background Image URL</label>
                          <input
                            type="text"
                            value={section.content.backgroundImage || ''}
                            onChange={(e) => updateSection(section.id, { backgroundImage: e.target.value })}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                      </>
                    )}

                    {section.type === 'productGrid' && (
                      <>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Section Title</label>
                          <input
                            type="text"
                            value={section.content.title || ''}
                            onChange={(e) => updateSection(section.id, { title: e.target.value })}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Category</label>
                          <select
                            value={section.content.category || 'all'}
                            onChange={(e) => updateSection(section.id, { category: e.target.value })}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                          >
                            <option value="all">All Products</option>
                            <option value="mice">Mice</option>
                            <option value="keyboards">Keyboards</option>
                            <option value="headsets">Headsets</option>
                            <option value="controllers">Controllers</option>
                          </select>
                        </div>
                      </>
                    )}

                    {section.type === 'features' && (
                      <>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Section Title</label>
                          <input
                            type="text"
                            value={section.content.title || ''}
                            onChange={(e) => updateSection(section.id, { title: e.target.value })}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Feature 1 - Icon</label>
                          <input
                            type="text"
                            value={section.content.features?.[0]?.icon || ''}
                            onChange={(e) => {
                              const newFeatures = [...(section.content.features || [])];
                              newFeatures[0] = { ...newFeatures[0], icon: e.target.value };
                              updateSection(section.id, { features: newFeatures });
                            }}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Feature 1 - Title</label>
                          <input
                            type="text"
                            value={section.content.features?.[0]?.title || ''}
                            onChange={(e) => {
                              const newFeatures = [...(section.content.features || [])];
                              newFeatures[0] = { ...newFeatures[0], title: e.target.value };
                              updateSection(section.id, { features: newFeatures });
                            }}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Feature 1 - Description</label>
                          <textarea
                            value={section.content.features?.[0]?.desc || ''}
                            onChange={(e) => {
                              const newFeatures = [...(section.content.features || [])];
                              newFeatures[0] = { ...newFeatures[0], desc: e.target.value };
                              updateSection(section.id, { features: newFeatures });
                            }}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                            rows={2}
                          />
                        </div>
                      </>
                    )}

                    {section.type === 'contact' && (
                      <>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Section Title</label>
                          <input
                            type="text"
                            value={section.content.title || ''}
                            onChange={(e) => updateSection(section.id, { title: e.target.value })}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Phone 1</label>
                          <input
                            type="text"
                            value={section.content.phone1 || ''}
                            onChange={(e) => updateSection(section.id, { phone1: e.target.value })}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Phone 2</label>
                          <input
                            type="text"
                            value={section.content.phone2 || ''}
                            onChange={(e) => updateSection(section.id, { phone2: e.target.value })}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Email</label>
                          <input
                            type="email"
                            value={section.content.email || ''}
                            onChange={(e) => updateSection(section.id, { email: e.target.value })}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                      </>
                    )}

                    {section.type === 'testimonial' && (
                      <>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Section Title</label>
                          <input
                            type="text"
                            value={section.content.title || ''}
                            onChange={(e) => updateSection(section.id, { title: e.target.value })}
                            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                          />
                        </div>
                      </>
                    )}

                    <div className="pt-4 border-t border-gray-700">
                      <button
                        onClick={() => deleteSection(section.id)}
                        className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                      >
                        <Trash2 size={18} />
                        <span>Delete Section</span>
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

