import useSWRMutation from "swr/mutation";
import { BASE_URL } from "../../utils/api";
import useSWR from "swr";
import { ObservationModel } from "../../models/quantitative-model";

const ONE_OBSERVATION = `${BASE_URL}/quantitative/:id/observation`;

export const useGetObservation = (id: string, page: string) => {
  const PAGINATED_KEY = `${ONE_OBSERVATION}?page=${page}`;

  const fetcher = async (key: string) => {
    const url = key.replace(":id", id);
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) throw new Error("Error while fetching observation.");
    return (await res.json()) as ObservationModel;
  };

  const { data, isLoading, error, mutate } = useSWR(PAGINATED_KEY, fetcher);
  return {
    data: data,
    loading: isLoading,
    error: error,
    refetch: mutate,
  };
};

export const useUpsertObservation = (id: string) => {
  const fetcher = async (key: string, { arg }: { arg: File }) => {
    const binary = new Blob([arg], { type: "text/csv" });
    const formData = new FormData();
    formData.append("csv", binary, "observation.csv");

    const url = key.replace(":id", id) + "/";
    const res = await fetch(url, {
      method: "PATCH",
      body: formData,
    });
    if (!res.ok) throw new Error("Error while creating a new observation.");
    return res.text();
  };

  const { trigger, isMutating } = useSWRMutation(ONE_OBSERVATION, fetcher);
  return {
    postTrigger: trigger,
    isPosting: isMutating,
  };
};
