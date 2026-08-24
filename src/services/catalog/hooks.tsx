/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetCatalogQuery, useShowCatalogQuery } from "./api";

export const useCatalog = ({ id, params }: { id?: string; params?: any } = {}) => {
  const listQuery = useGetCatalogQuery(params, { refetchOnMountOrArgChange: true });
  const detailQuery = useShowCatalogQuery(id!, { skip: !id, refetchOnMountOrArgChange: true });

  return {
    listQuery,
    detailQuery,
  };
};
