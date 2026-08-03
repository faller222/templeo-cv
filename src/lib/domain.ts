import {
  CvData,
  CvInstance,
  CvThemeSettings,
  MasterProfile,
  emptyCvData,
} from "../types";
import {
  containsLegacyLenisePii,
  defaultThemeSettings,
} from "../data/sampleCVs";

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
  isGuest: boolean;
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

    localStorage.removeItem("cv_builder_data");
    localStorage.removeItem("cv_builder_theme");

    // No migrar PII real de Lenise al nuevo storage: el guest bootstrap lo reemplaza.
    if (containsLegacyLenisePii(data)) {
      return null;
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
        theme,
        isGuest: true,
      })
    );

    return {
      master: data,
      instances: [instance],
      activeId: instance.id,
      theme,
      isGuest: true,
    };
  } catch {
    return null;
  }
}

export function applyAuthIdentity(
  data: CvData,
  identity: {
    displayName?: string | null;
    email?: string | null;
    photoURL?: string | null;
  }
): CvData {
  const next = cloneCvData(data);
  const hasPhoto = Boolean(identity.photoURL);
  next.personalInfo = {
    ...next.personalInfo,
    fullName: identity.displayName || next.personalInfo.fullName,
    email: identity.email || next.personalInfo.email,
    photoUrl: identity.photoURL || next.personalInfo.photoUrl,
    showPhoto: hasPhoto || next.personalInfo.showPhoto,
  };
  return next;
}
