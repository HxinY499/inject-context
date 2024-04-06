import { RefObject, useEffect } from 'react';

export default function useHighlight(dom: RefObject<HTMLElement>) {
  useEffect(() => {
    let lock = false;
    if (dom.current) {
      dom.current.style.backgroundColor = 'red';
      dom.current.style.transition = 'all 0.2s';

      setTimeout(() => {
        if (dom.current && !lock) dom.current.style.backgroundColor = '#fff';
      }, 500);
    }

    return () => {
      lock = true;
    };
  });
}
