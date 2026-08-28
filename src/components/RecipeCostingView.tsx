import React, { useState } from 'react';
import { MenuItem, InventoryItem, Recipe, RecipeIngredient } from '../types';
import { formatCOP } from '../utils/formatters';
import {
  UtensilsCrossed,
  TrendingUp,
  DollarSign,
  Plus,
  Trash2,
  Edit3,
  AlertTriangle,
  CheckCircle2,
  PieChart,
  Calculator,
  Search
} from 'lucide-react';

interface RecipeCostingViewProps {
  menuItems: MenuItem[];
  inventoryItems: InventoryItem[];
  recipes: Recipe[];
  onUpdateRecipe: (updatedRecipe: Recipe) => void;
}

export function RecipeCostingView({
  menuItems,
  inventoryItems,
  recipes,
  onUpdateRecipe
}: RecipeCostingViewProps) {
  const [selectedMenuItemId, setSelectedMenuItemId] = useState<string>(
    menuItems[0]?.id || ''
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  const selectedMenuItem = menuItems.find((m) => m.id === selectedMenuItemId) || menuItems[0];
  const existingRecipe = recipes.find((r) => r.menuItemId === selectedMenuItemId);

  // Form state for editing or creating recipe
  const [draftIngredients, setDraftIngredients] = useState<RecipeIngredient[]>(
    existingRecipe ? existingRecipe.ingredients : []
  );
  const [draftNotes, setDraftNotes] = useState<string>(
    existingRecipe?.preparationNotes || ''
  );

  // When changing item, sync draft state
  const handleSelectMenuItem = (itemId: string) => {
    setSelectedMenuItemId(itemId);
    const recipe = recipes.find((r) => r.menuItemId === itemId);
    setDraftIngredients(recipe ? recipe.ingredients : []);
    setDraftNotes(recipe?.preparationNotes || '');
    setIsEditing(false);
  };

  // Calculate costs for a recipe
  const calculateTotalCost = (ingredients: RecipeIngredient[]) => {
    return ingredients.reduce((sum, ing) => {
      // Find latest inventory item cost if available
      const invItem = inventoryItems.find((i) => i.id === ing.inventoryItemId);
      const costPerUnit = invItem ? invItem.costPerUnit : ing.unitCost;
      return sum + ing.quantityNeeded * costPerUnit;
    }, 0);
  };

  const totalCost = calculateTotalCost(draftIngredients);
  const sellingPrice = selectedMenuItem ? selectedMenuItem.price : 0;
  const grossProfit = sellingPrice - totalCost;
  const foodCostPercent = sellingPrice > 0 ? (totalCost / sellingPrice) * 100 : 0;
  const marginPercent = sellingPrice > 0 ? (grossProfit / sellingPrice) * 100 : 0;

  // Food cost status badge helper
  const getFoodCostBadge = (percent: number) => {
    if (percent <= 35) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30">
          <CheckCircle2 size={13} /> Excelente (Costo &lt; 35%)
        </span>
      );
    } else if (percent <= 45) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/30">
          <AlertTriangle size={13} /> Moderado (35% - 45%)
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/30">
          <AlertTriangle size={13} /> Crítico (Food Cost &gt; 45%)
        </span>
      );
    }
  };

  // Ingredient management inside draft
  const handleAddIngredient = (invItemId: string) => {
    const invItem = inventoryItems.find((i) => i.id === invItemId);
    if (!invItem) return;

    if (draftIngredients.some((ing) => ing.inventoryItemId === invItemId)) {
      alert('El insumo ya está agregado en el escandallo.');
      return;
    }

    setDraftIngredients([
      ...draftIngredients,
      {
        inventoryItemId: invItem.id,
        inventoryItemName: invItem.name,
        quantityNeeded: 1,
        unit: invItem.unit,
        unitCost: invItem.costPerUnit
      }
    ]);
  };

  const handleUpdateQuantity = (invItemId: string, qty: number) => {
    setDraftIngredients(
      draftIngredients.map((ing) =>
        ing.inventoryItemId === invItemId
          ? { ...ing, quantityNeeded: Math.max(0.01, qty) }
          : ing
      )
    );
  };

  const handleRemoveIngredient = (invItemId: string) => {
    setDraftIngredients(
      draftIngredients.filter((ing) => ing.inventoryItemId !== invItemId)
    );
  };

  const handleSaveRecipe = () => {
    const updated: Recipe = {
      id: existingRecipe ? existingRecipe.id : 'rec-' + Date.now(),
      menuItemId: selectedMenuItem.id,
      menuItemName: selectedMenuItem.name,
      yieldServings: 1,
      ingredients: draftIngredients,
      preparationNotes: draftNotes
    };
    onUpdateRecipe(updated);
    setIsEditing(false);
  };

  const filteredMenuItems = menuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.plu.includes(searchQuery)
  );

  return (
    <div className="flex-1 h-full flex flex-col lg:flex-row overflow-hidden bg-[#131313] p-4 lg:p-6 gap-6">
      {/* 1. Left Selector Sidebar: Menu Items List */}
      <div className="w-full lg:w-80 flex flex-col bg-[#1e1e1e] rounded-2xl border border-[#2a2a2a] overflow-hidden shadow-xl">
        <div className="p-4 border-b border-[#2a2a2a] bg-[#1a1a1a]">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <UtensilsCrossed size={18} className="text-[#f8bd2a]" />
            Escandallos y Platos
          </h2>
          <p className="text-xs text-[#a0a0a0] mt-0.5">
            Selecciona un plato para ver o costear su receta
          </p>

          <div className="mt-3 relative">
            <Search className="absolute left-3 top-2.5 text-gray-500" size={15} />
            <input
              type="text"
              placeholder="Buscar por plato o PLU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-[#262626] text-xs text-white rounded-lg border border-[#333] focus:outline-none focus:border-[#f8bd2a]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-[#262626] custom-scrollbar">
          {filteredMenuItems.map((item) => {
            const recipe = recipes.find((r) => r.menuItemId === item.id);
            const cost = recipe ? calculateTotalCost(recipe.ingredients) : 0;
            const margin = item.price > 0 ? ((item.price - cost) / item.price) * 100 : 0;

            const isSelected = item.id === selectedMenuItemId;

            return (
              <button
                key={item.id}
                onClick={() => handleSelectMenuItem(item.id)}
                className={`w-full text-left p-3 flex items-center gap-3 transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#d32f2f]/10 border-l-4 border-[#d32f2f] text-white'
                    : 'hover:bg-[#242424] text-gray-300'
                }`}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-11 h-11 rounded-lg object-cover bg-black/40 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-xs text-white truncate">
                      {item.name}
                    </span>
                    <span className="text-[10px] bg-[#2a2a2a] text-gray-400 px-1.5 py-0.5 rounded font-mono">
                      #{item.plu}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-1 text-[11px]">
                    <span className="text-[#f8bd2a] font-bold">
                      {formatCOP(item.price)}
                    </span>
                    {recipe ? (
                      <span
                        className={`font-semibold ${
                          margin >= 55 ? 'text-[#10b981]' : 'text-amber-400'
                        }`}
                      >
                        Margen: {margin.toFixed(0)}%
                      </span>
                    ) : (
                      <span className="text-gray-500 italic text-[10px]">
                        Sin receta
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Main Recipe Analysis Canvas */}
      <div className="flex-1 flex flex-col bg-[#1e1e1e] rounded-2xl border border-[#2a2a2a] overflow-hidden shadow-xl min-w-0">
        {selectedMenuItem ? (
          <>
            {/* Header: Item Details & KPI Cards */}
            <div className="p-5 border-b border-[#2a2a2a] bg-[#191919] flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={selectedMenuItem.image}
                  alt={selectedMenuItem.name}
                  className="w-16 h-16 rounded-xl object-cover border border-[#333] shadow"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl font-black text-white">
                      {selectedMenuItem.name}
                    </h1>
                    <span className="text-xs px-2 py-0.5 rounded bg-[#2a2a2a] text-[#f8bd2a] font-mono">
                      PLU #{selectedMenuItem.plu}
                    </span>
                  </div>
                  <p className="text-xs text-[#a0a0a0] mt-0.5 max-w-md line-clamp-1">
                    {selectedMenuItem.description}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    {getFoodCostBadge(foodCostPercent)}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-[#d32f2f] hover:bg-[#b71c1c] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow cursor-pointer"
                  >
                    <Edit3 size={15} /> Editar Escandallo
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-[#2a2a2a] hover:bg-[#333] text-gray-300 text-xs font-semibold rounded-xl transition-all cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleSaveRecipe}
                      className="px-4 py-2 bg-[#10b981] hover:bg-[#059669] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow cursor-pointer"
                    >
                      <CheckCircle2 size={15} /> Guardar Receta
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Financial Highlights Dashboard */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-[#141414] border-b border-[#2a2a2a]">
              <div className="p-3 bg-[#1e1e1e] rounded-xl border border-[#2a2a2a]">
                <span className="text-[11px] text-gray-400 font-medium block">
                  Precio de Venta al Público
                </span>
                <span className="text-lg font-black text-[#f8bd2a] mt-0.5 block">
                  {formatCOP(sellingPrice)}
                </span>
              </div>

              <div className="p-3 bg-[#1e1e1e] rounded-xl border border-[#2a2a2a]">
                <span className="text-[11px] text-gray-400 font-medium block">
                  Costo de Insumos (Food Cost)
                </span>
                <span className="text-lg font-black text-[#ef4444] mt-0.5 block">
                  {formatCOP(totalCost)}
                </span>
              </div>

              <div className="p-3 bg-[#1e1e1e] rounded-xl border border-[#2a2a2a]">
                <span className="text-[11px] text-gray-400 font-medium block">
                  Utilidad Bruta por Unidad
                </span>
                <span className="text-lg font-black text-[#10b981] mt-0.5 block">
                  {formatCOP(grossProfit)}
                </span>
              </div>

              <div className="p-3 bg-[#1e1e1e] rounded-xl border border-[#2a2a2a]">
                <span className="text-[11px] text-gray-400 font-medium block">
                  Margen Bruto de Ganancia
                </span>
                <span className="text-lg font-black text-[#3b82f6] mt-0.5 block">
                  {marginPercent.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* Recipe Ingredients Breakdown Table */}
            <div className="flex-1 p-5 overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Calculator size={16} className="text-[#f8bd2a]" />
                  Desglose de Ingredientes e Insumos Directos
                </h3>

                {isEditing && (
                  <div className="flex items-center gap-2">
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleAddIngredient(e.target.value);
                          e.target.value = '';
                        }
                      }}
                      className="bg-[#2a2a2a] text-xs text-white px-3 py-1.5 rounded-lg border border-[#3d3d3d] focus:outline-none focus:border-[#f8bd2a]"
                    >
                      <option value="">+ Agregar insumo del inventario...</option>
                      {inventoryItems.map((inv) => (
                        <option key={inv.id} value={inv.id}>
                          {inv.name} ({formatCOP(inv.costPerUnit)} / {inv.unit})
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {draftIngredients.length === 0 ? (
                <div className="p-8 text-center bg-[#181818] rounded-xl border border-[#2a2a2a] text-gray-400">
                  <PieChart size={36} className="mx-auto text-gray-600 mb-2" />
                  <p className="text-sm font-semibold text-gray-300">
                    No se han registrado ingredientes para este plato.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Haz clic en "Editar Escandallo" para vincular los insumos del inventario.
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-[#2a2a2a] text-gray-400 uppercase text-[10px] tracking-wider bg-[#141414]">
                        <th className="p-3">Insumo de Inventario</th>
                        <th className="p-3">Cantidad Requerida</th>
                        <th className="p-3">Unidad de Medida</th>
                        <th className="p-3">Costo Unitario Insumo</th>
                        <th className="p-3">Subtotal Insumo</th>
                        {isEditing && <th className="p-3 text-right">Acción</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#262626] text-gray-300">
                      {draftIngredients.map((ing) => {
                        const invItem = inventoryItems.find(
                          (i) => i.id === ing.inventoryItemId
                        );
                        const unitCost = invItem ? invItem.costPerUnit : ing.unitCost;
                        const subtotal = ing.quantityNeeded * unitCost;

                        return (
                          <tr key={ing.inventoryItemId} className="hover:bg-[#222]">
                            <td className="p-3 font-semibold text-white">
                              {ing.inventoryItemName}
                            </td>
                            <td className="p-3">
                              {isEditing ? (
                                <input
                                  type="number"
                                  step="0.01"
                                  value={ing.quantityNeeded}
                                  onChange={(e) =>
                                    handleUpdateQuantity(
                                      ing.inventoryItemId,
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  className="w-20 bg-[#2b2b2b] text-white px-2 py-1 rounded border border-[#444] text-xs font-bold"
                                />
                              ) : (
                                <span className="font-bold text-white">
                                  {ing.quantityNeeded}
                                </span>
                              )}
                            </td>
                            <td className="p-3 text-gray-400">
                              {ing.unit}
                            </td>
                            <td className="p-3 text-gray-300 font-mono">
                              {formatCOP(unitCost)}
                            </td>
                            <td className="p-3 font-bold text-[#f8bd2a] font-mono">
                              {formatCOP(subtotal)}
                            </td>
                            {isEditing && (
                              <td className="p-3 text-right">
                                <button
                                  onClick={() => handleRemoveIngredient(ing.inventoryItemId)}
                                  className="p-1 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded transition cursor-pointer"
                                >
                                  <Trash2 size={15} />
                                </button>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="border-t-2 border-[#333] bg-[#141414] font-bold text-white text-xs">
                        <td colSpan={4} className="p-3 text-right">
                          COSTO TOTAL MATERIA PRIMA (FOOD COST):
                        </td>
                        <td className="p-3 text-[#ef4444] text-sm font-black font-mono">
                          {formatCOP(totalCost)}
                        </td>
                        {isEditing && <td></td>}
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}

              {/* Preparation Notes Section */}
              <div className="mt-6 p-4 bg-[#181818] rounded-xl border border-[#2a2a2a]">
                <h4 className="text-xs font-bold text-gray-300 mb-2">
                  Notas de Preparación y Control de Mermas
                </h4>
                {isEditing ? (
                  <textarea
                    rows={2}
                    value={draftNotes}
                    onChange={(e) => setDraftNotes(e.target.value)}
                    placeholder="Instrucciones de preparación o notas sobre mermas..."
                    className="w-full bg-[#242424] text-xs text-white p-2.5 rounded-lg border border-[#333] focus:outline-none focus:border-[#f8bd2a]"
                  />
                ) : (
                  <p className="text-xs text-gray-400 italic">
                    {draftNotes || 'Sin observaciones de preparación registradas.'}
                  </p>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-8 text-gray-500">
            Selecciona un plato para comenzar.
          </div>
        )}
      </div>
    </div>
  );
}
