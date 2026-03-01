import Phaser from 'phaser';
import { gameConfig } from './game/config';

window.addEventListener('load', () => {
  const game = new Phaser.Game(gameConfig);

  // Request fullscreen on first interaction (mobile browsers).
  // Uses the canvas pointerdown as the user-gesture context, which is
  // more reliable than a document-level touchstart listener.
  // Note: iOS Safari does not support the Fullscreen API — the
  // apple-mobile-web-app-capable meta tag handles that case instead.
  game.events.once('ready', () => {
    const canvas = game.canvas;
    const onFirstTap = () => {
      if (document.fullscreenEnabled && !document.fullscreenElement) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
      canvas.removeEventListener('pointerdown', onFirstTap);
    };
    canvas.addEventListener('pointerdown', onFirstTap, { once: true });
  });
});
