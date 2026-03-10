import { useEffect, useState } from "react";

const fetchUser = async () => {
  // Giả sử bạn có một API để lấy thông tin người dùng
  // const response = await fetch('/api/user');
  // const data = await response.json();1

  const data = localStorage.getItem("user");
  return data ? JSON.parse(data) : null;
};

export function useUser() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Giả sử bạn gọi API để lấy thông tin người dùng khi component được mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    const getUser = async () => {
      const userData = await fetchUser();
      setUser(userData);
      setIsLoading(false);
    };
    getUser();
  }, []);

  return { user, isLoading };
}
