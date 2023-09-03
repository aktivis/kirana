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
          event.detail.href.replace(":id", location.pathname.split("/")[1])
        );
      }}
      header={{ href: "/", text: "Kirana Desktop" }}
      items={[
        { type: "link", href: "/:id", text: "Project Kirana NEW" },
        { type: "divider" },
        {
          type: "link-group",
          text: "Theoritical Foundations",
          href: "/:id/theory",
          items: [
            {
              type: "link",
              text: "References",
              href: "/:id/theory/reference?page=index",
            },
            {
              type: "link",
              text: "Bibliography",
              href: "/:id/theory/bibliography",
            },
          ],
        },
        { type: "divider" },
        {
          type: "link-group",
          text: "Quantitative Analyses",
          href: "/:id/quantitative",
          items: data?.map((e) => ({
            type: "link",
            text: e?.name ?? "",
            href: `/:id/quantitative/${e?.id}`,
          })),
        },
      ]}
    />
  );
}
