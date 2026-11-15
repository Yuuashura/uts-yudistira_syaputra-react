import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CartProvider } from './context/CartContext';
import { NotificationProvider } from './context/NotificationContext';
import { ToastProvider } from './context/ToastContext';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <NotificationProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </NotificationProvider>
    </ToastProvider>
  </StrictMode>,
);
