$(document).ready(() => {

    // =====================
    // VARIABLES GLOBALES
    // =====================

    // grille 4x4 representee par un tableau de tableaux, 0 = case vide
    let grille = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
    ];
    let score = 0;    // score du joueur, incremente a chaque fusion
    let nbVide = 16;  // nombre de cases vides, decremente a chaque placement

    // =====================
    // AFFICHAGE
    // =====================

    // construit le HTML de la grille depuis le tableau grille
    // on affiche seulement les cases non nulles
    function construire_grille() {
        let code = "";
        for (let i = 0; i < 4; i++) {
            code += "<tr>";
            for (let j = 0; j < 4; j++) {
                code += "<td>";
                if (grille[i][j] !== 0) {
                    code += grille[i][j];
                }
                code += "</td>";
            }
            code += "</tr>";
        }
        $('#grille table').html(code);
    }

    // met a jour l'affichage du score dans le span#score
    function afficher_score() {
        $("#score").html(score);
    }

    // =====================
    // GESTION DES CASES VIDES
    // =====================

    // place la valeur x dans la i-eme case vide de la grille
    // parcourt la grille case par case et compte les cases vides
    // quand le compteur atteint i, on place x et on decremente nbVide
    function caseVide(i, x) {
        let compteur = 0;
        for (let z = 0; z < 4; z++) {
            for (let n = 0; n < 4; n++) {
                if (grille[z][n] === 0) {
                    if (compteur === i) {
                        grille[z][n] = x;
                        nbVide--;
                        return;
                    }
                    compteur++;
                }
            }
        }
    }

    // =====================
    // NOUVELLE PARTIE
    // =====================

    // reinitialise tout et place 2 tuiles de valeur 2 dans des cases aleatoires
    // on s'assure que les deux cases tirees sont differentes avec le do...while
    function nouvelle() {
        score = 0;
        afficher_score();
        grille = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        nbVide = 16;

        // tirage de la premiere case
        let i = Math.floor(Math.random() * nbVide);
        caseVide(i, 2);

        // tirage de la deuxieme case — on retente si elle tombe sur la meme que i
        let j;
        do {
            j = Math.floor(Math.random() * nbVide); // nbVide vaut 15 ici
        } while (j === i);
        caseVide(j, 2);

        construire_grille();
    }

    // =====================
    // LOGIQUE DE GLISSEMENT
    // =====================

    // applique un glissement vers la gauche sur une ligne (tableau de 4 elements)
    // etape 1 : filtre les zeros — on garde seulement les tuiles
    // etape 2 : fusionne les voisins identiques (chaque tuile fusionne au plus une fois)
    // etape 3 : complete avec des zeros a droite pour revenir a 4 elements
    function slideGauche(row) {

        // etape 1 — filtrer les zeros
        let line = row.filter(x => x !== 0);

        // etape 2 — fusionner les voisins identiques
        for (let i = 0; i < line.length - 1; i++) {
            if (line[i] === line[i + 1]) {
                line[i] *= 2;           // on double la valeur de la tuile gauche
                score += line[i];       // on ajoute la valeur fusionnee au score
                nbVide++;               // une case se libere apres fusion
                line.splice(i + 1, 1); // on supprime le doublon ex: (2,2) --> (4,2) --> splice --> (4)
            }
        }

        // etape 3 — completer avec des zeros a droite
        while (line.length < 4) line.push(0); // ex: (4) --> (4,0,0,0)

        return line;
    }

    // applique le glissement dans la direction donnee (g/d/h/b)
    // toutes les directions reutilisent slideGauche :
    //   gauche  → directement sur chaque ligne
    //   droite  → reverse + slideGauche + reverse sur chaque ligne
    //   haut    → extrait chaque colonne + slideGauche + remet en place
    //   bas     → extrait chaque colonne + reverse + slideGauche + reverse + remet en place
    function glisse(dir) {

        // GAUCHE — on applique slideGauche directement sur chaque ligne
        if (dir === 'g') {
            for (let i = 0; i < 4; i++) {
                grille[i] = slideGauche(grille[i]);
            }
        }

        // DROITE — on retourne la ligne, on slide a gauche, on remet a l'endroit
        if (dir === 'd') {
            for (let i = 0; i < 4; i++) {
                grille[i].reverse();                 // gauche->droite devient droite->gauche
                grille[i] = slideGauche(grille[i]);  // on applique slideGauche
                grille[i].reverse();                 // on remet dans le bon sens
            }
        }

        // HAUT — on travaille colonne par colonne
        // une colonne n'existe pas directement, on l'extrait dans un tableau temporaire
        if (dir === 'h') {
            for (let j = 0; j < 4; j++) {
                let col = [];
                for (let i = 0; i < 4; i++) col.push(grille[i][j]); // extraire colonne j
                col = slideGauche(col);                               // slider vers le haut
                for (let i = 0; i < 4; i++) grille[i][j] = col[i];  // remettre en place
            }
        }

        // BAS — meme principe que haut mais avec reverse avant et apres
        if (dir === 'b') {
            for (let j = 0; j < 4; j++) {
                let col = [];
                for (let i = 0; i < 4; i++) col.push(grille[i][j]); // extraire colonne j
                col.reverse();                                         // on retourne
                col = slideGauche(col);                               // slider
                col.reverse();                                         // on remet a l'endroit
                for (let i = 0; i < 4; i++) grille[i][j] = col[i];  // remettre en place
            }
        }

        // apres chaque mouvement : ajouter une tuile 2 dans une case vide aleatoire
        caseVide(Math.floor(Math.random() * nbVide), 2);
        construire_grille();  // mettre a jour l'affichage
        afficher_score();     // mettre a jour le score
        gameOver();           // verifier si la partie est terminee
    }

    // =====================
    // FIN DE PARTIE
    // =====================

    // verifie si la grille est pleine et affiche le message de game over
    function gameOver() {
        if (nbVide === 0) {
            alert("Game over !\nScore : " + score);
        }
    }

    // =====================
    // EVENEMENTS
    // =====================

    // ecoute les touches du clavier et appelle glisse avec la bonne direction
    // 37 = fleche gauche, 38 = fleche haut, 39 = fleche droite, 40 = fleche bas
    $(document).on("keydown", function(e) {
        if (e.which === 37) glisse('g');
        if (e.which === 38) glisse('h');
        if (e.which === 39) glisse('d');
        if (e.which === 40) glisse('b');
    });

    // =====================
    // LANCEMENT
    // =====================

    // lance une nouvelle partie au chargement de la page
    nouvelle();

});