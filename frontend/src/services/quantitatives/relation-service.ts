import useSWRMutation from "swr/mutation";
import { BASE_URL } from "../../utils/api";
import { RelationModel } from "../../models/quantitative-model";

const ONE_QUANTITATIVE = `${BASE_URL}/quantitative/:id`;

export const usePostRelations = (id: string) => {
  const fetcher = async (key: string, { arg }: { arg: RelationModel[] }) => {
    const url = key.replace(":id", id) + "/relation" + "/";
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ relations: arg }),
    });
    if (!res.ok) throw new Error("Error while creating new relations.");
    return res.text();
  };

  const { trigger, isMutating } = useSWRMutation(ONE_QUANTITATIVE, fetcher);
  return {
    postTrigger: trigger,
    isPosting: isMutating,
  };
};

export const useUpdateRelations = (id: string) => {
  const fetcher = async (key: string, { arg }: { arg: RelationModel[] }) => {
    const url = key.replace(":id", id) + "/relation" + "/";
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ relations: arg }),
    });
    if (!res.ok) throw new Error("Error while updating relations.");
    return res.text();
  };

  const { trigger, isMutating } = useSWRMutation(ONE_QUANTITATIVE, fetcher);
  return {
    updateTrigger: trigger,
    isUpdating: isMutating,
  };
};

export const useDeleteRelations = (id: string) => {
  const fetcher = async (key: string, { arg }: { arg: number[] }) => {
    const url = key.replace(":id", id) + "/relation" + "/";
    const res = await fetch(url, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ relation_ids: arg }),
    });
    if (!res.ok) throw new Error("Error while deleting the relations.");
    return res.text();
  };

  const { trigger, isMutating } = useSWRMutation(ONE_QUANTITATIVE, fetcher);
  return {
    deleteTrigger: trigger,
    isDeleting: isMutating,
  };
};
