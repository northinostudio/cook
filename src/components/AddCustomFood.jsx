import { useState } from 'react';

export default function AddCustomFood({ onAdd }) {
  const [name, setName] = useState('');
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = name.trim();
    const totalSeconds = Math.max(1, Number(minutes) * 60 + Number(seconds));
    if (!trimmed) return;
    onAdd(trimmed, totalSeconds);
    setName('');
    setMinutes(5);
    setSeconds(0);
  }

  return (
    <form className="add-food" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Food name (e.g. Reheated leftovers)"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="add-food__name"
        autoFocus
        required
      />
      <div className="add-food__time">
        <label>
          <input
            type="number"
            min="0"
            max="600"
            value={minutes}
            onChange={(e) => setMinutes(e.target.value)}
          />
          min
        </label>
        <label>
          <input
            type="number"
            min="0"
            max="59"
            value={seconds}
            onChange={(e) => setSeconds(e.target.value)}
          />
          sec
        </label>
      </div>
      <button type="submit" className="btn btn--primary">
        Save &amp; Start
      </button>
    </form>
  );
}
