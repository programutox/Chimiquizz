function win(music, texts, language) {
    play("win");
    music.paused = true;

    const subtextSize = 25;
    onClick(() => go("tutorial", music, texts, language, 1));

    const winText = getText(texts, "win", language);
    const restartText = getText(texts, "restart", language);

    onDraw(() => {
        drawSprite({ sprite: "bg3", });
        drawTwoColoredText(winText, width() / 2, height() / 4, 32);
        drawTwoColoredText(restartText, width() / 2, height() * 0.75, subtextSize);
    });
}
