// 渔网模拟：setup 建立网点；tick 更新弹性与拖拽；draw 绘制网和鱼。
// 常改参数：columns / rows（网孔密度）、setup 内网形公式、draw 内线宽。
(() => {
  "use strict";
  const canvas = document.getElementById("net"),
    ctx = canvas.getContext("2d");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const image = new Image();
  image.src = "/assets/images/fish-reference.png";
  const isCollection = document.body.dataset.view === "work";
  let down = null;
  const columns = 22,
    rows = 24;
  let width = 0,
    height = 0,
    fishScale = 0,
    points = [],
    links = [],
    fish = [],
    pointer = null,
    grab = null,
    last = 0;
  const index = (i, j) => j * (columns + 1) + i;
  const noise = (i, j, offset) => Math.sin(i * 127.1 + j * 311.7 + offset) * 0.5;
  function setup() {
    const box = canvas.getBoundingClientRect();
    width = box.width;
    height = box.height;
    // Fit the net's original proportions inside the available collection canvas.
    const meshHeight = isCollection ? Math.min(height, width / 1.16) : height;
    const meshWidth = isCollection ? meshHeight * 1.16 : width;
    const meshLeft = (width - meshWidth) / 2;
    const meshTop = (height - meshHeight) / 2;
    fishScale = meshWidth;
    const dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    points = [];
    links = [];
    grab = null;
    pointer = null;
    for (let j = 0; j <= rows; j++)
      for (let i = 0; i <= columns; i++) {
        const u = i / columns,
          v = j / rows;
        // Two lifted corners, a deep catenary belly, and folded side gathers.
        const sag = Math.pow(Math.sin(Math.PI * u), 0.82);
        const gather = Math.pow(Math.abs(2 * u - 1), 3);
        const fold = Math.sin(u * Math.PI * 10 + v * 3.5) * gather;
        const x =
          meshLeft +
          meshWidth *
            (0.13 +
              0.73 * u +
              0.063 * fold * Math.sin(Math.PI * v) +
              0.018 * Math.sin(v * 7 + u * 3) * v) +
          noise(i, j, 4) * meshWidth * 0.006;
        const y =
          meshTop +
          meshHeight *
            (0.13 -
              0.045 * u +
              0.23 * sag +
              v * (0.43 + 0.12 * sag) +
              0.06 * Math.sin(u * 6 * Math.PI + v * 5) * gather * v -
              0.13 * Math.sin(v * Math.PI) * gather) +
          noise(i, j, 17) * meshHeight * 0.004;
        points.push({
          x,
          y,
          bx: x,
          by: y,
          vx: 0,
          vy: 0,
          pin: j === 0 && (i < 2 || i > columns - 2),
        });
      }
    for (let j = 0; j < rows; j++)
      for (let i = 0; i <= columns; i++) {
        for (const next of [i, i + (j % 2 ? 1 : -1)])
          if (next >= 0 && next <= columns) {
            const a = index(i, j),
              b = index(next, j + 1),
              p = points[a],
              q = points[b];
            links.push({
              a,
              b,
              length: Math.hypot(q.x - p.x, q.y - p.y),
              bend: noise(i, j, 2) * 0.13,
            });
          }
      }
    fish = [
      { i: 5, j: 5, sy: 18, sh: 125, angle: -0.35, size: 0.23 },
      { i: 16, j: 6, sy: 145, sh: 110, angle: 0.6, size: 0.26 },
      { i: 10, j: 12, sy: 258, sh: 110, angle: -0.5, size: 0.24 },
      { i: 18, j: 17, sy: 370, sh: 90, angle: 0.95, size: 0.22 },
      { i: 6, j: 19, sy: 480, sh: 114, angle: 0.25, size: 0.25 },
    ].map((f) => ({
      ...f,
      a: index(f.i, f.j),
      b: index(f.i, f.j + 2),
      rotation: f.angle,
      velocity: 0,
    }));
    draw();
  }
  function draw() {
    if (!points.length) return;
    ctx.clearRect(0, 0, width, height);
    // Draw source-image regions directly; retain the supplied photographic fish.
    for (const f of fish) {
      const p = points[f.a],
        q = points[f.b],
        x = (p.x + q.x) / 2,
        y = (p.y + q.y) / 2;
      if (image.complete && image.naturalWidth) {
        const fw = fishScale * f.size,
          fh = (fw * f.sh) / 355;
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(f.rotation);
        ctx.drawImage(image, 7, f.sy, 355, f.sh, -fw / 2, -fh / 2, fw, fh);
        ctx.restore();
      }
    }
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    for (const e of links) {
      const p = points[e.a],
        q = points[e.b],
        dx = q.x - p.x,
        dy = q.y - p.y;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.bezierCurveTo(
        p.x + dx * 0.3 - dy * e.bend,
        p.y + dy * 0.3 + dx * e.bend,
        p.x + dx * 0.7 - dy * e.bend,
        p.y + dy * 0.7 + dx * e.bend,
        q.x,
        q.y,
      );
      let color = "#6d96ad";
      if (isCollection) {
        let distance = Infinity;
        fish.forEach((f, i) => {
          const anchor = points[f.a];
          const d = Math.hypot(p.bx - anchor.bx, p.by - anchor.by);
          if (d < distance) {
            distance = d;
            color = window.PORTFOLIO_PROJECTS[i].color;
          }
        });
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = isCollection
        ? Math.max(0.8, fishScale * 0.0015)
        : Math.max(1.25, width * 0.0025);
      ctx.stroke();
      ctx.strokeStyle = "rgba(183,209,218,.35)";
      ctx.lineWidth = 0.8;
      ctx.stroke();
    }
    // Bound ropes follow the same simulated vertices, including the gathered hem.
    ctx.strokeStyle = "#648cae";
    ctx.lineWidth = isCollection ? Math.max(1.5, fishScale * 0.0028) : Math.max(2.8, width * 0.005);
    for (const edge of [
      Array.from({ length: columns + 1 }, (_, i) => index(i, 0)),
      Array.from({ length: columns + 1 }, (_, i) => index(i, rows)),
      Array.from({ length: rows + 1 }, (_, j) => index(0, j)),
      Array.from({ length: rows + 1 }, (_, j) => index(columns, j)),
    ]) {
      ctx.beginPath();
      edge.forEach((n, i) => {
        const p = points[n];
        if (i) ctx.lineTo(p.x, p.y);
        else ctx.moveTo(p.x, p.y);
      });
      ctx.stroke();
    }
    if (isCollection)
      window.dispatchEvent(
        new CustomEvent("netframe", {
          detail: fish.map((f) => {
            const p = points[f.a],
              q = points[f.b];
            return {
              x: (p.x + q.x) / 2,
              y: (p.y + q.y) / 2,
              width: fishScale * f.size,
              angle: f.rotation,
            };
          }),
        }),
      );
    ctx.fillStyle = "#6d96ad";
    for (const p of points) {
      ctx.beginPath();
      ctx.arc(
        p.x,
        p.y,
        isCollection ? Math.max(0.9, fishScale * 0.0017) : Math.max(1.4, width * 0.0027),
        0,
        Math.PI * 2,
      );
      ctx.fill();
    }
  }
  function tick(time) {
    const dt = Math.min((time - last) / 16.667, 1.5) || 1;
    last = time;
    for (const p of points) {
      if (p.pin) continue;
      let ax = (p.bx - p.x) * 0.015,
        ay = (p.by - p.y) * 0.015;
      if (!reduced) ax += Math.sin(time * 0.0008 + p.by * 0.018) * 0.016;
      if (pointer && !grab) {
        const dx = p.x - pointer.x,
          dy = p.y - pointer.y,
          d = Math.hypot(dx, dy);
        if (d < 105) {
          const force = (1 - d / 105) * 0.036;
          ax += dx * force + pointer.dx * 0.055;
          ay += dy * force + pointer.dy * 0.055;
        }
      }
      p.vx = (p.vx + ax * dt) * Math.pow(0.91, dt);
      p.vy = (p.vy + ay * dt) * Math.pow(0.91, dt);
      p.x += p.vx * dt;
      p.y += p.vy * dt;
    }
    for (let n = 0; n < 4; n++) {
      for (const e of links) {
        const p = points[e.a],
          q = points[e.b],
          dx = q.x - p.x,
          dy = q.y - p.y,
          d = Math.hypot(dx, dy) || 1,
          f = ((d - e.length) / d) * 0.22;
        if (!p.pin) {
          p.x += dx * f;
          p.y += dy * f;
        }
        if (!q.pin) {
          q.x -= dx * f;
          q.y -= dy * f;
        }
      }
      if (grab && pointer) {
        const p = points[grab.a];
        p.x = pointer.x + grab.ox;
        p.y = pointer.y + grab.oy;
        p.vx = p.vy = 0;
      }
    }
    for (const f of fish) {
      const p = points[f.a],
        q = points[f.b];
      const turn = Math.atan2(q.y - p.y, q.x - p.x) - Math.atan2(q.by - p.by, q.bx - p.bx);
      const target = f.angle + Math.atan2(Math.sin(turn), Math.cos(turn));
      f.velocity = (f.velocity + (target - f.rotation) * 0.12 * dt) * Math.pow(0.8, dt);
      f.rotation += f.velocity * dt;
    }
    if (pointer) {
      pointer.dx *= 0.7;
      pointer.dy *= 0.7;
    }
    draw();
    requestAnimationFrame(tick);
  }
  function locate(e) {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }
  canvas.addEventListener("pointermove", (e) => {
    const p = locate(e);
    pointer = { ...p, dx: pointer ? p.x - pointer.x : 0, dy: pointer ? p.y - pointer.y : 0 };
  });
  canvas.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;
    down = { x: e.clientX, y: e.clientY };
    const p = locate(e);
    pointer = { ...p, dx: 0, dy: 0 };
    let a = -1,
      distance = 90;
    points.forEach((q, i) => {
      const d = Math.hypot(q.x - p.x, q.y - p.y);
      if (!q.pin && d < distance) {
        distance = d;
        a = i;
      }
    });
    if (a >= 0) {
      grab = { a, ox: points[a].x - p.x, oy: points[a].y - p.y };
      canvas.setPointerCapture(e.pointerId);
    }
  });
  function release() {
    grab = null;
    pointer = null;
  }
  canvas.addEventListener("pointerup", (e) => {
    if (
      down &&
      document.body.dataset.view === "home" &&
      Math.hypot(e.clientX - down.x, e.clientY - down.y) < 7
    )
      location.href = "/work/";
    down = null;
  });
  for (const event of ["pointerup", "pointercancel", "lostpointercapture"])
    canvas.addEventListener(event, release);
  canvas.addEventListener("pointerleave", () => {
    if (!grab) pointer = null;
  });
  document.getElementById("ripple")?.addEventListener("click", () => {
    for (const p of points)
      if (!p.pin) {
        p.vx += Math.sin(p.by * 0.03) * 10;
        p.vy += Math.cos(p.bx * 0.025) * 10;
      }
  });
  image.addEventListener("load", draw);
  setup();
  new ResizeObserver(setup).observe(canvas);
  requestAnimationFrame(tick);
})();
