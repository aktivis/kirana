import useSWRMutation from "swr/mutation";
import { BASE_URL } from "../../utils/api";
import { IndicatorModel } from "../../models/quantitative-model";

const ONE_QUANTITATIVE = `${BASE_URL}/quantitative/:id`;

export const useUpdateIndicators = (id: string) => {
  const fetcher = async (key: string, { arg }: { arg: IndicatorModel[] }) => {
    const url = key.replace(":id", id) + "/indicator" + "/";
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ indicators: arg }),
    });
    if (!res.ok) throw new Error("Error while updating the indicators.");
    return res.text();
  };

  const { trigger, isMutating } = useSWRMutation(ONE_QUANTITATIVE, fetcher);
  return {
    updateTrigger: trigger,
    isUpdating: isMutating,
  };
};
