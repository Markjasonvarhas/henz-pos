import React from 'react';
import { Layers, Plus, Sparkles, Check } from 'lucide-react';
import { usePOS } from '../../context/POSContext';

export const QuickKitSelector: React.FC = () => {
  const { presetKits, loadPresetKitIntoCart } = usePOS();
  const [justAddedKitId, setJustAddedKitId] = React.useState<string | null>(null);

  const handleAddKit = (kitId: string) => {
    loadPresetKitIntoCart(kitId);
    setJustAddedKitId(kitId);
    setTimeout(() => setJustAddedKitId(null), 1500);
  };

  if (!presetKits || presetKits.length === 0) {
    return null;
  }

  return (
    <div className="bg-[#161b22] rounded-xl border border-[#30363d] p-3 shadow-md">
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center gap-1.5">
          <Layers className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Quick 1-Click Student & Clinic Duty Kits
          </h3>
        </div>
        <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
          <Sparkles className="w-2.5 h-2.5" />
          Fast-Load ({presetKits.length} Kits)
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
        {presetKits.map((kit) => {
          const isAdded = justAddedKitId === kit.id;
          return (
            <button
              key={kit.id}
              onClick={() => handleAddKit(kit.id)}
              className={`text-left p-2.5 rounded-lg border transition-all relative overflow-hidden flex flex-col justify-between cursor-pointer group ${
                isAdded
                  ? 'border-emerald-500 bg-emerald-950/40 text-emerald-100 ring-1 ring-emerald-500'
                  : 'bg-[#0d1117] border-[#30363d] hover:border-emerald-500/50 hover:bg-[#1f242c]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-1">
                  <span className="text-xs font-bold text-white group-hover:text-emerald-400 line-clamp-1">
                    {kit.name}
                  </span>
                  {kit.discountPercentage && (
                    <span className="text-[9px] font-bold text-amber-300 bg-amber-500/10 px-1 py-0.2 rounded border border-amber-500/30 shrink-0">
                      -{kit.discountPercentage}%
                    </span>
                  )}
                </div>
                <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">
                  {kit.targetAudience}
                </p>
              </div>

              <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-[#30363d] text-[10px]">
                <span className="text-gray-400 font-medium">{kit.items.length} items bundle</span>
                <span
                  className={`flex items-center gap-0.5 font-bold ${
                    isAdded ? 'text-emerald-400' : 'text-emerald-400 group-hover:text-emerald-300'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Added!</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3 h-3" />
                      <span>Add All</span>
                    </>
                  )}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
