import { useEffect, useState } from "react";

interface Crop {
  id: string;
  name: string;
  
}

export function useGetCrops() {
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getCrops = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/crops");

      if (!res.ok) {
        throw new Error(`${res.status}: Failed to load crops`);
      }

      const data = await res.json();
      setCrops(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCrops();
  }, []);

  return {
    crops,
    loading,
    error,
    refetch: getCrops,
  };
}