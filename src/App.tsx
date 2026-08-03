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
import { CvRenderer } from "./components/CvRenderer";
import { ThemeCustomizerModal } from "./components/ThemeCustomizerModal";
import { AIAssistantDrawer } from "./components/AIAssistantDrawer";
import { AuthBar } from "./components/AuthBar";
import { AuthModal, type AuthModalReason } from "./components/AuthModal";
import { CvManagerModal } from "./components/CvManagerModal";
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
  saveCvInstance,
  saveMasterProfile,
} from "./lib/firestoreUser";
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Eye,
  Edit3,
  Lock,
} from "lucide-react";

const STORAGE_KEY = "templeo_cv_v2";

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
  const [zoomLevel, setZoomLevel] = useState(0.95);
  const [mobileTab, setMobileTab] = useState<"editor" | "preview">("editor");
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

  // Sync theme onto active instance (solo autenticado)
  useEffect(() => {
    if (!user) return;
    setInstances((prev) =>
      prev.map((inst) =>
        inst.id === activeId
          ? {
              ...inst,
              theme,
              templateId: theme.templateId,
              updatedAt: Date.now(),
            }
          : inst
      )
    );
  }, [theme, activeId, user]);

  const onUserChange = useCallback(async (u: User | null) => {
    setUser(u);
    if (!u) {
      setIsGuest(true);
      return;
    }
    if (!isFirebaseConfigured) {
      setIsGuest(false);
      return;
    }

    try {
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
        setMaster(doc.profile || remote[0].data);
        setCredits(doc.economy?.creditosIa ?? DEFAULT_ECONOMY.creditosIa);
        setInstances(remote);
        setActiveId(remote[0].id);
        if (remote[0].theme) setTheme(remote[0].theme);
        setIsGuest(false);
        setAuthModalOpen(false);
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
      const saved: CvInstance = { ...claimedInstance, id: cloudId, userId: u.uid };
      await saveMasterProfile(u.uid, claimedData);

      setMaster(claimedData);
      setInstances([saved]);
      setActiveId(cloudId);
      setTheme(saved.theme);
      setIsGuest(false);
      setAuthModalOpen(false);
    } catch (e) {
      console.error("Firestore sync / claim failed", e);
    }
  }, []);

  const syncActiveToCloud = async () => {
    if (!user || !active) return;
    try {
      const id = await saveCvInstance(user.uid, active);
      if (id !== active.id) {
        setInstances((prev) =>
          prev.map((i) => (i.id === active.id ? { ...i, id } : i))
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

  const handleClone = () => {
    if (!requireAuth("manage")) return;
    if (!active) return;
    const cloned = createLocalCvInstance({
      userId: user!.uid,
      title: `${active.title} (copia)`,
      data: cloneCvData(active.data),
      theme: active.theme || theme,
      sourceJobHint: active.sourceJobHint,
      clonedFrom: active.id,
    });
    setInstances((prev) => [...prev, cloned]);
    setActiveId(cloned.id);
  };

  const handleCreateBlank = (title: string) => {
    if (!requireAuth("manage")) return;
    const inst = createLocalCvInstance({
      userId: user!.uid,
      title,
      data: masterToInstanceData(master),
      theme,
    });
    setInstances((prev) => [...prev, inst]);
    setActiveId(inst.id);
  };

  const handleGenerateAi = async (jobHint: string) => {
    if (!requireAuth("ai")) return;
    const res = await api.generateCv({
      jobHint,
      language,
      masterOverride: master,
    });
    if (typeof res.creditosIa === "number") setCredits(res.creditosIa);
    const inst = createLocalCvInstance({
      userId: user!.uid,
      title: res.title || "CV IA",
      data: res.data,
      theme,
      sourceJobHint: jobHint,
    });
    setInstances((prev) => [...prev, inst]);
    setActiveId(inst.id);
    if (user) await saveCvInstance(user.uid, inst);
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

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-800 antialiased">
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

      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:hidden col-span-1 flex bg-white p-1 rounded-xl border border-slate-200 shadow-xs mb-1">
          <button
            onClick={() => setMobileTab("editor")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mobileTab === "editor"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" /> Editar
          </button>
          <button
            onClick={() => setMobileTab("preview")}
            className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              mobileTab === "preview"
                ? "bg-slate-900 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-blue-400" /> Preview
          </button>
        </div>

        <div
          className={`lg:col-span-5 space-y-4 ${
            mobileTab === "preview" ? "hidden lg:block" : "block"
          }`}
        >
          <div className="flex items-center justify-between px-1 gap-2">
            <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 truncate">
              <Edit3 className="w-4 h-4 text-blue-600 shrink-0" />
              {active?.title || "CV"}
            </h2>
            {locked ? (
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md shrink-0">
                <Lock className="w-3 h-3" /> Ejemplo · solo lectura
              </span>
            ) : (
              <span className="text-[11px] text-slate-500 shrink-0">
                Instancia · Master aparte
              </span>
            )}
          </div>

          <div className="relative">
            <div
              className={locked ? "pointer-events-none select-none opacity-90" : undefined}
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

        <div
          className={`lg:col-span-7 flex flex-col items-center ${
            mobileTab === "editor" ? "hidden lg:flex" : "flex"
          }`}
        >
          <div className="w-full bg-white p-2.5 rounded-xl border border-slate-200 shadow-xs mb-4 flex items-center justify-between text-xs print:hidden">
            <div className="flex items-center gap-2 font-semibold text-slate-700">
              <Eye className="w-4 h-4 text-blue-600" />
              <span>Vista Previa</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.6, z - 0.1))}
                className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-md border border-slate-200 cursor-pointer"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-slate-700 font-bold min-w-[3rem] text-center">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(1.3, z + 0.1))}
                className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-md border border-slate-200 cursor-pointer"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(0.95)}
                className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-md border border-slate-200 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <div className="w-full flex justify-center overflow-x-auto pb-10">
            <div
              id="cv-preview-container"
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: "top center",
                transition: "transform 0.15s ease-out",
                width: "210mm",
                minHeight: "297mm",
              }}
              className="bg-white shadow-xl rounded-sm border border-slate-200 transition-all shrink-0 relative overflow-hidden"
            >
              <CvRenderer data={cvData} theme={theme} />
            </div>
          </div>
        </div>
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
