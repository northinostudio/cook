import { formatClock } from '../utils/format';

export default function TimerCard({ timer, onPause, onResume, onAdjust, onRestart, onRemove }) {
  const { id, label, remainingSeconds, totalSeconds, status } = timer;
  const progress = totalSeconds > 0 ? 1 - remainingSeconds / totalSeconds : 0;
  const isDone = status === 'done';
  const isPaused = status === 'paused';
  const isWarning = status === 'running' && remainingSeconds > 0 && remainingSeconds <= 60;

  return (
    <div
      className={`timer-card ${isDone ? 'timer-card--done' : ''} ${isPaused ? 'timer-card--paused' : ''} ${isWarning ? 'timer-card--warning' : ''}`}
      role="group"
      aria-label={`Timer: ${label}`}
    >
      <div className="timer-card__top">
        <span className="timer-card__label">{label}</span>
        {isPaused && <span className="timer-card__badge">Paused</span>}
        {isWarning && <span className="timer-card__badge timer-card__badge--warning">Almost done</span>}
        {isDone && <span className="timer-card__badge timer-card__badge--done">Done</span>}
      </div>

      <div className="timer-card__clock" aria-live={isDone ? 'assertive' : 'off'}>
        {isDone ? "0:00" : formatClock(remainingSeconds)}
      </div>

      <div className="timer-card__bar">
        <div
          className="timer-card__bar-fill"
          style={{ width: `${Math.min(100, Math.max(0, progress * 100))}%` }}
        />
      </div>

      {isDone ? (
        <div className="timer-card__controls timer-card__controls--done">
          <button type="button" className="btn btn--ghost" onClick={() => onAdjust(id, 5 * 60)}>
            +5 min
          </button>
          <button type="button" className="btn btn--ghost" onClick={() => onRestart(id)}>
            Restart
          </button>
          <button type="button" className="btn btn--dismiss" onClick={() => onRemove(id)}>
            Dismiss
          </button>
        </div>
      ) : (
        <div className="timer-card__controls">
          <button type="button" className="btn btn--ghost" onClick={() => onAdjust(id, -60)} aria-label="Subtract 1 minute">
            −1m
          </button>
          <button type="button" className="btn btn--ghost" onClick={() => onAdjust(id, 60)} aria-label="Add 1 minute">
            +1m
          </button>
          {isPaused ? (
            <button type="button" className="btn btn--primary" onClick={() => onResume(id)}>
              Resume
            </button>
          ) : (
            <button type="button" className="btn btn--primary" onClick={() => onPause(id)}>
              Pause
            </button>
          )}
          <button type="button" className="btn btn--danger" onClick={() => onRemove(id)} aria-label="Cancel timer">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
