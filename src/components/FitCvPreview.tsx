import React, { useEffect, useRef, useState } from "react";
import type { CvData, CvThemeSettings } from "../types";
import { CvRenderer } from "./CvRenderer";

/** A4 en px a 96dpi (CSS). */
const A4_W = 794;
const A4_H = 1123;
const MARGIN = 24;

interface Props {
  data: CvData;
  theme: CvThemeSettings;
}

/** Escala la hoja A4 para que entre en el contenedor, con margen alrededor. */
export const FitCvPreview: React.FC<Props> = ({ data, theme }) => {
  const frameRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.75);

  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;

    const measure = () => {
      const { clientWidth: w, clientHeight: h } = el;
      if (w < 40 || h < 40) return;
      const next = Math.min(
        (w - MARGIN * 2) / A4_W,
        (h - MARGIN * 2) / A4_H,
        1
      );
      setScale(Math.max(0.35, next));
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={frameRef}
      className="w-full h-full min-h-0 flex items-center justify-center bg-slate-300/80 rounded-lg"
    >
      <div
        style={{
          width: A4_W * scale,
          height: A4_H * scale,
        }}
        className="relative shadow-xl shrink-0"
      >
        <div
          id="cv-preview-container"
          style={{
            width: A4_W,
            height: A4_H,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
          className="absolute top-0 left-0 bg-white overflow-hidden"
        >
          <CvRenderer data={data} theme={theme} />
        </div>
      </div>
    </div>
  );
};
