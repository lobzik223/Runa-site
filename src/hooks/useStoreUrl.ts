import { useEffect, useState } from 'react';
import { APP_STORE_URL, getStoreUrl } from '../utils/storeLinks';

export function useStoreUrl(): string {
  const [url, setUrl] = useState(APP_STORE_URL);

  useEffect(() => {
    setUrl(getStoreUrl());
  }, []);

  return url;
}
