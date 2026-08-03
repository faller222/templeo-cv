import React, { useState, useEffect, useCallback, useRef } from "react";
import type { User } from "firebase/auth";
import {
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
import { CvManagerModal } from "./components/CvManagerModal";
import { WorkspaceSplit } from "./components/WorkspaceSplit";
import { FitCvPreview } from "./components/FitCvPreview";
import {
  applyAuthIdentity,
  createLocalCvInstance,
  migrateLegacyLocalStorage,
  cloneCvData,
  masterToInstanceData,
} from "./lib/domain";
import { api } from "./lib/api";
import { isFirebaseConfigured } from "./lib/firebase";
import {
  ensureUserDoc,
  listCvInstances,
  reconcileCvInstances,
  saveCvInstance,
  saveMasterProfile,
} from "./lib/firestoreUser";
import { Edit3, Lock } from "lucide-react";

const STORAGE_KEY = "templeo_cv_v2";
const AUTOSAVE_MS = 700;

type LocalState = {
  master: MasterProfile;
  instances: CvInstance[];
  activeId: string;
  theme: CvThemeSettings;
  isGuest: boolean;
  language: AppLanguage;
};

function buildGuestState(): LocalState {
  const picked = pickRandomGuestCv();
  const master = cloneCvData(picked.data);
  const theme: CvThemeSettings = {
    ...defaultThemeSettings,
    templateId: picked.templateId,
  };
  const instance = createLocalCvInstance({
    userId: "local",
    title: `CV — ${master.personalInfo.fullName}`,
    data: cloneCvData(master),
    theme,
  });
  return {
    master,
    instances: [instance],
    activeId: instance.id,
    theme,
    isGuest: true,
    language: picked.language,
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
    return {
      ...migrated,
      language: "es",
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
          master: parsed.master,
          instances: parsed.instances,
          activeId: parsed.activeId || parsed.instances[0].id,
          theme: parsed.theme || defaultThemeSettings,
          isGuest: parsed.isGuest !== false && parsed.instances[0]?.userId === "local",
          language: parsed.language === "en" ? "en" : "es",
        };
      }
    } catch {
      /* fallthrough */
    }
  }

  return buildGuestState();
}

export default function App() {
  const initial = loadLocalState();
  const [master, setMaster] = useState<MasterProfile>(initial.master);
  const [instances, setInstances] = useState<CvInstance[]>(initial.instances);
  const [activeId, setActiveId] = useState<string>(initial.activeId);
  const [theme, setTheme] = useState<CvThemeSettings>(initial.theme);
  const [language, setLanguage] = useState<AppLanguage>(initial.language);
  const [isGuest, setIsGuest] = useState(initial.isGuest);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isCvManagerOpen, setIsCvManagerOpen] = useState(false);
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

  const active =
    instances.find((i) => i.id === activeId) || instances[0] || null;
  const cvData = active?.data ?? emptyCvData();
  const locked = !user;

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
          return { ...inst, data: next, updatedAt: Date.now() };
        })
      );
    },
    [activeId, user]
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

  // Persist local
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
      })
    );
  }, [master, instances, activeId, theme, isGuest, language, locked]);

  // Sync theme onto active instance without bumping updatedAt if nothing changed
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

  // Autosave a Firestore (debounce) cuando hay sesión
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
          prev.map((i) => (i.id === from ? { ...i, id: to, userId: user.uid } : i))
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

    // Evita que un re-subscribe de Auth pise ediciones locales a mitad de sesión
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

      const claimedData = applyAuthIdentity(
        localActive?.data || localMaster,
        u
      );
      const claimedMaster = applyAuthIdentity(localMaster, u);

      const remote = await listCvInstances(u.uid);

      if (remote.length) {
        const doc = await ensureUserDoc(u.uid, remote[0].data);
        const merged = await reconcileCvInstances(
          u.uid,
          localInstances,
          remote
        );
        setMaster(doc.profile || merged[0]?.data || remote[0].data);
        setCredits(doc.economy?.creditosIa ?? DEFAULT_ECONOMY.creditosIa);
        setInstances(merged);
        const keepActive =
          merged.find((m) => m.id === localActiveId) || merged[0];
        setActiveId(keepActive.id);
        if (keepActive.theme) setTheme(keepActive.theme);
        setIsGuest(false);
        setAuthModalOpen(false);
        syncedUidRef.current = u.uid;
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
      });

      const cloudId = await saveCvInstance(u.uid, claimedInstance);
      const saved: CvInstance = {
        ...claimedInstance,
        id: cloudId,
        userId: u.uid,
      };
      await saveMasterProfile(u.uid, claimedData);

      setMaster(claimedData);
      setInstances([saved]);
      setActiveId(cloudId);
      setTheme(saved.theme);
      setIsGuest(false);
      setAuthModalOpen(false);
      syncedUidRef.current = u.uid;
    } catch (e) {
      console.error("Firestore sync / claim failed", e);
    } finally {
      // Soltar el skip en el próximo tick para no autosavear el set masivo
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

  const handleSaveMasterFromActive = async () => {
    if (!requireAuth("manage")) return;
    const next = cloneCvData(cvData);
    setMaster(next);
    if (user && isFirebaseConfigured) {
      await saveMasterProfile(user.uid, next);
    }
  };

  const handleClone = async () => {
    if (!requireAuth("manage")) return;
    if (!active || !user) return;
    const cloned = createLocalCvInstance({
      userId: user.uid,
      title: `${active.title} (copia)`,
      data: cloneCvData(active.data),
      theme: active.theme || theme,
      sourceJobHint: active.sourceJobHint,
      clonedFrom: active.id,
    });
    try {
      const id = await saveCvInstance(user.uid, cloned);
      const saved = { ...cloned, id, userId: user.uid };
      setInstances((prev) => [...prev, saved]);
      setActiveId(id);
    } catch (e) {
      console.error(e);
      setInstances((prev) => [...prev, cloned]);
      setActiveId(cloned.id);
    }
  };

  const handleCreateBlank = async (title: string) => {
    if (!requireAuth("manage")) return;
    if (!user) return;
    const inst = createLocalCvInstance({
      userId: user.uid,
      title,
      data: masterToInstanceData(master),
      theme,
    });
    try {
      const id = await saveCvInstance(user.uid, inst);
      const saved = { ...inst, id, userId: user.uid };
      setInstances((prev) => [...prev, saved]);
      setActiveId(id);
    } catch (e) {
      console.error(e);
      setInstances((prev) => [...prev, inst]);
      setActiveId(inst.id);
    }
  };

  const handleGenerateAi = async (jobHint: string) => {
    if (!requireAuth("ai")) return;
    if (!user) return;
    const res = await api.generateCv({
      jobHint,
      language,
      masterOverride: master,
    });
    if (typeof res.creditosIa === "number") setCredits(res.creditosIa);
    const inst = createLocalCvInstance({
      userId: user.uid,
      title: res.title || "CV IA",
      data: res.data,
      theme,
      sourceJobHint: jobHint,
    });
    const id = await saveCvInstance(user.uid, inst);
    const saved = { ...inst, id, userId: user.uid };
    setInstances((prev) => [...prev, saved]);
    setActiveId(id);
  };

  const openThemeModal = () => {
    if (!requireAuth("theme")) return;
    setIsThemeModalOpen(true);
  };

  const openAiDrawer = () => {
    if (!requireAuth("ai")) return;
    setIsAiDrawerOpen(true);
  };

  const openCvManager = () => {
    if (!requireAuth("manage")) return;
    setIsCvManagerOpen(true);
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

  const editorPanel = (
    <div className="space-y-4">
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
      <Navbar
        cvData={cvData}
        setCvData={setCvData}
        theme={theme}
        setTheme={setThemeGated}
        language={language}
        setLanguage={setLanguage}
        onOpenAiDrawer={openAiDrawer}
        onOpenThemeModal={openThemeModal}
        onOpenCvManager={openCvManager}
        onRequireAuth={requireAuth}
        authSlot={
          <AuthBar
            onUserChange={onUserChange}
            credits={credits}
            onCreditsChange={setCredits}
          />
        }
        onSaveMaster={handleSaveMasterFromActive}
        onSyncCloud={user ? syncActiveToCloud : undefined}
      />

      <main className="flex-1 min-h-0 h-0 w-full flex flex-col overflow-hidden">
        <WorkspaceSplit editor={editorPanel} preview={previewPanel} />
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
      />

      <CvManagerModal
        isOpen={isCvManagerOpen}
        onClose={() => setIsCvManagerOpen(false)}
        instances={instances}
        activeId={activeId}
        onSelect={(id) => {
          setActiveId(id);
          const inst = instances.find((i) => i.id === id);
          if (inst?.theme) setTheme(inst.theme);
        }}
        onRename={renameCv}
        onClone={handleClone}
        onCreateBlank={handleCreateBlank}
        onGenerateAi={handleGenerateAi}
      />

      <AuthModal
        open={authModalOpen}
        reason={authModalReason}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
}
