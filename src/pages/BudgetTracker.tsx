
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, 
  Wallet, 
  PieChart, 
  Plus, 
  Trash2, 
  Edit, 
  Filter,
  Sparkles,
  Star 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TypewriterText from '@/components/TypewriterText';
import { 
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
} from 'chart.js';
import { Doughnut, Line, Bar } from 'react-chartjs-2';
import { useToast } from '@/components/ui/use-toast';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement
);

interface Expense {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
  currency: string;
}

const DEMO_EXPENSES: Expense[] = [
  {
    id: '1',
    amount: 250,
    description: 'Hotel in Paris',
    category: 'Accommodation',
    date: '2023-05-15',
    currency: 'USD'
  },
  {
    id: '2',
    amount: 85,
    description: 'Eiffel Tower tickets',
    category: 'Attractions',
    date: '2023-05-16',
    currency: 'USD'
  },
  {
    id: '3',
    amount: 120,
    description: 'Dinner at Le Bistro',
    category: 'Food',
    date: '2023-05-16',
    currency: 'USD'
  },
  {
    id: '4',
    amount: 65,
    description: 'Taxi to airport',
    category: 'Transportation',
    date: '2023-05-17',
    currency: 'USD'
  },
  {
    id: '5',
    amount: 200,
    description: 'Shopping at Galeries Lafayette',
    category: 'Shopping',
    date: '2023-05-16',
    currency: 'USD'
  },
];

const CATEGORIES = ['Accommodation', 'Food', 'Transportation', 'Attractions', 'Shopping', 'Other'];
const CURRENCIES = ['USD', 'EUR', 'GBP', 'JPY'];

const BudgetTracker = () => {
  const [expenses, setExpenses] = useState<Expense[]>(DEMO_EXPENSES);
  const [newExpense, setNewExpense] = useState<Omit<Expense, 'id'>>({
    amount: 0,
    description: '',
    category: 'Other',
    date: new Date().toISOString().split('T')[0],
    currency: 'USD'
  });
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [budget, setBudget] = useState<number>(1500);
  const [showBudgetEdit, setShowBudgetEdit] = useState<boolean>(false);
  const [tempBudget, setTempBudget] = useState<number>(budget);
  const { toast } = useToast();

  const filteredExpenses = filterCategory === 'All' 
    ? expenses 
    : expenses.filter(expense => expense.category === filterCategory);

  const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const remainingBudget = budget - totalSpent;
  const spentPercentage = (totalSpent / budget) * 100;

  // Group by category for pie chart
  const expensesByCategory = CATEGORIES.map(category => ({
    category,
    amount: expenses
      .filter(expense => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0)
  })).filter(item => item.amount > 0);

  // Group by date for line chart
  const expensesByDate = expenses.reduce((acc, expense) => {
    const date = expense.date;
    acc[date] = (acc[date] || 0) + expense.amount;
    return acc;
  }, {} as Record<string, number>);

  const sortedDates = Object.keys(expensesByDate).sort();
  
  const lineChartData = {
    labels: sortedDates,
    datasets: [
      {
        label: 'Daily Expenses',
        data: sortedDates.map(date => expensesByDate[date]),
        fill: true,
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        tension: 0.4,
      }
    ]
  };

  const pieChartData = {
    labels: expensesByCategory.map(item => item.category),
    datasets: [
      {
        data: expensesByCategory.map(item => item.amount),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
        borderColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40',
        ],
        borderWidth: 1,
      },
    ],
  };

  const barChartData = {
    labels: CATEGORIES,
    datasets: [
      {
        label: 'Expenses by Category',
        data: CATEGORIES.map(category => 
          expenses
            .filter(expense => expense.category === category)
            .reduce((sum, expense) => sum + expense.amount, 0)
        ),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
          'rgba(255, 159, 64, 0.6)'
        ],
      }
    ]
  };

  const handleAddExpense = () => {
    if (newExpense.amount <= 0 || !newExpense.description) {
      toast({
        variant: "destructive",
        title: "Invalid input",
        description: "Please enter a valid amount and description"
      });
      return;
    }

    const expense: Expense = {
      ...newExpense,
      id: Date.now().toString(),
    };

    setExpenses(prev => [expense, ...prev]);
    setNewExpense({
      amount: 0,
      description: '',
      category: 'Other',
      date: new Date().toISOString().split('T')[0],
      currency: 'USD'
    });

    toast({
      title: "Expense added",
      description: `${expense.description} (${expense.currency} ${expense.amount}) has been added.`
    });
  };

  const handleEditExpense = () => {
    if (!editingExpense) return;

    setExpenses(prev => 
      prev.map(exp => exp.id === editingExpense.id ? editingExpense : exp)
    );
    
    setEditingExpense(null);
    
    toast({
      title: "Expense updated",
      description: `${editingExpense.description} has been updated.`
    });
  };

  const handleDeleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
    
    toast({
      title: "Expense deleted",
      description: "The expense has been removed from your budget."
    });
  };

  const updateBudget = () => {
    if (tempBudget <= 0) {
      toast({
        variant: "destructive",
        title: "Invalid budget",
        description: "Budget must be greater than zero"
      });
      return;
    }
    
    setBudget(tempBudget);
    setShowBudgetEdit(false);
    
    toast({
      title: "Budget updated",
      description: `Your budget has been set to ${tempBudget}.`
    });
  };

  const renderStars = () => {
    return Array.from({ length: 20 }).map((_, i) => (
      <motion.div
        key={`star-${i}`}
        className="absolute text-yellow-400"
        style={{ 
          left: `${Math.random() * 100}%`, 
          top: `${Math.random() * 100}%`,
          opacity: Math.random() * 0.7 + 0.3
        }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.3, 0.7, 0.3]
        }}
        transition={{
          duration: 2 + Math.random() * 3,
          repeat: Infinity,
          delay: Math.random() * 2
        }}
      >
        <Star size={Math.random() * 10 + 5} fill="currentColor" />
      </motion.div>
    ));
  };

  return (
    <div className="container py-8 relative">
      {/* Background star animations */}
      {renderStars()}
      
      {/* Header section with animations */}
      <motion.div 
        className="mb-10 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="inline-block mb-4 text-6xl"
          animate={{ 
            rotate: [0, 10, 0, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ duration: 5, repeat: Infinity }}
        >
          💰
        </motion.div>
        <h1 className="text-4xl font-bold mb-4 text-gradient">
          <TypewriterText 
            text="Budget Tracker" 
            speed={50}
            gradientClass="bg-gradient-to-r from-emerald-600 to-teal-500 text-transparent bg-clip-text"
          />
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Keep track of your travel expenses and stay within your budget with our intuitive expense tracker.
        </p>
      </motion.div>

      {/* Budget overview cards with animations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="overflow-hidden border-2 border-green-500/20">
            <CardHeader className="bg-green-500/10 pb-2">
              <CardTitle className="flex items-center text-lg">
                <Wallet className="mr-2" size={18} />
                Total Budget
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold">${budget.toFixed(2)}</div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setTempBudget(budget);
                    setShowBudgetEdit(true);
                  }}
                >
                  <Edit size={16} />
                </Button>
              </div>
              
              <Dialog open={showBudgetEdit} onOpenChange={setShowBudgetEdit}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Set Your Budget</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Input
                        type="number"
                        placeholder="Enter your budget"
                        value={tempBudget}
                        onChange={(e) => setTempBudget(parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setShowBudgetEdit(false)}>
                      Cancel
                    </Button>
                    <Button onClick={updateBudget}>Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="overflow-hidden border-2 border-blue-500/20">
            <CardHeader className="bg-blue-500/10 pb-2">
              <CardTitle className="flex items-center text-lg">
                <DollarSign className="mr-2" size={18} />
                Total Spent
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="text-2xl font-bold">${totalSpent.toFixed(2)}</div>
              <div className="text-muted-foreground text-sm mt-1">
                {spentPercentage > 100 ? (
                  <span className="text-destructive">
                    Budget exceeded by ${(totalSpent - budget).toFixed(2)}
                  </span>
                ) : (
                  <span>{spentPercentage.toFixed(1)}% of budget used</span>
                )}
              </div>
              <div className="w-full bg-muted rounded-full h-2 mt-2">
                <motion.div 
                  className={`h-2 rounded-full ${
                    spentPercentage > 90 ? 'bg-destructive' : 'bg-blue-500'
                  }`}
                  initial={{ width: '0%' }}
                  animate={{ width: `${Math.min(spentPercentage, 100)}%` }}
                  transition={{ duration: 0.5 }}
                ></motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className={`overflow-hidden border-2 ${
            remainingBudget < 0 ? 'border-destructive/20' : 'border-emerald-500/20'
          }`}>
            <CardHeader className={`${
              remainingBudget < 0 ? 'bg-destructive/10' : 'bg-emerald-500/10'
            } pb-2`}>
              <CardTitle className="flex items-center text-lg">
                <Wallet className="mr-2" size={18} />
                Remaining Budget
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className={`text-2xl font-bold ${
                remainingBudget < 0 ? 'text-destructive' : ''
              }`}>
                ${remainingBudget.toFixed(2)}
              </div>
              <div className="text-muted-foreground text-sm mt-1">
                {remainingBudget < 0 
                  ? "You're over budget!" 
                  : remainingBudget < budget * 0.2
                    ? "Getting low, be careful!"
                    : "Your budget is on track"}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {/* Chart Tabs with animations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mb-8"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="mr-2" size={18} />
              Expense Analytics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="donut" className="w-full">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="donut">Category Breakdown</TabsTrigger>
                <TabsTrigger value="line">Spending Over Time</TabsTrigger>
                <TabsTrigger value="bar">Category Comparison</TabsTrigger>
              </TabsList>
              <TabsContent value="donut" className="pt-4">
                <div className="h-[300px] flex justify-center">
                  {expenses.length > 0 ? (
                    <Doughnut 
                      data={pieChartData} 
                      options={{ maintainAspectRatio: false }} 
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No expense data to display
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="line" className="pt-4">
                <div className="h-[300px]">
                  {sortedDates.length > 0 ? (
                    <Line 
                      data={lineChartData} 
                      options={{ 
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                          }
                        }
                      }} 
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No expense data to display
                    </div>
                  )}
                </div>
              </TabsContent>
              <TabsContent value="bar" className="pt-4">
                <div className="h-[300px]">
                  {expenses.length > 0 ? (
                    <Bar 
                      data={barChartData} 
                      options={{ 
                        maintainAspectRatio: false,
                        scales: {
                          y: {
                            beginAtZero: true,
                          }
                        }
                      }} 
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No expense data to display
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
      
      {/* Expense management section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="lg:col-span-1"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Plus className="mr-2" size={18} />
                Add New Expense
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Input
                      type="number"
                      placeholder="Amount"
                      value={newExpense.amount || ''}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) || 0 })}
                    />
                  </div>
                  <div>
                    <Select
                      value={newExpense.currency}
                      onValueChange={(value) => setNewExpense({ ...newExpense, currency: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {CURRENCIES.map(currency => (
                          <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <Input
                  placeholder="Description"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                />
                
                <Select
                  value={newExpense.category}
                  onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                />
                
                <motion.div 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    onClick={handleAddExpense} 
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-500"
                  >
                    <Plus size={16} className="mr-1" />
                    Add Expense
                  </Button>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="lg:col-span-2"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center">
                <Wallet className="mr-2" size={18} />
                Expense List
              </CardTitle>
              
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-muted-foreground" />
                <Select
                  value={filterCategory}
                  onValueChange={setFilterCategory}
                >
                  <SelectTrigger className="w-36">
                    <SelectValue placeholder="Filter" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Categories</SelectItem>
                    {CATEGORIES.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <AnimatePresence>
                  {filteredExpenses.length === 0 ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-6 text-muted-foreground"
                    >
                      No expenses found. Add some expenses to get started!
                    </motion.div>
                  ) : (
                    filteredExpenses.map((expense) => (
                      <motion.div
                        key={expense.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Card className="overflow-hidden">
                          <div className="p-4">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-medium">{expense.description}</div>
                                <div className="text-sm text-muted-foreground flex items-center gap-2">
                                  <span className="px-2 py-0.5 rounded-full bg-muted text-xs">
                                    {expense.category}
                                  </span>
                                  <span>{expense.date}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-lg font-semibold">
                                  {expense.currency} {expense.amount.toFixed(2)}
                                </span>
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button 
                                      variant="ghost" 
                                      size="icon"
                                      onClick={() => setEditingExpense(expense)}
                                    >
                                      <Edit size={16} />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Edit Expense</DialogTitle>
                                    </DialogHeader>
                                    {editingExpense && (
                                      <div className="space-y-4 py-4">
                                        <div className="grid grid-cols-2 gap-4">
                                          <div>
                                            <Input
                                              type="number"
                                              placeholder="Amount"
                                              value={editingExpense.amount || ''}
                                              onChange={(e) => setEditingExpense({ 
                                                ...editingExpense, 
                                                amount: parseFloat(e.target.value) || 0 
                                              })}
                                            />
                                          </div>
                                          <div>
                                            <Select
                                              value={editingExpense.currency}
                                              onValueChange={(value) => setEditingExpense({ 
                                                ...editingExpense, 
                                                currency: value 
                                              })}
                                            >
                                              <SelectTrigger>
                                                <SelectValue placeholder="Currency" />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {CURRENCIES.map(currency => (
                                                  <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                                                ))}
                                              </SelectContent>
                                            </Select>
                                          </div>
                                        </div>
                                        
                                        <Input
                                          placeholder="Description"
                                          value={editingExpense.description}
                                          onChange={(e) => setEditingExpense({ 
                                            ...editingExpense, 
                                            description: e.target.value 
                                          })}
                                        />
                                        
                                        <Select
                                          value={editingExpense.category}
                                          onValueChange={(value) => setEditingExpense({ 
                                            ...editingExpense, 
                                            category: value 
                                          })}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Category" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {CATEGORIES.map(category => (
                                              <SelectItem key={category} value={category}>{category}</SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                        
                                        <Input
                                          type="date"
                                          value={editingExpense.date}
                                          onChange={(e) => setEditingExpense({ 
                                            ...editingExpense, 
                                            date: e.target.value 
                                          })}
                                        />
                                      </div>
                                    )}
                                    <DialogFooter>
                                      <Button variant="outline" onClick={() => setEditingExpense(null)}>
                                        Cancel
                                      </Button>
                                      <Button onClick={handleEditExpense}>
                                        Save Changes
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>
                                <Button 
                                  variant="ghost" 
                                  size="icon"
                                  onClick={() => handleDeleteExpense(expense.id)}
                                >
                                  <Trash2 size={16} className="text-destructive" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      {/* Floating action button */}
      <motion.div
        className="fixed bottom-6 right-6 z-10"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Dialog>
          <DialogTrigger asChild>
            <Button 
              size="lg"
              className="rounded-full w-14 h-14 p-0 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-700 hover:to-teal-600 shadow-lg"
            >
              <Plus size={24} />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Expense</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    type="number"
                    placeholder="Amount"
                    value={newExpense.amount || ''}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) || 0 })}
                  />
                </div>
                <div>
                  <Select
                    value={newExpense.currency}
                    onValueChange={(value) => setNewExpense({ ...newExpense, currency: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map(currency => (
                        <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <Input
                placeholder="Description"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              />
              
              <Select
                value={newExpense.category}
                onValueChange={(value) => setNewExpense({ ...newExpense, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Input
                type="date"
                value={newExpense.date}
                onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
              />
            </div>
            <DialogFooter>
              <Button onClick={handleAddExpense}>
                Add Expense
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </motion.div>
      
      {/* Floating sparkle animation */}
      <motion.div
        className="fixed right-20 top-40 text-yellow-500 pointer-events-none"
        animate={{ 
          rotate: 360,
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{ 
          rotate: { duration: 10, repeat: Infinity, ease: "linear" },
          scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          opacity: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }}
      >
        <Sparkles size={64} />
      </motion.div>
    </div>
  );
};

export default BudgetTracker;
