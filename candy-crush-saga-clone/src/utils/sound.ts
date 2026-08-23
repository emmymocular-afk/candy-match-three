class SoundEngine {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private bgmEnabled: boolean = false;
  private sfxVolume: number = 0.8;
  private bgmVolume: number = 0.7;
  private bgmInterval: number | null = null;
  private bgmStep: number = 0;

  constructor() {
    // Sound settings stored in localStorage
    const storedSound = localStorage.getItem('candy_sound_enabled');
    const storedBgm = localStorage.getItem('candy_bgm_enabled');
    const storedSfxVol = localStorage.getItem('candy_sfx_volume');
    const storedBgmVol = localStorage.getItem('candy_bgm_volume');

    this.soundEnabled = storedSound !== null ? JSON.parse(storedSound) : true;
    this.bgmEnabled = storedBgm !== null ? JSON.parse(storedBgm) : true;
    this.sfxVolume = storedSfxVol !== null ? parseFloat(storedSfxVol) : 0.8;
    this.bgmVolume = storedBgmVol !== null ? parseFloat(storedBgmVol) : 0.7;
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public ensureBgmStarted() {
    if (this.bgmEnabled && !this.bgmInterval) {
      this.startBgm();
    }
  }

  public isSoundEnabled() {
    return this.soundEnabled;
  }

  public isBgmEnabled() {
    return this.bgmEnabled;
  }

  public getSfxVolume() {
    return this.sfxVolume;
  }

  public getBgmVolume() {
    return this.bgmVolume;
  }

  public setSoundEnabled(enabled: boolean) {
    this.soundEnabled = enabled;
    localStorage.setItem('candy_sound_enabled', JSON.stringify(this.soundEnabled));
  }

  public setBgmEnabled(enabled: boolean) {
    this.bgmEnabled = enabled;
    localStorage.setItem('candy_bgm_enabled', JSON.stringify(this.bgmEnabled));
    if (this.bgmEnabled) {
      this.startBgm();
    } else {
      this.stopBgm();
    }
  }

  public setSfxVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
    localStorage.setItem('candy_sfx_volume', this.sfxVolume.toString());
  }

  public setBgmVolume(vol: number) {
    this.bgmVolume = Math.max(0, Math.min(1, vol));
    localStorage.setItem('candy_bgm_volume', this.bgmVolume.toString());
  }

  public toggleSound(): boolean {
    this.soundEnabled = !this.soundEnabled;
    localStorage.setItem('candy_sound_enabled', JSON.stringify(this.soundEnabled));
    return this.soundEnabled;
  }

  public toggleBgm(): boolean {
    this.bgmEnabled = !this.bgmEnabled;
    localStorage.setItem('candy_bgm_enabled', JSON.stringify(this.bgmEnabled));
    if (this.bgmEnabled) {
      this.startBgm();
    } else {
      this.stopBgm();
    }
    return this.bgmEnabled;
  }

  public playSwap() {
    if (!this.soundEnabled || this.sfxVolume === 0) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, this.ctx.currentTime + 0.08);

    gain.gain.setValueAtTime(0.15 * this.sfxVolume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.08);
  }

  public playPop() {
    if (!this.soundEnabled || this.sfxVolume === 0) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(350, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(850, this.ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.2 * this.sfxVolume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.06);
  }

  public playInvalid() {
    if (!this.soundEnabled || this.sfxVolume === 0) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, this.ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(140, this.ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.2 * this.sfxVolume, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.15);
  }

  public playMatch(comboCount: number = 1) {
    if (!this.soundEnabled || this.sfxVolume === 0) return;
    this.initCtx();
    if (!this.ctx) return;

    const baseFreqs = [523.25, 587.33, 659.25, 698.46, 783.99, 880.0, 987.77, 1046.5]; // C5 to C6 scale
    const baseFreq = baseFreqs[Math.min(comboCount - 1, baseFreqs.length - 1)];

    const now = this.ctx.currentTime;
    
    // Play a dual-tone sweet chime
    [0, 120].forEach((offsetHz, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq + offsetHz, now);
      osc.frequency.exponentialRampToValueAtTime((baseFreq + offsetHz) * 1.2, now + 0.18);

      const volume = Math.min(0.25, 0.12 + comboCount * 0.02) * this.sfxVolume;
      gain.gain.setValueAtTime(volume, now + idx * 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.03);
      osc.stop(now + 0.25);
    });
  }

  public playSpecialCreate() {
    if (!this.soundEnabled || this.sfxVolume === 0) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const freqs = [440, 554.37, 659.25, 880, 1108.73];

    freqs.forEach((f, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(f, now + i * 0.04);

      gain.gain.setValueAtTime(0.2 * this.sfxVolume, now + i * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.04);
      osc.stop(now + i * 0.04 + 0.2);
    });
  }

  public playExplosion() {
    if (!this.soundEnabled || this.sfxVolume === 0) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // Sub bass boom
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.35);

    gain.gain.setValueAtTime(0.35 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.35);

    // Noise burst
    const bufferSize = this.ctx.sampleRate * 0.25;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const noiseFilter = this.ctx.createBiquadFilter();
    noiseFilter.type = 'lowpass';
    noiseFilter.frequency.setValueAtTime(800, now);
    noiseFilter.frequency.exponentialRampToValueAtTime(100, now + 0.25);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.3 * this.sfxVolume, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    noise.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    noise.start(now);
  }

  public playLaser() {
    if (!this.soundEnabled || this.sfxVolume === 0) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.25);

    gain.gain.setValueAtTime(0.25 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  public playHammer() {
    if (!this.soundEnabled || this.sfxVolume === 0) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    
    // Heavy thud
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(250, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.2);

    gain.gain.setValueAtTime(0.4 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.2);
  }

  public playVictory() {
    if (!this.soundEnabled || this.sfxVolume === 0) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, High C
    notes.forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + i * 0.12);

      gain.gain.setValueAtTime(0.3 * this.sfxVolume, now + i * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.4);
    });
  }

  public playCoin() {
    if (!this.soundEnabled || this.sfxVolume === 0) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    [987.77, 1318.51].forEach((freq, i) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + i * 0.08);

      gain.gain.setValueAtTime(0.2 * this.sfxVolume, now + i * 0.08);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.08);
      osc.stop(now + i * 0.08 + 0.25);
    });
  }

  public playWheelSpin() {
    if (!this.soundEnabled || this.sfxVolume === 0) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.04);

    gain.gain.setValueAtTime(0.1 * this.sfxVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  private startBgm() {
    if (this.bgmInterval) return;

    // 4 Chords Loop: C Major, A Minor, F Major, G Major
    // 32 steps total, 0.14s per step (~107 BPM)
    const stepDuration = 0.14;

    const N = {
      C2: 65.41, F2: 87.31, G2: 98.00, A2: 110.00, B2: 123.47,
      C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61, G3: 196.00, A3: 220.00, B3: 246.94,
      C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23, G4: 392.00, A4: 440.00, B4: 493.88,
      C5: 523.25, D5: 587.33, E5: 659.25, F5: 698.46, G5: 783.99, A5: 880.00, B5: 987.77,
      C6: 1046.50, D6: 1174.66, E6: 1318.51
    };

    const chords = [
      { bass: N.C2, arpeggio: [N.C3, N.E3, N.G3, N.C4, N.E4, N.G4] },
      { bass: N.A2, arpeggio: [N.A2, N.C3, N.E3, N.A3, N.C4, N.E4] },
      { bass: N.F2, arpeggio: [N.F2, N.A2, N.C3, N.F3, N.A3, N.C4] },
      { bass: N.G2, arpeggio: [N.G2, N.B2, N.D3, N.G3, N.B3, N.D4] },
    ];

    const melodyPattern: (number | null)[] = [
      // Bar 0 (C Maj)
      N.E5, null, N.G5, null, N.C6, N.B5, N.G5, N.E5,
      // Bar 1 (A Min)
      N.A5, null, N.C6, null, N.E6, N.D6, N.C6, N.A5,
      // Bar 2 (F Maj)
      N.C6, null, N.A5, null, N.F5, N.A5, N.C6, N.D6,
      // Bar 3 (G Maj)
      N.B5, null, N.G5, null, N.D6, N.C6, N.B5, N.G5,
    ];

    this.bgmStep = 0;

    this.bgmInterval = window.setInterval(() => {
      if (!this.bgmEnabled || this.bgmVolume === 0) return;
      this.initCtx();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const step = this.bgmStep % 32;
      const barIndex = Math.floor(step / 8);
      const chord = chords[barIndex];
      const stepInBar = step % 8;

      // 1. Bass Note (beats 1 & 3 of bar)
      if (stepInBar === 0 || stepInBar === 4) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(chord.bass, now);
        gain.gain.setValueAtTime(0.04 * this.bgmVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + stepDuration * 3.5);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + stepDuration * 3.6);
      }

      // 2. Arpeggio / Chord note
      const arpNote = chord.arpeggio[stepInBar % chord.arpeggio.length];
      if (arpNote) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(arpNote, now);
        gain.gain.setValueAtTime(0.02 * this.bgmVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + stepDuration * 1.5);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + stepDuration * 1.6);
      }

      // 3. Top Melody Note
      const melodyNote = melodyPattern[step];
      if (melodyNote) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(melodyNote, now);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2200, now);

        gain.gain.setValueAtTime(0.035 * this.bgmVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + stepDuration * 1.8);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + stepDuration * 1.9);
      }

      // 4. Subtle Percussion Tap
      if (stepInBar % 2 === 1) {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.03);
        gain.gain.setValueAtTime(0.006 * this.bgmVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.035);
      }

      this.bgmStep++;
    }, stepDuration * 1000);
  }

  private stopBgm() {
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }
}

export const sound = new SoundEngine();
