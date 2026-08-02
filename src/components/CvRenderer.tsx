import React from "react";
import { CvData, CvThemeSettings } from "../types";
import { ClasicoV1Template } from "./templates/ClasicoV1Template";
import { MarkdownTemplateV1 } from "./templates/MarkdownTemplateV1";
import { ModernTemplate } from "./templates/ModernTemplate";
import { MinimalTemplate } from "./templates/MinimalTemplate";
import { ExecutiveTemplate } from "./templates/ExecutiveTemplate";
import { TechTemplate } from "./templates/TechTemplate";
import { CreativeTemplate } from "./templates/CreativeTemplate";
import { ElegantTemplate } from "./templates/ElegantTemplate";

interface Props {
  data: CvData;
  theme: CvThemeSettings;
}

export const CvRenderer: React.FC<Props> = ({ data, theme }) => {
  switch (theme.templateId) {
    case "clasico-v1":
      return <ClasicoV1Template data={data} theme={theme} />;
    case "markdown-template-v1":
      return <MarkdownTemplateV1 data={data} theme={theme} />;
    case "minimal":
      return <MinimalTemplate data={data} theme={theme} />;
    case "executive":
      return <ExecutiveTemplate data={data} theme={theme} />;
    case "tech":
      return <TechTemplate data={data} theme={theme} />;
    case "creative":
      return <CreativeTemplate data={data} theme={theme} />;
    case "elegant":
      return <ElegantTemplate data={data} theme={theme} />;
    case "modern":
    default:
      return <ModernTemplate data={data} theme={theme} />;
  }
};
