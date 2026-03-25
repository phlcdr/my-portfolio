import { useState, useEffect, useRef } from "react";

const useTypewriter = (texts = [], speed = 80, deleteSpeed = 40, pause = 2000) => {
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [textIndex, setTextIndex] = useState(0);
  const [isWaiting, setIsWaiting] = useState(false);
  const timeoutRef = useRef(null);

  useEffect(() => {
    if (!texts.length) return;

    const currentText = texts[textIndex];

    if (isWaiting) {
      timeoutRef.current = setTimeout(() => {
        setIsWaiting(false);
        setIsDeleting(true);
      }, pause);
      return;
    }

    if (!isDeleting && displayText === currentText) {
      setIsWaiting(true);
      return;
    }

    if (isDeleting && displayText === "") {
      setIsDeleting(false);
      setTextIndex((prev) => (prev + 1) % texts.length);
      return;
    }

    const delta = isDeleting ? deleteSpeed : speed;
    timeoutRef.current = setTimeout(() => {
      setDisplayText((prev) =>
        isDeleting
          ? prev.slice(0, -1)
          : currentText.slice(0, prev.length + 1)
      );
    }, delta);

    return () => clearTimeout(timeoutRef.current);
  }, [displayText, isDeleting, isWaiting, textIndex, texts, speed, deleteSpeed, pause]);

  return { displayText, textIndex };
};

export default useTypewriter;
