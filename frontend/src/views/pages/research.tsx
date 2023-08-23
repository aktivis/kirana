import {
  ContentLayout,
  Header,
  TextContent,
} from "@cloudscape-design/components";
import { useGetResearch } from "../../services/research-service";
import { useParams } from "react-router-dom";

export default function ResearchPage() {
  const { id } = useParams();
  const { data, loading, error } = useGetResearch(id!);

  return error ? (
    <TextContent>{error.message}</TextContent>
  ) : loading ? (
    <TextContent>Loading</TextContent>
  ) : (
    <ContentLayout
      header={
        <Header children={data?.name} description={data?.description} info />
      }
    ></ContentLayout>
  );
}
