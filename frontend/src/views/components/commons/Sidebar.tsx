import * as React from "react";
import { SideNavigation } from "@cloudscape-design/components";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const [activeHref, setActiveHref] = React.useState("/:id");
  const navigate = useNavigate();

  return (
    <SideNavigation
      activeHref={activeHref}
      onFollow={(event) => {
        if (!event.detail.external) {
          event.preventDefault();
          setActiveHref(event.detail.href);
          navigate(event.detail.href);
        }
      }}
      header={{ href: "/", text: "Kirana Desktop" }}
      items={[
        { type: "link", href: "/:id", text: "Project Kirana NEW" },
        { type: "divider" },
        {
          type: "link-group",
          text: "Theoritical Foundations",
          href: "/:id/theory/create/",
          items: [
            {
              type: "link",
              text: "References",
              href: "/:id/reference?page=index/",
            },
            {
              type: "link",
              text: "Bibliography",
              href: "/:id/bibliography/",
            },
          ],
        },
        { type: "divider" },
        {
          type: "link-group",
          text: "Quantitative Analyses",
          href: "/:id/quantitative/create/",
          items: [
            {
              type: "link",
              text: "Quantitative Name",
              href: "/:id/quantitative/:quantitative-name",
            },
          ],
        },
      ]}
    />
  );
}
