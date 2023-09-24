import { useCallback, useRef, useState, useEffect } from 'react';

type TextElement = HTMLInputElement | HTMLTextAreaElement;
type RegisterElement = <Element extends TextElement = TextElement>(
  el: Element | null
) => void;

interface UseTypingProps {
  timeout?: number;
}

const useTyping = ({ timeout }: UseTypingProps): [boolean, RegisterElement] => {
  const timeoutRef = useRef<NodeJS.Timeout>();

  const [isTyping, setIsTyping] = useState(false);
  const [currentEl, setCurrentEl] = useState<TextElement | null>(null);

  const reset = useCallback(() => {
    // Debounce `reset()` based on `timeout`
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, timeout);
  }, [timeout]);

  const register: RegisterElement = useCallback((el) => {
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

    const keyPressListener: EventListener = (e) => {
      const hasValue =
        (e.target as HTMLInputElement | HTMLTextAreaElement).value !== '';

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
