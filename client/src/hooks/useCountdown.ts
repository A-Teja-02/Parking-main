import { useEffect, useState } from 'react';
import { getSecondsUntilMidnight, formatCountdown } from '../utils/date';

/**
 * Live countdown hook — ticks every second until midnight.
 */
export function useCountdown() {
  const [seconds, setSeconds] = useState(getSecondsUntilMidnight);

  useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getSecondsUntilMidnight();
      setSeconds(remaining);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return {
    seconds,
    formatted: formatCountdown(seconds),
    isExpired: seconds <= 0,
  };
}
