import { useLayoutEffect, useState, useRef } from 'react'

const useResize = () => {
    const [width, setWidth] = useState(null);
    const ref = useRef(null);

    useLayoutEffect(() => {
        let timeoutId = null;
        const handleResize = () => {
          if(!ref || !ref.current){
            return;
          }
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            setWidth(ref.current.clientWidth)
          }, 500)
        }
        window.addEventListener("resize", handleResize);
        return () => {
          window.removeEventListener('resize', handleResize);
        };
      }, [ref, width])

    return [width,  ref];
}

export default useResize;
