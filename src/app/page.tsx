"use client";

import { useEffect, useRef } from "react";

type SphereParticle = {
  x: number;
  y: number;
  z: number;
  baseX: number;
  baseY: number;
  baseZ: number;
  size: number;
  offset: number;
};

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    let animationFrame = 0;
    let time = 0;

    const colors = [
      [132, 255, 0], // Green
      [168, 85, 247], // Purple
      [59, 130, 246], // Blue
      [239, 68, 68], // Red
      [250, 204, 21], // Yellow
    ];

    /* =====================================================
       LARGE ROTATING PARTICLE SPHERE
    ====================================================== */

    const sphereParticles: SphereParticle[] = [];

    const sphereParticleCount = 1500;

    for (let i = 0; i < sphereParticleCount; i++) {
      const phi = Math.acos(
        -1 + (2 * i) / sphereParticleCount
      );

      const theta =
        Math.sqrt(sphereParticleCount * Math.PI) * phi;

      const x = Math.cos(theta) * Math.sin(phi);
      const y = Math.sin(theta) * Math.sin(phi);
      const z = Math.cos(phi);

      sphereParticles.push({
        x,
        y,
        z,
        baseX: x,
        baseY: y,
        baseZ: z,
        size: Math.random() * 1.5 + 0.45,
        offset: Math.random() * Math.PI * 2,
      });
    }

    /* =====================================================
       CANVAS RESIZE
    ====================================================== */

    const resizeCanvas = () => {
      const dpr = Math.min(
        window.devicePixelRatio || 1,
        2
      );

      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;

      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      ctx.setTransform(
        dpr,
        0,
        0,
        dpr,
        0,
        0
      );
    };

    resizeCanvas();

    window.addEventListener(
      "resize",
      resizeCanvas
    );

    /* =====================================================
       COLOR INTERPOLATION
    ====================================================== */

    const getColor = (position: number) => {
      const normalized =
        ((position % colors.length) + colors.length) %
        colors.length;

      const index = Math.floor(normalized);

      const nextIndex =
        (index + 1) % colors.length;

      const progress = normalized - index;

      const current = colors[index];
      const next = colors[nextIndex];

      return {
        r: Math.round(
          current[0] +
            (next[0] - current[0]) * progress
        ),

        g: Math.round(
          current[1] +
            (next[1] - current[1]) * progress
        ),

        b: Math.round(
          current[2] +
            (next[2] - current[2]) * progress
        ),
      };
    };

    /* =====================================================
       ANIMATION
    ====================================================== */

    const animate = () => {
      time += 0.006;

      const width = window.innerWidth;
      const height = window.innerHeight;

      ctx.clearRect(
        0,
        0,
        width,
        height
      );

      /* =================================================
         BACKGROUND GLOW
      ================================================== */

      const backgroundGlow =
        ctx.createRadialGradient(
          width * 0.72,
          height * 0.5,
          0,
          width * 0.72,
          height * 0.5,
          Math.min(width, height) * 0.75
        );

      backgroundGlow.addColorStop(
        0,
        "rgba(59,130,246,0.055)"
      );

      backgroundGlow.addColorStop(
        0.4,
        "rgba(168,85,247,0.025)"
      );

      backgroundGlow.addColorStop(
        1,
        "rgba(0,0,0,0)"
      );

      ctx.fillStyle = backgroundGlow;

      ctx.fillRect(
        0,
        0,
        width,
        height
      );

      /* =================================================
         LARGE ROTATING SPHERE
      ================================================== */

      const isMobile = width < 768;

      const sphereCenterX = isMobile
        ? width * 0.72
        : width * 0.78;

      const sphereCenterY = isMobile
        ? height * 0.72
        : height * 0.52;

      const sphereSize = isMobile
        ? Math.min(width, height) * 0.32
        : Math.min(width, height) * 0.34;

      const rotationY = time * 0.65;

      const rotationX =
        Math.sin(time * 0.35) * 0.16;

      const projectedParticles: {
        x: number;
        y: number;
        z: number;
        size: number;
        color: string;
        opacity: number;
      }[] = [];

      sphereParticles.forEach(
        (particle, index) => {
          let x = particle.baseX;
          let y = particle.baseY;
          let z = particle.baseZ;

          /* Y rotation */

          const cosY = Math.cos(rotationY);
          const sinY = Math.sin(rotationY);

          const rotatedX =
            x * cosY - z * sinY;

          const rotatedZ =
            x * sinY + z * cosY;

          x = rotatedX;
          z = rotatedZ;

          /* X rotation */

          const cosX = Math.cos(rotationX);
          const sinX = Math.sin(rotationX);

          const rotatedY =
            y * cosX - z * sinX;

          const finalZ =
            y * sinX + z * cosX;

          y = rotatedY;
          z = finalZ;

          /* Organic movement */

          const wave =
            Math.sin(
              time * 2 +
                particle.offset +
                index * 0.01
            ) * 0.012;

          x += wave;
          y += wave;

          /* Perspective */

          const perspective =
            2.8 / (2.8 - z);

          const screenX =
            sphereCenterX +
            x *
              sphereSize *
              perspective;

          const screenY =
            sphereCenterY +
            y *
              sphereSize *
              perspective;

          const particleSize =
            particle.size * perspective;

          /* Color */

          const color = getColor(
            (index / sphereParticles.length) *
              colors.length +
              time * 0.18
          );

          const opacity = Math.max(
            0.12,
            Math.min(
              0.95,
              (z + 1.2) / 1.8
            )
          );

          projectedParticles.push({
            x: screenX,
            y: screenY,
            z,
            size: particleSize,
            color: `rgb(
              ${color.r},
              ${color.g},
              ${color.b}
            )`,
            opacity,
          });
        }
      );

      /* Back particles first */

      projectedParticles.sort(
        (a, b) => a.z - b.z
      );

      projectedParticles.forEach(
        (particle) => {
          ctx.beginPath();

          ctx.arc(
            particle.x,
            particle.y,
            Math.max(
              0.35,
              particle.size
            ),
            0,
            Math.PI * 2
          );

          ctx.fillStyle =
            particle.color
              .replace("rgb", "rgba")
              .replace(
                ")",
                `, ${particle.opacity})`
              );

          ctx.fill();
        }
      );

      animationFrame =
        requestAnimationFrame(
          animate
        );
    };

    animate();

    return () => {
      cancelAnimationFrame(
        animationFrame
      );

      window.removeEventListener(
        "resize",
        resizeCanvas
      );
    };
  }, []);

  return (
    <main className="min-h-screen scroll-smooth overflow-x-hidden bg-[#02040a] text-white">

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative flex min-h-screen items-center overflow-hidden">

        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 h-full w-full"
        />

        {/* Background subtle glow */}

        <div className="pointer-events-none absolute inset-0">

          <div className="absolute left-[5%] top-[15%] h-[350px] w-[350px] rounded-full bg-lime-400/[0.025] blur-[130px]" />

          <div className="absolute right-[15%] top-[20%] h-[500px] w-[500px] rounded-full bg-purple-500/[0.025] blur-[150px]" />

          <div className="absolute bottom-[5%] right-[5%] h-[350px] w-[350px] rounded-full bg-blue-500/[0.025] blur-[130px]" />

        </div>

        {/* =================================================
            CONTENT
        ================================================== */}

        <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-24 lg:px-12">

          <div className="max-w-2xl">

            {/* Badge */}

            <div className="mb-8 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.035] px-4 py-2 backdrop-blur-md">

              <span className="relative flex h-2.5 w-2.5">

                <span className="absolute inline-flex h-full w-full rounded-full bg-lime-400/20" />

                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-lime-400" />

              </span>

              <span className="text-xs font-medium tracking-[0.18em] text-gray-400 uppercase">

                Something meaningful starts here

              </span>

            </div>

            {/* Welcome */}

            <p className="text-lg font-medium tracking-wide text-gray-400 sm:text-xl">

              Welcome to

            </p>

            <h1 className="mt-2 text-6xl font-bold tracking-[-0.05em] sm:text-7xl lg:text-8xl">

              <span className="bg-gradient-to-r from-lime-300 via-cyan-300 to-purple-400 bg-clip-text text-transparent">

                Health Bridge

              </span>

            </h1>

            {/* Main message */}

            <h2 className="mt-8 max-w-xl text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">

              Let&apos;s build something

              <span className="text-lime-300">

                {" "}meaningful{" "}

              </span>

              together.

            </h2>

            {/* Developer message */}

            <div className="mt-8 border-l border-lime-400/40 pl-5">

              <p className="text-sm font-medium text-gray-300 sm:text-base">

                Developers, this is our starting point.

              </p>

              <p className="mt-2 max-w-lg text-sm leading-7 text-gray-600">

                Let&apos;s turn the idea into a real product,
                one feature, one commit and one improvement
                at a time.

              </p>

            </div>

            {/* =================================================
                START BUILDING
            ================================================== */}

            <div className="mt-7 flex flex-col items-start">

              <a
                href="#starting-together"
                className="group rounded-full bg-lime-400 px-7 py-3.5 text-sm font-semibold text-black transition-colors duration-300 hover:bg-lime-300 hover:shadow-[0_0_35px_rgba(132,255,0,0.22)]"
              >

                Start Building

                <span className="ml-2 inline-block">

                  →

                </span>

              </a>

              <p className="mt-4 text-sm text-gray-500">

                The first step is starting together.

              </p>

            </div>

          </div>

        </div>

        {/* Scroll */}

        <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2">

          <div className="flex flex-col items-center gap-3">

            <span className="text-[10px] tracking-[0.25em] text-gray-600 uppercase">

              Scroll

            </span>

            <div className="h-10 w-6 rounded-full border border-white/10 p-1">

              <div className="mx-auto h-1.5 w-1.5 rounded-full bg-lime-400" />

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          IDEA
      ====================================================== */}

      <section className="relative border-t border-white/[0.05]">

        <div className="mx-auto max-w-7xl px-6 py-32 lg:px-12">

          <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">

            <div>

              <p className="text-xs font-semibold tracking-[0.3em] text-lime-400 uppercase">

                01 / The Idea

              </p>

              <h2 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">

                We have an idea.

                <span className="mt-2 block text-gray-600">

                  Now we build it.

                </span>

              </h2>

            </div>

            <div>

              <p className="text-xl leading-9 text-gray-400">

                Health Bridge is our opportunity to create
                something that connects healthcare,
                technology and people in one meaningful
                ecosystem.

              </p>

              <p className="mt-6 text-base leading-8 text-gray-600">

                The goal is not to make everything perfect
                on day one. The goal is to keep moving,
                keep learning and keep improving what
                we create together.

              </p>

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          TEAM
      ====================================================== */}

      <section className="relative border-t border-white/[0.05]">

        <div className="mx-auto max-w-7xl px-6 py-32 lg:px-12">

          <div className="max-w-3xl">

            <p className="text-xs font-semibold tracking-[0.3em] text-purple-400 uppercase">

              02 / The Team

            </p>

            <h2 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">

              Different skills.

              <span className="block text-gray-600">

                One direction.

              </span>

            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-500">

              Every developer brings something different
              to the table. Our job is to combine those
              strengths and turn them into one product
              we can be proud of.

            </p>

          </div>

          <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

            {[
              {
                number: "01",
                title: "Think",
                text: "Bring ideas.",
                gradient: "from-lime-400 to-green-500",
              },
              {
                number: "02",
                title: "Build",
                text: "Write the code.",
                gradient: "from-blue-400 to-cyan-500",
              },
              {
                number: "03",
                title: "Improve",
                text: "Learn from every iteration.",
                gradient: "from-purple-400 to-violet-500",
              },
              {
                number: "04",
                title: "Ship",
                text: "Make it real.",
                gradient: "from-red-400 to-yellow-400",
              },
            ].map((item) => (

              <div
                key={item.number}
                className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-7"
              >

                <span className="text-xs text-gray-700">

                  {item.number}

                </span>

                <div
                  className={`mt-8 h-1 w-12 rounded-full bg-gradient-to-r ${item.gradient}`}
                />

                <h3 className="mt-8 text-2xl font-semibold">

                  {item.title}

                </h3>

                <p className="mt-2 text-sm text-gray-600">

                  {item.text}

                </p>

              </div>

            ))}

          </div>

        </div>

      </section>


      {/* =====================================================
          BUILD
      ====================================================== */}

      <section className="relative overflow-hidden border-t border-white/[0.05]">

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_50%,rgba(132,255,0,0.045),transparent_35%)]" />

        <div className="relative mx-auto max-w-7xl px-6 py-36 lg:px-12">

          <div className="max-w-4xl">

            <p className="text-xs font-semibold tracking-[0.3em] text-blue-400 uppercase">

              03 / Let&apos;s Build

            </p>

            <h2 className="mt-6 text-5xl font-bold tracking-tight sm:text-7xl">

              Don&apos;t just talk about it.

              <span className="block bg-gradient-to-r from-lime-300 via-blue-300 to-purple-400 bg-clip-text text-transparent">

                Build it.

              </span>

            </h2>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-gray-500">

              Every screen we design.
              Every API we create.
              Every bug we fix.
              Every commit we push.

              <br />
              <br />

              It all moves Health Bridge forward.

            </p>

            <div className="mt-10 flex flex-wrap gap-3">

              {[
                [
                  "Code",
                  "border-lime-400/20 bg-lime-400/5 text-lime-300",
                ],
                [
                  "Create",
                  "border-purple-400/20 bg-purple-400/5 text-purple-300",
                ],
                [
                  "Collaborate",
                  "border-blue-400/20 bg-blue-400/5 text-blue-300",
                ],
                [
                  "Improve",
                  "border-red-400/20 bg-red-400/5 text-red-300",
                ],
                [
                  "Ship",
                  "border-yellow-400/20 bg-yellow-400/5 text-yellow-300",
                ],
              ].map(([label, style]) => (

                <span
                  key={label}
                  className={`rounded-full border px-4 py-2 text-xs ${style}`}
                >

                  {label}

                </span>

              ))}

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          FINAL
      ====================================================== */}

      <section
        id="starting-together"
        className="relative flex min-h-[80vh] scroll-mt-20 items-center justify-center border-t border-white/[0.05]"
      >

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(132,255,0,0.05),transparent_45%)]" />

        <div className="relative z-10 px-6 text-center">

          <p className="text-xs font-semibold tracking-[0.3em] text-lime-400 uppercase">

            Health Bridge

          </p>

          <h2 className="mx-auto mt-7 max-w-4xl text-5xl font-bold tracking-tight sm:text-7xl">

            The first step is

            <span className="block bg-gradient-to-r from-lime-300 via-cyan-300 to-purple-400 bg-clip-text text-transparent">

              starting together.

            </span>

          </h2>

          <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-gray-600">

            So let&apos;s start.

            <br />

            Let&apos;s build Health Bridge.

            <br />

            And let&apos;s make it something we are proud of.

          </p>

          <button className="mt-10 rounded-full border border-lime-400/30 bg-lime-400/10 px-8 py-4 text-sm font-semibold text-lime-300 transition-colors duration-300 hover:bg-lime-400 hover:text-black">

            Let&apos;s Build 🚀

          </button>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="border-t border-white/[0.05] px-6 py-8">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-xs text-gray-700 sm:flex-row">

          <span>

            Health Bridge · 2026

          </span>

          <span>

            Built by our team, one step at a time.

          </span>

        </div>

      </footer>

    </main>
  );
}