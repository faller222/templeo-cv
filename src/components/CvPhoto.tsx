import React, { useState } from "react";
import { normalizePhotoUrl } from "../lib/photoUrl";

export { normalizePhotoUrl };

interface Props {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Foto de perfil del CV. Sin referrer: las URLs de Google Auth
 * devuelven 403 si el browser manda Referer de nuestro dominio.
 */
export const CvPhoto: React.FC<Props> = ({ src, alt, className, style }) => {
  const [failed, setFailed] = useState(false);
  const normalized = normalizePhotoUrl(src);

  if (!normalized || failed) return null;

  return (
    <img
      src={normalized}
      alt={alt}
      className={className}
      style={style}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
};
