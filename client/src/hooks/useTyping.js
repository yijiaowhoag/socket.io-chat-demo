import { useCallback, useRef, useState, useEffect } from 'react';

const useTyping = ({ timeout }) => {
  const [isTyping, setIsTyping] = useState(false);
  const [currentEl, setCurrentEl] = useState(null);
  const timeoutRef = useRef(null);

  const reset = useCallback(() => {
    // Debounce `reset()` based on `timeout`
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, timeout);
  }, [timeout]);

  const register = useCallback((el) => {
    setCurrentEl(el);
    if (!el) {
      setIsTyping(false);
    }
  }, []);

  useEffect(() => {
    // Clear timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!currentEl) {
      return;
    }

    const keyPressListener = (e) => {
      const hasValue = e.target.value !== '';

      setIsTyping(hasValue);
      reset();
    };
    const blurListener = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsTyping(false);
    };

    currentEl.addEventListener('keyup', keyPressListener);
    currentEl.addEventListener('keydown', keyPressListener);
    currentEl.addEventListener('blur', blurListener);

    return () => {
      currentEl.removeEventListener('keydown', keyPressListener);
      currentEl.removeEventListener('keyup', keyPressListener);
      currentEl.removeEventListener('blur', blurListener);
    };
  }, [currentEl, reset]);

  return [isTyping, register];
};

export default useTyping;
