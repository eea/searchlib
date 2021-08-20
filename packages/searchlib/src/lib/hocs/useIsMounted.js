// Based on MIT licensed https://github.com/jmlweb/isMounted

import { useRef, useEffect } from 'react';

const useIsMounted = () => {
  const isMounted = useRef(false);
  useEffect(() => {
    isMounted.current = true;
    return () => (isMounted.current = false);
  }, []);
  return isMounted;
};

export default useIsMounted;
