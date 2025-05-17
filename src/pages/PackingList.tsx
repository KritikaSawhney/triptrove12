import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Plus, X, List, Save, Mountain, Luggage } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from '@/components/ui/sonner';
import FlyingAirplane from '../components/FlyingAirplane';
import TypewriterText from '../components/TypewriterText';
import MountainBackground from '../components/MountainBackground';

// Sample data for packing list items
const initialCategories = [
  {
    id: 'essentials',
    name: 'Essentials ✅',
    items: [
      { id: 'e1', name: 'Passport', checked: false },
      { id: 'e2', name: 'ID / Driver\'s license', checked: false },
      { id: 'e3', name: 'Credit/debit cards', checked: false },
      { id: 'e4', name: 'Travel insurance', checked: false },
      { id: 'e5', name: 'Phone + charger', checked: false },
    ]
  },
  {
    id: 'clothing',
    name: 'Clothing 👕',
    items: [
      { id: 'c1', name: 'T-shirts', checked: false },
      { id: 'c2', name: 'Pants/jeans', checked: false },
      { id: 'c3', name: 'Underwear', checked: false },
      { id: 'c4', name: 'Socks', checked: false },
      { id: 'c5', name: 'Jacket/coat', checked: false },
      { id: 'c6', name: 'Pajamas', checked: false },
    ]
  },
  {
    id: 'toiletries',
    name: 'Toiletries 🧴',
    items: [
      { id: 't1', name: 'Toothbrush & toothpaste', checked: false },
      { id: 't2', name: 'Shampoo & conditioner', checked: false },
      { id: 't3', name: 'Soap/body wash', checked: false },
      { id: 't4', name: 'Deodorant', checked: false },
      { id: 't5', name: 'Medications', checked: false },
      { id: 't6', name: 'First aid kit', checked: false },
    ]
  },
  {
    id: 'gadgets',
    name: 'Gadgets 📱',
    items: [
      { id: 'g1', name: 'Camera', checked: false },
      { id: 'g2', name: 'Laptop & charger', checked: false },
      { id: 'g3', name: 'Headphones', checked: false },
      { id: 'g4', name: 'Travel adapter', checked: false },
      { id: 'g5', name: 'Power bank', checked: false },
    ]
  }
];

// Sample list templates
const listTemplates = [
  { id: 'beach', name: 'Beach Vacation 🏖️' },
  { id: 'business', name: 'Business Trip 💼' },
  { id: 'camping', name: 'Camping Trip 🏕️' },
  { id: 'skiing', name: 'Ski Trip ⛷️' },
];

const PackingList = () => {
  const [categories, setCategories] = useState(initialCategories);
  const [newItemText, setNewItemText] = useState('');
  const [activeCategory, setActiveCategory] = useState('essentials');
  const [newListName, setNewListName] = useState('My Trip');
  const [currentTemplate, setCurrentTemplate] = useState('custom');

  // Toggle item checked status
  const toggleItem = (categoryId: string, itemId: string) => {
    setCategories(categories.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          items: category.items.map(item => 
            item.id === itemId ? { ...item, checked: !item.checked } : item
          )
        };
      }
      return category;
    }));
  };

  // Add new item to active category
  const addItem = () => {
    if (!newItemText.trim()) return;
    
    setCategories(categories.map(category => {
      if (category.id === activeCategory) {
        return {
          ...category,
          items: [
            ...category.items,
            { 
              id: `${category.id}-${Date.now()}`, 
              name: newItemText, 
              checked: false 
            }
          ]
        };
      }
      return category;
    }));
    
    setNewItemText('');
  };

  // Delete item from category
  const deleteItem = (categoryId: string, itemId: string) => {
    setCategories(categories.map(category => {
      if (category.id === categoryId) {
        return {
          ...category,
          items: category.items.filter(item => item.id !== itemId)
        };
      }
      return category;
    }));
  };

  // Handle keydown for adding items with Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItem();
    }
  };

  // Get progress percentage for a category
  const getCategoryProgress = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category || category.items.length === 0) return 0;
    
    const checkedItems = category.items.filter(item => item.checked).length;
    return Math.round((checkedItems / category.items.length) * 100);
  };

  // Get overall progress
  const getOverallProgress = () => {
    const totalItems = categories.reduce((acc, category) => acc + category.items.length, 0);
    if (totalItems === 0) return 0;
    
    const checkedItems = categories.reduce(
      (acc, category) => acc + category.items.filter(item => item.checked).length, 
      0
    );
    
    return Math.round((checkedItems / totalItems) * 100);
  };

  // Load a template
  const loadTemplate = (templateId: string) => {
    setCurrentTemplate(templateId);
    // In a real app, this would load template data from backend
    setNewListName(
      listTemplates.find(template => template.id === templateId)?.name || 'My Trip'
    );
    // For demo, we'll just use our initial data
    setCategories(initialCategories);
  };

  // Save the current list (mock function)
  const saveList = () => {
    // In a real app, this would save to backend
    alert(`List "${newListName}" saved!`);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  return (
    <div className="container py-8 relative">
      {/* Background Elements */}
      <MountainBackground />
      <FlyingAirplane size={64} />

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8"
      >
        <div>
          <motion.div
            className="flex items-center gap-3"
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Luggage className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold mb-2">
              <TypewriterText text="Packing List" />
            </h1>
          </motion.div>
          <p className="text-muted-foreground">
            Create and manage your travel packing lists
          </p>
        </div>
        
        <motion.div 
          className="flex flex-col sm:flex-row gap-2"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          whileHover={{ scale: 1.02 }}
        >
          <Input
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            className="w-full sm:w-auto"
            placeholder="List name"
          />
          <Button onClick={saveList}>
            <Save className="mr-2 h-4 w-4" /> Save List
          </Button>
        </motion.div>
      </motion.div>
      
      {/* Progress bar */}
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ scaleX: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm font-medium">{getOverallProgress()}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary transition-all" 
                style={{ width: `${getOverallProgress()}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${getOverallProgress()}%` }}
                transition={{ duration: 1 }}
              ></motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Templates Select */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <Card className="mb-8 overflow-hidden relative">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <motion.span
                animate={{ rotate: [0, 10, 0, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
              >
                📋
              </motion.span> 
              Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div className="flex flex-wrap gap-2" variants={containerVariants}>
              <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button 
                  variant={currentTemplate === 'custom' ? 'default' : 'outline'}
                  onClick={() => loadTemplate('custom')}
                  className="transition-all duration-300"
                >
                  Custom List ✨
                </Button>
              </motion.div>
              
              {listTemplates.map(template => (
                <motion.div key={template.id} variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant={currentTemplate === template.id ? 'default' : 'outline'}
                    onClick={() => loadTemplate(template.id)}
                    className="transition-all duration-300"
                  >
                    {template.name}
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Packing List */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Categories List */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <Card className="md:col-span-1 shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <motion.span
                  animate={{ 
                    rotate: [0, 5, 0, -5, 0],
                  }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  🗂️
                </motion.span>
                Categories
              </CardTitle>
            </CardHeader>
            <CardContent>
              <motion.div className="space-y-2" variants={containerVariants}>
                {categories.map((category, idx) => (
                  <motion.div 
                    key={category.id}
                    className={`p-3 rounded-md cursor-pointer flex justify-between items-center ${
                      activeCategory === category.id ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                    }`}
                    onClick={() => setActiveCategory(category.id)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * idx, duration: 0.5 }}
                    whileHover={{ scale: 1.03, x: 5 }}
                  >
                    <div className="flex items-center">
                      <List className="mr-2 h-4 w-4" />
                      <span>{category.name}</span>
                    </div>
                    <motion.span 
                      className="text-xs font-medium"
                      initial={{ scale: 1 }}
                      animate={{ 
                        scale: [1, 1.2, 1], 
                        color: getCategoryProgress(category.id) === 100 ? ['currentColor', '#10b981', 'currentColor'] : 'currentColor'
                      }}
                      transition={{ 
                        duration: 0.5, 
                        repeat: getCategoryProgress(category.id) === 100 ? 3 : 0, 
                        repeatDelay: 0.5 
                      }}
                    >
                      {getCategoryProgress(category.id)}%
                    </motion.span>
                  </motion.div>
                ))}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Items List */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="md:col-span-3"
        >
          <Card className="shadow-md hover:shadow-lg transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <motion.span
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, 0, -5, 0]
                  }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  {activeCategory === 'essentials' ? '🔑' : 
                   activeCategory === 'clothing' ? '👕' : 
                   activeCategory === 'toiletries' ? '🧴' : 
                   activeCategory === 'gadgets' ? '📱' : '📦'}
                </motion.span>
                {categories.find(c => c.id === activeCategory)?.name || 'Items'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Add new item input */}
              <motion.div 
                className="flex gap-2 mb-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
              >
                <Input
                  placeholder="Add new item..."
                  value={newItemText}
                  onChange={(e) => setNewItemText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="shadow-sm"
                />
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button onClick={addItem}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </motion.div>
              </motion.div>
              
              {/* Items list */}
              <motion.div 
                className="space-y-2"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {categories
                  .find(c => c.id === activeCategory)
                  ?.items.map((item, idx) => (
                    <motion.div 
                      key={item.id}
                      className="flex items-center justify-between p-3 border rounded-md hover:bg-muted/50"
                      variants={itemVariants}
                      custom={idx}
                      whileHover={{ scale: 1.01, x: 3 }}
                    >
                      <div className="flex items-center">
                        <Checkbox 
                          id={item.id}
                          checked={item.checked}
                          onCheckedChange={() => {
                            toggleItem(activeCategory, item.id);
                            if (!item.checked) {
                              toast("Item checked!", {
                                description: `"${item.name}" marked as packed`,
                                icon: "✅"
                              });
                            }
                          }}
                          className="mr-2"
                        />
                        <label 
                          htmlFor={item.id}
                          className={`cursor-pointer transition-all duration-300 ${item.checked ? 'line-through text-muted-foreground' : ''}`}
                        >
                          {item.name}
                        </label>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => deleteItem(activeCategory, item.id)}
                      >
                        <motion.div
                          whileHover={{ rotate: 90 }}
                          transition={{ duration: 0.2 }}
                        >
                          <X className="h-4 w-4" />
                        </motion.div>
                      </Button>
                    </motion.div>
                  ))
                }
                
                {categories.find(c => c.id === activeCategory)?.items.length === 0 && (
                  <motion.div 
                    className="text-center py-8 text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-4xl mb-4"
                    >
                      📝
                    </motion.div>
                    No items added yet. Add your first item above.
                  </motion.div>
                )}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PackingList;
