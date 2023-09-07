import useSWRMutation from "swr/mutation";
import { ConstructModel } from "../../models/quantitative-model";
import API, { CacheKey } from "../../utils/api";

export const usePostConstructs = (quantitative_id: number) => {
  const key = { id: quantitative_id, path: API.QUANTITATIVE };

  const fetcher = async (key: CacheKey, { arg }: { arg: ConstructModel[] }) => {
    const url = key.path + "/construct";
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ constructs: arg }),
    });
    if (!res.ok) throw new Error("Error while creating new constructs.");
    return res.text();
  };

  const { trigger, isMutating } = useSWRMutation(key, fetcher);
  return {
    postTrigger: trigger,
    isPosting: isMutating,
  };
};

export const useUpdateConstructs = (quantitative_id: number) => {
  const key = { id: quantitative_id, path: API.QUANTITATIVE };

  const fetcher = async (key: CacheKey, { arg }: { arg: ConstructModel[] }) => {
    const url = key.path + "/construct";
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ constructs: arg }),
    });
    if (!res.ok) throw new Error("Error while updating constructs.");
    return res.text();
  };

  const { trigger, isMutating } = useSWRMutation(key, fetcher);
  return {
    updateTrigger: trigger,
    isUpdating: isMutating,
  };
};

export const useDeleteConstructs = (quantitative_id: number) => {
  const key = { id: quantitative_id, path: API.QUANTITATIVE };

  const fetcher = async (key: CacheKey, { arg }: { arg: number[] }) => {
    const url = key.path + "/construct";
    const res = await fetch(url, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ construct_ids: arg }),
    });
    if (!res.ok) throw new Error("Error while deleting the constructs.");
    return res.text();
  };

  const { trigger, isMutating } = useSWRMutation(key, fetcher);
  return {
    deleteTrigger: trigger,
    isDeleting: isMutating,
  };
};
