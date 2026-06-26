/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetCatalogQuery, useShowCatalogQuery } from "./api";

export const useCatalog = (params?: any) => {
  const query = useGetCatalogQuery(params);

  return {
    query,
    // Add any specific catalog actions here if needed in the future
  };
};

export const useCatalogDetail = (id: string) => {
  const query = useShowCatalogQuery(id);

  return {
    query,
  };
};
