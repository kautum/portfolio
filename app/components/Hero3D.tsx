"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type * as ThreeNamespace from "three";

/* three.js is dynamic-imported inside the effect below, never imported at
   module scope — this keeps it out of the initial JS bundle entirely. The
   `import type` above is erased at build time; it costs nothing at runtime. */

const NODE_COUNT = 160;
const DEGREE = 3; // nearest neighbours each node connects to, before dedup
const EXTENT = { x: 5.6, y: 3, z: 3.2 };
const CAMERA_RADIUS = 9.5;
const CAMERA_HEIGHT = 1.4;
const ROTATE_SPEED = 0.05; // rad/s — one slow revolution every ~2 minutes
const PULSE_SPEED = 0.18; // fraction of an edge traversed per second
const FOG_DENSITY = 0.055;
const INTERACT_RADIUS = 0.4; // NDC units, aspect-corrected
const PUSH_STRENGTH = 5.5;
const SPRING_K = 5; // how hard a displaced node snaps back
const DAMPING = 4.5; // velocity decay rate
const FALLBACK_ACCENT = "#ff6b4a";
const FALLBACK_ACCENT_2 = "#ffa23d";

/** Read a theme colour off the document root, falling back if unset. Lets
 *  the scroll-driven iridescent palette (owned elsewhere) repaint this
 *  scene without this file knowing anything about how it works. */
function readColor(name: string, fallback: string): string {
  if (typeof window === "undefined") return fallback;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return value || fallback;
}

/** Uniform random point inside an ellipsoid via rejection sampling on the
 *  unit sphere — a filled, organic cloud rather than a hollow "globe"
 *  shell, which is the more overused shape for this kind of scene. */
function buildLayout(count: number, extent: typeof EXTENT): Float32Array {
  const out = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    let x = 0;
    let y = 0;
    let z = 0;
    do {
      x = Math.random() * 2 - 1;
      y = Math.random() * 2 - 1;
      z = Math.random() * 2 - 1;
    } while (x * x + y * y + z * z > 1);
    out[i * 3] = x * extent.x;
    out[i * 3 + 1] = y * extent.y;
    out[i * 3 + 2] = z * extent.z;
  }
  return out;
}

/** k-nearest-neighbour edges over a fixed layout, deduped so A-B is never
 *  listed twice. O(count^2) once at setup, trivial at this node count. */
function buildEdges(base: Float32Array, count: number, degree: number): Uint16Array {
  const seen = new Set<string>();
  const list: number[] = [];
  for (let i = 0; i < count; i++) {
    const ix = base[i * 3];
    const iy = base[i * 3 + 1];
    const iz = base[i * 3 + 2];
    const candidates: { j: number; d: number }[] = [];
    for (let j = 0; j < count; j++) {
      if (j === i) continue;
      const dx = base[j * 3] - ix;
      const dy = base[j * 3 + 1] - iy;
      const dz = base[j * 3 + 2] - iz;
      candidates.push({ j, d: dx * dx + dy * dy + dz * dz });
    }
    candidates.sort((a, b) => a.d - b.d);
    for (let k = 0; k < degree && k < candidates.length; k++) {
      const j = candidates[k].j;
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (seen.has(key)) continue;
      seen.add(key);
      list.push(i, j);
    }
  }
  return new Uint16Array(list);
}

function makeGlowTexture(THREE: typeof ThreeNamespace): ThreeNamespace.CanvasTexture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.4, "rgba(255,255,255,0.55)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function detectWebgl(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

type Props = {
  /** Optional overlay content (headline, metrics) positioned above the scene. */
  children?: ReactNode;
  className?: string;
};

export default function Hero3D({ children, className }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [useFallback, setUseFallback] = useState<boolean | null>(null);

  // Decide once on mount: reduced motion, no WebGL, or a QA hook that
  // forces the fallback for visual testing both never render a blank box.
  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const forced = (window as unknown as Record<string, unknown>).__HERO3D_FORCE_FALLBACK__ === true;
    setUseFallback(reducedMotion || forced || !detectWebgl());
  }, []);

  useEffect(() => {
    if (useFallback !== false) return;
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    let disposed = false;
    let raf = 0;
    let running = true;
    let visible = true;
    let elapsed = 0;
    let cameraAngle = 0;

    // Populated once the dynamic three.js module resolves; used by the
    // cleanup function even if the component unmounts mid-import.
    let scene: ThreeNamespace.Scene | null = null;
    let renderer: ThreeNamespace.WebGLRenderer | null = null;
    let camera: ThreeNamespace.PerspectiveCamera | null = null;
    let nodesGeometry: ThreeNamespace.BufferGeometry | null = null;
    let edgesGeometry: ThreeNamespace.BufferGeometry | null = null;
    let pulsesGeometry: ThreeNamespace.BufferGeometry | null = null;
    let nodesMaterial: ThreeNamespace.PointsMaterial | null = null;
    let edgesMaterial: ThreeNamespace.LineBasicMaterial | null = null;
    let pulsesMaterial: ThreeNamespace.PointsMaterial | null = null;
    let glowTexture: ThreeNamespace.CanvasTexture | null = null;
    let pulseColor: ThreeNamespace.Color | null = null;
    let resizeObserver: ResizeObserver | null = null;
    let pollId: ReturnType<typeof setInterval> | null = null;

    // Holds the RAF driver once three.js resolves, so the visibility and
    // intersection handlers can restart the loop without referencing a
    // binding that only exists inside the dynamic import.
    const tickRef = { current: () => {} };
    const applyThemeRef = { current: () => {} };

    const pointer = { x: 0, y: 0 };
    let pointerActive = false;
    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      pointerActive = true;
    };
    const handlePointerLeave = () => {
      pointerActive = false;
    };

    const handleVisibility = () => {
      visible = !document.hidden;
      if (visible && running) tickRef.current();
    };

    const handleHueChange = () => applyThemeRef.current();

    let io: IntersectionObserver | null = null;

    import("three").then((THREE) => {
      if (disposed) return;

      scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x0a0a0a, FOG_DENSITY);

      camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
      camera.position.set(0, CAMERA_HEIGHT, CAMERA_RADIUS);
      camera.lookAt(0, 0, 0);

      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setClearColor(0x000000, 0);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      // ---- graph data --------------------------------------------------
      const basePositions = buildLayout(NODE_COUNT, EXTENT);
      const edgeIndex = buildEdges(basePositions, NODE_COUNT, DEGREE);
      const edgeCount = edgeIndex.length / 2;
      const edgePhase = new Float32Array(edgeCount);
      for (let e = 0; e < edgeCount; e++) edgePhase[e] = Math.random();

      const offsets = new Float32Array(NODE_COUNT * 3);
      const velocities = new Float32Array(NODE_COUNT * 3);
      const nodePosArray = new Float32Array(basePositions);
      const edgePosArray = new Float32Array(edgeCount * 6);
      const pulsePosArray = new Float32Array(edgeCount * 3);
      const pulseColorArray = new Float32Array(edgeCount * 3);

      glowTexture = makeGlowTexture(THREE);
      pulseColor = new THREE.Color(FALLBACK_ACCENT_2);

      // ---- nodes ---------------------------------------------------------
      nodesGeometry = new THREE.BufferGeometry();
      const nodePosAttr = new THREE.BufferAttribute(nodePosArray, 3).setUsage(THREE.DynamicDrawUsage);
      nodesGeometry.setAttribute("position", nodePosAttr);
      nodesMaterial = new THREE.PointsMaterial({
        map: glowTexture,
        color: new THREE.Color(FALLBACK_ACCENT),
        size: 0.32,
        sizeAttenuation: true,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const nodePoints = new THREE.Points(nodesGeometry, nodesMaterial);
      scene.add(nodePoints);

      // ---- edges (dim, static network) -----------------------------------
      edgesGeometry = new THREE.BufferGeometry();
      const edgePosAttr = new THREE.BufferAttribute(edgePosArray, 3).setUsage(THREE.DynamicDrawUsage);
      edgesGeometry.setAttribute("position", edgePosAttr);
      edgesMaterial = new THREE.LineBasicMaterial({
        color: new THREE.Color(FALLBACK_ACCENT),
        transparent: true,
        opacity: 0.22,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const edgeLines = new THREE.LineSegments(edgesGeometry, edgesMaterial);
      scene.add(edgeLines);

      // ---- pulses (bright dots travelling along each edge, staggered) ----
      pulsesGeometry = new THREE.BufferGeometry();
      const pulsePosAttr = new THREE.BufferAttribute(pulsePosArray, 3).setUsage(THREE.DynamicDrawUsage);
      const pulseColorAttr = new THREE.BufferAttribute(pulseColorArray, 3).setUsage(THREE.DynamicDrawUsage);
      pulsesGeometry.setAttribute("position", pulsePosAttr);
      pulsesGeometry.setAttribute("color", pulseColorAttr);
      pulsesMaterial = new THREE.PointsMaterial({
        map: glowTexture,
        size: 0.5,
        sizeAttenuation: true,
        transparent: true,
        vertexColors: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const pulsePoints = new THREE.Points(pulsesGeometry, pulsesMaterial);
      scene.add(pulsePoints);

      // ---- theme colours, read from CSS custom properties ----------------
      const applyTheme = () => {
        if (!nodesMaterial || !edgesMaterial || !pulseColor) return;
        const accent = readColor("--accent", FALLBACK_ACCENT);
        const accent2 = readColor("--accent-2", FALLBACK_ACCENT_2);
        nodesMaterial.color.set(accent);
        edgesMaterial.color.set(accent);
        pulseColor.set(accent2);
      };
      applyThemeRef.current = applyTheme;
      applyTheme();
      pollId = setInterval(applyTheme, 500);

      const resize = () => {
        if (!renderer || !camera) return;
        const { clientWidth, clientHeight } = container;
        renderer.setSize(clientWidth, clientHeight, false);
        camera.aspect = clientWidth / Math.max(clientHeight, 1);
        camera.updateProjectionMatrix();
      };
      resize();
      resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(container);

      const clock = new THREE.Clock();
      const tempVec = new THREE.Vector3();
      const rightVec = new THREE.Vector3();
      const upVec = new THREE.Vector3();

      const render = () => {
        if (!renderer || !scene || !camera || !nodesGeometry || !edgesGeometry || !pulsesGeometry) return;
        const dt = Math.min(clock.getDelta(), 0.05);
        elapsed += dt;

        // camera slowly orbits the graph rather than the graph rotating in
        // place — same visual result, but keeps every node's base position
        // in one fixed world frame, so the pointer math below stays simple.
        cameraAngle += dt * ROTATE_SPEED;
        camera.position.set(Math.sin(cameraAngle) * CAMERA_RADIUS, CAMERA_HEIGHT, Math.cos(cameraAngle) * CAMERA_RADIUS);
        camera.lookAt(0, 0, 0);
        camera.updateMatrixWorld();
        rightVec.setFromMatrixColumn(camera.matrixWorld, 0);
        upVec.setFromMatrixColumn(camera.matrixWorld, 1);
        const aspect = camera.aspect;

        // spring-damped push-away from the pointer, eased back to rest —
        // a real spring, not a linear lerp, so it feels physical.
        for (let i = 0; i < NODE_COUNT; i++) {
          const bx = basePositions[i * 3];
          const by = basePositions[i * 3 + 1];
          const bz = basePositions[i * 3 + 2];
          let ox = offsets[i * 3];
          let oy = offsets[i * 3 + 1];
          let oz = offsets[i * 3 + 2];

          if (pointerActive) {
            tempVec.set(bx + ox, by + oy, bz + oz).project(camera);
            const dx = (tempVec.x - pointer.x) * aspect;
            const dy = tempVec.y - pointer.y;
            const dist = Math.hypot(dx, dy);
            if (dist < INTERACT_RADIUS) {
              const falloff = 1 - dist / INTERACT_RADIUS;
              const eased = falloff * falloff;
              const pushX = rightVec.x * dx + upVec.x * dy;
              const pushY = rightVec.y * dx + upVec.y * dy;
              const pushZ = rightVec.z * dx + upVec.z * dy;
              const len = Math.hypot(pushX, pushY, pushZ) || 1;
              const mag = eased * PUSH_STRENGTH * dt;
              velocities[i * 3] += (pushX / len) * mag;
              velocities[i * 3 + 1] += (pushY / len) * mag;
              velocities[i * 3 + 2] += (pushZ / len) * mag;
            }
          }

          velocities[i * 3] += -ox * SPRING_K * dt;
          velocities[i * 3 + 1] += -oy * SPRING_K * dt;
          velocities[i * 3 + 2] += -oz * SPRING_K * dt;
          const damp = Math.exp(-DAMPING * dt);
          velocities[i * 3] *= damp;
          velocities[i * 3 + 1] *= damp;
          velocities[i * 3 + 2] *= damp;

          ox += velocities[i * 3] * dt;
          oy += velocities[i * 3 + 1] * dt;
          oz += velocities[i * 3 + 2] * dt;
          offsets[i * 3] = ox;
          offsets[i * 3 + 1] = oy;
          offsets[i * 3 + 2] = oz;
          nodePosArray[i * 3] = bx + ox;
          nodePosArray[i * 3 + 1] = by + oy;
          nodePosArray[i * 3 + 2] = bz + oz;
        }
        nodesGeometry.attributes.position.needsUpdate = true;

        // edges follow the (possibly displaced) node positions; the pulse
        // for each edge advances at its own staggered phase, so the network
        // reads as many independent signals rather than one blinking mass.
        for (let e = 0; e < edgeCount; e++) {
          const a = edgeIndex[e * 2];
          const b = edgeIndex[e * 2 + 1];
          const ax = nodePosArray[a * 3];
          const ay = nodePosArray[a * 3 + 1];
          const az = nodePosArray[a * 3 + 2];
          const bx2 = nodePosArray[b * 3];
          const by2 = nodePosArray[b * 3 + 1];
          const bz2 = nodePosArray[b * 3 + 2];
          edgePosArray[e * 6] = ax;
          edgePosArray[e * 6 + 1] = ay;
          edgePosArray[e * 6 + 2] = az;
          edgePosArray[e * 6 + 3] = bx2;
          edgePosArray[e * 6 + 4] = by2;
          edgePosArray[e * 6 + 5] = bz2;

          const t = (elapsed * PULSE_SPEED + edgePhase[e]) % 1;
          const brightness = Math.max(0, Math.sin(Math.PI * t));
          pulsePosArray[e * 3] = ax + (bx2 - ax) * t;
          pulsePosArray[e * 3 + 1] = ay + (by2 - ay) * t;
          pulsePosArray[e * 3 + 2] = az + (bz2 - az) * t;
          pulseColorArray[e * 3] = (pulseColor?.r ?? 1) * brightness;
          pulseColorArray[e * 3 + 1] = (pulseColor?.g ?? 1) * brightness;
          pulseColorArray[e * 3 + 2] = (pulseColor?.b ?? 1) * brightness;
        }
        edgesGeometry.attributes.position.needsUpdate = true;
        pulsesGeometry.attributes.position.needsUpdate = true;
        pulsesGeometry.attributes.color.needsUpdate = true;

        renderer.render(scene, camera);
      };

      const tick = () => {
        if (!running || !visible) return;
        render();
        raf = requestAnimationFrame(tick);
      };
      // expose tick to the outer visibility handler via closure reassignment
      tickRef.current = tick;
      tick();
    });

    // IntersectionObserver pauses the RAF loop entirely off-screen.
    io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        running = entry.isIntersecting;
        if (running && visible) tickRef.current();
        else cancelAnimationFrame(raf);
      },
      { threshold: 0.05 },
    );
    io.observe(container);

    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("hue-change", handleHueChange);

    return () => {
      disposed = true;
      running = false;
      cancelAnimationFrame(raf);
      io?.disconnect();
      resizeObserver?.disconnect();
      if (pollId) clearInterval(pollId);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pointermove", handlePointerMove);
      document.documentElement.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("hue-change", handleHueChange);
      nodesGeometry?.dispose();
      edgesGeometry?.dispose();
      pulsesGeometry?.dispose();
      nodesMaterial?.dispose();
      edgesMaterial?.dispose();
      pulsesMaterial?.dispose();
      glowTexture?.dispose();
      renderer?.dispose();
      renderer?.forceContextLoss();
    };
  }, [useFallback]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        /* dvh, not vh: the taste protocol calls out 100vh as a mobile bug */
        minHeight: "100dvh",
        overflow: "hidden",
        background: "#0A0A0A",
      }}
    >
      {useFallback !== false && (
        <div
          aria-hidden={useFallback === null}
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 60% 50% at 28% 22%, var(--accent-glow-soft, rgba(255,107,74,0.28)), transparent 60%)," +
              "radial-gradient(ellipse 55% 45% at 78% 78%, var(--accent-glow-soft, rgba(255,162,61,0.20)), transparent 60%)," +
              "repeating-linear-gradient(0deg, rgba(255,255,255,0.035) 0, rgba(255,255,255,0.035) 1px, transparent 1px, transparent 48px)," +
              "repeating-linear-gradient(90deg, rgba(255,255,255,0.035) 0, rgba(255,255,255,0.035) 1px, transparent 1px, transparent 48px)," +
              "#0A0A0A",
          }}
        />
      )}
      {useFallback === false && (
        <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      )}
      {children && (
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
          {children}
        </div>
      )}
    </div>
  );
}
