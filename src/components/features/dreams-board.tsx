'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useDragControls } from 'framer-motion';
import { Plus, Save, Download, Upload, Trash2, Edit3, Heart, Star, Home, Plane, Baby, Briefcase, Palette, Music } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useEasterEgg } from './easter-eggs';

interface DreamItem {
  id: string;
  type: 'text' | 'image' | 'goal' | 'quote';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  category: 'home' | 'travel' | 'family' | 'career' | 'hobbies' | 'love';
  priority: 'high' | 'medium' | 'low';
  completed?: boolean;
  dateAdded: Date;
  notes?: string;
}

interface DreamBoard {
  id: string;
  name: string;
  items: DreamItem[];
  background: string;
  createdAt: Date;
  lastModified: Date;
}

const dreamCategories = {
  home: { icon: Home, color: 'from-green-400 to-emerald-500', label: 'Home & Living' },
  travel: { icon: Plane, color: 'from-blue-400 to-cyan-500', label: 'Travel & Adventure' },
  family: { icon: Baby, color: 'from-pink-400 to-rose-500', label: 'Family & Kids' },
  career: { icon: Briefcase, color: 'from-purple-400 to-violet-500', label: 'Career & Goals' },
  hobbies: { icon: Palette, color: 'from-orange-400 to-amber-500', label: 'Hobbies & Fun' },
  love: { icon: Heart, color: 'from-red-400 to-pink-500', label: 'Love & Romance' }
};

const backgroundOptions = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)'
];

const defaultDreams: DreamItem[] = [
  {
    id: 'dream-1',
    type: 'goal',
    content: 'Buy our first home together',
    x: 100,
    y: 100,
    width: 200,
    height: 120,
    color: 'from-green-400 to-emerald-500',
    category: 'home',
    priority: 'high',
    dateAdded: new Date(),
    notes: 'Looking for a cozy place with a garden'
  },
  {
    id: 'dream-2',
    type: 'goal',
    content: 'Travel to Japan for our honeymoon',
    x: 350,
    y: 150,
    width: 180,
    height: 100,
    color: 'from-blue-400 to-cyan-500',
    category: 'travel',
    priority: 'high',
    dateAdded: new Date(),
    notes: 'Cherry blossom season would be perfect!'
  },
  {
    id: 'dream-3',
    type: 'quote',
    content: '"The best dreams happen when you\'re awake" - Cherie Gilderbloom',
    x: 150,
    y: 300,
    width: 250,
    height: 80,
    color: 'from-purple-400 to-violet-500',
    category: 'love',
    priority: 'medium',
    dateAdded: new Date()
  },
  {
    id: 'dream-4',
    type: 'goal',
    content: 'Start a family in 2-3 years',
    x: 450,
    y: 280,
    width: 160,
    height: 100,
    color: 'from-pink-400 to-rose-500',
    category: 'family',
    priority: 'medium',
    dateAdded: new Date(),
    notes: 'When we feel ready and settled'
  }
];

export function DreamsBoard({ className }: { className?: string }) {
  const [board, setBoard] = useState<DreamBoard>({
    id: 'main-board',
    name: 'Our Dreams Together',
    items: defaultDreams,
    background: backgroundOptions[0],
    createdAt: new Date(),
    lastModified: new Date()
  });
  
  const [selectedItem, setSelectedItem] = useState<DreamItem | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newDream, setNewDream] = useState({
    type: 'goal' as const,
    content: '',
    category: 'home' as const,
    priority: 'medium' as const,
    notes: ''
  });
  
  const boardRef = useRef<HTMLDivElement>(null);
  const { triggerCustomEgg } = useEasterEgg();

  // Load board from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('wedding-dreams-board');
    if (saved) {
      try {
        const savedBoard = JSON.parse(saved);
        setBoard({
          ...savedBoard,
          createdAt: new Date(savedBoard.createdAt),
          lastModified: new Date(savedBoard.lastModified),
          items: savedBoard.items.map((item: any) => ({
            ...item,
            dateAdded: new Date(item.dateAdded)
          }))
        });
      } catch (error) {
        console.error('Failed to load dreams board:', error);
      }
    }
  }, []);

  // Save board to localStorage
  const saveBoard = (updatedBoard: DreamBoard) => {
    const boardToSave = {
      ...updatedBoard,
      lastModified: new Date()
    };
    setBoard(boardToSave);
    localStorage.setItem('wedding-dreams-board', JSON.stringify(boardToSave));
  };

  // Add new dream
  const addDream = () => {
    if (!newDream.content.trim()) return;

    const dreamItem: DreamItem = {
      id: `dream-${Date.now()}`,
      type: newDream.type,
      content: newDream.content,
      x: Math.random() * 300 + 50,
      y: Math.random() * 200 + 50,
      width: newDream.type === 'quote' ? 250 : 180,
      height: newDream.type === 'quote' ? 100 : 120,
      color: dreamCategories[newDream.category].color,
      category: newDream.category,
      priority: newDream.priority,
      dateAdded: new Date(),
      notes: newDream.notes || undefined
    };

    const updatedBoard = {
      ...board,
      items: [...board.items, dreamItem]
    };

    saveBoard(updatedBoard);
    setShowAddForm(false);
    setNewDream({
      type: 'goal',
      content: '',
      category: 'home',
      priority: 'medium',
      notes: ''
    });

    triggerCustomEgg('✨ New dream added to your board!', 'stars');
  };

  // Update dream position
  const updateDreamPosition = (id: string, x: number, y: number) => {
    const updatedBoard = {
      ...board,
      items: board.items.map(item =>
        item.id === id ? { ...item, x, y } : item
      )
    };
    saveBoard(updatedBoard);
  };

  // Delete dream
  const deleteDream = (id: string) => {
    const updatedBoard = {
      ...board,
      items: board.items.filter(item => item.id !== id)
    };
    saveBoard(updatedBoard);
    setSelectedItem(null);
  };

  // Toggle dream completion
  const toggleDreamCompletion = (id: string) => {
    const updatedBoard = {
      ...board,
      items: board.items.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    };
    saveBoard(updatedBoard);

    const item = board.items.find(i => i.id === id);
    if (item && !item.completed) {
      triggerCustomEgg('🎉 Dream achieved! Congratulations!', 'rainbow');
    }
  };

  // Export board as JSON
  const exportBoard = () => {
    const dataStr = JSON.stringify(board, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `dreams-board-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  // Change background
  const changeBackground = (background: string) => {
    const updatedBoard = { ...board, background };
    saveBoard(updatedBoard);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-serif text-charcoal mb-2">
            {board.name}
          </h2>
          <p className="text-sage-green">
            Drag and drop your dreams to create your perfect vision board together
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAddForm(true)}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Dream
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportBoard}
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Background Selector */}
      <div className="flex items-center space-x-2">
        <span className="text-sm text-muted-foreground">Background:</span>
        <div className="flex space-x-2">
          {backgroundOptions.map((bg, index) => (
            <button
              key={index}
              className={`w-8 h-8 rounded-full border-2 ${
                board.background === bg ? 'border-charcoal' : 'border-gray-300'
              }`}
              style={{ background: bg }}
              onClick={() => changeBackground(bg)}
            />
          ))}
        </div>
      </div>

      {/* Dreams Board */}
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div
            ref={boardRef}
            className="relative w-full h-[600px] overflow-hidden"
            style={{ background: board.background }}
          >
            {/* Grid Pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%">
                <defs>
                  <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="white" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Dream Items */}
            <AnimatePresence>
              {board.items.map((item) => (
                <DreamCard
                  key={item.id}
                  item={item}
                  onPositionChange={updateDreamPosition}
                  onSelect={setSelectedItem}
                  onToggleComplete={toggleDreamCompletion}
                  isSelected={selectedItem?.id === item.id}
                />
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-charcoal">{board.items.length}</div>
            <div className="text-xs text-muted-foreground">Total Dreams</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {board.items.filter(item => item.completed).length}
            </div>
            <div className="text-xs text-muted-foreground">Achieved</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {board.items.filter(item => item.priority === 'high').length}
            </div>
            <div className="text-xs text-muted-foreground">High Priority</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {Object.keys(dreamCategories).length}
            </div>
            <div className="text-xs text-muted-foreground">Categories</div>
          </CardContent>
        </Card>
      </div>

      {/* Add Dream Modal */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
            onClick={() => setShowAddForm(false)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="max-w-md w-full bg-white rounded-2xl p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-serif text-charcoal mb-4">Add New Dream</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Dream Type
                  </label>
                  <select
                    value={newDream.type}
                    onChange={(e) => setNewDream({ ...newDream, type: e.target.value as any })}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  >
                    <option value="goal">Goal</option>
                    <option value="quote">Quote</option>
                    <option value="text">Text Note</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Content
                  </label>
                  <Textarea
                    value={newDream.content}
                    onChange={(e) => setNewDream({ ...newDream, content: e.target.value })}
                    placeholder="Describe your dream..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Category
                    </label>
                    <select
                      value={newDream.category}
                      onChange={(e) => setNewDream({ ...newDream, category: e.target.value as any })}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      {Object.entries(dreamCategories).map(([key, cat]) => (
                        <option key={key} value={key}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Priority
                    </label>
                    <select
                      value={newDream.priority}
                      onChange={(e) => setNewDream({ ...newDream, priority: e.target.value as any })}
                      className="w-full p-2 border border-gray-300 rounded-lg"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-charcoal mb-2">
                    Notes (Optional)
                  </label>
                  <Input
                    value={newDream.notes}
                    onChange={(e) => setNewDream({ ...newDream, notes: e.target.value })}
                    placeholder="Additional notes..."
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <Button
                    onClick={addDream}
                    className="flex-1"
                    disabled={!newDream.content.trim()}
                  >
                    Add Dream
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selected Item Details */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed bottom-4 right-4 max-w-sm bg-white rounded-2xl shadow-2xl p-4 border"
          >
            <div className="flex items-center justify-between mb-3">
              <Badge className={`bg-gradient-to-r ${selectedItem.color} text-white border-0`}>
                {React.createElement(dreamCategories[selectedItem.category].icon, { className: "w-3 h-3 mr-1" })}
                {dreamCategories[selectedItem.category].label}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedItem(null)}
              >
                ✕
              </Button>
            </div>

            <h4 className="font-semibold text-charcoal mb-2">{selectedItem.content}</h4>
            
            {selectedItem.notes && (
              <p className="text-sm text-sage-green mb-3">{selectedItem.notes}</p>
            )}

            <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
              <span>Priority: {selectedItem.priority}</span>
              <span>{selectedItem.dateAdded.toLocaleDateString()}</span>
            </div>

            <div className="flex space-x-2">
              <Button
                size="sm"
                variant={selectedItem.completed ? "default" : "outline"}
                onClick={() => toggleDreamCompletion(selectedItem.id)}
                className="flex-1"
              >
                {selectedItem.completed ? '✓ Achieved' : 'Mark Complete'}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => deleteDream(selectedItem.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Individual Dream Card Component
function DreamCard({ 
  item, 
  onPositionChange, 
  onSelect, 
  onToggleComplete,
  isSelected 
}: {
  item: DreamItem;
  onPositionChange: (id: string, x: number, y: number) => void;
  onSelect: (item: DreamItem) => void;
  onToggleComplete: (id: string) => void;
  isSelected: boolean;
}) {
  const controls = useDragControls();
  const CategoryIcon = dreamCategories[item.category].icon;

  return (
    <motion.div
      drag
      dragControls={controls}
      dragMomentum={false}
      dragElastic={0}
      onDragEnd={(_, info) => {
        const newX = Math.max(0, Math.min(item.x + info.offset.x, 800 - item.width));
        const newY = Math.max(0, Math.min(item.y + info.offset.y, 600 - item.height));
        onPositionChange(item.id, newX, newY);
      }}
      initial={{ x: item.x, y: item.y, opacity: 0, scale: 0.8 }}
      animate={{ 
        x: item.x, 
        y: item.y, 
        opacity: 1, 
        scale: isSelected ? 1.05 : 1,
        rotate: isSelected ? 1 : 0
      }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={`absolute cursor-move select-none ${
        item.completed ? 'opacity-75' : ''
      }`}
      style={{ width: item.width, height: item.height }}
      onClick={() => onSelect(item)}
      whileHover={{ scale: 1.02 }}
      whileDrag={{ scale: 1.1, rotate: 5 }}
    >
      <div className={`
        w-full h-full rounded-xl shadow-lg border-2 p-3 text-white relative overflow-hidden
        ${isSelected ? 'border-white' : 'border-white/20'}
        ${item.completed ? 'ring-2 ring-green-400' : ''}
      `}
      style={{ background: `linear-gradient(135deg, ${item.color.replace('from-', '').replace('to-', ', ')})` }}
      >
        {/* Completed Overlay */}
        {item.completed && (
          <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center">
            <div className="bg-green-500 text-white rounded-full p-2">
              ✓
            </div>
          </div>
        )}

        {/* Category Icon */}
        <div className="absolute top-2 right-2">
          <CategoryIcon className="w-4 h-4 opacity-70" />
        </div>

        {/* Priority Indicator */}
        {item.priority === 'high' && (
          <div className="absolute top-2 left-2">
            <Star className="w-4 h-4 text-yellow-300 fill-current" />
          </div>
        )}

        {/* Content */}
        <div className="h-full flex flex-col justify-center">
          <p className={`text-sm font-medium leading-tight ${
            item.type === 'quote' ? 'italic text-center' : ''
          } ${item.completed ? 'line-through' : ''}`}>
            {item.content}
          </p>
        </div>

        {/* Drag Handle */}
        <div className="absolute bottom-1 right-1 opacity-50">
          <div className="w-3 h-3 grid grid-cols-2 gap-0.5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="w-1 h-1 bg-white rounded-full" />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
