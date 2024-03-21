function lost(music, texts, language, level, score) {
    music.paused = true;
    play("lost");

    const subtextSize = 25;
    onClick(() => go("tutorial", music, texts, language, 1));

    const lostText = getText(texts, "lost", language);
    const restartText = getText(texts, "restart", language);

    onDraw(() => {
        drawSprite({ sprite: `bg${level}`, });
        drawTwoColoredText(lostText, width() / 2, height() / 4, 32);
        drawTwoColoredText(`Score: ${score}`, width() / 2, height() * 0.75 - subtextSize * 2, subtextSize);
        drawTwoColoredText(restartText, width() / 2, height() * 0.75, subtextSize);
    });
}

