import { useState, useCallback } from "react";

type UseLoadingReturn = {
  isLoading: boolean;
  withLoading: (asyncFn: () => Promise<void>) => Promise<void>;
};

export function useLoading() : UseLoadingReturn {
  const [isLoading, setIsLoading] = useState(false);

  const withLoading = useCallback(async (asyncFn: () => Promise<void>) => {
    if (isLoading) return;
    try {
      setIsLoading(true);
      await asyncFn();
    } finally {
      setIsLoading(false);
    }
  }, [isLoading]);

  return { isLoading, withLoading };
}
