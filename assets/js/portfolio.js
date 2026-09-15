/**
 * 作品界面控制。作品内容请编辑 /data/projects.js。
 * 1. 总览：创建鱼的点击链接，并跟随渔网移动。
 * 2. 详情：创建左侧鱼选择器和右侧卡片。
 * 3. 导航：滚轮、键盘、触摸均可循环切换卡片。
 */
(() => {
  const projects = window.PORTFOLIO_PROJECTS;
  const view = document.body.dataset.view;
  const projectUrl = (project) => window.portfolioUrl(`work/${project.id}/`);

  // 将用户编辑的文字作为文字显示，避免被解释成 HTML。
  function escapeHtml(value) {
    return String(value).replace(
      /[&<>"']/g,
      (character) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[character],
    );
  }

  function createCollectionLinks() {
    const layer = document.getElementById("fish-links");
    projects.forEach((project) => {
      const link = document.createElement("a");
      link.href = projectUrl(project);
      link.className = "fish-project-link";
      link.style.setProperty("--domain", project.color);
      link.setAttribute("aria-label", `Explore ${project.title}, ${project.category}`);
      link.innerHTML = `
        <span class="fish-hit" aria-hidden="true"></span>
        <span class="fish-label">
          ${escapeHtml(project.title)}
          <small>${escapeHtml(project.category)} ↗</small>
        </span>`;
      layer.append(link);
    });

    // 坐标来自 fishing-net.js，链接与鱼始终使用同一位置。
    window.addEventListener("netframe", (event) => {
      [...layer.children].forEach((link, index) => {
        const fish = event.detail[index];
        if (!fish) return;
        link.style.left = `${fish.x}px`;
        link.style.top = `${fish.y}px`;
        link.style.width = `${fish.width}px`;
        link.style.setProperty("--fish-angle", `${fish.angle}rad`);
      });
    });
  }

  function createFishSelector(selectedIndex) {
    const list = document.getElementById("catch-list");
    const middle = Math.floor(projects.length / 2);
    projects.forEach((project, index) => {
      const link = document.createElement("a");
      const isSelected = index === selectedIndex;
      const offset =
        ((index - selectedIndex + projects.length + middle) % projects.length) - middle;
      link.href = projectUrl(project);
      link.className = `catch-item${isSelected ? " selected" : ""}`;
      link.style.setProperty("--catch-offset", offset);
      link.style.setProperty("--catch-curve", offset * offset);
      link.style.setProperty("--fish-facing", project.fish.facing);
      if (isSelected) link.setAttribute("aria-current", "page");
      link.setAttribute("aria-label", `${project.title}, ${project.category}`);
      link.innerHTML = `
        <span class="fish-crop" style="--source-y:${project.fish.sourceY};--source-height:${project.fish.sourceHeight}">
          <img src="${window.portfolioUrl("assets/images/fish-reference.png")}" alt="${escapeHtml(project.title)} fish">
        </span>
        <span class="catch-name">
          ${escapeHtml(project.title)}<small>${escapeHtml(project.category)}</small>
        </span>`;
      list.append(link);
    });
  }

  // 卡片轮廓：SVG 仅绘制界面边框，照片和文字仍使用普通 HTML。
  const CARD_OUTLINE =
    "M 145,82 Q 490,18 910,36 Q 937,37 942,64 Q 995,350 942,636 Q 937,663 910,664 Q 490,682 145,618 Q 116,612 125,585 Q 163,350 125,115 Q 116,88 145,82 Z";

  function createCards(project) {
    const container = document.getElementById("orbit-cards");
    project.slides.forEach((slide) => {
      const card = document.createElement("article");
      card.className = `orbit-card${slide.image ? " image-card" : ""}`;
      const imageHtml = slide.image
        ? `
        <figure class="project-photo">
          <img src="${escapeHtml(window.portfolioUrl(slide.image.src))}" alt="${escapeHtml(slide.image.alt)}" loading="lazy">
          <figcaption>${escapeHtml(slide.image.caption)}</figcaption>
        </figure>`
        : "";
      card.innerHTML = `
        <svg class="card-shape" viewBox="0 0 1000 700" preserveAspectRatio="none" aria-hidden="true">
          <path d="${CARD_OUTLINE}"/>
        </svg>
        <div class="card-content">
          <span class="eyebrow">${escapeHtml(slide.section)}</span>
          <h1>${escapeHtml(slide.title)}</h1>
          ${imageHtml}
          <p>${escapeHtml(slide.text)}</p>
        </div>`;
      container.append(card);
    });
    return [...container.children];
  }

  function enableOrbitNavigation(cards) {
    const orbit = document.querySelector(".project-orbit");
    const WHEEL_COOLDOWN_MS = 550;
    const SWIPE_DISTANCE_PX = 40;
    let activeIndex = 0;
    let lastWheelTime = 0;
    let touchStartY = null;

    function render() {
      cards.forEach((card, index) => {
        let offset = index - activeIndex;
        if (offset > cards.length / 2) offset -= cards.length;
        if (offset < -cards.length / 2) offset += cards.length;
        card.style.setProperty("--offset", offset);
        card.style.setProperty("--curve", offset * offset);
        card.classList.toggle("active", index === activeIndex);
        card.setAttribute("aria-hidden", index === activeIndex ? "false" : "true");
        card.inert = index !== activeIndex;
      });
    }

    function move(direction) {
      activeIndex = (activeIndex + direction + cards.length) % cards.length;
      render();
    }

    orbit.addEventListener(
      "wheel",
      (event) => {
        // 长文字先在卡片内滚动；到达边缘后才切换卡片。
        const inner = event.target.closest?.(".card-content");
        if (inner) {
          const canScrollDown =
            event.deltaY > 0 && inner.scrollTop + inner.clientHeight < inner.scrollHeight - 2;
          const canScrollUp = event.deltaY < 0 && inner.scrollTop > 2;
          if (canScrollDown || canScrollUp) return;
        }
        event.preventDefault();
        if (Math.abs(event.deltaY) < 7) return;
        const now = Date.now();
        if (now - lastWheelTime < WHEEL_COOLDOWN_MS) return;
        lastWheelTime = now;
        move(event.deltaY > 0 ? 1 : -1);
      },
      { passive: false },
    );

    orbit.addEventListener("keydown", (event) => {
      const supported = ["ArrowDown", "PageDown", "ArrowUp", "PageUp", "Home", "End"];
      if (!supported.includes(event.key)) return;
      event.preventDefault();
      if (event.key === "Home") {
        activeIndex = 0;
        render();
      } else if (event.key === "End") {
        activeIndex = cards.length - 1;
        render();
      } else move(["ArrowDown", "PageDown"].includes(event.key) ? 1 : -1);
    });

    orbit.addEventListener(
      "touchstart",
      (event) => {
        touchStartY = event.touches[0].clientY;
      },
      { passive: true },
    );
    orbit.addEventListener(
      "touchend",
      (event) => {
        if (touchStartY === null) return;
        const distance = touchStartY - event.changedTouches[0].clientY;
        if (Math.abs(distance) > SWIPE_DISTANCE_PX) move(distance > 0 ? 1 : -1);
        touchStartY = null;
      },
      { passive: true },
    );
    render();
  }

  if (view === "work") createCollectionLinks();
  if (view !== "detail") return;
  const id = location.pathname.split("/").filter(Boolean).at(-1);
  const selectedIndex = Math.max(
    0,
    projects.findIndex((project) => project.id === id),
  );
  const selected = projects[selectedIndex];
  document.title = `${selected.title} — Athena Zeng`;
  document.body.style.setProperty("--project-color", selected.color);
  document.getElementById("project-category").textContent = selected.category.toUpperCase();
  document.getElementById("project-number").textContent = selected.title;
  createFishSelector(selectedIndex);
  enableOrbitNavigation(createCards(selected));
})();
