import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef } from 'react';
import { menu } from '../data/menu.js';
import useLocalStorage from '../hooks/useLocalStorage.js';
import { calculateTotals } from '../utils/pricing.js';
import { createCartReducer, createInitialState, restoreState, selectItems, transition, validateCartState } from '../utils/cartReducer.js';

const CartContext = createContext(null);
const reducer = createCartReducer(menu);
const validateSnapshot = (value) => validateCartState(value, menu);
export const CART_STORAGE_KEY = 'kopiku-cart';
let checkoutSequence = 0;

export function CartProvider({ children }) {
  const [snapshot, setSnapshot, storageError] = useLocalStorage(
    CART_STORAGE_KEY, () => createInitialState(menu), validateSnapshot,
  );
  const [state, dispatch] = useReducer(reducer, snapshot, (saved) => restoreState(saved, menu));
  // This ref advances immediately in the handler, not in an effect or render.
  // React can batch dispatches; a second checkout must still see an empty cart.
  const current = useRef(state);
  useEffect(() => { setSnapshot(state); }, [state, setSnapshot]);

  const act = useCallback((type, payload = {}) => {
    const action = { type, payload };
    if (type === 'CHECKOUT') {
      checkoutSequence += 1;
      action.payload = {
        id: `KK-${globalThis.crypto?.randomUUID?.() || `${Date.now()}-${checkoutSequence}`}`,
        createdAt: new Date().toISOString(),
      };
    }
    const outcome = transition(current.current, action, menu);
    if (outcome.result.ok) {
      current.current = outcome.state;
      dispatch(action);
    }
    return outcome.result;
  }, []);

  const value = useMemo(() => {
    const items = selectItems(state, menu);
    return {
      state, items, totals: calculateTotals(items, state.promoCode),
      count: items.reduce((sum, item) => sum + item.quantity, 0), act, storageError,
    };
  }, [state, act, storageError]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart harus digunakan di dalam CartProvider.');
  return context;
}
