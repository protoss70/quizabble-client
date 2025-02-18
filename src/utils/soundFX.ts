const correctSound = new Audio("/correct.mp3");
const wrongSound = new Audio("/wrong.mp3");
const testCompletedSound = new Audio("/test_completed.mp3");

export const playAnswerSoundFX = (isCorrect: boolean) => {
  const sound = isCorrect ? correctSound : wrongSound;

  // Reset and play the sound
  sound.currentTime = 0;
  sound.play().catch((error) => console.error("Error playing sound:", error));
};

export const playTestCompletedSoundFX = () => {
    const sound = testCompletedSound;   
    sound.currentTime = 0;
    sound.play().catch((error) => console.error("Error playing sound:", error));
}