import React, { useState, useEffect } from "react";
import digitalclock from "./digitalclock.png";

const CountdownTimer = ({ time, countdownCompleted, onCountdownComplete }) => {
  const [seconds, setSeconds] = useState(time * 60);

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      if (seconds > 0 && !countdownCompleted) {
        setSeconds((prevSeconds) => prevSeconds - 1);
      } else {
        clearInterval(countdownInterval);
        if (onCountdownComplete) {
          onCountdownComplete(); // Invoke the callback function
        }
      }
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [seconds, onCountdownComplete, countdownCompleted]);

  const formatTime = () => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${hours < 10 ? "0" : ""}${hours}:${
      minutes < 10 ? "0" : ""
    }${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <div className="position-relative w-auto">
      <img className="image-fluid" src={digitalclock} alt="Digital Clock" />
      <p className="text-center fs-2 position-absolute top-50 start-50 translate-middle">
        {formatTime()}
      </p>
    </div>
  );
};

export default CountdownTimer;
