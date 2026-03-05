import React from "react";
import {
  useCurrentFrame,
  useVideoConfig,
  Img,
  staticFile,
  interpolate,
  Easing,
  spring,
  AbsoluteFill,
} from "remotion";
import {
  TransitionSeries,
  linearTiming,
} from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";

const images = [
  { file: "borsa gg1.jpg", brand: "GUCCI", label: "BORSA GG" },
  { file: "diante, b gucci 1.png", brand: "GUCCI", label: "BAG COLLECTION" },
  { file: "diamante, b gucci 2.png", brand: "GUCCI", label: "BAG COLLECTION" },
  { file: "diamante b gucci 3.png", brand: "GUCCI", label: "BAG COLLECTION" },
  { file: "diamante , b gucci 4.png", brand: "GUCCI", label: "BAG COLLECTION" },
  { file: "diamante, camicia gucci.png", brand: "GUCCI", label: "CAMICIA" },
  { file: "diamante, camicia gucci 2.png", brand: "GUCCI", label: "CAMICIA" },
  { file: "diamante, lv 2.png", brand: "LOUIS VUITTON", label: "LV COLLECTION" },
  { file: "diamante. lv 3.png", brand: "LOUIS VUITTON", label: "LV COLLECTION" },
  { file: "diamante, scarpe lv.png", brand: "LOUIS VUITTON", label: "SCARPE LV" },
  { file: "diamante, scarpe lv 1.png", brand: "LOUIS VUITTON", label: "SCARPE LV" },
];

const kenBurnsVariants = [
  { startScale: 1.08, endScale: 1.0, startX: 0, endX: 30, startY: 0, endY: 0 },
  { startScale: 1.0, endScale: 1.08, startX: -30, endX: 0, startY: 0, endY: 0 },
  { startScale: 1.06, endScale: 1.0, startX: 0, endX: 0, startY: 30, endY: -30 },
  { startScale: 1.0, endScale: 1.06, startX: 20, endX: -20, startY: 0, endY: 0 },
  { startScale: 1.08, endScale: 1.02, startX: -20, endX: 20, startY: 10, endY: -10 },
  { startScale: 1.0, endScale: 1.1, startX: 0, endX: 0, startY: 20, endY: 0 },
  { startScale: 1.1, endScale: 1.0, startX: 10, endX: -10, startY: -10, endY: 10 },
  { startScale: 1.0, endScale: 1.08, startX: -10, endX: 10, startY: 0, endY: 20 },
  { startScale: 1.06, endScale: 1.0, startX: 20, endX: 0, startY: 0, endY: -20 },
  { startScale: 1.0, endScale: 1.06, startX: 0, endX: -20, startY: 10, endY: 0 },
  { startScale: 1.08, endScale: 1.0, startX: -10, endX: 10, startY: 0, endY: 0 },
];

const GOLD = "#C9A84C";
const BLACK = "#000000";

interface SlideProps {
  imageIndex: number;
}

const Slide: React.FC<SlideProps> = ({ imageIndex }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const image = images[imageIndex];
  const variant = kenBurnsVariants[imageIndex % kenBurnsVariants.length];

  const progress = interpolate(frame, [0, durationInFrames], [0, 1], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const scale = interpolate(progress, [0, 1], [variant.startScale, variant.endScale]);
  const translateX = interpolate(progress, [0, 1], [variant.startX, variant.endX]);
  const translateY = interpolate(progress, [0, 1], [variant.startY, variant.endY]);

  const labelProgress = spring({
    frame,
    fps,
    config: { damping: 200 },
    durationInFrames: 20,
  });

  const labelOpacity = interpolate(labelProgress, [0, 1], [0, 1]);
  const labelY = interpolate(labelProgress, [0, 1], [24, 0]);

  return (
    <AbsoluteFill style={{ backgroundColor: BLACK }}>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <Img
          src={staticFile(image.file)}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transform: `scale(${scale}) translate(${translateX}px, ${translateY}px)`,
          }}
        />
        {/* Vignette bottom */}
        <AbsoluteFill
          style={{
            background:
              "linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0) 25%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.8) 100%)",
          }}
        />
      </AbsoluteFill>

      {/* Brand + label text */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "flex-start",
          padding: "0 64px 130px 64px",
          opacity: labelOpacity,
          transform: `translateY(${labelY}px)`,
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontSize: 18,
              color: GOLD,
              letterSpacing: 8,
              textTransform: "uppercase",
              margin: 0,
              marginBottom: 10,
            }}
          >
            {image.brand}
          </p>
          <p
            style={{
              fontFamily: "'Georgia', 'Times New Roman', serif",
              fontSize: 42,
              color: "#FFFFFF",
              letterSpacing: 4,
              textTransform: "uppercase",
              margin: 0,
              fontWeight: "300",
            }}
          >
            {image.label}
          </p>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const IntroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 200 }, durationInFrames: 30 });
  const subSpring = spring({ frame: frame - 18, fps, config: { damping: 200 }, durationInFrames: 25 });

  const lineWidth = interpolate(frame, [10, 45], [0, 200], {
    extrapolateRight: "clamp",
    extrapolateLeft: "clamp",
    easing: Easing.inOut(Easing.quad),
  });

  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);
  const titleY = interpolate(titleSpring, [0, 1], [32, 0]);
  const subOpacity = interpolate(subSpring, [0, 1], [0, 1]);
  const subY = interpolate(subSpring, [0, 1], [20, 0]);

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BLACK,
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: 18,
            color: GOLD,
            letterSpacing: 12,
            textTransform: "uppercase",
            margin: 0,
            marginBottom: 18,
          }}
        >
          EXCLUSIVE
        </p>
        <p
          style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: 72,
            color: "#FFFFFF",
            letterSpacing: 6,
            textTransform: "uppercase",
            margin: 0,
            fontWeight: "300",
            lineHeight: 1.15,
          }}
        >
          LUXURY
          <br />
          COLLECTION
        </p>
      </div>

      <div
        style={{
          width: lineWidth,
          height: 1,
          backgroundColor: GOLD,
          marginTop: 32,
          marginBottom: 32,
        }}
      />

      <div
        style={{
          opacity: subOpacity,
          transform: `translateY(${subY}px)`,
        }}
      >
        <p
          style={{
            fontFamily: "'Georgia', 'Times New Roman', serif",
            fontSize: 14,
            color: "rgba(255,255,255,0.65)",
            letterSpacing: 10,
            textTransform: "uppercase",
            margin: 0,
          }}
        >
          GUCCI · LOUIS VUITTON
        </p>
      </div>
    </AbsoluteFill>
  );
};

export const TRANSITION_FRAMES = 15;
export const SCENE_FRAMES = 90;
export const INTRO_FRAMES = 60;
export const IMAGE_COUNT = images.length; // 11

export const MyComposition: React.FC = () => {
  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={INTRO_FRAMES}>
        <IntroScene />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
      />
      {images.map((_, i) => (
        <React.Fragment key={i}>
          <TransitionSeries.Sequence durationInFrames={SCENE_FRAMES}>
            <Slide imageIndex={i} />
          </TransitionSeries.Sequence>
          {i < images.length - 1 && (
            <TransitionSeries.Transition
              presentation={fade()}
              timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
            />
          )}
        </React.Fragment>
      ))}
    </TransitionSeries>
  );
};
