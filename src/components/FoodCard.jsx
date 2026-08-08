import { useState } from 'react';
import { EGG_SIZE_ADJUST, servingsSeconds } from '../data/presetFoods';
import { formatDuration } from '../utils/format';

function secondsToParts(totalSeconds) {
  return { minutes: Math.floor(totalSeconds / 60), seconds: totalSeconds % 60 };
}

// A single preset/custom food tile. Clicking it opens an editable panel —
// it never starts a timer by itself; you always land on an explicit
// "Start" button, with the minutes/seconds fields pre-filled and editable
// right there. "Save as default" persists whatever's in those fields as
// this food's new default time (built-ins get overridden, not replaced —
// "Reset" brings back the original).
export default function FoodCard({ food, effectiveSeconds, isOverridden, onStart, onSaveDefault, onResetDefault, onRemoveCustom }) {
  const [open, setOpen] = useState(false);
  const [eggSize, setEggSize] = useState('medium');
  const [servings, setServings] = useState(2);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const hasAdjust = food.adjust === 'eggSize' || food.adjust === 'servings';

  function handleOpen() {
    const parts = secondsToParts(effectiveSeconds);
    setMinutes(parts.minutes);
    setSeconds(parts.seconds);
    setEggSize('medium');
    setServings(2);
    setOpen((v) => !v);
  }

  function applySeconds(totalSeconds) {
    const parts = secondsToParts(Math.max(0, totalSeconds));
    setMinutes(parts.minutes);
    setSeconds(parts.seconds);
  }

  function selectEggSize(id) {
    setEggSize(id);
    const delta = EGG_SIZE_ADJUST.find((s) => s.id === id)?.deltaSeconds ?? 0;
    applySeconds(Math.max(60, effectiveSeconds + delta));
  }

  function selectServings(n) {
    const clamped = Math.max(1, Math.min(12, n));
    setServings(clamped);
    applySeconds(servingsSeconds(effectiveSeconds, clamped));
  }

  const currentTotal = Math.max(0, Number(minutes) * 60 + Number(seconds));

  function handleStart() {
    onStart(food.name, currentTotal || effectiveSeconds);
    setOpen(false);
  }

  function handleSaveDefault() {
    onSaveDefault(food, currentTotal || effectiveSeconds);
  }

  return (
    <div className={`food-card ${open ? 'food-card--open' : ''} ${food.custom ? 'food-card--custom' : ''}`}>
      <button type="button" className="food-card__main" onClick={handleOpen} aria-expanded={open}>
        <span className="food-card__name">{food.name}</span>
        <span className="food-card__time">
          {formatDuration(effectiveSeconds)}
          {isOverridden && <span title="Edited from the built-in default"> *</span>}
        </span>
        {food.note && <span className="food-card__note">{food.note}</span>}
      </button>

      {food.custom && (
        <div className="food-card__actions">
          <button
            type="button"
            className="food-card__tune food-card__tune--danger"
            onClick={() => onRemoveCustom(food.id)}
            aria-label={`Remove ${food.name}`}
            title="Remove custom food"
          >
            ×
          </button>
        </div>
      )}

      {open && (
        <div className="food-card__panel">
          {food.adjust === 'eggSize' && (
            <div className="food-card__row">
              {EGG_SIZE_ADJUST.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  className={`chip ${eggSize === s.id ? 'chip--active' : ''}`}
                  onClick={() => selectEggSize(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          )}
          {food.adjust === 'servings' && (
            <div className="food-card__row food-card__row--stepper">
              <button type="button" className="stepper-btn" onClick={() => selectServings(servings - 1)}>
                −
              </button>
              <span className="stepper-value">{servings} serving{servings > 1 ? 's' : ''}</span>
              <button type="button" className="stepper-btn" onClick={() => selectServings(servings + 1)}>
                +
              </button>
            </div>
          )}

          <div className="food-card__time-edit">
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

          <div className="food-card__panel-footer">
            <div className="food-card__panel-footer-left">
              <button type="button" className="link-btn" onClick={handleSaveDefault}>
                Save as default
              </button>
              {isOverridden && !food.custom && (
                <button type="button" className="link-btn" onClick={() => onResetDefault(food)}>
                  Reset
                </button>
              )}
            </div>
            <button type="button" className="btn btn--small btn--primary" onClick={handleStart}>
              Start
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
