"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { magnusTrajectory, COURT_LENGTH, NET_HEIGHT } from "@/lib/physics";

interface SpinSceneProps {
  spinType: "topspin" | "slice" | "flat" | "kick";
  spinRate: number; // RPM
  ballSpeed: number; // km/h
}

export default function SpinScene({
  spinType,
  spinRate,
  ballSpeed,
}: SpinSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Refs for Three.js objects we need to keep between renders
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const trajectoryLineRef = useRef<THREE.Line | null>(null);
  const ballRef = useRef<THREE.Mesh | null>(null);
  const frameRef = useRef<number>(0);

  // Scale factor: physics uses meters, Three.js units are 1:1 here but we scale
  // the court to fit nicely — 1 Three.js unit = 1 meter.
  // Court: 23.77m long, 8.23m wide (singles)
  const COURT_WIDTH = 8.23;
  // Service line is at ~6.4m from the net on each side
  const SERVICE_BOX_DEPTH = 6.4;

  // -------------------------------------------------------------------------
  // Helper: build trajectory geometry from physics points
  // -------------------------------------------------------------------------
  function buildTrajectoryGeometry(
    points: { x: number; y: number }[]
  ): THREE.BufferGeometry {
    // Physics x = distance along court (0 → COURT_LENGTH)
    // We centre the court on origin, so court runs from -COURT_LENGTH/2 to +COURT_LENGTH/2
    const half = COURT_LENGTH / 2;
    const positions: number[] = [];
    for (const p of points) {
      // x (court depth) maps to Three.js Z axis (forward)
      // y (height) maps to Three.js Y axis
      // We start the serve from -half (back of court) going toward +half
      positions.push(0, p.y, -half + p.x);
    }
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    return geometry;
  }

  // -------------------------------------------------------------------------
  // One-time scene initialisation
  // -------------------------------------------------------------------------
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#0a0a1a");
    sceneRef.current = scene;

    // Camera — 45° above, behind the serve position
    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      200
    );
    camera.position.set(0, 12, -COURT_LENGTH / 2 - 8);
    camera.lookAt(0, 1, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minDistance = 5;
    controls.maxDistance = 60;
    controlsRef.current = controls;

    // Lighting
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    // ---- Court surface ----
    const courtGeo = new THREE.PlaneGeometry(COURT_WIDTH, COURT_LENGTH);
    const courtMat = new THREE.MeshLambertMaterial({ color: "#2d5a27" });
    const court = new THREE.Mesh(courtGeo, courtMat);
    court.rotation.x = -Math.PI / 2;
    scene.add(court);

    // Court lines (white)
    const lineMat = new THREE.LineBasicMaterial({ color: "#ffffff" });

    // Helper to add a rectangle outline at y=0.01
    function addRect(x1: number, z1: number, x2: number, z2: number) {
      const pts = [
        new THREE.Vector3(x1, 0.01, z1),
        new THREE.Vector3(x2, 0.01, z1),
        new THREE.Vector3(x2, 0.01, z2),
        new THREE.Vector3(x1, 0.01, z2),
        new THREE.Vector3(x1, 0.01, z1),
      ];
      const g = new THREE.BufferGeometry().setFromPoints(pts);
      scene.add(new THREE.Line(g, lineMat));
    }

    const half = COURT_LENGTH / 2;
    const hw = COURT_WIDTH / 2;

    // Outer baseline rectangle
    addRect(-hw, -half, hw, half);

    // Service boxes
    addRect(-hw, -SERVICE_BOX_DEPTH, hw, SERVICE_BOX_DEPTH);

    // Center service line (divides service boxes)
    const centerGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0.01, -SERVICE_BOX_DEPTH),
      new THREE.Vector3(0, 0.01, SERVICE_BOX_DEPTH),
    ]);
    scene.add(new THREE.Line(centerGeo, lineMat));

    // ---- Net ----
    const netGeo = new THREE.BoxGeometry(COURT_WIDTH + 2, NET_HEIGHT, 0.05);
    const netMat = new THREE.MeshLambertMaterial({
      color: "#ffffff",
      transparent: true,
      opacity: 0.7,
    });
    const net = new THREE.Mesh(netGeo, netMat);
    net.position.set(0, NET_HEIGHT / 2, 0);
    scene.add(net);

    // Net post pillars
    const postGeo = new THREE.CylinderGeometry(0.05, 0.05, NET_HEIGHT + 0.1, 6);
    const postMat = new THREE.MeshLambertMaterial({ color: "#aaaaaa" });
    [-hw - 1, hw + 1].forEach((px) => {
      const post = new THREE.Mesh(postGeo, postMat);
      post.position.set(px, NET_HEIGHT / 2, 0);
      scene.add(post);
    });

    // ---- Tennis ball (initial position at serve) ----
    const ballGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const ballMat = new THREE.MeshLambertMaterial({ color: "#fbbf24" });
    const ball = new THREE.Mesh(ballGeo, ballMat);
    ball.position.set(0, 2.5, -half);
    scene.add(ball);
    ballRef.current = ball;

    // ---- Trajectory line (placeholder — updated separately) ----
    const initPoints = magnusTrajectory(ballSpeed, spinRate, spinType);
    const trajGeo = buildTrajectoryGeometry(initPoints);
    const trajMat = new THREE.LineBasicMaterial({ color: "#dc2626", linewidth: 2 });
    const trajLine = new THREE.Line(trajGeo, trajMat);
    scene.add(trajLine);
    trajectoryLineRef.current = trajLine;

    // ---- Animation loop ----
    function animate() {
      frameRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }
    animate();

    // ---- Resize handler ----
    function handleResize() {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frameRef.current);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // -------------------------------------------------------------------------
  // Update trajectory when props change
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (!trajectoryLineRef.current || !sceneRef.current || !ballRef.current)
      return;

    const points = magnusTrajectory(ballSpeed, spinRate, spinType);

    // Rebuild geometry
    const newGeo = buildTrajectoryGeometry(points);
    trajectoryLineRef.current.geometry.dispose();
    trajectoryLineRef.current.geometry = newGeo;

    // Move ball to serve start position (first point)
    const half = COURT_LENGTH / 2;
    const first = points[0];
    ballRef.current.position.set(0, first.y, -half + first.x);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spinType, spinRate, ballSpeed]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "400px",
        borderRadius: "8px",
        overflow: "hidden",
        background: "#0a0a1a",
      }}
    />
  );
}
