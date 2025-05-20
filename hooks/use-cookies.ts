// hooks/use-cookies.ts
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

export function useCookies() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return {
      setCookie: () => {},
      getCookie: () => null,
      removeCookie: () => {},
    };
  }

  return {
    setCookie: Cookies.set,
    getCookie: Cookies.get,
    removeCookie: Cookies.remove,
  };
}
