/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetCatalogQuery, useShowCatalogQuery } from "./api";

export const useCatalog = ({ id, params }: { id?: string; params?: any } = {}) => {
  const listQuery = useGetCatalogQuery(params);
  const detailQuery = useShowCatalogQuery(id!, { skip: !id });

  return {
    listQuery,
    detailQuery,
  };
};
