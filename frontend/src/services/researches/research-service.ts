import useSWR from "swr";
import { ResearchModel } from "../../models/research-model";
import useSWRMutation from "swr/mutation";
import API, { CacheKey } from "../../utils/api";

export const useGetResearches = () => {
  const key = { id: undefined, path: API.RESEARCH };

  const fetcher = async (key: CacheKey) => {
    const url = key.path + "/";
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) throw new Error("Error while fetching research projects.");
    return (await res.json())["researches"] as Partial<ResearchModel[]>;
  };

  const { data, isLoading, error, mutate } = useSWR(key, fetcher);
  return {
    data: data ?? [],
    loading: isLoading,
    error: error,
    refetch: mutate,
  };
};

export const useGetResearch = (research_id: number) => {
  const key = { id: research_id, path: API.RESEARCH };

  const fetcher = async (key: CacheKey) => {
    const url = key.path + "/" + key.id!.toString();
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) throw new Error("Error while fetching the project.");
    return (await res.json()) as ResearchModel;
  };

  const { data, isLoading, error, mutate } = useSWR(key, fetcher);
  return {
    data: data,
    loading: isLoading,
    error: error,
    refetch: mutate,
  };
};

export const usePostResearch = () => {
  const key = { id: undefined, path: API.RESEARCH };

  const fetcher = async (
    key: CacheKey,
    { arg }: { arg: Partial<ResearchModel> }
  ) => {
    const url = key.path + "/";
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: arg.name,
        description: arg.description,
      }),
    });
    if (!res.ok) throw new Error("Error while creating a new project.");
    return res.json() as Partial<ResearchModel>;
  };

  const { trigger, isMutating } = useSWRMutation(key, fetcher);
  return {
    postTrigger: trigger,
    isPosting: isMutating,
  };
};

export const useUpdateResearch = (research_id: number) => {
  const key = { id: research_id, path: API.RESEARCH };

  const fetcher = async (
    key: CacheKey,
    { arg }: { arg: Partial<ResearchModel> }
  ) => {
    const url = key.path + "/" + key.id!.toString();
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: arg.name,
        description: arg.description,
      }),
    });
    if (!res.ok) throw new Error("Error while updating the project.");
    return res.text();
  };

  const { trigger, isMutating } = useSWRMutation(key, fetcher);
  return {
    updateTrigger: trigger,
    isUpdating: isMutating,
  };
};

export const useDeleteResearch = (research_id: number) => {
  const key = { id: research_id, path: API.RESEARCH };

  const fetcher = async (key: CacheKey) => {
    const url = key.path + "/" + key.id!.toString();
    const res = await fetch(url, { method: "DELETE" });
    if (!res.ok) throw new Error("Error while deleting the project.");
    return res.text();
  };

  const { trigger, isMutating } = useSWRMutation(key, fetcher);
  return {
    deleteTrigger: trigger,
    isDeleting: isMutating,
  };
};
