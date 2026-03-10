import { useEffect, useState } from "react";

const fetchAdmin = async () => {
  // Giả sử bạn có một API để lấy thông tin người dùng
  // const response = await fetch('/api/user');
  // const data = await response.json();1

  const data = localStorage.getItem("admin");
  return data ? JSON.parse(data) : null;
};

export function useAdmin() {
  const [admin, setAdmin] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Giả sử bạn gọi API để lấy thông tin người dùng khi component được mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsLoading(true);
    const getUser = async () => {
      const userData = await fetchAdmin();
      setAdmin(userData);
      setIsLoading(false);
    };
    getUser();
  }, []);

  return { admin, isLoading };
}
