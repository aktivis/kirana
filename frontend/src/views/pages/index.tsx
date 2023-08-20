import { Dispatch, SetStateAction, useState } from "react";
import { useGetResearches } from "../../services/research-service";
import {
  Box,
  Button,
  ButtonDropdown,
  Cards,
  Container,
  ContentLayout,
  Header,
  Link,
  StatusIndicator,
} from "@cloudscape-design/components";
import { ResearchDialog } from "../components/research/ResearchDialog";
import {
  ResearchModel,
  createResearchModel,
} from "../../models/research-model";
import { ResearchDialogContext } from "../../utils/providers";

export default function HomePage() {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState<string>();
  const [dialogData, setDialogData] = useState<ResearchModel>();

  return (
    <ContentLayout header={<Header>Kirana Desktop</Header>}>
      <HomeContent
        setShowDialog={setShowDialog}
        setDialogType={setDialogType}
        setDialogData={setDialogData}
      />
      <ResearchDialogContext.Provider
        value={{ type: dialogType, data: dialogData }}
      >
        <ResearchDialog visible={showDialog} setVisible={setShowDialog} />
      </ResearchDialogContext.Provider>
    </ContentLayout>
  );
}

function HomeContent({
  setShowDialog,
  setDialogType,
  setDialogData,
}: {
  setShowDialog: Dispatch<SetStateAction<boolean>>;
  setDialogType: Dispatch<SetStateAction<string | undefined>>;
  setDialogData: Dispatch<SetStateAction<ResearchModel | undefined>>;
}) {
  const { data, loading, error, refetch } = useGetResearches();
  const empty = "No research projects found, please start a new one.";

  return error ? (
    <Container>
      <StatusIndicator type="error">{error}</StatusIndicator>
      <Box float="right">
        <Button variant="inline-link" onClick={refetch}>
          Retry
        </Button>
      </Box>
    </Container>
  ) : loading ? (
    <Container>
      <StatusIndicator type="loading">
        Loading research projects
      </StatusIndicator>
    </Container>
  ) : (
    <>
      <Cards
        empty={empty}
        header={
          <Header
            actions={
              <Button
                variant="primary"
                onClick={() => {
                  setDialogType("create");
                  setDialogData(createResearchModel({}));
                  setShowDialog(true);
                }}
              >
                Start a new project
              </Button>
            }
            description={"Let's manage research projects with Kirana!"}
          >
            Welcome to the home page,
          </Header>
        }
        items={data.map((e) => e)}
        cardDefinition={{
          sections: [
            {
              id: "description",
              content: (item) => `${item?.description}`,
            },
          ],
          header: (item) => (
            <>
              <Link href="#" fontSize="heading-m">
                {item?.name}
              </Link>
              <Box float="right">
                <ButtonDropdown
                  variant="icon"
                  items={[
                    {
                      id: "update",
                      text: "Modify",
                    },
                    {
                      id: "delete",
                      text: "Remove",
                    },
                  ]}
                  onItemClick={({ detail }) => {
                    setDialogType(detail.id);
                    setDialogData(createResearchModel(item!));
                    setShowDialog(true);
                  }}
                />
              </Box>
            </>
          ),
        }}
      />
    </>
  );
}
