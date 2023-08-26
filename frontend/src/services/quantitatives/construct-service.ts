import useSWRMutation from "swr/mutation";
import { BASE_URL } from "../../utils/api";
import { ConstructModel } from "../../models/quantitative-model";

const ONE_QUANTITATIVE = `${BASE_URL}/quantitative/:id`;

export const usePostConstructs = (id: string) => {
  const fetcher = async (key: string, { arg }: { arg: ConstructModel[] }) => {
    const url = key.replace(":id", id) + "/construct" + "/";
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ constructs: arg }),
    });
    if (!res.ok) throw new Error("Error while creating new constructs.");
    return res.text();
  };

  const { trigger, isMutating } = useSWRMutation(ONE_QUANTITATIVE, fetcher);
  return {
    postTrigger: trigger,
    isPosting: isMutating,
  };
};

export const useUpdateConstructs = (id: string) => {
  const fetcher = async (key: string, { arg }: { arg: ConstructModel[] }) => {
    const url = key.replace(":id", id) + "/construct" + "/";
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ constructs: arg }),
    });
    if (!res.ok) throw new Error("Error while updating constructs.");
    return res.text();
  };

  const { trigger, isMutating } = useSWRMutation(ONE_QUANTITATIVE, fetcher);
  return {
    updateTrigger: trigger,
    isUpdating: isMutating,
  };
};

export const useDeleteConstructs = (id: string) => {
  const fetcher = async (key: string, { arg }: { arg: number[] }) => {
    const url = key.replace(":id", id) + "/construct" + "/";
    const res = await fetch(url, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ construct_ids: arg }),
    });
    if (!res.ok) throw new Error("Error while deleting the constructs.");
    return res.text();
  };

  const { trigger, isMutating } = useSWRMutation(ONE_QUANTITATIVE, fetcher);
  return {
    deleteTrigger: trigger,
    isDeleting: isMutating,
  };
};
