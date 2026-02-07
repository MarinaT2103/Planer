import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Delete } from 'lucide-react';
import { cn } from '@/utils/cn';

const CORRECT_PIN = '1590';
const AUTH_KEY = 'planner_authenticated';
const AUTH_EXPIRY = 'planner_auth_expiry';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface PasswordLockProps {
  children: React.ReactNode;
}

export const PasswordLock = ({ children }: PasswordLockProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if already authenticated
    const authExpiry = localStorage.getItem(AUTH_EXPIRY);
    if (authExpiry && Date.now() < parseInt(authExpiry)) {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleNumberClick = (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      setError(false);

      if (newPin.length === 4) {
        if (newPin === CORRECT_PIN) {
          // Save authentication
          localStorage.setItem(AUTH_KEY, 'true');
          localStorage.setItem(AUTH_EXPIRY, (Date.now() + SESSION_DURATION).toString());
          setTimeout(() => setIsAuthenticated(true), 300);
        } else {
          setError(true);
          setTimeout(() => setPin(''), 500);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin(pin.slice(0, -1));
    setError(false);
  };

  const handleClear = () => {
    setPin('');
    setError(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-pink-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-pink-300 border-t-pink-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-pink-100 dark:from-gray-950 dark:to-gray-900 flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="mb-8"
      >
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-400 to-pink-500 flex items-center justify-center shadow-lg">
          <Lock className="w-10 h-10 text-white" />
        </div>
      </motion.div>

      {/* Title */}
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="text-2xl font-bold text-gray-800 dark:text-white mb-2"
      >
        Планировщик
      </motion.h1>
      <motion.p
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-gray-500 dark:text-gray-400 mb-8"
      >
        Введите PIN-код
      </motion.p>

      {/* PIN dots */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex gap-4 mb-8"
      >
        {[0, 1, 2, 3].map((i) => (
          <motion.div
            key={i}
            animate={error ? { x: [-5, 5, -5, 5, 0] } : {}}
            transition={{ duration: 0.3 }}
            className={cn(
              'w-4 h-4 rounded-full transition-all duration-200',
              i < pin.length
                ? error
                  ? 'bg-red-500'
                  : 'bg-pink-500 scale-110'
                : 'bg-pink-200 dark:bg-pink-900/50'
            )}
          />
        ))}
      </motion.div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-red-500 text-sm mb-4"
          >
            Неверный PIN-код
          </motion.p>
        )}
      </AnimatePresence>

      {/* Number pad */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-3 gap-4"
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handleNumberClick(num.toString())}
            className="w-16 h-16 rounded-2xl bg-white dark:bg-gray-800 shadow-soft flex items-center justify-center text-2xl font-semibold text-gray-800 dark:text-white hover:bg-pink-50 dark:hover:bg-pink-900/30 active:scale-95 transition-all"
          >
            {num}
          </button>
        ))}
        <button
          onClick={handleClear}
          className="w-16 h-16 rounded-2xl bg-white dark:bg-gray-800 shadow-soft flex items-center justify-center text-gray-400 hover:bg-pink-50 dark:hover:bg-pink-900/30 active:scale-95 transition-all"
        >
          <span className="text-sm">Очист.</span>
        </button>
        <button
          onClick={() => handleNumberClick('0')}
          className="w-16 h-16 rounded-2xl bg-white dark:bg-gray-800 shadow-soft flex items-center justify-center text-2xl font-semibold text-gray-800 dark:text-white hover:bg-pink-50 dark:hover:bg-pink-900/30 active:scale-95 transition-all"
        >
          0
        </button>
        <button
          onClick={handleDelete}
          className="w-16 h-16 rounded-2xl bg-white dark:bg-gray-800 shadow-soft flex items-center justify-center text-gray-400 hover:bg-pink-50 dark:hover:bg-pink-900/30 active:scale-95 transition-all"
        >
          <Delete className="w-6 h-6" />
        </button>
      </motion.div>
    </div>
  );
};
