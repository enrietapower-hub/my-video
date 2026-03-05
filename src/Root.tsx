import { Composition } from "remotion";
import { MyComposition, INTRO_FRAMES, SCENE_FRAMES, TRANSITION_FRAMES, IMAGE_COUNT } from "./Composition";

// Total = (INTRO + IMAGE_COUNT * SCENE) - (IMAGE_COUNT transitions)
// 1 transition from intro->first + (IMAGE_COUNT-1) between images = IMAGE_COUNT transitions
const totalFrames =
  INTRO_FRAMES +
  IMAGE_COUNT * SCENE_FRAMES -
  IMAGE_COUNT * TRANSITION_FRAMES;

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="LuxuryCollection"
        component={MyComposition}
        durationInFrames={totalFrames}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
