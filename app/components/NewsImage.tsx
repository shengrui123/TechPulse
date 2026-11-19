"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type NewsImageProps = ImageProps & { source: string };

export default function NewsImage({ source, src, alt, ...props }: NewsImageProps) {
  const [failedSrc, setFailedSrc] = useState<ImageProps["src"] | null>(null);
  const failed = failedSrc === src;
  return (
    <Image
      {...props}
      src={failed ? "/editorial-cover.jpg" : src}
      alt={failed ? `${source} · WorldPulse 编辑插图` : alt}
      onError={() => { if (!failed) setFailedSrc(src); }}
    />
  );
}
