import TimerCard from './TimerCard';

export default function TimerList({ timers, onPause, onResume, onAdjust, onRestart, onRemove }) {
  if (timers.length === 0) {
    return (
      <div className="timer-list timer-list--empty">
        <p>No timers running yet. Pick a food below to start one.</p>
      </div>
    );
  }

  return (
    <div className="timer-list">
      {timers.map((t) => (
        <TimerCard
          key={t.id}
          timer={t}
          onPause={onPause}
          onResume={onResume}
          onAdjust={onAdjust}
          onRestart={onRestart}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
