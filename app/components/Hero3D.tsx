"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import type * as ThreeNamespace from "three";

/* three.js is dynamic-imported inside the effect below, never imported at
   module scope — this keeps it out of the initial JS bundle entirely. The
   `import type` above is erased at build time; it costs nothing at runtime. */

const COLS = 14;
const ROWS = 9;
const BAR_GAP = 0.18;
const BAR_SIZE = 1 - BAR_GAP;
const GRID_W = COLS - 1;
const GRID_D = ROWS - 1;

/**
 * Illustrative data surface — not a specific real dataset. Two overlaid
 * sine fields plus a small deterministic jitter stand in for a metrics
 * grid (columns as a time axis, rows as a category axis), so the bar
 * field reads as "data" without asserting any real number on screen.
 */
function sampleHeight(x: number, z: number): number {
  const wave =
    Math.sin(x * 0.6) * 0.5 + Math.cos(z * 0.5 + x * 0.15) * 0.35 + Math.sin((x + z) * 0.35) * 0.25;
  const jitter = Math.sin(x * 12.9898 + z * 78.233) * 0.05;
  return Math.max(0.15, wave + 1.1 + jitter);
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

    // Populated once the dynamic three.js module resolves; used by the
    // cleanup function even if the component unmounts mid-import.
    let scene: ThreeNamespace.Scene | null = null;
    let renderer: ThreeNamespace.WebGLRenderer | null = null;
    let camera: ThreeNamespace.PerspectiveCamera | null = null;
    let mesh: ThreeNamespace.InstancedMesh | null = null;
    let geometry: ThreeNamespace.BoxGeometry | null = null;
    let material: ThreeNamespace.MeshStandardMaterial | null = null;
    let resizeObserver: ResizeObserver | null = null;

    // Holds the RAF driver once three.js resolves, so the visibility and
    // intersection handlers can restart the loop without referencing a
    // binding that only exists inside the dynamic import.
    const tickRef = { current: () => {} };

    const pointer = { x: 0, y: 0 };
    const handlePointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    };

    const handleVisibility = () => {
      visible = !document.hidden;
      if (visible && running) tickRef.current();
    };

    let io: IntersectionObserver | null = null;

    import("three").then((THREE) => {
      if (disposed) return;

      scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(0x0a0a0a, 0.045);

      camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
      camera.position.set(0, 7, 11);
      camera.lookAt(0, 0.5, 0);

      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setClearColor(0x000000, 0);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

      const hemi = new THREE.HemisphereLight(0x3a3a3a, 0x0a0a0a, 1.1);
      scene.add(hemi);
      const glow = new THREE.PointLight(0xff6b4a, 18, 30, 2);
      glow.position.set(2, 6, 4);
      scene.add(glow);

      geometry = new THREE.BoxGeometry(BAR_SIZE, 1, BAR_SIZE);
      material = new THREE.MeshStandardMaterial({
        roughness: 0.45,
        metalness: 0.1,
        emissiveIntensity: 0.55,
      });

      const count = COLS * ROWS;
      const instanced = new THREE.InstancedMesh(geometry, material, count);
      const dummy = new THREE.Object3D();
      const colorLow = new THREE.Color(0xff6b4a);
      const colorHigh = new THREE.Color(0xffa23d);
      const tmpColor = new THREE.Color();

      let i = 0;
      let maxHeight = 0;
      const heights: number[] = [];
      for (let cx = 0; cx < COLS; cx++) {
        for (let cz = 0; cz < ROWS; cz++) {
          const h = sampleHeight(cx, cz);
          heights.push(h);
          maxHeight = Math.max(maxHeight, h);
        }
      }

      for (let cx = 0; cx < COLS; cx++) {
        for (let cz = 0; cz < ROWS; cz++) {
          const h = heights[i];
          const x = cx - GRID_W / 2;
          const z = cz - GRID_D / 2;
          dummy.position.set(x, h / 2, z);
          dummy.scale.set(1, h, 1);
          dummy.updateMatrix();
          instanced.setMatrixAt(i, dummy.matrix);
          tmpColor.copy(colorLow).lerp(colorHigh, h / maxHeight);
          instanced.setColorAt(i, tmpColor);
          i++;
        }
      }
      instanced.instanceMatrix.needsUpdate = true;
      if (instanced.instanceColor) instanced.instanceColor.needsUpdate = true;

      mesh = instanced;
      scene.add(mesh);

      const group = mesh;

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

      const render = () => {
        if (!renderer || !scene || !camera) return;
        const dt = clock.getDelta();
        group.rotation.y += dt * 0.12;
        const targetX = pointer.y * 0.18;
        const targetY = pointer.x * 0.35;
        camera.position.x += (targetY * 6 - camera.position.x + 0) * 0.02;
        group.rotation.x += (targetX - group.rotation.x) * 0.04;
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

    return () => {
      disposed = true;
      running = false;
      cancelAnimationFrame(raf);
      io?.disconnect();
      resizeObserver?.disconnect();
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pointermove", handlePointerMove);
      geometry?.dispose();
      material?.dispose();
      if (mesh?.instanceColor) mesh.instanceColor = null;
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
              "radial-gradient(ellipse 60% 50% at 28% 22%, rgba(255,107,74,0.28), transparent 60%)," +
              "radial-gradient(ellipse 55% 45% at 78% 78%, rgba(255,162,61,0.20), transparent 60%)," +
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
