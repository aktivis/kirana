import { FlashbarProps } from "@cloudscape-design/components";
import { Dispatch, SetStateAction, createContext } from "react";
import { ResearchModel } from "../models/research-model";

export const StateFlashbarContext = createContext<
  Dispatch<SetStateAction<FlashbarProps.MessageDefinition[]>>
>(() => {});

export const ResearchDialogContext = createContext<{
  type?: string;
  data?: ResearchModel;
}>({});
