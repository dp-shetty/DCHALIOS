import axios from "axios";
import { useState, useEffect } from "react";

function useFetch(url, headers) {
  const [apiData, setApiData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;

    async function fetchData() {
      try {
        const { data } = await axios.get(url, { headers: { Authorization: headers } });
        setApiData(data);
      } catch (error) {
        setError(error);
      }
    }

    fetchData();
  }, [url, headers]);

  return { apiData, error };
}

export default useFetch;