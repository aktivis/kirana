import useSWR from "swr";
import { BASE_URL } from "../../utils/api";
import { ResearchModel } from "../../models/research-model";
import useSWRMutation from "swr/mutation";

const ALL_RESEARCHES = `${BASE_URL}/research`;
const ONE_RESEARCH = `${BASE_URL}/research/:id`;

export const useGetResearches = () => {
  const fetcher = async (key: string) => {
    const url = key + "/";
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) throw new Error("Error while fetching research projects.");
    return (await res.json())["researches"] as Partial<ResearchModel[]>;
  };

  const { data, isLoading, error, mutate } = useSWR(ALL_RESEARCHES, fetcher);
  return {
    data: data ?? [],
    loading: isLoading,
    error: error,
    refetch: mutate,
  };
};

export const useGetResearch = (id: string) => {
  const fetcher = async (key: string) => {
    const url = key.replace(":id", id) + "/";
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) throw new Error("Error while fetching the project.");
    return (await res.json()) as ResearchModel;
  };

  const { data, isLoading, error, mutate } = useSWR(ONE_RESEARCH, fetcher);
  return {
    data: data,
    loading: isLoading,
    error: error,
    refetch: mutate,
  };
};

export const usePostResearch = () => {
  const fetcher = async (
    key: string,
    { arg }: { arg: Partial<ResearchModel> }
  ) => {
    const url = key + "/";
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: arg.name, description: arg.description }),
    });
    if (!res.ok) throw new Error("Error while creating a new project.");
    return res.json() as Partial<ResearchModel>;
  };

  const { trigger, isMutating } = useSWRMutation(ALL_RESEARCHES, fetcher);
  return {
    postTrigger: trigger,
    isPosting: isMutating,
  };
};

export const useUpdateResearch = (id: number) => {
  const fetcher = async (
    key: string,
    { arg }: { arg: Partial<ResearchModel> }
  ) => {
    const url = key + "/" + id.toString() + "/";
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: arg.name, description: arg.description }),
    });
    if (!res.ok) throw new Error("Error while updating the project.");
    return res.text();
  };

  const { trigger, isMutating } = useSWRMutation(ALL_RESEARCHES, fetcher);
  return {
    updateTrigger: trigger,
    isUpdating: isMutating,
  };
};

export const useDeleteResearch = (id: number) => {
  const fetcher = async (key: string) => {
    const url = key + "/" + id.toString() + "/";
    const res = await fetch(url, { method: "DELETE" });
    if (!res.ok) throw new Error("Error while deleting the project.");
    return res.text();
  };

  const { trigger, isMutating } = useSWRMutation(ALL_RESEARCHES, fetcher);
  return {
    deleteTrigger: trigger,
    isDeleting: isMutating,
  };
};
