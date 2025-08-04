'use client';

import React, { useEffect, useState } from 'react';

interface CountdownTimerProps {
  targetDate: string;
}

const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    if (Object.keys(calculateTimeLeft()).length === 0) {
      return;
    }

    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      if (Object.keys(newTimeLeft).length === 0) {
        clearInterval(timer);
        window.location.reload();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timerComponents: React.ReactNode[] = [];

  Object.keys(timeLeft).forEach((interval) => {
    if (!timeLeft[interval as keyof typeof timeLeft]) {
      return;
    }

    timerComponents.push(
      <div key={interval} className="text-center">
        <div className="text-2xl font-bold">
          {timeLeft[interval as keyof typeof timeLeft]}
        </div>
        <div className="text-sm uppercase">
          {interval}
        </div>
      </div>,
    );
  });

  return (
    <div className="flex justify-center gap-4">
      {timerComponents.length ? timerComponents : <span>Time's up!</span>}
    </div>
  );
};

export default CountdownTimer;