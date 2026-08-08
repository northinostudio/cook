import { useEffect } from 'react';
import { useTimers } from '../hooks/useTimers';
import { useCustomFoods } from '../hooks/useCustomFoods';
import { startAlarm, stopAlarm } from '../utils/audio';
import TimerList from './TimerList';
import FoodPicker from './FoodPicker';

export default function TimerView() {
  const {
    timers,
    anyDone,
    addTimer,
    pauseTimer,
    resumeTimer,
    adjustTimer,
    restartTimer,
    removeTimer,
  } = useTimers();
  const { customFoods, addCustomFood, removeCustomFood, updateCustomFood } = useCustomFoods();

  // Keep the alarm loop tied to "is anything currently done and undismissed" —
  // starts the instant a timer finishes, stops the instant the last one is
  // dismissed/restarted/snoozed.
  useEffect(() => {
    if (anyDone) startAlarm();
    else stopAlarm();
  }, [anyDone]);

  function handleStart(label, seconds) {
    addTimer(label, seconds);
  }

  return (
    <>
      <TimerList
        timers={timers}
        onPause={pauseTimer}
        onResume={resumeTimer}
        onAdjust={adjustTimer}
        onRestart={restartTimer}
        onRemove={removeTimer}
      />

      <FoodPicker
        customFoods={customFoods}
        onStart={handleStart}
        onAddCustom={addCustomFood}
        onRemoveCustom={removeCustomFood}
        onUpdateCustom={updateCustomFood}
      />
    </>
  );
}
