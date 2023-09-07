import useSWRMutation from "swr/mutation";
import useSWR from "swr";
import { ObservationModel } from "../../models/quantitative-model";
import API, { CacheKey } from "../../utils/api";

export const useGetObservation = (slug: string, page: number) => {
  const key = { slug: slug, path: API.OBSERVATION, params: { page: page } };

  const fetcher = async (key: CacheKey) => {
    const url = key.path + "/" + key.slug + "?page=" + key.params!.page;
    const res = await fetch(url, { method: "GET" });
    if (!res.ok) throw new Error("Error while fetching observation.");
    return (await res.json()) as ObservationModel;
  };

  const { data, isLoading, error, mutate } = useSWR(key, fetcher);
  return {
    data: data,
    loading: isLoading,
    error: error,
    refetch: mutate,
  };
};

export const useUpsertObservation = () => {
  const key = { slug: undefined, path: API.OBSERVATION };

  const fetcher = async (
    key: CacheKey,
    { arg }: { arg: { observation_code: string; csv_file: File } }
  ) => {
    const url = key.path + "/";
    const binary = new Blob([arg.csv_file], { type: "text/csv" });
    const formData = new FormData();

    formData.append("observation_code", arg.observation_code);
    formData.append("csv_file", binary, "observation.csv");

    const res = await fetch(url, {
      method: "PATCH",
      body: formData,
    });
    if (!res.ok) throw new Error("Error while creating a new observation.");
    return res.text();
  };

  const { trigger, isMutating } = useSWRMutation(key, fetcher);
  return {
    postTrigger: trigger,
    isPosting: isMutating,
  };
};
