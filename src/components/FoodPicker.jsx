import { useMemo, useState } from 'react';
import { CATEGORIES, PRESET_FOODS } from '../data/presetFoods';
import { usePresetOverrides } from '../hooks/usePresetOverrides';
import FoodCard from './FoodCard';
import AddCustomFood from './AddCustomFood';

export default function FoodPicker({ customFoods, onStart, onAddCustom, onRemoveCustom, onUpdateCustom }) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const { overrides, setOverride, resetOverride } = usePresetOverrides();

  const allFoods = useMemo(() => [...PRESET_FOODS, ...customFoods], [customFoods]);

  const categories = useMemo(() => {
    const customCats = customFoods.some((f) => f.category === 'Custom') ? ['Custom'] : [];
    return ['All', ...CATEGORIES, ...customCats];
  }, [customFoods]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allFoods.filter((f) => {
      const matchesCategory = category === 'All' || f.category === category;
      const matchesQuery = !q || f.name.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [allFoods, query, category]);

  function handleSaveDefault(food, seconds) {
    if (food.custom) {
      onUpdateCustom(food.id, seconds);
    } else {
      setOverride(food.id, seconds);
    }
  }

  return (
    <section className="picker" aria-label="Choose a food to time">
      <div className="picker__controls">
        <input
          type="search"
          className="picker__search"
          placeholder="Search foods…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search foods"
        />
        <button
          type="button"
          className="btn btn--outline"
          onClick={() => setShowAddForm((v) => !v)}
        >
          {showAddForm ? 'Close' : '+ Add custom food'}
        </button>
      </div>

      {showAddForm && (
        <AddCustomFood
          onAdd={async (name, seconds) => {
            const food = await onAddCustom(name, seconds);
            setShowAddForm(false);
            onStart(food.name, food.seconds);
          }}
        />
      )}

      <div className="picker__categories" role="tablist" aria-label="Food categories">
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            role="tab"
            aria-selected={category === c}
            className={`category-chip ${category === c ? 'category-chip--active' : ''}`}
            onClick={() => setCategory(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="picker__empty">No foods match "{query}". Try "+ Add custom food".</p>
      ) : (
        <div className="picker__grid">
          {filtered.map((food) => {
            const effectiveSeconds = food.custom ? food.seconds : overrides[food.id] ?? food.seconds;
            return (
              <FoodCard
                key={food.id}
                food={food}
                effectiveSeconds={effectiveSeconds}
                isOverridden={!food.custom && food.id in overrides}
                onStart={onStart}
                onSaveDefault={handleSaveDefault}
                onResetDefault={(f) => resetOverride(f.id)}
                onRemoveCustom={onRemoveCustom}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
