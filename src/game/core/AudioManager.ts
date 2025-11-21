import { Howl } from 'howler';

export class AudioManager {
    private static instance: AudioManager;
    private sounds: Map<string, Howl>;
    private isBlackHumorMode: boolean;
    private muted: boolean = false;

    private constructor() {
        this.sounds = new Map();
        this.isBlackHumorMode = window.location.pathname === '/black-humor';
        this.initializeSounds();

        // Load mute state from localStorage
        const savedMute = localStorage.getItem('flappyBirdMuted');
        if (savedMute) {
            this.muted = savedMute === 'true';
            this.updateAllSounds();
        }
    }

    public static getInstance(): AudioManager {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager();
        }
        return AudioManager.instance;
    }

    private initializeSounds(): void {
        this.sounds.set(
            'flap',
            new Howl({
                src: ['/sounds/flap.mp3'],
                volume: 0.5,
            })
        );

        this.sounds.set(
            'score',
            new Howl({
                src: ['/sounds/point.mp3'],
                volume: 0.5,
            })
        );

        this.sounds.set(
            'swoosh',
            new Howl({
                src: ['/sounds/swoosh.mp3'],
                volume: 0.5,
            })
        );

        // Use explosion sound for black humor mode, die sound for normal mode
        this.sounds.set(
            'hit',
            new Howl({
                src: [this.isBlackHumorMode ? '/sounds/explosion.mp3' : '/sounds/die.mp3'],
                volume: 0.5,
            })
        );
    }

    public play(soundName: string): void {
        if (this.muted) return;

        const sound = this.sounds.get(soundName);
        if (sound) {
            sound.play();
        } else {
            console.warn(`Sound "${soundName}" not found`);
        }
    }

    public toggleMute(): void {
        this.muted = !this.muted;
        localStorage.setItem('flappyBirdMuted', this.muted.toString());
        this.updateAllSounds();
    }

    public isMuted(): boolean {
        return this.muted;
    }

    private updateAllSounds(): void {
        this.sounds.forEach((sound) => {
            sound.volume(this.muted ? 0 : 0.5);
        });
    }
}
