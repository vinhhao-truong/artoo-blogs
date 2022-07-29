import { useState, useEffect } from "react";
import axios from "axios";

const useGETFetch = (url) => {
  const [resData, setData] = useState(null);


  const fetchData = async () => {
    try {
      const res = await axios.get(url);
      setData(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);
  return {
    resData,
  };
};

export default useGETFetch;
