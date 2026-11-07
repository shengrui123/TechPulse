"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type NewsImageProps = ImageProps & { source: string };

export default function NewsImage({ source, src, alt, ...props }: NewsImageProps) {
  const [failedSrc, setFailedSrc] = useState<ImageProps["src"] | null>(null);
  const fallback = `/api/news-image?fallback=logo&source=${encodeURIComponent(source)}&v=6`;
  const failed = failedSrc === src;
  return <Image {...props} src={failed ? fallback : src} alt={failed ? `${source} 媒体标志` : alt} onError={() => { if (!failed) setFailedSrc(src); }} />;
}
