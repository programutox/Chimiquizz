# Chimiquizz

> A game about chemical names and formulas.


## Goal

You have to choose the formula corresponding to the displayed chemical name. Make your highest score!


## Why I decided to create this game

At school I have to learn many chemical names with their formulas, so I thought the best way to learn was by playing a game. I also wanted to help my friends and my classmates, so I made the game in French.


## Tools

I started developing the game using [Rust] and [macroquad], since I wanted it to be fast, safe and quick to program (and because I'm currently learning Rust). Also, macroquad's design is similar to [raylib], which I used in my previous repositories.


### Issues encountered with macroquad

I was unable to target the game to wasm. There was multiple errors because of the js file I had to import from macroquad's repository.
Moreover, assets management seemed different between desktop Rust app and wasm one (if I had used the macro `include_bytes!("image.png")`, the game would 
have been heavier and longer to load).

I was a bit frustrated, because I wanted to develop the game once and run it everywhere, and macroquad is told to be cross-platform.
I was looking for another Rust game library/game engine, but the ones I found seemed too different or too complex. 
For instance, Bevy uses systems and plugins, as well as OOP. I was losing macroquad's simplicity and functional pattern. 
I did not want to spend more time learning how to use a new library than developing the game. At least, with all those reasearches I discovered the website 
[Are we game yet?].

Thanks to this [Polymars' video], I discovered [kaboom], a JS library to create simple video games. 
So I decided to give it a try, and I made a simpler version of the game.


### Issues encountered with kaboom (former version)

You cannot use ttf fonts with kaboom. Instead, you have to use [bitmap fonts]. However, I could not
find one that supported subscripts and superscripts, which was necessary for the chemical formulas. I tried first to analyze each character of
the formulas to place the special one a bit higher or lower (as subscripts or superscripts), but the result was not the same for all the formulas. 
Therefore I used an online [LaTeX equation editor] to create formulas' images. 
It works, but the rendering is a bit distorted.

Another problem I found is file management. Indeed, I did not find a *simple* way of reading external files (without using node.js, because I did not
want my game to be heavy).


### Now (recent version)

I used the fetch api to load files, which works pretty well, and kaboom supports ttf files, so you can display superscripts and subscripts (if the font supports it).


## Build

If you want to download the source code and test the game on your browser. You need to setup a local server, otherwise kaboom will not be able to load images.

To do so, type this command:

```bash
python3 -m http.server
```

Then follow the link the program displays.


## Documentation

To add new formulas and chemical names, you can refer to [this file].


## License

This project is under MIT License (refer to the [LICENSE] file for more details).

In addition to the license conditions, you have to credit the artists who made the sound effects and the musics, which I did in the [credits file].

Feel free to use this project as an inspiration for your quizz games.


<!--- References --->
[Rust]: https://www.rust-lang.org/
[macroquad]: https://github.com/not-fl3/macroquad
[raylib]: https://github.com/raysan5/raylib
[Are we game yet?]: https://arewegameyet.rs/
[Polymars' video]: https://yewtu.be/watch?v=D1CKDpdsOTQ
[kaboom]: https://kaboomjs.com/
[bitmap fonts]: https://en.wikipedia.org/wiki/Computer_font#BITMAP
[LaTeX equation editor]: https://latex.codecogs.com/eqneditor/editor.php
[this file]: doc/formatting.md
[LICENSE]: LICENSE
[credits file]: assets/credits.txt