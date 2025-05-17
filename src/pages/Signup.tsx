
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Globe, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../App';
import { useToast } from '@/hooks/use-toast';

// Animated star component
const TwinklingStar = ({ delay, x, y, size = 4 }: { delay: number; x: number; y: number; size?: number }) => (
  <motion.div 
    className="absolute text-primary/20"
    style={{ left: `${x}%`, top: `${y}%` }}
    initial={{ opacity: 0.2, scale: 0.8 }}
    animate={{ 
      opacity: [0.2, 0.7, 0.2],
      scale: [0.8, 1.2, 0.8],
    }}
    transition={{
      duration: 3,
      delay,
      repeat: Infinity,
      repeatType: "loop"
    }}
  >
    <Star size={size} fill="currentColor" />
  </motion.div>
);

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/');
    return null;
  }
  
  // Generate stars - more and larger
  const stars = Array.from({ length: 25 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 3,
    size: Math.random() * 6 + 3 // Larger stars
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Basic validation
      if (password.length < 6) {
        toast({
          variant: "destructive",
          title: "Invalid password",
          description: "Password must be at least 6 characters long.",
        });
        setIsLoading(false);
        return;
      }
      
      const success = signup(name, email, password);
      
      if (success) {
        toast({
          title: "Account created!",
          description: "Welcome to TripTrove.",
        });
        navigate('/');
      } else {
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: "An account with this email already exists.",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Registration error",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* Background stars */}
      {stars.map((star) => (
        <TwinklingStar 
          key={`signup-${star.id}`}
          delay={star.delay} 
          x={star.x} 
          y={star.y} 
          size={star.size}
        />
      ))}
      
      <motion.div 
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Card className="w-full shadow-xl border-primary/10">
          <CardHeader className="text-center">
            <motion.div 
              className="flex justify-center mb-4"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              >
                <Globe className="h-12 w-12 text-primary" />
              </motion.div>
            </motion.div>
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription>
              Sign up to start planning your trips with TripTrove
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                />
              </motion.div>
              
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="name@example.com"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                />
              </motion.div>
              
              <motion.div 
                className="space-y-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="transition-all duration-300 focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-muted-foreground">
                  Password must be at least 6 characters long
                </p>
              </motion.div>
              
              <motion.div 
                className="flex items-center space-x-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Checkbox id="terms" required />
                <label
                  htmlFor="terms"
                  className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  I agree to the{' '}
                  <Link to="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </label>
              </motion.div>
            </CardContent>
            <CardFooter className="flex flex-col">
              <motion.div 
                className="w-full"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? 'Creating account...' : 'Sign up'}
                </Button>
              </motion.div>
              <motion.div 
                className="mt-4 text-center text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </motion.div>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  );
};

export default Signup;
