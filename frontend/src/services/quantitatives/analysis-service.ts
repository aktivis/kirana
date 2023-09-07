import useSWRMutation from "swr/mutation";
import { AnalysisModel } from "../../models/quantitative-model";
import API, { CacheKey } from "../../utils/api";

export const useRunAnalysis = (
  quantitative_id: number,
  analysis_id: number
) => {
  const key = { id: quantitative_id, path: API.QUANTITATIVE };

  const fetcher = async (
    key: CacheKey,
    { arg }: { arg: Partial<AnalysisModel> }
  ) => {
    const url = key.path + "/analysis" + "/" + analysis_id.toString();
    const res = await fetch(url, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: analysis_id,
        quantitative_id: arg.quantitative_id,
      }),
    });
    if (!res.ok) throw new Error("Error while creating a new analysis.");
    return res.text();
  };

  const { trigger, isMutating } = useSWRMutation(key, fetcher);
  return {
    runTrigger: trigger,
    isRunning: isMutating,
  };
};

export const usePostAnalyses = (quantitative_id: number) => {
  const key = { id: quantitative_id, path: API.QUANTITATIVE };

  const fetcher = async (key: CacheKey, { arg }: { arg: AnalysisModel[] }) => {
    const url = key.path + "/analysis";
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        analyses: arg,
      }),
    });
    if (!res.ok) throw new Error("Error while creating a new analysis.");
    return res.text();
  };

  const { trigger, isMutating } = useSWRMutation(key, fetcher);
  return {
    postTrigger: trigger,
    isPosting: isMutating,
  };
};

export const useUpdateAnalysis = (
  quantitative_id: number,
  analysis_id: number
) => {
  const key = { id: quantitative_id, path: API.QUANTITATIVE };

  const fetcher = async (
    key: CacheKey,
    { arg }: { arg: Partial<AnalysisModel> }
  ) => {
    const url = key.path + "/analysis" + "/" + analysis_id.toString();
    const res = await fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: arg.name,
        type: arg.type,
      }),
    });
    if (!res.ok) throw new Error("Error while updating analysis.");
    return res.text();
  };

  const { trigger, isMutating } = useSWRMutation(key, fetcher);
  return {
    updateTrigger: trigger,
    isUpdating: isMutating,
  };
};

export const useDeleteAnalysis = (
  quantitative_id: number,
  analysis_id: number
) => {
  const key = { id: quantitative_id, path: API.QUANTITATIVE };

  const fetcher = async (key: CacheKey) => {
    const url = key.path + "/analysis" + "/" + analysis_id.toString();
    const res = await fetch(url, { method: "DELETE" });
    if (!res.ok) throw new Error("Error while deleting the analysis.");
    return res.text();
  };

  const { trigger, isMutating } = useSWRMutation(key, fetcher);
  return {
    deleteTrigger: trigger,
    isDeleting: isMutating,
  };
};
