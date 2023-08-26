export type ObservationDatum = {
  [key: string]: undefined | number | string | boolean;
};

export enum IndicatorType {
  TEXT = "text",
  LIKERT = "likert",
}

export enum IndicatorRole {
  PROFILE = "profile",
  MEASURE = "measure",
}

export enum RelationType {
  DIRECT = "direct",
  MEDIATION = "mediation",
  MODERATION = "moderation",
}

export enum AnalysisType {
  DESCRIPTIVE = "descriptive statistics",
}

export interface ObservationModel {
  length: number;
  columns: string[];
  data: ObservationDatum[];
}

export interface IndicatorModel {
  id: number | undefined;
  quantitative_id: number | undefined;
  construct_id: number | null;
  order: number;
  visibility: boolean;
  origin: string;
  alias: string;
  type: IndicatorType;
  role: IndicatorRole;
}

export interface ConstructModel {
  id: number | undefined;
  quantitative_id: number | undefined;
  name: string;
  description: string;
  indicators: IndicatorModel[];
}

export interface RelationModel {
  id: number | undefined;
  quantitative_id: number | undefined;
  type: RelationType;
  influencer_construct: ConstructModel | undefined;
  independent_construct: ConstructModel | null;
  dependent_construct: ConstructModel | undefined;
}

export interface AnalysisModel {
  id: number | undefined;
  quantitative_id: number | undefined;
  name: string;
  type: AnalysisType;
  result: JSON | null;
}

export interface QuantitativeModel {
  id: number | undefined;
  research_id: number;
  created_at: string | undefined;
  updated_at: string | undefined;
  name: string;
  observation_code: string | undefined;
  indicators: IndicatorModel[];
  constructs: ConstructModel[];
  relations: RelationModel[];
  analyses: AnalysisModel[];
}

export function createConstructModel(): ConstructModel {
  return {
    id: undefined,
    quantitative_id: undefined,
    name: "",
    description: "",
    indicators: [],
  };
}

export function createRelationModel(): RelationModel {
  return {
    id: undefined,
    quantitative_id: undefined,
    type: RelationType.DIRECT,
    influencer_construct: undefined,
    independent_construct: null,
    dependent_construct: undefined,
  };
}

export function createQuantitativeModel(
  initial: Partial<QuantitativeModel>
): QuantitativeModel {
  return {
    id: initial.id ?? undefined,
    research_id: initial.research_id!,
    created_at: initial.created_at ?? undefined,
    updated_at: initial.updated_at ?? undefined,
    name: initial.name ?? "",
    observation_code: initial.observation_code ?? undefined,
    indicators: initial.indicators ?? [],
    constructs: initial.constructs ?? [],
    relations: initial.relations ?? [],
    analyses: initial.analyses ?? [],
  };
}

export function copyQuantitativeModel(
  initial: QuantitativeModel,
  overrides: Partial<QuantitativeModel>
): QuantitativeModel {
  return {
    id: initial.id,
    research_id: initial.research_id,
    created_at: initial.created_at,
    updated_at: initial.updated_at,
    name: overrides.name ?? initial.name,
    observation_code: overrides.observation_code ?? initial.observation_code,
    indicators: overrides.indicators ?? initial.indicators,
    constructs: overrides.constructs ?? initial.constructs,
    relations: overrides.relations ?? initial.relations,
    analyses: overrides.analyses ?? initial.analyses,
  };
}
