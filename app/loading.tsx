import Image from "next/image";

export default function Loading() {
  return (
    <div className="route-loading" role="status" aria-label="页面加载中">
      <div className="route-loading-bar" />
      <Image
        className="route-loading-logo"
        src="/worldpulse-logo.png"
        alt="WorldPulse"
        width={640}
        height={640}
        priority
      />
      <p>
        正在加载新闻
        <span className="route-loading-dots" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
      </p>
    </div>
  );
}
