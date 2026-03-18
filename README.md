# 2048-game
# 2048 Game — JavaScript / jQuery

Implementation of the 2048 game in HTML/CSS/JavaScript with jQuery.
Built as part of a graded Web Programming lab (L3).

## How to play

Use the arrow keys to slide the tiles.
When two identical tiles collide, they merge into one.
The goal is to reach the 2048 tile before the grid fills up.

## Project structure

- `2048.html` — page structure
- `2048.css`  — styling and colors
- `2048.js`   — game logic

## Main functions

- `construire_grille()` — builds the HTML table from the JS array
- `afficher_score()`    — updates the score display
- `caseVide(i, x)`     — places value x in the i-th empty cell
- `nouvelle()`         — resets the grid and places 2 random tiles
- `slideGauche(row)`   — filters zeros, merges neighbors, pads with zeros
- `glisse(dir)`        — applies slideGauche in all 4 directions (g/d/h/b)
- `gameOver()`         — detects end of game

## Sliding algorithm

Each move follows 3 steps on every row or column :
1. Filter out zeros
2. Merge identical neighbors (each tile can only merge once)
3. Pad with zeros on the correct side

Right and down directions use reverse() before and after
slideGauche() to reuse the same logic.

## Technologies

- HTML5 / CSS3
- JavaScript ES6
- jQuery 3.7.1
