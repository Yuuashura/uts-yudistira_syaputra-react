import { useEffect } from 'react';

export default function useMotionFeedback() {
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const active = new Set();
    function bounce(event) {
      const button = event.target.closest('button, a');
      if (!button || button.disabled || media.matches) return;
      const icon = button.querySelector('svg');
      if (!icon) return;
      icon.classList.remove('icon-bounce');
      void icon.getBoundingClientRect();
      icon.classList.add('icon-bounce');
      active.add(icon);
    }
    function finish(event) {
      if (event.animationName === 'icon-bounce') { event.target.classList.remove('icon-bounce'); active.delete(event.target); }
    }
    document.addEventListener('click', bounce, true);
    document.addEventListener('animationend', finish);
    return () => {
      document.removeEventListener('click', bounce, true);
      document.removeEventListener('animationend', finish);
      active.forEach(icon => icon.classList.remove('icon-bounce'));
    };
  }, []);
}
