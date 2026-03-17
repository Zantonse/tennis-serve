export interface WarmupStep {
  id: string;
  name: string;
  duration: number; // seconds
  instruction: string;
}

export const WARMUP_STEPS: WarmupStep[] = [
  {
    id: 'light-jog',
    name: 'Light Jog',
    duration: 120,
    instruction: 'Light jog around the court to raise heart rate',
  },
  {
    id: 'high-knees',
    name: 'High Knees',
    duration: 30,
    instruction: 'Drive knees up, pump arms, stay on balls of feet',
  },
  {
    id: 'butt-kicks',
    name: 'Butt Kicks',
    duration: 30,
    instruction: 'Kick heels to glutes, keep torso upright',
  },
  {
    id: 'lateral-shuffles',
    name: 'Lateral Shuffles',
    duration: 30,
    instruction: 'Shuffle side to side, stay low, don\'t cross feet',
  },
  {
    id: 'carioca',
    name: 'Carioca',
    duration: 30,
    instruction: 'Grapevine pattern, rotate hips, stay light on feet',
  },
  {
    id: 'walking-lunges-rotation',
    name: 'Walking Lunges with Rotation',
    duration: 45,
    instruction: 'Lunge forward, rotate trunk toward front knee',
  },
  {
    id: 'leg-swings-forward-back',
    name: 'Leg Swings Forward/Back',
    duration: 30,
    instruction: 'Hold fence, swing each leg 10 times front to back',
  },
  {
    id: 'leg-swings-side-to-side',
    name: 'Leg Swings Side to Side',
    duration: 30,
    instruction: 'Swing each leg 10 times across the body',
  },
  {
    id: 'arm-circles',
    name: 'Arm Circles',
    duration: 30,
    instruction: 'Small circles building to large, both directions',
  },
  {
    id: 'hip-circles',
    name: 'Hip Circles',
    duration: 20,
    instruction: 'Hands on hips, circle 10 times each direction',
  },
  {
    id: 'trunk-rotations',
    name: 'Trunk Rotations',
    duration: 20,
    instruction: 'Arms out, rotate torso left and right 10 times',
  },
  {
    id: 'shadow-serves',
    name: 'Shadow Serves',
    duration: 60,
    instruction: '5 slow shadow serves building to full speed',
  },
];
