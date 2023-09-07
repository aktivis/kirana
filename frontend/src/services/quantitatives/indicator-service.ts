import useSWRMutation from "swr/mutation";
import { IndicatorModel } from "../../models/quantitative-model";
import API, { CacheKey } from "../../utils/api";

export const useUpdateIndicators = (quantitative_id: number) => {
  const key = { id: quantitative_id, path: API.QUANTITATIVE };

  const fetcher = async (key: CacheKey, { arg }: { arg: IndicatorModel[] }) => {
    const url = key.path + "/indicator";
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ indicators: arg }),
    });
    if (!res.ok) throw new Error("Error while updating the indicators.");
    return res.text();
  };

  const { trigger, isMutating } = useSWRMutation(key, fetcher);
  return {
    updateTrigger: trigger,
    isUpdating: isMutating,
  };
};
