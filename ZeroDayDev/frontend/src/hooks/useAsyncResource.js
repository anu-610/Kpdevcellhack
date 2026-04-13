import { useEffect, useState } from "react";

const EMPTY_ARRAY = [];

export function useAsyncResource(loader, initialValue = EMPTY_ARRAY) {
  const [data, setData] = useState(initialValue);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function load() {
      setStatus("loading");
      setError("");

      try {
        const result = await loader();

        if (isMounted) {
          setData(result);
          setStatus("success");
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message);
          setStatus("error");
        }
      }
    }

    load();

    return () => {
      isMounted = false;
    };
  }, [initialValue, loader]);

  return { data, status, error };
}
