export default function Loading() {
  return (
    <div className="route-loading" role="status" aria-label="页面加载中">
      <div className="route-loading-bar" />
      <div className="route-loading-mark">
        <span>W</span>
        <i />
        <span>P</span>
      </div>
      <p>正在编辑今日世界</p>
    </div>
  );
}
