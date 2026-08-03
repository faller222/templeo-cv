import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import type { User } from "firebase/auth";
import {
  AppView,
  CvData,
  CvInstance,
  CvThemeSettings,
  AppLanguage,
  MasterProfile,
  emptyCvData,
  DEFAULT_ECONOMY,
} from "./types";
import {
  containsLegacyLenisePii,
  defaultThemeSettings,
  pickRandomGuestCv,
} from "./data/sampleCVs";
import { Navbar } from "./components/Navbar";
import { FormEditor } from "./components/FormEditor";
import { ThemeCustomizerModal } from "./components/ThemeCustomizerModal";
import { AIAssistantDrawer } from "./components/AIAssistantDrawer";
import { AuthBar } from "./components/AuthBar";
import { AuthModal, type AuthModalReason } from "./components/AuthModal";
import { WorkspaceSplit } from "./components/WorkspaceSplit";
import { FitCvPreview } from "./components/FitCvPreview";
import { AppShell } from "./components/AppShell";
import { ProfessionalProfileView } from "./components/profile/ProfessionalProfileView";
import { MyCvsView } from "./components/cvs/MyCvsView";
import { CreateCvModal } from "./components/cvs/CreateCvModal";
import {
  JobAnalysisOverlay,
  type AnalysisPhase,
} from "./components/cvs/JobAnalysisOverlay";
import {
  applyAuthIdentity,
  createLocalCvInstance,
  migrateLegacyLocalStorage,
  cloneCvData,
  masterToInstanceData,
} from "./lib/domain";
import { normalizeCvData } from "./lib/normalizeCvData";
import { computeProfileCompleteness } from "./lib/profileCompleteness";
import { api } from "./lib/api";
import { isFirebaseConfigured } from "./lib/firebase";
import {
  ensureUserDoc,
  listCvInstances,
  reconcileCvInstances,
  saveCvInstance,
  saveMasterProfile,
  deleteCvInstance,
} from "./lib/firestoreUser";
import { Edit3, Lock, RefreshCw } from "lucide-react";

const STORAGE_KEY = "templeo_cv_v2";
const AUTOSAVE_MS = 700;

type LocalState = {
  master: MasterProfile;
  instances: CvInstance[];
  activeId: string;
  theme: CvThemeSettings;
  isGuest: boolean;
  language: AppLanguage;
  profileUpdatedAt: number;
  view?: AppView;
};

function buildGuestState(): LocalState {
  const picked = pickRandomGuestCv();
  const master = normalizeCvData(picked.data);
  const theme: CvThemeSettings = {
    ...defaultThemeSettings,
    templateId: picked.templateId,
  };
  const now = Date.now();
  const instance = createLocalCvInstance({
    userId: "local",
    title: `CV — ${master.personalInfo.fullName}`,
    data: cloneCvData(master),
    theme,
    basedOnProfileAt: now,
  });
  return {
    master,
    instances: [instance],
    activeId: instance.id,
    theme,
    isGuest: true,
    language: picked.language,
    profileUpdatedAt: now,
  };
}

function hasLeniseInState(state: {
  master?: MasterProfile;
  instances?: CvInstance[];
}): boolean {
  if (state.master && containsLegacyLenisePii(state.master)) return true;
  return (state.instances || []).some((i) => containsLegacyLenisePii(i.data));
}

function loadLocalState(): LocalState {
  const migrated = migrateLegacyLocalStorage();
  if (migrated) {
    const now = Date.now();
    return {
      ...migrated,
      master: normalizeCvData(migrated.master),
      instances: migrated.instances.map((i) => ({
        ...i,
        data: normalizeCvData(i.data),
      })),
      language: "es",
      profileUpdatedAt: now,
    };
  }

  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed.master && parsed.instances?.length) {
        if (hasLeniseInState(parsed)) {
          const fresh = buildGuestState();
          localStorage.setItem(STORAGE_KEY, JSON.stringify(fresh));
          return fresh;
        }
        return {
          master: normalizeCvData(parsed.master),
          instances: parsed.instances.map((i: CvInstance) => ({
            ...i,
            data: normalizeCvData(i.data),
          })),
          activeId: parsed.activeId || parsed.instances[0].id,
          theme: parsed.theme || defaultThemeSettings,
          isGuest:
            parsed.isGuest !== false &&
            parsed.instances[0]?.userId === "local",
          language: parsed.language === "en" ? "en" : "es",
          profileUpdatedAt: parsed.profileUpdatedAt || Date.now(),
        };
      }
    } catch {
      /* fallthrough */
    }
  }

  return buildGuestState();
}

function sleep(ms: number) {
  return new Promise((r) => window.setTimeout(r, ms));
}

export default function App() {
  const initial = loadLocalState();
  const [master, setMaster] = useState<MasterProfile>(initial.master);
  const [instances, setInstances] = useState<CvInstance[]>(initial.instances);
  const [activeId, setActiveId] = useState<string>(initial.activeId);
  const [theme, setTheme] = useState<CvThemeSettings>(initial.theme);
  const [language, setLanguage] = useState<AppLanguage>(initial.language);
  const [isGuest, setIsGuest] = useState(initial.isGuest);
  const [profileUpdatedAt, setProfileUpdatedAt] = useState(
    initial.profileUpdatedAt
  );
  const [view, setView] = useState<AppView>(() => {
    const c = computeProfileCompleteness(initial.master);
    return c.isUsable ? "cvs" : "profile";
  });
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [createCvOpen, setCreateCvOpen] = useState(false);
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const [analysisPhase, setAnalysisPhase] = useState<AnalysisPhase>("idle");
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalReason, setAuthModalReason] =
    useState<AuthModalReason>("generic");
  const [user, setUser] = useState<User | null>(null);
  const [credits, setCredits] = useState<number>(DEFAULT_ECONOMY.creditosIa);

  const masterRef = useRef(master);
  const instancesRef = useRef(instances);
  const activeIdRef = useRef(activeId);
  const themeRef = useRef(theme);
  const isGuestRef = useRef(isGuest);
  const profileUpdatedAtRef = useRef(profileUpdatedAt);
  const syncedUidRef = useRef<string | null>(null);
  const skipAutosaveRef = useRef(false);

  useEffect(() => {
    masterRef.current = master;
  }, [master]);
  useEffect(() => {
    instancesRef.current = instances;
  }, [instances]);
  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);
  useEffect(() => {
    themeRef.current = theme;
  }, [theme]);
  useEffect(() => {
    isGuestRef.current = isGuest;
  }, [isGuest]);
  useEffect(() => {
    profileUpdatedAtRef.current = profileUpdatedAt;
  }, [profileUpdatedAt]);

  const active =
    instances.find((i) => i.id === activeId) || instances[0] || null;
  const cvData = normalizeCvData(active?.data ?? emptyCvData());
  const locked = !user;
  const completeness = useMemo(
    () => computeProfileCompleteness(master),
    [master]
  );
  const isStale =
    Boolean(active?.basedOnProfileAt) &&
    profileUpdatedAt > (active?.basedOnProfileAt || 0);

  const requireAuth = useCallback(
    (reason: AuthModalReason = "generic"): boolean => {
      if (user) return true;
      setAuthModalReason(reason);
      setAuthModalOpen(true);
      return false;
    },
    [user]
  );

  const setCvData = useCallback(
    (updater: CvData | ((prev: CvData) => CvData)) => {
      if (!user) return;
      setInstances((prev) =>
        prev.map((inst) => {
          if (inst.id !== activeId) return inst;
          const next =
            typeof updater === "function" ? updater(inst.data) : updater;
          return {
            ...inst,
            data: normalizeCvData(next),
            updatedAt: Date.now(),
          };
        })
      );
    },
    [activeId, user]
  );

  const updateMaster = useCallback(
    (updater: MasterProfile | ((prev: MasterProfile) => MasterProfile)) => {
      if (!user) return;
      setMaster((prev) => {
        const next =
          typeof updater === "function" ? updater(prev) : updater;
        return normalizeCvData(next);
      });
      const now = Date.now();
      setProfileUpdatedAt(now);
    },
    [user]
  );

  const setThemeGated: React.Dispatch<React.SetStateAction<CvThemeSettings>> =
    useCallback(
      (value) => {
        if (!user) {
          requireAuth("theme");
          return;
        }
        setTheme(value);
      },
      [user, requireAuth]
    );

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        master,
        instances,
        activeId,
        theme,
        isGuest: locked || isGuest,
        language,
        profileUpdatedAt,
      })
    );
  }, [
    master,
    instances,
    activeId,
    theme,
    isGuest,
    language,
    locked,
    profileUpdatedAt,
  ]);

  useEffect(() => {
    if (!user) return;
    setInstances((prev) =>
      prev.map((inst) => {
        if (inst.id !== activeId) return inst;
        const sameTemplate = inst.templateId === theme.templateId;
        const sameTheme =
          JSON.stringify(inst.theme) === JSON.stringify(theme);
        if (sameTemplate && sameTheme) return inst;
        return {
          ...inst,
          theme,
          templateId: theme.templateId,
          updatedAt: Date.now(),
        };
      })
    );
  }, [theme, activeId, user]);

  // Autosave master
  useEffect(() => {
    if (!user || !isFirebaseConfigured || locked) return;
    if (skipAutosaveRef.current) return;
    const timer = window.setTimeout(() => {
      void saveMasterProfile(user.uid, masterRef.current).catch(console.error);
    }, AUTOSAVE_MS);
    return () => window.clearTimeout(timer);
  }, [master, user, locked]);

  // Autosave instances
  useEffect(() => {
    if (!user || !isFirebaseConfigured || locked) return;
    if (skipAutosaveRef.current) return;

    const timer = window.setTimeout(async () => {
      const snapshot = instancesRef.current;
      let idRemap: { from: string; to: string } | null = null;

      for (const inst of snapshot) {
        try {
          const id = await saveCvInstance(user.uid, inst);
          if (id !== inst.id) idRemap = { from: inst.id, to: id };
        } catch (e) {
          console.error("Autosave failed", e);
        }
      }

      if (idRemap) {
        const { from, to } = idRemap;
        setInstances((prev) =>
          prev.map((i) =>
            i.id === from ? { ...i, id: to, userId: user.uid } : i
          )
        );
        if (activeIdRef.current === from) setActiveId(to);
      }
    }, AUTOSAVE_MS);

    return () => window.clearTimeout(timer);
  }, [instances, user, locked]);

  const onUserChange = useCallback(async (u: User | null) => {
    setUser(u);
    if (!u) {
      setIsGuest(true);
      syncedUidRef.current = null;
      return;
    }
    if (!isFirebaseConfigured) {
      setIsGuest(false);
      return;
    }

    if (syncedUidRef.current === u.uid) {
      setIsGuest(false);
      return;
    }

    try {
      skipAutosaveRef.current = true;
      const localInstances = instancesRef.current;
      const localActiveId = activeIdRef.current;
      const localActive =
        localInstances.find((i) => i.id === localActiveId) ||
        localInstances[0] ||
        null;
      const localMaster = masterRef.current;
      const localTheme = themeRef.current;
      const localProfileAt = profileUpdatedAtRef.current;

      const claimedData = normalizeCvData(
        applyAuthIdentity(localActive?.data || localMaster, u)
      );
      const claimedMaster = normalizeCvData(
        applyAuthIdentity(localMaster, u)
      );

      const remote = await listCvInstances(u.uid);

      if (remote.length) {
        const doc = await ensureUserDoc(u.uid, remote[0].data);
        const merged = await reconcileCvInstances(
          u.uid,
          localInstances,
          remote
        );
        const nextMaster = normalizeCvData(
          doc.profile || merged[0]?.data || remote[0].data
        );
        setMaster(nextMaster);
        setProfileUpdatedAt(doc.updatedAt || Date.now());
        setCredits(doc.economy?.creditosIa ?? DEFAULT_ECONOMY.creditosIa);
        setInstances(merged);
        const keepActive =
          merged.find((m) => m.id === localActiveId) || merged[0];
        setActiveId(keepActive.id);
        if (keepActive.theme) setTheme(keepActive.theme);
        setIsGuest(false);
        setAuthModalOpen(false);
        syncedUidRef.current = u.uid;
        const c = computeProfileCompleteness(nextMaster);
        setView(c.isUsable ? "cvs" : "profile");
        return;
      }

      const doc = await ensureUserDoc(u.uid, claimedMaster);
      setCredits(doc.economy?.creditosIa ?? DEFAULT_ECONOMY.creditosIa);

      const claimedInstance = createLocalCvInstance({
        userId: u.uid,
        title:
          localActive?.title ||
          `CV — ${claimedData.personalInfo.fullName}`,
        data: claimedData,
        theme: localActive?.theme || localTheme,
        sourceJobHint: localActive?.sourceJobHint,
        basedOnProfileAt: localProfileAt,
      });

      const cloudId = await saveCvInstance(u.uid, claimedInstance);
      const saved: CvInstance = {
        ...claimedInstance,
        id: cloudId,
        userId: u.uid,
      };
      await saveMasterProfile(u.uid, claimedMaster);

      setMaster(claimedMaster);
      setProfileUpdatedAt(Date.now());
      setInstances([saved]);
      setActiveId(cloudId);
      setTheme(saved.theme);
      setIsGuest(false);
      setAuthModalOpen(false);
      syncedUidRef.current = u.uid;
      const c = computeProfileCompleteness(claimedMaster);
      setView(c.isUsable ? "cvs" : "profile");
    } catch (e) {
      console.error("Firestore sync / claim failed", e);
    } finally {
      window.setTimeout(() => {
        skipAutosaveRef.current = false;
      }, AUTOSAVE_MS + 50);
    }
  }, []);

  const syncActiveToCloud = async () => {
    if (!user || !active) return;
    try {
      const id = await saveCvInstance(user.uid, active);
      if (id !== active.id) {
        setInstances((prev) =>
          prev.map((i) =>
            i.id === active.id ? { ...i, id, userId: user.uid } : i
          )
        );
        setActiveId(id);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const openCreateCv = () => {
    if (!requireAuth("manage")) return;
    setCreateCvOpen(true);
  };

  const handleCreateGeneral = async () => {
    if (!requireAuth("manage")) return;
    if (!user) return;
    const basedAt = profileUpdatedAt;
    const name =
      master.personalInfo.fullName?.trim() ||
      master.personalInfo.title?.trim() ||
      "General";
    const inst = createLocalCvInstance({
      userId: user.uid,
      title: `CV General — ${name}`,
      data: masterToInstanceData(master),
      theme,
      basedOnProfileAt: basedAt,
    });
    try {
      const id = await saveCvInstance(user.uid, inst);
      const saved = { ...inst, id, userId: user.uid };
      setInstances((prev) => [saved, ...prev]);
      setActiveId(id);
      setTheme(saved.theme);
      setView("editor");
    } catch (e) {
      console.error(e);
      setInstances((prev) => [inst, ...prev]);
      setActiveId(inst.id);
      setView("editor");
    }
  };

  const handleAnalyzeOffer = async (jobDescription: string) => {
    if (!requireAuth("ai")) return;
    if (!user) return;

    setAnalysisError(null);
    setAnalysisOpen(true);
    setAnalysisPhase("analyzing");

    const steps: AnalysisPhase[] = [
      "tech",
      "seniority",
      "skills",
      "keywords",
    ];
    let stepIdx = 0;
    const tick = window.setInterval(() => {
      if (stepIdx < steps.length) {
        setAnalysisPhase(steps[stepIdx]);
        stepIdx += 1;
      }
    }, 700);

    try {
      const res = await api.generateCv({
        jobHint: jobDescription,
        language,
        masterOverride: master,
      });
      window.clearInterval(tick);
      for (let i = stepIdx; i < steps.length; i++) {
        setAnalysisPhase(steps[i]);
        await sleep(220);
      }
      setAnalysisPhase("generating");
      if (typeof res.creditosIa === "number") setCredits(res.creditosIa);

      const inst = createLocalCvInstance({
        userId: user.uid,
        title: res.title || "CV adaptado",
        data: normalizeCvData(res.data),
        theme,
        sourceJobHint: jobDescription.slice(0, 160),
        basedOnProfileAt: profileUpdatedAt,
      });
      const id = await saveCvInstance(user.uid, inst);
      const saved = { ...inst, id, userId: user.uid };
      setInstances((prev) => [saved, ...prev]);
      setActiveId(id);
      setTheme(saved.theme);
      setAnalysisPhase("done");
      await sleep(450);
      setAnalysisOpen(false);
      setAnalysisPhase("idle");
      setView("editor");
    } catch (e: unknown) {
      window.clearInterval(tick);
      const msg =
        e instanceof Error ? e.message : "Error al generar el CV";
      setAnalysisPhase("error");
      setAnalysisError(msg);
      await sleep(1800);
      setAnalysisOpen(false);
      setAnalysisPhase("idle");
      throw e;
    }
  };

  const handleDuplicate = async (id: string) => {
    if (!requireAuth("manage")) return;
    if (!user) return;
    const source = instances.find((i) => i.id === id);
    if (!source) return;
    const cloned = createLocalCvInstance({
      userId: user.uid,
      title: `${source.title} (copia)`,
      data: cloneCvData(source.data),
      theme: source.theme || theme,
      sourceJobHint: source.sourceJobHint,
      clonedFrom: source.id,
      basedOnProfileAt: source.basedOnProfileAt ?? profileUpdatedAt,
      atsScore: source.atsScore,
    });
    try {
      const cloudId = await saveCvInstance(user.uid, cloned);
      const saved = { ...cloned, id: cloudId, userId: user.uid };
      setInstances((prev) => [saved, ...prev]);
    } catch (e) {
      console.error(e);
      setInstances((prev) => [cloned, ...prev]);
    }
  };

  const handleDelete = async (id: string) => {
    if (!requireAuth("manage")) return;
    setInstances((prev) => {
      const next = prev.filter((i) => i.id !== id);
      if (activeId === id) {
        const fallback = next[0];
        if (fallback) {
          setActiveId(fallback.id);
          if (fallback.theme) setTheme(fallback.theme);
        }
      }
      return next;
    });
    try {
      await deleteCvInstance(id);
    } catch (e) {
      console.error(e);
    }
  };

  const handlePullProfileIntoActive = () => {
    if (!requireAuth("edit") || !active) return;
    const merged = masterToInstanceData(master);
    setInstances((prev) =>
      prev.map((inst) =>
        inst.id === active.id
          ? {
              ...inst,
              data: merged,
              basedOnProfileAt: profileUpdatedAt,
              updatedAt: Date.now(),
            }
          : inst
      )
    );
  };

  const renameCv = (id: string, title: string) => {
    if (!requireAuth("edit")) return;
    const trimmed = title.trim() || "CV";
    setInstances((prev) =>
      prev.map((inst) =>
        inst.id === id
          ? { ...inst, title: trimmed, updatedAt: Date.now() }
          : inst
      )
    );
  };

  const openThemeModal = () => {
    if (!requireAuth("theme")) return;
    setIsThemeModalOpen(true);
  };

  const openAiDrawer = () => {
    if (!requireAuth("ai")) return;
    setIsAiDrawerOpen(true);
  };

  const navigate = (next: AppView) => {
    if (next === "editor") {
      if (!active) {
        setView("cvs");
        return;
      }
      setView("editor");
      return;
    }
    setView(next);
  };

  const editorPanel = (
    <div className="space-y-4">
      {isStale && (
        <div className="mx-1 flex flex-col sm:flex-row sm:items-center gap-2 justify-between rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5">
          <p className="text-xs text-amber-900 font-medium">
            Tu Perfil Profesional se actualizó después de crear este CV.
          </p>
          <button
            type="button"
            onClick={handlePullProfileIntoActive}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-950 bg-white border border-amber-200 px-2.5 py-1.5 rounded-lg hover:bg-amber-100 cursor-pointer shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Incorporar cambios del perfil
          </button>
        </div>
      )}

      <div className="flex items-center justify-between px-1 gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <Edit3 className="w-4 h-4 text-blue-600 shrink-0" />
          <input
            type="text"
            value={active?.title || ""}
            disabled={locked}
            onChange={(e) => {
              if (!active || locked) return;
              if (!requireAuth("edit")) return;
              setInstances((prev) =>
                prev.map((inst) =>
                  inst.id === active.id
                    ? {
                        ...inst,
                        title: e.target.value,
                        updatedAt: Date.now(),
                      }
                    : inst
                )
              );
            }}
            onBlur={() => {
              if (!active) return;
              const trimmed = active.title.trim() || "CV";
              const updated = {
                ...active,
                title: trimmed,
                updatedAt: Date.now(),
              };
              setInstances((prev) =>
                prev.map((inst) =>
                  inst.id === active.id ? updated : inst
                )
              );
              if (user) {
                void saveCvInstance(user.uid, updated).catch(console.error);
              }
            }}
            onClick={() => {
              if (locked) requireAuth("edit");
            }}
            placeholder="Nombre del CV"
            aria-label="Nombre del CV"
            className="min-w-0 flex-1 text-sm font-extrabold text-slate-900 bg-transparent border border-transparent hover:border-slate-200 focus:border-blue-400 focus:bg-white rounded-md px-1.5 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500/30 disabled:opacity-70"
          />
        </div>
        <span className="hidden sm:inline-flex text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md shrink-0">
          Basado en tu Perfil Profesional
        </span>
        {locked && (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md shrink-0">
            <Lock className="w-3 h-3" /> Ejemplo · solo lectura
          </span>
        )}
      </div>

      <div className="relative">
        <div
          className={
            locked ? "pointer-events-none select-none opacity-90" : undefined
          }
        >
          <FormEditor
            data={cvData}
            onChange={(updated) => setCvData(updated)}
            language={language}
          />
        </div>
        {locked && (
          <button
            type="button"
            aria-label="Iniciar sesión para editar"
            onClick={() => requireAuth("edit")}
            className="absolute inset-0 z-10 cursor-pointer rounded-xl border-0 bg-transparent"
          />
        )}
      </div>
    </div>
  );

  const previewPanel = (
    <div className="h-full min-h-0 w-full">
      <FitCvPreview data={cvData} theme={theme} />
    </div>
  );

  return (
    <div className="h-dvh max-h-dvh bg-slate-100 flex flex-col font-sans text-slate-800 antialiased overflow-hidden">
      <AppShell
        view={view}
        onNavigate={navigate}
        completenessPercent={completeness.percent}
        cvCount={instances.length}
        authSlot={
          <AuthBar
            onUserChange={onUserChange}
            credits={credits}
            onCreditsChange={setCredits}
          />
        }
      />

      <main className="flex-1 min-h-0 h-0 w-full flex flex-col overflow-hidden">
        {view === "profile" && (
          <ProfessionalProfileView
            profile={master}
            onChange={updateMaster}
            language={language}
            locked={locked}
            onRequireAuth={() => requireAuth("edit")}
            onGenerateCv={openCreateCv}
          />
        )}

        {view === "cvs" && (
          <MyCvsView
            instances={instances}
            profileUsable={completeness.isUsable}
            locked={locked}
            onRequireAuth={() => requireAuth("manage")}
            onCreate={openCreateCv}
            onOpen={(id) => {
              setActiveId(id);
              const inst = instances.find((i) => i.id === id);
              if (inst?.theme) setTheme(inst.theme);
              setView("editor");
            }}
            onRename={renameCv}
            onDuplicate={handleDuplicate}
            onDelete={handleDelete}
            onExport={(id) => {
              setActiveId(id);
              const inst = instances.find((i) => i.id === id);
              if (inst?.theme) setTheme(inst.theme);
              setView("editor");
              window.setTimeout(() => {
                document
                  .querySelector<HTMLButtonElement>(
                    'button[title="Exportar PDF"]'
                  )
                  ?.click();
              }, 350);
            }}
          />
        )}

        {view === "editor" && (
          <>
            <Navbar
              cvData={cvData}
              setCvData={setCvData}
              theme={theme}
              setTheme={setThemeGated}
              language={language}
              setLanguage={setLanguage}
              onOpenAiDrawer={openAiDrawer}
              onOpenThemeModal={openThemeModal}
              onRequireAuth={requireAuth}
              onBackToCvs={() => setView("cvs")}
              onSyncCloud={user ? syncActiveToCloud : undefined}
              compact
            />
            <div className="flex-1 min-h-0">
              <WorkspaceSplit editor={editorPanel} preview={previewPanel} />
            </div>
          </>
        )}
      </main>

      <ThemeCustomizerModal
        isOpen={isThemeModalOpen}
        onClose={() => setIsThemeModalOpen(false)}
        theme={theme}
        setTheme={setTheme}
      />

      <AIAssistantDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        cvData={cvData}
        setCvData={(updated) => setCvData(updated)}
        language={language}
        onCreditsChange={setCredits}
        onAtsScore={(score) => {
          setInstances((prev) =>
            prev.map((inst) =>
              inst.id === activeId
                ? { ...inst, atsScore: score, updatedAt: Date.now() }
                : inst
            )
          );
        }}
      />

      <CreateCvModal
        isOpen={createCvOpen}
        onClose={() => setCreateCvOpen(false)}
        profileUsable={completeness.isUsable}
        profilePercent={completeness.percent}
        onCreateGeneral={handleCreateGeneral}
        onAnalyzeOffer={handleAnalyzeOffer}
      />

      <JobAnalysisOverlay
        open={analysisOpen}
        phase={analysisPhase}
        error={analysisError}
      />

      <AuthModal
        open={authModalOpen}
        reason={authModalReason}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}
