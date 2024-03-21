function tutorial(music, texts, language, level) {
    const text = getText(texts, `tutorial${level}`, language);
    const startTime = time();
    const duration = 2;

    music.paused = true;
    music = play(`music${level}`, { loop: true, })

    onUpdate(() => {
        if (time() - startTime > duration) {
            go("game", music, texts, language, level);
        }
    });

    const levelText = getText(texts, "level", language) + ` ${level}`;

    onDraw(() => {
        drawSprite({ sprite: `bg${level}`, })
        drawTwoColoredText(levelText, width() / 2, height() / 4, 32, true);
        drawTwoColoredText(text, width() / 2, height() * 0.75, 20, true);
    });
}
