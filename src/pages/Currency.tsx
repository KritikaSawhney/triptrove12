import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { ArrowLeftRight, Clock, X, Wallet, TrendingUp, BadgeDollarSign } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import TypewriterText from '@/components/TypewriterText';

// Sample currency data - in a real app this would come from an API
const currencyData = {
  USD: { name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
  EUR: { name: 'Euro', symbol: '€', flag: '🇪🇺' },
  GBP: { name: 'British Pound', symbol: '£', flag: '🇬🇧' },
  JPY: { name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
  AUD: { name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
  CAD: { name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
  CHF: { name: 'Swiss Franc', symbol: 'Fr', flag: '🇨🇭' },
  CNY: { name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
  INR: { name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
  MXN: { name: 'Mexican Peso', symbol: 'Mex$', flag: '🇲🇽' },
  BRL: { name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
};

// Sample exchange rates (relative to USD) - in a real app these would come from an API
const exchangeRates = {
  USD: 1,
  EUR: 0.91,
  GBP: 0.78,
  JPY: 150.59,
  AUD: 1.51,
  CAD: 1.36,
  CHF: 0.89,
  CNY: 7.19,
  INR: 83.48,
  MXN: 17.10,
  BRL: 5.04,
};

interface ConversionHistoryItem {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  amount: number;
  result: number;
  date: Date;
}

// 3D Floating Coin component
const FloatingCoin = ({ emoji, delay = 0 }: { emoji: string; delay?: number }) => {
  return (
    <motion.div
      className="absolute text-4xl pointer-events-none"
      style={{ 
        left: `${Math.random() * 80 + 10}%`,
        top: `${Math.random() * 70 + 15}%`,
        zIndex: 0
      }}
      initial={{ opacity: 0, y: 100 }}
      animate={{ 
        opacity: [0.2, 0.7, 0.2],
        y: [0, -30, 0],
        rotate: [0, 360]
      }}
      transition={{
        delay,
        duration: 10,
        repeat: Infinity,
        repeatType: "loop"
      }}
    >
      {emoji}
    </motion.div>
  );
};

const Currency = () => {
  const [amount, setAmount] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState<string>('USD');
  const [toCurrency, setToCurrency] = useState<string>('EUR');
  const [result, setResult] = useState<number | null>(null);
  const [history, setHistory] = useState<ConversionHistoryItem[]>([]);
  const [showAnimation, setShowAnimation] = useState(false);
  
  // Calculate conversion on currency or amount change
  useEffect(() => {
    if (amount && fromCurrency && toCurrency) {
      // Convert to USD first (if not already USD), then to target currency
      const valueInUSD = amount / exchangeRates[fromCurrency as keyof typeof exchangeRates];
      const convertedValue = valueInUSD * exchangeRates[toCurrency as keyof typeof exchangeRates];
      setResult(convertedValue);
    }
  }, [amount, fromCurrency, toCurrency]);
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add to history
    if (result !== null) {
      const newHistoryItem: ConversionHistoryItem = {
        id: Date.now().toString(),
        fromCurrency,
        toCurrency,
        amount,
        result,
        date: new Date(),
      };
      
      setHistory(prev => [newHistoryItem, ...prev.slice(0, 9)]);
      setShowAnimation(true);
      
      // Show success toast
      toast("Conversion saved to history!", {
        description: `${formatCurrency(amount, fromCurrency)} to ${formatCurrency(result, toCurrency)}`,
        action: {
          label: "View",
          onClick: () => console.log("Viewed conversion history"),
        },
      });
      
      // Reset animation state
      setTimeout(() => setShowAnimation(false), 1000);
    }
  };
  
  // Swap currencies
  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };
  
  // Remove item from history
  const removeHistoryItem = (id: string) => {
    setHistory(prev => prev.filter(item => item.id !== id));
    toast("Removed from history", {
      description: "Currency conversion removed from history",
    });
  };
  
  // Format currency with symbol
  const formatCurrency = (value: number, currencyCode: string) => {
    const currency = currencyData[currencyCode as keyof typeof currencyData];
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      currencyDisplay: 'narrowSymbol',
    }).format(value);
  };

  // Get currency info for display
  const getCurrencyInfo = (code: string) => {
    const currency = currencyData[code as keyof typeof currencyData];
    return {
      code,
      name: currency?.name || '',
      symbol: currency?.symbol || '',
      flag: currency?.flag || '',
    };
  };

  const fromCurrencyInfo = getCurrencyInfo(fromCurrency);
  const toCurrencyInfo = getCurrencyInfo(toCurrency);

  // Generate floating coins
  const coins = ['💵', '💶', '💷', '💴', '🪙', '💰'];
  
  return (
    <motion.div 
      className="container py-8 relative overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Floating background coins */}
      {coins.map((coin, idx) => (
        <FloatingCoin key={idx} emoji={coin} delay={idx * 1.5} />
      ))}
      
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="relative z-10"
      >
        <div className="flex items-center">
          <motion.span
            animate={{ 
              rotate: [0, 10, 0, -10, 0],
              scale: [1, 1.2, 1]
            }}
            transition={{ duration: 3, repeat: Infinity }}
            className="text-4xl mr-3"
          >
            💱
          </motion.span>
          <h1 className="text-3xl font-bold mb-2">
            <TypewriterText text="Currency Converter" />
          </h1>
        </div>
        <p className="text-muted-foreground mb-8 ml-11">
          Convert between currencies with real-time exchange rates
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Converter Card */}
        <motion.div 
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card className="overflow-hidden transition-all duration-500 hover:shadow-xl transform hover:translate-y-[-5px]">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
              <CardTitle>
                <BadgeDollarSign className="inline mr-2 mb-1" />
                Convert Currency
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                  {/* Amount Input */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">
                      Amount
                    </label>
                    <Input 
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                      className="w-full transition-all duration-300 hover:shadow-md focus:shadow-lg"
                      required
                    />
                  </div>
                  
                  {/* From Currency */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      From
                    </label>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <div>
                          <Select
                            value={fromCurrency}
                            onValueChange={(value) => setFromCurrency(value)}
                          >
                            <SelectTrigger className="w-full transition-all duration-300 hover:border-primary focus:border-primary">
                              <SelectValue>
                                <div className="flex items-center">
                                  <span className="mr-2">{fromCurrencyInfo.flag}</span>
                                  <span>{fromCurrencyInfo.code}</span>
                                </div>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="max-h-80">
                              {Object.entries(currencyData).map(([code, { name, flag }]) => (
                                <SelectItem 
                                  key={code} 
                                  value={code}
                                  className="transition-colors duration-200 hover:bg-primary/10"
                                >
                                  <motion.span 
                                    className="flex items-center gap-2"
                                    whileHover={{ scale: 1.02 }}
                                  >
                                    <span>{flag}</span>
                                    <span>{code} - {name}</span>
                                  </motion.span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent className="p-2 w-auto">
                        <div className="text-sm">
                          <p className="font-medium">{fromCurrencyInfo.name}</p>
                          <p className="text-muted-foreground">Symbol: {fromCurrencyInfo.symbol}</p>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                  
                  {/* Swap Button */}
                  <div className="flex items-end justify-center">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon"
                      onClick={handleSwapCurrencies}
                      className="transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
                    >
                      <motion.div
                        whileHover={{ rotate: 180 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ArrowLeftRight className="h-4 w-4" />
                      </motion.div>
                    </Button>
                  </div>
                  
                  {/* To Currency */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      To
                    </label>
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <div>
                          <Select
                            value={toCurrency}
                            onValueChange={(value) => setToCurrency(value)}
                          >
                            <SelectTrigger className="w-full transition-all duration-300 hover:border-primary focus:border-primary">
                              <SelectValue>
                                <div className="flex items-center">
                                  <span className="mr-2">{toCurrencyInfo.flag}</span>
                                  <span>{toCurrencyInfo.code}</span>
                                </div>
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="max-h-80">
                              {Object.entries(currencyData).map(([code, { name, flag }]) => (
                                <SelectItem 
                                  key={code} 
                                  value={code}
                                  className="transition-colors duration-200 hover:bg-primary/10"
                                >
                                  <motion.span 
                                    className="flex items-center gap-2"
                                    whileHover={{ scale: 1.02 }}
                                  >
                                    <span>{flag}</span>
                                    <span>{code} - {name}</span>
                                  </motion.span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </HoverCardTrigger>
                      <HoverCardContent className="p-2 w-auto">
                        <div className="text-sm">
                          <p className="font-medium">{toCurrencyInfo.name}</p>
                          <p className="text-muted-foreground">Symbol: {toCurrencyInfo.symbol}</p>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  </div>
                </div>
                
                {/* Result with enhanced animation */}
                <div className="bg-gradient-to-r from-muted to-muted/50 p-6 rounded-lg mb-6 transform transition-all duration-500 hover:shadow-md">
                  <div className="flex flex-col items-center">
                    <p className="text-sm text-muted-foreground mb-2">
                      {amount} {fromCurrency} equals
                    </p>
                    <motion.div 
                      className="perspective-card"
                      whileHover={{ rotateY: 5, rotateX: 5 }}
                      transition={{ duration: 0.5 }}
                    >
                      <motion.p 
                        className="text-3xl font-bold mb-2"
                        animate={showAnimation ? { 
                          scale: [1, 1.1, 1],
                          color: ['currentColor', '#10b981', 'currentColor']
                        } : {}}
                        transition={{ duration: 0.5 }}
                      >
                        {result !== null ? formatCurrency(result, toCurrency) : '—'}
                      </motion.p>
                    </motion.div>
                    <div className="flex items-center text-xs text-muted-foreground">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <p>
                        1 {fromCurrency} = {formatCurrency(exchangeRates[toCurrency as keyof typeof exchangeRates] / exchangeRates[fromCurrency as keyof typeof exchangeRates], toCurrency)}
                      </p>
                    </div>
                  </div>
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button 
                    type="submit" 
                    className="w-full transition-all duration-300 hover:shadow-lg transform hover:translate-y-[-2px]"
                  >
                    Save Conversion to History
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
        
        {/* Conversion History */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <Card className="transition-all duration-500 hover:shadow-xl h-full transform hover:translate-y-[-5px]">
            <CardHeader className="bg-gradient-to-r from-accent/10 to-accent/5">
              <CardTitle>
                <Clock className="inline mr-2 mb-1" />
                Conversion History
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AnimatePresence>
                {history.length > 0 ? (
                  <motion.div className="space-y-4">
                    {history.map((item, index) => (
                      <motion.div 
                        key={item.id}
                        className="p-3 border rounded-md flex justify-between hover:bg-muted/50 transition-all duration-300"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * index, duration: 0.3 }}
                        whileHover={{ 
                          scale: 1.02,
                          boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                        }}
                        exit={{ opacity: 0, x: -100 }}
                      >
                        <div>
                          <p className="font-medium">
                            {formatCurrency(item.amount, item.fromCurrency)} → {formatCurrency(item.result, item.toCurrency)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(item.date).toLocaleString()}
                          </p>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeHistoryItem(item.id)}
                          className="opacity-60 hover:opacity-100 transition-opacity duration-200"
                        >
                          <motion.div whileHover={{ rotate: 90 }} transition={{ duration: 0.2 }}>
                            <X className="h-4 w-4" />
                          </motion.div>
                        </Button>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <motion.div 
                    className="text-center py-8 text-muted-foreground"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, 0, -5, 0]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="text-4xl mb-4"
                    >
                      📊
                    </motion.div>
                    No conversion history yet. Save a conversion to see it here.
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Currency;
