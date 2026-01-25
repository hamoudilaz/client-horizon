import { useTheme } from '../utils/ThemeContext';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import './ThemeToggle.css';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className='theme-toggle'
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      {theme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
    </button>
  );
}
