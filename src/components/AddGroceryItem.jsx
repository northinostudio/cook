import { useState } from 'react';

export default function AddGroceryItem({ onAdd }) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    const numericPrice = price === '' ? 0 : Math.max(0, Number(price));
    onAdd(trimmed, numericPrice);
    setName('');
    setPrice('');
  }

  return (
    <form className="add-item" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Item (e.g. Milk)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="add-item__name"
        required
      />
      <label className="add-item__price">
        ₦
        <input
          type="number"
          min="0"
          step="0.01"
          placeholder="0.00"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
      </label>
      <button type="submit" className="btn btn--primary">
        Add
      </button>
    </form>
  );
}
