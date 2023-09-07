import useSWRMutation from "swr/mutation";
import { RelationModel } from "../../models/quantitative-model";
import API, { CacheKey } from "../../utils/api";

export const usePostRelations = (quantitative_id: number) => {
  const key = { id: quantitative_id, path: API.QUANTITATIVE };

  const fetcher = async (key: CacheKey, { arg }: { arg: RelationModel[] }) => {
    const url = key.path + "/relation";
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ relations: arg }),
    });
    if (!res.ok) throw new Error("Error while creating new relations.");
    return res.text();
  };

  const { trigger, isMutating } = useSWRMutation(key, fetcher);
  return {
    postTrigger: trigger,
    isPosting: isMutating,
  };
};

export const useUpdateRelations = (quantitative_id: number) => {
  const key = { id: quantitative_id, path: API.QUANTITATIVE };

  const fetcher = async (key: CacheKey, { arg }: { arg: RelationModel[] }) => {
    const url = key.path + "/relation";
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ relations: arg }),
    });
    if (!res.ok) throw new Error("Error while updating relations.");
    return res.text();
  };

  const { trigger, isMutating } = useSWRMutation(key, fetcher);
  return {
    updateTrigger: trigger,
    isUpdating: isMutating,
  };
};

export const useDeleteRelations = (quantitative_id: number) => {
  const key = { id: quantitative_id, path: API.QUANTITATIVE };

  const fetcher = async (key: CacheKey, { arg }: { arg: number[] }) => {
    const url = key.path + "/relation";
    const res = await fetch(url, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ relation_ids: arg }),
    });
    if (!res.ok) throw new Error("Error while deleting the relations.");
    return res.text();
  };

  const { trigger, isMutating } = useSWRMutation(key, fetcher);
  return {
    deleteTrigger: trigger,
    isDeleting: isMutating,
  };
};
