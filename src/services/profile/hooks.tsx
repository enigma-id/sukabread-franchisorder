import { useGetProfileQuery } from "./api";

export const useProfile = () => {
  const query = useGetProfileQuery(undefined, { refetchOnMountOrArgChange: true });

  return {
    query,
  };
};
