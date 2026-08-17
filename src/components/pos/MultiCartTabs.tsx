import React from 'react';
import { Plus, X, ShoppingCart, Users, User, Building2 } from 'lucide-react';
import { usePOS } from '../../context/POSContext';

export const MultiCartTabs: React.FC = () => {
  const { heldCarts, activeCartIndex, setActiveCartIndex, addNewCart, closeCart } = usePOS();

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-[#30363d] bg-[#0d1117] p-2 rounded-t-xl">
      {heldCarts.map((cart, idx) => {
        const isActive = idx === activeCartIndex;
        const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        const subtotal = cart.items.reduce((sum, item) => sum + item.subtotal, 0);

        return (
          <div
            key={cart.id}
            onClick={() => setActiveCartIndex(idx)}
            className={`group relative flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold cursor-pointer transition-all border shrink-0 ${
              isActive
                ? 'bg-[#161b22] text-white border-emerald-500 shadow-md ring-1 ring-emerald-500/30'
                : 'bg-[#0a0b0d] text-gray-400 border-[#30363d] hover:bg-[#161b22] hover:text-gray-200'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <ShoppingCart className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-gray-500'}`} />
              <span className="max-w-[110px] truncate">{cart.name}</span>
            </div>

            <div className="flex items-center gap-1">
              <span
                className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    : 'bg-[#21262d] text-gray-400'
                }`}
              >
                {itemCount}
              </span>

              {subtotal > 0 && (
                <span className="text-[10px] font-mono text-gray-400 hidden sm:inline">
                  ₱{subtotal.toLocaleString()}
                </span>
              )}

              {/* Close Tab Button */}
              {heldCarts.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeCart(cart.id);
                  }}
                  className="text-gray-500 hover:text-rose-400 p-0.5 rounded hover:bg-[#21262d] transition ml-0.5"
                  title="Close and park this ticket"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        );
      })}

      {/* Add New Order Tab Button */}
      <button
        type="button"
        onClick={() => addNewCart()}
        className="flex items-center gap-1 px-2.5 py-2 text-xs font-bold text-gray-300 hover:text-emerald-400 hover:bg-[#21262d] bg-[#0a0b0d] rounded-lg transition border border-dashed border-[#30363d] shrink-0 cursor-pointer"
        title="Serve another customer in parallel (Multi-Cart)"
      >
        <Plus className="w-3.5 h-3.5 text-emerald-400" />
        <span className="hidden sm:inline">Serve Next Customer</span>
      </button>
    </div>
  );
};
