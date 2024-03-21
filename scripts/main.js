async function readLinesFromFile(filePath) {
    const response = await fetch(filePath);
    if (!response.ok) {
        throw new Error(`Loading Error : ${response.status}`);
    }

    const text = await response.text();
    const lines = text.split('\n');
    return lines;
}

async function loadLevel(filePath) {
    const lines = await readLinesFromFile(filePath);

    let data = [];

    for (const line of lines) {
        if (line.startsWith("//")) {
            continue;
        }

        const elements = line.split("::");
        data.push(elements);
    }

    return data;
}

async function loadTexts() {
    const lines = await readLinesFromFile("./assets/data/texts.lang");
    const map = new Map();

    for (const line of lines) {
        const [key, french, english] = line.split("::");
        map.set(key, [french, english]);
    }

    return map;
}

async function main() {
    kaboom({
        width: 640,
        height: 360,
        debug: false,
    });
    
    for (let i = 1; i <= 3; i++) {
        loadSprite(`bg${i}`, `./assets/img/bg${i}.png`);
        loadSound(`music${i}`, `./assets/mus/music${i}.mp3`);
    }

    loadSprite("heart", "./assets/img/heart.png");
    loadSprite("heartEmpty", "./assets/img/heartEmpty.png");
    loadFont("seguisym", "./assets/font/seguisym.ttf");
    loadSound("correct", "./assets/sfx/correct.wav");
    loadSound("wrong", "./assets/sfx/wrong.wav");
    loadSound("lost", "./assets/sfx/lost.wav");
    loadSound("win", "./assets/sfx/win.wav");

    const texts = await loadTexts();
    
    scene("languageSelection", (texts) => languageSelection(texts));
    scene("tutorial", (music, texts, language, level) => tutorial(music, texts, language, level));
    scene("game", async (music, texts, language, level) => await game(music, texts, language, level));
    scene("lost", (music, texts, language, level, score) => lost(music, texts, language, level, score));
    scene("win", (music, texts, language) => win(music, texts, language));
    
    go("languageSelection", texts);
}

main();

