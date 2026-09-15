/** 自动从当前脚本位置确定网站根目录，支持 GitHub 仓库子路径和自定义域名。 */
(() => {
  const root = new URL("../../", document.currentScript.src);
  window.portfolioUrl = (path) => new URL(path.replace(/^\/+/, ""), root).href;
})();
