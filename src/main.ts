import Phaser from 'phaser';
import { gameConfig } from './game/config';

window.addEventListener('load', () => {
  new Phaser.Game(gameConfig);

  // Request fullscreen on first touch (mobile browsers)
  const requestFullscreen = () => {
    const el = document.documentElement;
    if (el.requestFullscreen) {
      el.requestFullscreen().catch(() => { /* ignore if denied */ });
    }
    document.removeEventListener('touchstart', requestFullscreen);
  };
  document.addEventListener('touchstart', requestFullscreen, { once: true });
});
