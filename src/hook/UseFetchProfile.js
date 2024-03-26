import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export function useFetchProfile() {
  const session = useSession();
  const { status } = session;

  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchProfile = () => {
    setLoading(true);
    fetch("/api/profile")
      .then(async (res) => {
        const data = await res.json();
        if (data) {
          setData(data);
        }
      })
      .catch((error) => {
        throw Error(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    if (status === "authenticated") {
      fetchProfile();
    }
  }, [session, status]);

  return { loading, data };
}
