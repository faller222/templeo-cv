import {
  CvData,
  CvInstance,
  CvThemeSettings,
  MasterProfile,
  emptyCvData,
} from "../types";
import { defaultThemeSettings } from "../data/sampleCVs";

export function cloneCvData(data: CvData): CvData {
  return structuredClone(data);
}

export function masterToInstanceData(master: MasterProfile): CvData {
  return cloneCvData(master);
}

export function createLocalCvInstance(params: {
  userId: string;
  title: string;
  data?: CvData;
  theme?: CvThemeSettings;
  sourceJobHint?: string;
  clonedFrom?: string | null;
}): CvInstance {
  const now = Date.now();
  const theme = params.theme ?? defaultThemeSettings;
  return {
    id: `local-${now}-${Math.random().toString(36).slice(2, 8)}`,
    userId: params.userId,
    title: params.title,
    sourceJobHint: params.sourceJobHint,
    templateId: theme.templateId,
    data: params.data ?? emptyCvData(),
    theme,
    clonedFrom: params.clonedFrom ?? null,
    createdAt: now,
    updatedAt: now,
  };
}

export function migrateLegacyLocalStorage(): {
  master: MasterProfile;
  instances: CvInstance[];
  activeId: string;
  theme: CvThemeSettings;
} | null {
  const raw = localStorage.getItem("cv_builder_data");
  if (!raw) return null;

  try {
    const data = JSON.parse(raw) as CvData;
    let theme = defaultThemeSettings;
    const themeRaw = localStorage.getItem("cv_builder_theme");
    if (themeRaw) {
      try {
        theme = JSON.parse(themeRaw);
      } catch {
        /* keep default */
      }
    }

    const instance = createLocalCvInstance({
      userId: "local",
      title: data.personalInfo?.fullName
        ? `CV — ${data.personalInfo.fullName}`
        : "Mi CV",
      data,
      theme,
    });

    localStorage.setItem(
      "templeo_cv_v2",
      JSON.stringify({
        master: data,
        instances: [instance],
        activeId: instance.id,
      })
    );
    localStorage.removeItem("cv_builder_data");

    return {
      master: data,
      instances: [instance],
      activeId: instance.id,
      theme,
    };
  } catch {
    return null;
  }
}
