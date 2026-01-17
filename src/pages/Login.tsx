import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, getRoleDashboardPath } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ChefHat, Eye, EyeOff, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }

    const success = login(username, password);
    if (success) {
      const user = { role: username === 'store1' ? 'franchise_store' : username === 'kitchen1' ? 'central_kitchen' : username === 'supply1' ? 'supply_coordinator' : username === 'manager1' ? 'manager' : 'admin' } as const;
      navigate(getRoleDashboardPath(user.role));
    } else {
      setError('Invalid username or password');
    }
  };

  const demoAccounts = [
    { username: 'store1', role: 'Franchise Store Staff' },
    { username: 'kitchen1', role: 'Central Kitchen Staff' },
    { username: 'supply1', role: 'Supply Coordinator' },
    { username: 'manager1', role: 'Manager' },
    { username: 'admin1', role: 'Admin' },
  ];

  const handleDemoLogin = (demoUsername: string) => {
    setUsername(demoUsername);
    setPassword('123456');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary to-primary/80" />
        <div className="relative z-10 flex flex-col justify-center p-12 text-primary-foreground">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur flex items-center justify-center">
              <ChefHat className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">CK Manager</h1>
              <p className="text-primary-foreground/70">Central Kitchen Management</p>
            </div>
          </div>
          <h2 className="text-4xl font-semibold leading-tight mb-4">
            Streamline Your<br />Kitchen Operations
          </h2>
          <p className="text-lg text-primary-foreground/80 max-w-md">
            Manage ordering, production, inventory, and distribution between Central Kitchen and Franchise Stores seamlessly.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-3xl font-bold">156</p>
              <p className="text-sm text-primary-foreground/70">Orders Today</p>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-xl p-4">
              <p className="text-3xl font-bold">94%</p>
              <p className="text-sm text-primary-foreground/70">Delivery Rate</p>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-white/5" />
        <div className="absolute -top-10 -right-10 w-64 h-64 rounded-full bg-white/5" />
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
              <ChefHat className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">CK Manager</h1>
              <p className="text-sm text-muted-foreground">Central Kitchen</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-foreground">Welcome back</h2>
            <p className="text-muted-foreground mt-1">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-11 text-base">
              Sign In
            </Button>
          </form>

          {/* Demo Accounts */}
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Demo Accounts</span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {demoAccounts.map((account) => (
                <button
                  key={account.username}
                  type="button"
                  onClick={() => handleDemoLogin(account.username)}
                  className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors text-left"
                >
                  <div>
                    <p className="text-sm font-medium text-foreground">{account.role}</p>
                    <p className="text-xs text-muted-foreground">{account.username} / 123456</p>
                  </div>
                  <span className="text-xs text-primary">Use →</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
