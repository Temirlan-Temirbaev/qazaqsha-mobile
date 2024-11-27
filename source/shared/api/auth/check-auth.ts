import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import {User} from "@/source/core/entities";
const API_URL = "http://MacBook-Air-Erlan.local:3001/api/";

export const useCheckAuth = (refetchEnabled: boolean, token: string) => {
  const queryClient = useQueryClient();
  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["check-auth"],
    queryFn: async () => {
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;
      const user = await axios
        .get<User>(`${API_URL}user/check-login`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .catch(async (e: any) => {
          if (e?.response?.status === 401) {
            queryClient.cancelQueries({ queryKey: ["check-auth"] });
          }
        });
      return user;
    },
    enabled: refetchEnabled,
  });
  const userData = data?.data;
  return { data, error, isLoading, userData, refetch };
};
