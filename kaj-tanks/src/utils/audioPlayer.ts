/**
 * Wrapper of all audio effects in the application.
 */
export class AudioPlayer {

  private static backgroundMusicAudio: HTMLAudioElement = AudioPlayer.initBackgroundMusic();

  private static initBackgroundMusic(): HTMLAudioElement {
    const a = new Audio();
    a.src = "background_music.mp3";
    a.loop = true;
    a.volume = 0.4;
    return a;
  }

  /**
   * Plays the sound of tank shooting.
   *
   * @param volume default volume is 1
   */
  public static shotSound(volume: number = 1): void {
    const a = new Audio();
    a.src = "tank_fire.mp3";
    a.volume = volume;
    console.log(a);
    a.play();
  }

  /**
   * Plays the sound of explosion.
   *
   * @param volume default volume is 1
   */
  public static explosionSound(volume: number = 1): void {
    const a = new Audio();
    a.src = "explosion.mp3";
    a.volume = volume;
    a.play();
  }

  /**
   * Starts playing the background music.
   */
  public static startBackgroundMusic(): void {
    AudioPlayer.backgroundMusicAudio.play();
  }

  /**
   * Pauses playing the background music.
   */
  public static pauseBackgroundMusic(): void {
    AudioPlayer.backgroundMusicAudio.pause();
  }
}