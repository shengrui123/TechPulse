"use client";

import { useState } from "react";
import { trustedSources } from "../data/sources";

export default function SourceLabel({ source, name }: { source: string; name: string }) {
  const [failed, setFailed] = useState(false);
  const publisher = trustedSources.find((item) => item.name === source);
  const host = publisher ? new URL(publisher.url).hostname : null;
  const fallback = (publisher?.shortName || name).trim().charAt(0).toUpperCase();
  return <span className="source-label">
    {host && !failed
      ? <img className="source-logo" src={`https://www.google.com/s2/favicons?domain=${encodeURIComponent(host)}&sz=64`} alt="" width={20} height={20} onError={() => setFailed(true)} />
      : <span className="source-logo source-logo-fallback" aria-hidden="true">{fallback}</span>}
    <span>{name}</span>
  </span>;
}
