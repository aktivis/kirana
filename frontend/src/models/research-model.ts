import { LiteratureModel } from "./literature-model";
import { QuantitativeModel } from "./quantitative-model";

export interface ResearchModel {
  id: number | undefined;
  created_at: string | undefined;
  updated_at: string | undefined;
  name: string;
  description: string;
  literatures: LiteratureModel[];
  quantitatives: QuantitativeModel[];
}

export function createResearchModel(
  initial: Partial<ResearchModel>
): ResearchModel {
  return {
    id: initial.id ?? undefined,
    created_at: initial.created_at ?? undefined,
    updated_at: initial.updated_at ?? undefined,
    name: initial.name ?? "",
    description: initial.description ?? "",
    literatures: [],
    quantitatives: [],
  };
}

export function copyResearchModel(
  initial: ResearchModel,
  overrides: Partial<ResearchModel>
): ResearchModel {
  return {
    id: initial.id,
    created_at: overrides.created_at ?? initial.created_at,
    updated_at: overrides.updated_at ?? initial.updated_at,
    name: overrides.name ?? initial.name,
    description: overrides.description ?? initial.description,
    literatures: overrides.literatures ?? [...initial.literatures],
    quantitatives: overrides.quantitatives ?? [...initial.quantitatives],
  };
}
