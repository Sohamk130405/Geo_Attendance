import { useCallback, useEffect, useState } from "react";
import { getLocation } from "../getLocation.js";
import { toast } from "react-toastify";

export const useLocationHandler = () => {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLocation = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const result = await getLocation();
      setLocation(result);
      toast.success(`📍 Location: ${result.latitude}, ${result.longitude}`);
    } catch (err) {
      const message =
        err.message || "Unable to retrieve location. Please enable GPS.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  return { location, loading, error, refetch: fetchLocation };
};
