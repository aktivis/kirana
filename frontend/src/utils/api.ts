const BASE_URL = "http://127.0.0.1:5000";

export default class API {
  static RESEARCH = `${BASE_URL}/research`;
  static QUANTITATIVE = `${BASE_URL}/quantitative`;
  static OBSERVATION = `${BASE_URL}/quantitative/observation`;
}

export type CacheKey = {
  id?: number;
  slug?: string;
  path: string;
  params?: { [key: string]: unknown };
};
