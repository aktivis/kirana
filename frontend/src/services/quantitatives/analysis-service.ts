import useSWRMutation from "swr/mutation";
import { BASE_URL } from "../../utils/api";
import { AnalysisModel } from "../../models/quantitative-model";

const ONE_QUANTITATIVE = `${BASE_URL}/quantitative/:id`;

export const useRunAnalysis = (
  quantitative_id: string,
  analysis_id: string
) => {
  const fetcher = async (
    key: string,
    { arg }: { arg: Partial<AnalysisModel> }
  ) => {
    const url =
      key.replace(":id", quantitative_id) + "/analysis" + "/" + analysis_id;
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

  const { trigger, isMutating } = useSWRMutation(ONE_QUANTITATIVE, fetcher);
  return {
    runTrigger: trigger,
    isRunning: isMutating,
  };
};

export const usePostAnalyses = (quantitative_id: string) => {
  const fetcher = async (key: string, { arg }: { arg: AnalysisModel[] }) => {
    const url = key.replace(":id", quantitative_id) + "/analysis";
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

  const { trigger, isMutating } = useSWRMutation(ONE_QUANTITATIVE, fetcher);
  return {
    postTrigger: trigger,
    isPosting: isMutating,
  };
};

export const useUpdateAnalysis = (
  quantitative_id: string,
  analysis_id: string
) => {
  const fetcher = async (
    key: string,
    { arg }: { arg: Partial<AnalysisModel> }
  ) => {
    const url =
      key.replace(":id", quantitative_id) + "/analysis" + "/" + analysis_id;
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

  const { trigger, isMutating } = useSWRMutation(ONE_QUANTITATIVE, fetcher);
  return {
    updateTrigger: trigger,
    isUpdating: isMutating,
  };
};

export const useDeleteAnalysis = (
  quantitative_id: string,
  analysis_id: string
) => {
  const fetcher = async (key: string) => {
    const url =
      key.replace(":id", quantitative_id) + "/analysis" + "/" + analysis_id;
    const res = await fetch(url, { method: "DELETE" });
    if (!res.ok) throw new Error("Error while deleting the analysis.");
    return res.text();
  };

  const { trigger, isMutating } = useSWRMutation(ONE_QUANTITATIVE, fetcher);
  return {
    deleteTrigger: trigger,
    isDeleting: isMutating,
  };
};
