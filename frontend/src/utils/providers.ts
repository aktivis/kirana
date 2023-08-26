import { FlashbarProps } from "@cloudscape-design/components";
import { Dispatch, SetStateAction, createContext } from "react";
import { ResearchModel } from "../models/research-model";
import { QuantitativeModel } from "../models/quantitative-model";

export const StateFlashbarContext = createContext<
  Dispatch<SetStateAction<FlashbarProps.MessageDefinition[]>>
>(() => {});

export const ResearchDialogContext = createContext<{
  type?: string;
  data?: ResearchModel;
}>({});

export const QuantitativeDialogContext = createContext<{
  type?: string;
  data?: QuantitativeModel;
}>({});
