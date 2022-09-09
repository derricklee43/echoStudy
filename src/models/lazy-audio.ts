/**
 * Wrapper for the Audio object (HTMLAudioElement) that supports lazy loading/playing.
 */
export class LazyAudio {
  private readonly audio: HTMLAudioElement = new Audio();

  // whether or not the audio has enough data (readyState: 4 ==> HAVE_ENOUGH_DATA)
  // we need to store this as a state because rewinding it resets this despite it being loaded
  private hasEnoughData = false;

  // whether or not the audio is already loading; prevents multiple network calls on double clicks.
  private alreadyLoading = false;

  constructor(private readonly audioUrl: string) {}

  public async play(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.loadAudio({
        onPlayable: () => {
          this.audio.addEventListener('ended', () => resolve(), { once: true });
          this.audio.addEventListener('error', () => reject('unable to play audio'), {
            once: true,
          });
          this.audio.play();
        },
      });
    });
  }

  public pause(): void {
    this.audio.pause();
  }

  /**
   * Fully resets the audio (and keeps it paused).
   */
  public reset(): void {
    this.pause();
    this.setCurrentTime(0);
  }

  public setCurrentTime(seconds: number): void {
    this.audio.currentTime = seconds;
  }

  /**
   * Warning: this method will load the audio if it hasn't already in order to get the correct duration.
   */
  public async getDuration(): Promise<number> {
    return new Promise((resolve) => {
      this.loadAudio({
        onMetadataLoaded: () => resolve(this.audio.duration),
      });
    });
  }

  public addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void {
    this.audio.addEventListener(type, listener, options);
  }

  public removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void {
    this.audio.removeEventListener(type, listener, options);
  }

  /**
   * Load the audio and perform callbackOptions or short circuit and immediately invoke if it already has.
   * @param callbackOptions actions to perform on certain thresholds of loading
   */
  private async loadAudio(callbackOptions?: {
    onMetadataLoaded?: () => void;
    onPlayable?: () => void;
  }): Promise<void> {
    if (this.alreadyLoading) {
      return;
    }

    // enough data available to play through to the end
    if (this.hasEnoughData) {
      callbackOptions?.onMetadataLoaded?.();
      callbackOptions?.onPlayable?.();
      return;
    }

    return new Promise((resolve, reject) => {
      // readyState: 1 (HAVE_METADATA)
      this.audio.addEventListener(
        'loadedmetadata',
        () => {
          callbackOptions?.onMetadataLoaded?.();
        },
        { once: true }
      );
      // readyState: 4 (HAVE_ENOUGH_DATA) -- highest ready state; we can resolve
      this.audio.addEventListener(
        'canplaythrough',
        () => {
          this.hasEnoughData = true;
          this.alreadyLoading = false;
          callbackOptions?.onPlayable?.();
          resolve();
        },
        { once: true }
      );
      this.audio.addEventListener('error', reject, { once: true });

      // actually load audio and wait for event listeners
      this.alreadyLoading = true;
      this.audio.src = this.audioUrl;
      this.audio.load();
    });
  }
}
