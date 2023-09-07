import * as React from "react";
import { SideNavigation } from "@cloudscape-design/components";
import { useLocation, useNavigate } from "react-router-dom";
import { useGetQuantitatives } from "../../../services/quantitatives/quantitative-service";

export default function Sidebar() {
  const { data } = useGetQuantitatives();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeHref, setActiveHref] = React.useState(location.pathname);

  return (
    <SideNavigation
      activeHref={activeHref}
      onFollow={(event) => {
        event.preventDefault();
        setActiveHref(event.detail.href);
        navigate(
          event.detail.href.replace(
            ":research_id",
            location.pathname.split("/")[1]
          )
        );
      }}
      header={{ href: "/", text: "Kirana Desktop" }}
      items={[
        { type: "link", href: "/:research_id", text: "Project Kirana NEW" },
        { type: "divider" },
        {
          type: "link-group",
          text: "Theoritical Foundations",
          href: "/:research_id/theory",
          items: [
            {
              type: "link",
              text: "References",
              href: "/:research_id/theory/reference?page=index",
            },
            {
              type: "link",
              text: "Bibliography",
              href: "/:research_id/theory/bibliography",
            },
          ],
        },
        { type: "divider" },
        {
          type: "link-group",
          text: "Quantitative Analyses",
          href: "/:research_id/quantitative",
          items: data?.map((e) => ({
            type: "link",
            text: e?.name ?? "",
            href: `/:research_id/quantitative/${e?.id}`,
          })),
        },
      ]}
    />
  );
}
