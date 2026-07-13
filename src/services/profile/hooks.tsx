import { useGetProfileQuery } from "./api";

export const useProfile = () => {
  const query = useGetProfileQuery();

  return {
    query,
  };
};
