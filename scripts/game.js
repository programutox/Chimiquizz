function createButton(p_x, p_y, p_color, i) {
    return add([
        pos(p_x, p_y),
        rect(275, 50),
        anchor("center"),
        color(p_color),
        area(),
        `button${i}`
    ]);
}

function replaceAt(str, index, newChar) {
    return str.substring(0, index) + newChar + str.substring(index + 1);
}

function swapNames(englishName) {
    englishName = englishName.toLowerCase();
    englishName = englishName.split(' ').reverse().join(' ');
    englishName = englishName[0].toUpperCase() + englishName.substring(1);
    return englishName;
}

function decode(chemicalName, symbol) {
    switch (symbol) {
        case "*i":
            const last_occurence = chemicalName.lastIndexOf('y');
            return replaceAt(chemicalName, last_occurence, 'i');
        case "*l":
            return chemicalName.substring(0, chemicalName.length - 1);
        case "*ium":
            return chemicalName.substring(0, chemicalName.length - 1) + "ium";
        case "*ide":
            return chemicalName.replace("ure", "ide");
        case "*rev":
            chemicalName = chemicalName.replace(" de ", " ")
                .replace("d'", "")
                .replace("argent", "silver");
            return swapNames(chemicalName);
        case "*acid":
            chemicalName = chemicalName.replace("que", "c")
                .replace("eux", "ous")
                .replace("cide", "cid");
            return swapNames(chemicalName);
        default:
            throw new Error(`Got unexected symbol: ${symbol}`);
    }
}

function getEnglishChemicalName(chemicalName, englishExpression) {
    const isChemicalName = !englishExpression.startsWith('*');
    if (isChemicalName) {
        return englishExpression;
    }

    let englishName = chemicalName.replaceAll("é", "e")
        .replaceAll("è", "e")
        .replaceAll("ï", "i");
    
    if (englishExpression === '*') {
        return englishName;
    }

    for (const symbol of englishExpression.split(':')) {
        englishName = decode(englishName, symbol);
    }
    
    return englishName;
}

function getNameWithIndex(data, language) {
    const index = randi(data.length);
    const frenchChemicalName = data[index][0];
    const result = [
        index, language.name === Language.French.name ? frenchChemicalName : getEnglishChemicalName(frenchChemicalName, data[index][1])
    ];
    return result;
}

function shuffle(array) {
    array.sort(() => rand() - 0.5);
}

function getAnswersWithIndex(data, index) {
    let rightAnswer = data[index][2];
    let answers = data[index].slice(2);

    shuffle(answers);
    const rightIndex = answers.indexOf(rightAnswer);
    return [rightIndex, answers];
}

function drawTwoColoredText(label, x, y, size, centerText=true) {
    drawText({
        text: label,
        size: size,
        font: "seguisym",
        pos: vec2(x + 2, y + 2),
        color: BLACK,
        anchor: centerText ? "center" : "topleft"
    });

    drawText({
        text: label,
        size: size,
        font: "seguisym",
        pos: vec2(x, y),
        anchor: centerText ? "center" : "topleft"
    });
}

function drawQuestion(question) {
    drawTwoColoredText(question, width() / 2, height() / 4, 32)
}

function drawAnswers(answers, buttons) {
    for (let i = 0; i < buttons.length; i++) {
        drawTwoColoredText(answers[i], buttons[i].pos.x, buttons[i].pos.y, 32, true);
    }
}

async function game(music, texts, language, level) {
    add([ sprite(`bg${level}`) ]);
    
    const data = await loadLevel(`./assets/data/levels/entities${level}.lvl`);

    const timeLimit = 20;
    const scoreToPass = 20 * level;
    const lastLevel = 3;
    const livesMax = 5;
    const heartSize = 35;
    const orange = rgb(255, 165, 0);

    const buttonsDefaultColor = [
        rgb(220, 0, 0),
        rgb(0, 220, 0),
        rgb(0, 0, 220),
        rgb(220, 220, 0),
    ];

    const buttonsHoveredColor = [
        rgb(255, 0, 0),
        rgb(0, 255, 0),
        rgb(0, 0, 255),
        rgb(255, 255, 0),
    ];

    const buttons = [];
    const shownChemicalNames = [];

    for (let i = 0; i < buttonsDefaultColor.length; i++) {
        const x = i % 2 === 0 ? width() / 4 : width() * 0.75;
        const y = i < buttonsDefaultColor.length / 2 ? height() * 0.75 - 20 : height() * 0.75 + 40;
        buttons.push(
            createButton(x, y, buttonsDefaultColor[i], i)
        );
    }

    const bgRect = add([
        pos(0, height() - 10),
        rect(width(), 10),
        color(BLACK),
    ]);

    let [index, name] = getNameWithIndex(data, language);
    let [rightIndex, answers] = getAnswersWithIndex(data, index);

    // Only for debug
    // console.log(`Answer is ${answers[rightIndex]}`);

    let score = 20 * (level - 1);
    let lives = livesMax;
    let startTime = time();

    const launchAnotherQuestion = () => {
        shownChemicalNames.push(name);
                
        while (shownChemicalNames.includes(name)) {
            [index, name] = getNameWithIndex(data, language);
        }

        [rightIndex, answers] = getAnswersWithIndex(data, index);
        // console.log(`Answer is ${answers[rightIndex]}`);
        startTime = time();
    };

    const loseLife = () => {
        lives--;
        if (lives === 0) {
            go("lost", music, texts, language, level, score);
            return;
        }

        play("wrong");
    };

    onUpdate(() => {
        if (time() - startTime < timeLimit) {
            return;
        }

        loseLife();
        launchAnotherQuestion();
    });
    
    for (let i = 0; i < buttons.length; i++) {
        onClick(`button${i}`, () => {
            if (i !== rightIndex) {
                loseLife();
                launchAnotherQuestion();
                return;
            }

            score++;

            if (score !== scoreToPass) {
                play("correct");
                launchAnotherQuestion();
                return;
            }

            if (level < lastLevel) {
                play("correct");
                go("tutorial", music, texts, language, level + 1);
            } else {
                go("win", music, texts, language);
            }
        });

        if (!isTouchscreen()) {
            onHover(`button${i}`, () => buttons[i].color = buttonsHoveredColor[i]);
            onHoverEnd(`button${i}`, () => buttons[i].color = buttonsDefaultColor[i]);
        }
    }

    onDraw(() => {
        drawQuestion(name);
        for (let i = 0; i < livesMax; i++) {
            drawSprite({
                sprite: (i + 1) > lives ? "heartEmpty" : "heart",
                pos: vec2(heartSize * i, 0),
            });
        }
        drawTwoColoredText(`Score: ${score}`, 10, 35, 20, false);

        drawAnswers(answers, buttons);
        drawRect({
            width: (1 - (time() - startTime) / timeLimit) * bgRect.width,
            height: bgRect.height,
            pos: bgRect.pos,
            color: orange,
        });
    });
}
