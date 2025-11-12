import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { BrowserRouter } from 'react-router';
import ThemeProvider from '@/providers/ThemeProvider.tsx';

createRoot(document.getElementById('root')!).render(
  // <ScrollToTop />
  <ThemeProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ThemeProvider>,
);
