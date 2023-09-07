import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { QuantitativeModel } from "../../models/quantitative-model";
import API, { CacheKey } from "../../utils/api";

export const useGetQuantitatives = () => {
  const key = { id: undefined, path: API.QUANTITATIVE };

  const fetcher = async (key: CacheKey) => {
    const url = key.path + "/";
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) throw new Error("Error while fetching quantitative models.");
    return (await res.json())["quantitatives"] as Partial<QuantitativeModel[]>;
  };

  const { data, isLoading, error, mutate } = useSWR(key, fetcher);
  return {
    data: data ?? [],
    loading: isLoading,
    error: error,
    refetch: mutate,
  };
};

export const useGetQuantitative = (quantitative_id: number) => {
  const key = { id: quantitative_id, path: API.QUANTITATIVE };

  const fetcher = async (key: CacheKey) => {
    const url = key.path + "/" + key.id!.toString();
    const res = await fetch(url, { method: "GET" });
    if (!res.ok)
      throw new Error("Error while fetching the quantitative model.");
    return (await res.json()) as QuantitativeModel;
  };

  const { data, isLoading, error, mutate } = useSWR(key, fetcher);
  return {
    data: data,
    loading: isLoading,
    error: error,
    refetch: mutate,
  };
};

export const usePostQuantitative = () => {
  const key = { id: undefined, path: API.QUANTITATIVE };

  const fetcher = async (
    key: CacheKey,
    { arg }: { arg: Partial<QuantitativeModel> }
  ) => {
    const url = key.path + "/";
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        research_id: arg.research_id,
        name: arg.name,
        indicators: arg.indicators,
        constructs: arg.constructs,
        relations: arg.relations,
      }),
    });
    if (!res.ok)
      throw new Error("Error while creating a new quantitative model.");
    return res.text();
  };

  const { trigger, isMutating } = useSWRMutation(key, fetcher);
  return {
    postTrigger: trigger,
    isPosting: isMutating,
  };
};

export const useUpdateQuantitative = (quantitative_id: number) => {
  const key = { id: quantitative_id, path: API.QUANTITATIVE };

  const fetcher = async (
    key: CacheKey,
    { arg }: { arg: Partial<QuantitativeModel> }
  ) => {
    const url = key.path + "/" + key.id!.toString();
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: arg.id,
        research_id: arg.research_id,
        name: arg.name,
      }),
    });
    if (!res.ok)
      throw new Error("Error while updating the quantitative model.");
    return res.text();
  };

  const { trigger, isMutating } = useSWRMutation(key, fetcher);
  return {
    updateTrigger: trigger,
    isUpdating: isMutating,
  };
};

export const useDeleteQuantitative = (quantitative_id: number) => {
  const key = { id: quantitative_id, path: API.QUANTITATIVE };

  const fetcher = async (key: CacheKey) => {
    const url = key.path + "/" + key.id!.toString();
    const res = await fetch(url, { method: "DELETE" });
    if (!res.ok)
      throw new Error("Error while deleting the quantitative model.");
    return res.text();
  };

  const { trigger, isMutating } = useSWRMutation(key, fetcher);
  return {
    deleteTrigger: trigger,
    isDeleting: isMutating,
  };
};
