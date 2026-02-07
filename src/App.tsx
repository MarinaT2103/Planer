import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import {
  Home,
  DayPlans,
  WeekPlans,
  MonthPlans,
  YearPlans,
  Habits,
  Finance,
  Notes,
  Meetings,
  Important,
  Settings,
  More
} from '@/pages';
import { PasswordLock } from '@/components/auth';
import { useTheme } from '@/hooks/useTheme';
import { useOffline } from '@/hooks/useOffline';

function App() {
  // Initialize theme
  useTheme();
  
  // Monitor offline status
  useOffline();

  return (
    <PasswordLock>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/plans/day" element={<DayPlans />} />
          <Route path="/plans/week" element={<WeekPlans />} />
          <Route path="/plans/month" element={<MonthPlans />} />
          <Route path="/plans/year" element={<YearPlans />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/meetings" element={<Meetings />} />
          <Route path="/important" element={<Important />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/more" element={<More />} />
        </Routes>
        
          <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#fff',
              color: '#374151',
              borderRadius: '1rem',
              padding: '0.75rem 1rem',
              boxShadow: '0 4px 16px rgba(255, 107, 138, 0.15)'
            },
            success: {
              iconTheme: {
                primary: '#FF6B8A',
                secondary: '#fff'
              }
            },
            error: {
              iconTheme: {
                primary: '#EF4444',
                secondary: '#fff'
              }
            }
          }}
        />
      </BrowserRouter>
    </PasswordLock>
  );
}

export default App;
