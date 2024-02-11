import React, { useState, useEffect } from "react";

const TypingAnimation = ({ texts, speed }) => {
  const [text, setText] = useState("");
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      if (text === texts[index]) {
        setIndex((index + 1) % texts.length);
        setText("");
      } else {
        setText((prev) => prev + texts[index][prev.length]);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [index, text, texts, speed]);

  return <>{text}</>;
};

export default TypingAnimation;
