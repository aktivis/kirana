import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { BASE_URL } from "../../utils/api";
import { QuantitativeModel } from "../../models/quantitative-model";

const ALL_QUANTITATIVES = `${BASE_URL}/quantitative`;
const ONE_QUANTITATIVE = `${BASE_URL}/quantitative/:id`;

export const useGetQuantitatives = () => {
  const fetcher = async (key: string) => {
    const url = key + "/";
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) throw new Error("Error while fetching quantitative models.");
    return (await res.json())["quantitatives"] as Partial<QuantitativeModel[]>;
  };

  const { data, isLoading, error, mutate } = useSWR(ALL_QUANTITATIVES, fetcher);
  return {
    data: data ?? [],
    loading: isLoading,
    error: error,
    refetch: mutate,
  };
};

export const useGetQuantitative = (id: string) => {
  const fetcher = async (key: string) => {
    const url = key.replace(":id", id) + "/";
    const res = await fetch(url, { method: "GET" });
    if (!res.ok)
      throw new Error("Error while fetching the quantitative model.");
    return (await res.json()) as QuantitativeModel;
  };

  const { data, isLoading, error, mutate } = useSWR(ONE_QUANTITATIVE, fetcher);
  return {
    data: data,
    loading: isLoading,
    error: error,
    refetch: mutate,
  };
};

export const usePostQuantitative = () => {
  const fetcher = async (
    key: string,
    { arg }: { arg: Partial<QuantitativeModel> }
  ) => {
    const url = key + "/";
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
    return res.json() as Partial<QuantitativeModel>;
  };

  const { trigger, isMutating } = useSWRMutation(ALL_QUANTITATIVES, fetcher);
  return {
    postTrigger: trigger,
    isPosting: isMutating,
  };
};

export const useUpdateQuantitative = (id: string) => {
  const fetcher = async (
    key: string,
    { arg }: { arg: Partial<QuantitativeModel> }
  ) => {
    const url = key.replace(":id", id) + "/";
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

  const { trigger, isMutating } = useSWRMutation(ONE_QUANTITATIVE, fetcher);
  return {
    updateTrigger: trigger,
    isUpdating: isMutating,
  };
};

export const useDeleteQuantitative = (id: string) => {
  const fetcher = async (key: string) => {
    const url = key.replace(":id", id) + "/";
    const res = await fetch(url, { method: "DELETE" });
    if (!res.ok)
      throw new Error("Error while deleting the quantitative model.");
    return res.text();
  };

  const { trigger, isMutating } = useSWRMutation(ONE_QUANTITATIVE, fetcher);
  return {
    deleteTrigger: trigger,
    isDeleting: isMutating,
  };
};
