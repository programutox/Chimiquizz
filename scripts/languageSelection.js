class Language {
    static French = new Language("french");
    static English = new Language("english");

    constructor(name) {
        this.name = name;
    }
}

function getText(texts, key, language) {
    const choseEnglish = language.name === Language.English.name;
    return texts.get(key)[Number(choseEnglish)];
}

function languageSelection(texts) {
    add([ sprite("bg1") ]);

    const music = play("music1", { loop: true, paused: true, });

    const buttonsDefaultColor = [
        rgb(220, 0, 0),
        rgb(0, 0, 220),
    ];

    const buttonsHoveredColor = [
        rgb(255, 0, 0),
        rgb(0, 0, 255),
    ];

    const buttonsText = [
        "French",
        "English",
    ];

    const buttons = [];
    const x = width() / 2;
    
    for (let i = 0; i < buttonsDefaultColor.length; i++) {
        const y = i < buttonsDefaultColor.length / 2 ? height() * 0.75 - 20 : height() * 0.75 + 40;
        buttons.push(
            createButton(x, y, buttonsDefaultColor[i], i)
        );

        onClick(`button${i}`, () => go("tutorial", music, texts, i == 0 ? Language.French : Language.English, 1));

        if (!isTouchscreen()) {
            onHover(`button${i}`, () => buttons[i].color = buttonsHoveredColor[i]);
            onHoverEnd(`button${i}`, () => buttons[i].color = buttonsDefaultColor[i]);
        }
    }

    onDraw(() => {
        drawTwoColoredText("Choose a language", width() / 2, height() / 4, 32);
        for (let i = 0; i < buttons.length; i++) {
            drawTwoColoredText(buttonsText[i], buttons[i].pos.x, buttons[i].pos.y, 32, true)
        }
    });
}

