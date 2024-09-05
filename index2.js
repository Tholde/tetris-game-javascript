//création de l'élement audio
var initMusic = new Audio('safe.mp3')
var music1 = new Audio('crush.mp3')
var music2 = new Audio('soaMaso.mp3')
var gameOverMusic = new Audio('Ga.mp3')
//Fonction pour jouer la musique
function playSecondMusic () {
  music2.play()
}
function playGameOverMusic () {
  gameOverMusic.play()
}
initMusic.play()
//Fonction pour arrêter la musique
function arreterMusique (music) {
  music.pause()
  music.currentTime = 0
}

// variable pour vérifier si le jeu est en cours ou pas
var isStart = false
// objet tetris contenant toutes les fonctionnalités du jeu
var tetris = {
  // propriétés du jeu
  board: [], // tableau représentant le plateau de jeu
  boardDiv: null, // élément div associé au plateau
  canvas: null, // élément canvas pour afficher le jeu
  pSize: 20, // taille d'un carré (en pixels)
  canvasHeight: 440, // hauteur du canvas
  canvasWidth: 200, // largeur du canvas
  boardHeight: 0, // hauteur initiale du plateau de jeu (nombre de cases en hauteur)
  boardWidth: 0, // largeur initiale du plateau de jeu (nombre de cases en largeur)
  spawnX: 4, // position initiale en X où les formes apparaissent sur le plateau de jeu
  spawnY: 1, // position initiale en Y où les formes apparaissent sur le plateau de jeu
  // différentes formes de tétriminos avec leurs coordonnées relatives
  shapes: [
    // tétrimino TEE
    [
      [-1, 1],
      [0, 1],
      [1, 1],
      [0, 0]
    ],
    // tétrimino Ligne
    [
      [-1, 0],
      [0, 0],
      [1, 0],
      [2, 0]
    ],
    // tétrimino L EL
    [
      [-1, -1],
      [-1, 0],
      [0, 0],
      [1, 0]
    ],
    // tétrimino R EL
    [
      [1, -1],
      [-1, 0],
      [0, 0],
      [1, 0]
    ],
    // tétrimino R ess
    [
      [0, -1],
      [1, -1],
      [-1, 0],
      [0, 0]
    ],
    // tétrimino L ess
    [
      [-1, -1],
      [0, -1],
      [0, 0],
      [1, 0]
    ],
    // tétrimino square na Carré
    [
      [0, -1],
      [1, -1],
      [0, 0],
      [1, 0]
    ]
  ],

  tempShapes: null, // variable temporaire pour stocker les formes tétrimino à venir
  curShape: null, // forme tétrimino actuelle
  curShapeIndex: null, // indice de la forme tétrimino actuelle dans le tableau des formes
  curX: 0, // position en X actuelle de la forme tétrimino sur le plateau de jeu
  curY: 0, // position en Y actuelle de la forme tétrimino sur le plateau de jeu
  curSqs: [], // tableau pour stocker les carrés actuels de la forme tétrimino
  nextShape: null, // prochaine forme tétrimino à venir
  nextShapeDisplay: null, // élément d'affichage de la prochaine forme tétrimino
  nextShapeIndex: null, // indice de la prochaine forme tétrimino dans le tableau des formes
  sqs: [], // tableau pour stocker tous les carrés sur le plateau de jeu
  score: 0, // score actuel du joueur
  scoreDisplay: null, // élément d'affichage du score
  level: 1, // niveau actuel du joueur
  levelDisplay: null, // élément d'affichage du niveau
  numLevels: 10, // nombre total de niveaux dans le jeu
  time: 0, // temps écoulé depuis le début du jeu
  maxTime: 1000, // temps maximum de jeu
  timeDisplay: null, // élément d'affichage du temps
  isActive: 0, // indicateur d'activité du jeu (0 pour inactif, 1 pour actif)
  curComplete: false, // indicateur si la forme tétrimino actuelle est complète sur le plateau
  timer: null, // minuterie principale du jeu
  sTimer: null, // minuterie secondaire du jeu
  speed: 700, // vitesse de descente des formes tétrimino
  lines: 0, // nombre total de lignes complètes par le joueur

  // méthode d'initialisation du jeu
  init: function () {
    isStart = true
    this.canvas = document.getElementById('canvas') // Obtient l'élément canvas par ID
    this.initBoard() // Initialise le plateau de jeu
    this.initInfo() // Initialise les éléments d'affichage d'informations
    this.initLevelScores() // Initialise les niveaux et scores associés
    this.initShapes() // Initialise les formes du jeu
    this.bindKeyEvents() // Associe les événements clavier
    this.play() // Démarre le jeu
    //pour démarrer les deux musiques
    arreterMusique(initMusic) //arrêter le music d'initialisation de jeux
    music1.play() // jouer le music1
    music1.addEventListener('ended', playSecondMusic) //Lorsque la première music est terminée, jouer la deuxième music
  },
  // Méthode pour initialiser le tableau de jeu
  initBoard: function () {
    this.boardHeight = this.canvasHeight / this.pSize // Calcul de la hauteur du plateau de jeu en fonction de la hauteur du canevas et de la taille d'une case
    this.boardWidth = this.canvasWidth / this.pSize // Calcul de la largeur du plateau de jeu en fonction de la largeur du canevas et de la taille d'une case
    var s = this.boardHeight * this.boardWidth // Calcul du nombre total de cases sur le plateau de jeu
    for (var i = 0; i < s; i++) {
      // Initialisation du tableau de jeu avec des zéros, indiquant que toutes les cases sont initialement vides
      this.board.push(0)
    }
  },
  // Méthode d'initialisation des éléments d'affichage et de leurs valeurs dans l'interface utilisateur
  initInfo: function () {
    this.nextShapeDisplay = document.getElementById('next_shape') // Récupération de l'élément d'affichage de la prochaine forme tétrimino
    this.levelDisplay = document
      .getElementById('level')
      .getElementsByTagName('span')[0] // Récupération de l'élément d'affichage du niveau et de son premier enfant <span>
    this.timeDisplay = document
      .getElementById('time')
      .getElementsByTagName('span')[0] // Récupération de l'élément d'affichage du temps et de son premier enfant <span>
    this.scoreDisplay = document
      .getElementById('score')
      .getElementsByTagName('span')[0] // Récupération de l'élément d'affichage du score et de son premier enfant <span>
    this.linesDisplay = document
      .getElementById('lines')
      .getElementsByTagName('span')[0] // Récupération de l'élément d'affichage du nombre de lignes complètes et de son premier enfant <span>
    this.setInfo('time') // Initialisation des valeurs d'affichage pour le temps
    this.setInfo('score') // Initialisation des valeurs d'affichage pour le score
    this.setInfo('level') // Initialisation des valeurs d'affichage pour le niveau
    this.setInfo('lines') // Initialisation des valeurs d'affichage pour le nombre de lignes complètes
  },
  // Méthode d'initialisation des formes tétrimino
  initShapes: function () {
    this.curSqs = [] // Tableau pour stocker les carrés de la forme tétrimino actuelle
    this.curComplete = false // Indicateur si la forme tétrimino actuelle est complète sur le plateau
    this.shiftTempShapes() // Passage à la prochaine série de formes tétrimino disponibles
    this.curShapeIndex = this.tempShapes[0] // Sélection de l'indice de la forme tétrimino actuelle dans la série
    this.curShape = this.shapes[this.curShapeIndex] // Sélection de la forme tétrimino actuelle à partir du tableau des formes
    this.initNextShape() // Initialisation de la prochaine forme tétrimino à venir
    this.setCurCoords(this.spawnX, this.spawnY) // Positionnement initial de la forme tétrimino actuelle sur le plateau de jeu
    this.drawShape(this.curX, this.curY, this.curShape) // Dessin de la forme tétrimino actuelle sur le plateau de jeu
  },
  // Méthode d'initialisation de la prochaine forme tétrimino à venir
  initNextShape: function () {
    if (typeof this.tempShapes[1] === 'undefined') {
      // Vérification si la prochaine forme tétrimino est indéfinie dans la série actuelle
      this.initTempShapes() // Si oui, réinitialisation de la série de formes tétrimino disponibles
    }
    try {
      this.nextShapeIndex = this.tempShapes[1] // Sélection de l'indice de la prochaine forme tétrimino dans la série
      this.nextShape = this.shapes[this.nextShapeIndex] // Sélection de la prochaine forme tétrimino à partir du tableau des formes
      this.drawNextShape() // Dessin de la prochaine forme tétrimino dans l'interface utilisateur
    } catch (e) {
      throw new Error('Tsy afaka mamorana forme vaovao. ' + e) // En cas d'erreur, une exception est levée avec un message d'erreur
    }
  },
  // Méthode d'initialisation de la série temporaire de formes tétrimino
  initTempShapes: function () {
    this.tempShapes = [] // tableau temporaire des indices des formes tétrimino
    for (var i = 0; i < this.shapes.length; i++) {
      // Remplissage du tableau temporaire avec les indices des formes tétrimino disponibles
      this.tempShapes.push(i)
    }
    var k = this.tempShapes.length // Variable pour le mélange aléatoire des indices dans le tableau temporaire (Fisher-Yates Shuffle)
    while (--k) {
      var j = Math.floor(Math.random() * (k + 1)) // Génération d'un indice aléatoire
      // Échange des éléments d'indices k et j dans le tableau temporaire
      var tempk = this.tempShapes[k]
      var tempj = this.tempShapes[j]
      this.tempShapes[k] = tempj
      this.tempShapes[j] = tempk
    }
  },
  // Méthode pour décaler la série temporaire d'indices de formes tétrimino
  shiftTempShapes: function () {
    try {
      if (typeof this.tempShapes === 'undefined' || this.tempShapes === null) {
        // Vérification si la série temporaire des indices est indéfinie ou nulle
        this.initTempShapes() // Si oui, réinitialisation de la série temporaire
      } else {
        this.tempShapes.shift() // Sinon, décalage d'un élément vers la gauche dans la série temporaire
      }
    } catch (e) {
      throw new Error('Tsy afaka mi-réinitialisé na mi-décaler io: ' + e) // En cas d'erreur, une exception est levée avec un message d'erreur
    }
  },
  // Méthode d'initialisation de la minuterie du jeu Tetris
  initTimer: function () {
    var me = this // Sauvegarde de la référence à l'instance actuelle de l'objet Tetris
    var tLoop = function () {
      // Définition de la fonction de la boucle de la minuterie
      me.incTime() // Incrémentation du temps de jeu
      me.timer = setTimeout(tLoop, 2000) // Configuration du prochain appel de la boucle de minuterie après 2000 millisecondes (2 secondes)
    }
    this.timer = setTimeout(tLoop, 2000) // Démarrage initial de la minuterie
  },
  // Méthode pour initialiser les scores nécessaires pour atteindre le niveau suivant
  initLevelScores: function () {
    var c = 1 // Initialisation d'un multiplicateur pour les scores de niveau
    for (var i = 1; i <= this.numLevels; i++) {
      // Boucle pour configurer les scores et objectifs pour chaque niveau
      this['level' + i] = [c * 100, 40 * i, 1 * i] // Pour le prochain niveau, score de ligne, score de ligne, score de forme, [score nécessaire pour le niveau suivant, score par ligne, score par pièce]
      c = c + c // Multiplication du multiplicateur par 2 pour le prochain niveau
    }
  },
  // Méthode pour mettre à jour l'affichage d'une information (temps, score, niveau, lignes)
  setInfo: function (el) {
    this[el + 'Display'].innerHTML = this[el] // Modification du contenu HTML de l'élément d'affichage correspondant avec la valeur actuelle de l'information
  },
  // Méthode pour dessiner la forme suivante dans l'affichage
  drawNextShape: function () {
    var ns = [] // Tableau pour stocker les éléments div représentant la prochaine forme tétrimino
    for (var i = 0; i < this.nextShape.length; i++) {
      // Boucle pour créer les éléments div correspondant aux positions de la prochaine forme tétrimino
      ns[i] = this.createSquare(
        this.nextShape[i][0] + 2,
        this.nextShape[i][1] + 2,
        this.nextShapeIndex
      ) // Création d'un élément div pour chaque carré de la prochaine forme tétrimino
    }
    this.nextShapeDisplay.innerHTML = '' // Effacement du contenu actuel de l'affichage de la prochaine forme
    for (var k = 0; k < ns.length; k++) {
      // Ajout des nouveaux éléments div représentant la prochaine forme à l'affichage
      this.nextShapeDisplay.appendChild(ns[k])
    }
  },
  // Méthode pour dessiner une forme tétrimino sur le tableau de jeu
  drawShape: function (x, y, p) {
    for (var i = 0; i < p.length; i++) {
      // Boucle pour parcourir chaque carré de la forme tétrimino
      // Calcul des nouvelles coordonnées pour chaque carré de la forme tétrimino
      var newX = p[i][0] + x
      var newY = p[i][1] + y
      this.curSqs[i] = this.createSquare(newX, newY, this.curShapeIndex) // Création d'un élément div représentant le carré à la nouvelle position
    }
    for (var k = 0; k < this.curSqs.length; k++) {
      // Boucle pour ajouter chaque carré de la forme tétrimino au tableau de jeu
      this.canvas.appendChild(this.curSqs[k])
    }
  },
  // Méthode pour créer un élément div représentant un carré de la forme tétrimino
  createSquare: function (x, y, type) {
    var el = document.createElement('div') // Création d'un nouvel élément div
    el.className = 'square type' + type // Attribution d'une classe CSS au div en fonction du type de la forme tétrimino
    // Positionnement du div en fonction des coordonnées (x, y) et de la taille des carrés
    el.style.left = x * this.pSize + 'px'
    el.style.top = y * this.pSize + 'px'
    return el // Retour de l'élément div créé
  },
  // Méthode pour supprimer les carrés actuels de la forme tétrimino du tableau de jeu
  removeCur: function () {
    var me = this // Stockage de la référence à l'objet courant pour être utilisée à l'intérieur de la boucle
    this.curSqs.eachdo(function () {
      // Boucle pour chaque carré actuel de la forme tétrimino
      me.canvas.removeChild(this) // Suppression de chaque carré du tableau de jeu (canvas)
    })
    this.curSqs = [] // Réinitialisation du tableau des carrés actuels
  },
  // Méthode pour définir les coordonnées actuelles de la forme tétrimino
  setCurCoords: function (x, y) {
    this.curX = x // Attribution de la nouvelle valeur de x aux coordonnées actuelles de la forme tétrimino
    this.curY = y // Attribution de la nouvelle valeur de y aux coordonnées actuelles de la forme tétrimino
  },
  // Méthode pour lier les événements de touche (clavier) à la fonction de rappel handleKey.
  bindKeyEvents: function () {
    var me = this // Stockage de la référence à l'objet courant pour être utilisée à l'intérieur de la fonction de rappel
    var event = 'keypress' // Définition de l'événement initial à 'keypress'
    if (this.isSafari() || this.isIE()) {
      // Vérification du navigateur pour déterminer s'il s'agit de Safari ou d'Internet Explorer
      event = 'keydown'
    }
    var cb = function (e) {
      // Définition de la fonction de rappel pour gérer l'événement de touche
      me.handleKey(e)
    }
    if (window.addEventListener) {
      // Vérification de la prise en charge de la méthode addEventListener pour ajouter l'événement
      document.addEventListener(event, cb, false)
    } else {
      // Utilisation de la méthode attachEvent pour les anciennes versions d'Internet Explorer
      document.attachEvent('on' + event, cb)
    }
  },
  // Gestionnaire d'événements clavier pour les touches utilisées dans le jeu (touche est enfoncée)
  handleKey: function (e) {
    var c = this.whichKey(e)
    var dir = ''
    switch (c) {
      case 37:
        this.move('L') // Déplacer vers la gauche
        break
      case 38:
        this.move('RT') // Rotation
        break
      case 39:
        this.move('R') // Déplacer vers la droite
        break
      case 40:
        this.move('D') // Déplacer vers le bas
        break
      case 27: //esc: pause
        this.togglePause() // Mettre en pause ou reprendre le jeu
        break
      default:
        break
    }
  },
  // Méthode pour obtenir le code de touche associé à un événement de touche
  whichKey: function (e) {
    // un paramètre e qui représente l'événement de touche et utilise la propriété keyCode pour extraire le code de la touche
    var c // Variable pour stocker le code de la touche
    if (window.event) {
      // Vérification de la prise en charge de la propriété 'window.event' pour les anciennes versions d'Internet Explorer
      c = window.event.keyCode // Attribution du code de la touche à la variable 'c' en utilisant 'window.event.keyCode'
    } else if (e) {
      c = e.keyCode // Attribution du code de la touche à la variable 'c' en utilisant 'e.keyCode'
    }
    return c // Retourne le code de la touche
  },
  // Méthode pour incrémenter le temps et mettre à jour l'affichage du temps
  incTime: function () {
    this.time++ // Incrémente la variable 'time'
    this.setInfo('time') // Met à jour l'affichage du temps en appelant la méthode 'setInfo' avec l'argument 'time'
  },
  // Méthode pour incrémenter le score et mettre à jour l'affichage du score
  incScore: function (amount) {
    this.score = this.score + amount // Incrémente le score en ajoutant la valeur 'amount' à la variable 'score'
    this.setInfo('score') // Met à jour l'affichage du score en appelant la méthode 'setInfo' avec l'argument 'score'
  },
  // Méthode pour effectuer des actions lorsque le joueur atteint un nouveau niveau ( pour incrémenter le niveau et ajuster la vitesse, puis mettre à jour l'affichage du niveau)
  incLevel: function () {
    this.level++ // Incrémente la variable 'level'
    this.speed = this.speed - 100 // permet d'augmente la vitesse de forme
    this.setInfo('level') //  // Met à jour l'affichage du niveau en appelant la méthode 'setInfo' avec l'argument 'level'
  },
  // Méthode pour incrémenter le nombre de lignes complétées et mettre à jour l'affichage du nombre de lignes
  incLines: function (num) {
    this.lines += num // Incrémente le nombre de lignes en ajoutant la valeur 'num' à la variable 'lines'
    this.setInfo('lines') // Met à jour l'affichage du nombre de lignes en appelant la méthode 'setInfo' avec l'argument 'lines'
  },
  // Méthode pour effectuer des actions en fonction des paramètres fournis lors du calcul du score (pour calculer le score en fonction des paramètres passés)
  calcScore: function (args) {
    var lines = args.lines || 0 // Récupère le nombre de lignes (défaut à 0 si non spécifié)
    var shape = args.shape || false // Récupère la forme (défaut à false si non spécifié)
    var speed = args.speed || 0 // Récupère la vitesse (défaut à 0 si non spécifié)
    var score = 0 // Initialise le score à 0

    if (lines > 0) {
      // Si le nombre de lignes est supérieur à 0
      score += lines * this['level' + this.level][1] // Ajoute au score le produit du nombre de lignes, et du score de ligne pour le niveau actuel (Calcul du score basé sur le nombre de lignes complètes)
      this.incLines(lines) // Appelle la méthode 'incLines' pour mettre à jour le nombre de lignes complétées (Incrémenter le nombre total de lignes complètes)
    }
    if (shape === true) {
      // Si la forme est vraie (true)
      score += shape * this['level' + this.level][2] // Ajoute au score le produit de la forme et du score de forme pour le niveau actuel (Calcul du score basé sur la forme)
    }

    this.incScore(score) // Appelle la méthode 'incScore' pour mettre à jour le score total (Incrémenter le score total)
  },
  // Méthode pour vérifier si le joueur a atteint un nouveau niveau en fonction du score (pour vérifier si le score actuel atteint le seuil requis pour passer au niveau suivant)
  checkScore: function () {
    if (this.score >= this['level' + this.level][0]) {
      // Si le score actuel est supérieur ou égal au seuil du prochain niveau
      this.incLevel() // Appelle la méthode 'incLevel' pour passer au niveau suivant (Augmenter le niveau)
    }
  },

  // Méthode pour gérer la fin du jeu
  gameOver: function () {
    this.clearTimers() // Appelle la méthode 'clearTimers' pour arrêter les minuteries en cours (Arrêter les minuteries du jeu)
    isStart = false // Définit la variable isStart à false, indiquant que le jeu est terminé
    arreterMusique(music1) // arrêter le music1
    arreterMusique(music2) // arrêter le music2
    playGameOverMusic() // jouer le music de game over
    this.canvas.innerHTML =
      '<img src="./zany_face.png"><br><h1>GAME OVER</h1><br>' // Remplace le contenu du canvas par un message "GAME OVER"
  },
  // Méthode pour démarrer le jeu en appelant la boucle principale du jeu
  play: function () {
    var me = this // Capture la référence à l'instance actuelle du jeu
    if (this.timer === null) {
      // Si la minuterie principale (timer) n'est pas initialisée, l'initialise
      this.initTimer() // Initialiser la minuterie du jeu
    }
    // La boucle principale du jeu. Gère le déplacement de la forme actuelle vers le bas.
    var gameLoop = function () {
      me.move('D') // Déplacer la forme vers le bas
      if (me.curComplete) {
        // Si la forme actuelle est complète (arrivée en bas)
        me.markBoardShape(me.curX, me.curY, me.curShape) // Marque la forme sur le plateau de jeu
        me.curSqs.eachdo(function () {
          // Ajoute chaque carré de la forme actuelle à la liste des carrés du plateau
          me.sqs.push(this)
        })
        me.calcScore({ shape: true }) // Calcule le score pour la forme complète
        me.checkRows() // Vérifie et supprime les lignes complètes
        me.checkScore() // Vérifie si le score atteint le seuil pour passer au niveau suivant
        me.initShapes() // Initialise une nouvelle forme pour le prochain tour
        me.play() // Relance la boucle de jeu récursivement
      } else {
        me.pTimer = setTimeout(gameLoop, me.speed) // Si la forme n'est pas encore complète, planifie la prochaine itération de la boucle
      }
    }
    this.pTimer = setTimeout(gameLoop, me.speed) // Initialise la boucle de jeu avec la première itération
    this.isActive = 1 // Indique que le jeu est actif
  },
  // Méthode pour mettre en pause ou reprendre le jeu (pour basculer entre la pause et la reprise du jeu)
  togglePause: function () {
    if (this.isActive === 1) {
      // Si le jeu est actuellement actif
      this.clearTimers() // Mettre en pause en arrêtant les minuteries (Arrête toutes les minuteries pour mettre en pause le jeu)
      this.isActive = 0 // Indique que le jeu n'est plus actif
    } else {
      this.play() // Si le jeu est actuellement en pause, reprend le jeu
    }
  },
  // Méthode pour arrêter ou effacer toutes les minuteries du jeu
  clearTimers: function () {
    clearTimeout(this.timer) // Efface la minuterie principale
    clearTimeout(this.pTimer) // Efface la minuterie de jeu
    // Réinitialise les références des minuteries à null
    this.timer = null
    this.pTimer = null
  },
  // Méthode pour déplacer la forme dans une direction spécifiée
  move: function (dir) {
    var s = '' // Variable pour stocker la propriété CSS correspondante (left ou top)
    var me = this // Référence à l'instance actuelle pour une utilisation à l'intérieur de fonctions internes
    // Variables temporaires pour stocker les coordonnées temporelles de la forme
    var tempX = this.curX
    var tempY = this.curY
    // Sélectionne la propriété CSS appropriée et met à jour les coordonnées temporaires en conséquence
    switch (dir) {
      case 'L': //déplacement vers la gauche
        s = 'left'
        tempX -= 1
        break
      case 'R':
        s = 'left' //déplacement vers la droite,
        tempX += 1
        break
      case 'D':
        s = 'top' //déplacement vers le bas
        tempY += 1
        break
      case 'RT': //rotation
        this.rotate()
        return true
        break
      default: // En cas d'une direction inattendue, lance une erreur
        throw new Error('wtf')
        break
    }

    if (this.checkMove(tempX, tempY, this.curShape)) {
      // si le déplacement est valide en utilisant la méthode checkMove
      this.curSqs.eachdo(function (i) {
        // Si le déplacement est valide, met à jour les positions des carrés de la forme actuelle
        var l = parseInt(this.style[s], 10)
        dir === 'L' ? (l -= me.pSize) : (l += me.pSize)
        this.style[s] = l + 'px'
      })
      // Met à jour les coordonnées actuelles
      this.curX = tempX
      this.curY = tempY
    } else if (dir === 'D') {
      // Si le déplacement vers le bas n'est pas possible
      if (this.curY === 1 || this.time === this.maxTime) {
        this.gameOver() // Vérifie si le jeu est terminé et gère le Game Over
        return false
      }
      this.curComplete = true // Marque la complétion de la forme actuelle
    }
  },
  // Méthode pour effectuer la rotation de la forme actuelle
  rotate: function () {
    if (this.curShapeIndex !== 6) {
      // si la forme actuelle n'est pas un carré (indice 6 dans le tableau des formes)
      var temp = [] // tableau temporaire pour stocker les nouvelles coordonnées après la rotation
      this.curShape.eachdo(function () {
        temp.push([this[1] * -1, this[0]]) // Parcourt chaque carré de la forme actuelle et applique une rotation à 90 degrés
      })
      if (this.checkMove(this.curX, this.curY, temp)) {
        // si la rotation est possible en utilisant la méthode checkMove
        this.curShape = temp // Si la rotation est possible, met à jour les coordonnées de la forme actuelle
        this.removeCur() // Supprime les carrés actuels de l'affichage
        this.drawShape(this.curX, this.curY, this.curShape) // Dessine la forme mise à jour à ses nouvelles coordonnées
      } else {
        throw new Error('Tsy afaka mihodina io!') // En cas d'échec de la rotation, lance une erreur
      }
    }
  },
  // Méthode pour vérifier si le mouvement de la forme est possible à la position spécifiée
  checkMove: function (x, y, p) {
    // Vérifie si le déplacement est en dehors des limites du tableau ou s'il y a une collision
    if (this.isOB(x, y, p) || this.isCollision(x, y, p)) {
      return false // Le déplacement n'est pas possible
    }
    return true // Le déplacement est possible
  },
  // Méthode pour vérifier s'il y a une collision avec les blocs existants du plateau de jeu
  isCollision: function (x, y, p) {
    var me = this
    var bool = false
    p.eachdo(function () {
      // Parcourt chaque carré de la forme en cours
      // Calcule les nouvelles coordonnées après le déplacement
      var newX = this[0] + x
      var newY = this[1] + y
      // Vérifie si les nouvelles coordonnées se trouvent sur un carré déjà positionné
      if (me.boardPos(newX, newY) === 1) {
        bool = true // Il y a une collision
      }
    })
    return bool
  },
  // Méthode pour vérifier si la forme est hors des limites du plateau de jeu
  isOB: function (x, y, p) {
    // Obtient les dimensions maximales du tableau
    var w = this.boardWidth - 1
    var h = this.boardHeight - 1
    var bool = false
    // Parcourt chaque carré de la forme en cours
    p.eachdo(function () {
      // Calcule les nouvelles coordonnées après le déplacement
      var newX = this[0] + x
      var newY = this[1] + y
      // Vérifie si les nouvelles coordonnées dépassent les limites du tableau
      if (newX < 0 || newX > w || newY < 0 || newY > h) {
        bool = true // La forme dépasse les limites du tableau
      }
    })
    return bool // Renvoie true si la forme dépasse les limites, sinon false
  },
  // Méthode pour obtenir l'état d'une ligne du plateau (Empty, Full, ou Unfinished)
  getRowState: function (y) {
    var c = 0 //variable utiliser pour le compteur
    for (var x = 0; x < this.boardWidth; x++) {
      // Parcourt chaque colonne de la ligne spécifiée
      if (this.boardPos(x, y) === 1) {
        c = c + 1 // Incrémente le compteur si une case est occupée
      }
    }
    // Détermine l'état de la ligne en fonction du compteur
    if (c === 0) {
      return 'E' // Ligne vide (Empty)
    }
    if (c === this.boardWidth) {
      return 'F' // Ligne pleine (Full)
    }
    return 'U' // Ligne non terminée (Unfinished)
  },
  // Méthode pour vérifier l'état et supprimer des lignes complètes et effectuer des actions en conséquence
  checkRows: function () {
    var me = this
    var start = this.boardHeight
    this.curShape.eachdo(function () {
      // Parcourt chaque carré de la forme en cours
      var n = this[1] + me.curY
      console.log(n)
      if (n < start) {
        start = n // Recherche la position de départ la plus basse de la forme en cours
      }
    })
    console.log(start) // Affiche la position de départ la plus basse dans la console (à des fins de débogage)

    var c = 0 // Compteur de lignes complètes
    var stopCheck = false
    // Parcourt les lignes du bas vers le haut du plateau
    for (var y = this.boardHeight - 1; y >= 0; y--) {
      switch (this.getRowState(y)) {
        case 'F':
          this.removeRow(y) // Supprimer la ligne complète
          c++
          break
        case 'E':
          if (c === 0) {
            stopCheck = true
          }
          break
        case 'U':
          if (c > 0) {
            this.shiftRow(y, c) // Si des lignes ont été supprimées, décaler les lignes vers le bas
          }
          break
        default:
          break
      }
      if (stopCheck === true) {
        break // Arrêter la vérification si aucune ligne complète n'a été trouvée dans la forme en cours
      }
    }
    if (c > 0) {
      this.calcScore({ lines: c }) // Calculer le score en fonction du nombre de lignes complètes
    }
  },
  // Méthode pour décaler les blocs vers le bas après qu'une ligne a été supprimée
  shiftRow: function (y, amount) {
    var me = this
    // Parcourt chaque colonne de la ligne
    for (var x = 0; x < this.boardWidth; x++) {
      this.sqs.eachdo(function () {
        if (me.isAt(x, y, this)) {
          // si le carré est situé à la position actuelle
          me.setBlock(x, y + amount, this) // Déplace le carré vers le bas
        }
      })
    }
    me.emptyBoardRow(y) // Vider la ligne déplacée de la matrice du plateau de jeu
  },
  // Méthode pour vider une ligne spécifique dans le tableau
  emptyBoardRow: function (y) {
    for (var x = 0; x < this.boardWidth; x++) {
      this.markBoardAt(x, y, 0) // Marque la position du plateau comme vide
    }
  },
  // Méthode pour supprimer une ligne spécifique dans le plateau
  removeRow: function (y) {
    for (var x = 0; x < this.boardWidth; x++) {
      this.removeBlock(x, y) // Appelle la méthode removeBlock pour chaque bloc dans la ligne
    }
  },
  // Méthode pour supprimer un bloc à une position spécifique
  removeBlock: function (x, y) {
    var me = this
    this.markBoardAt(x, y, 0) // Marque la position dans le plateau comme vide
    this.sqs.eachdo(function (i) {
      // Parcourt chaque carré actif sur le plateau
      if (me.getPos(this)[0] === x && me.getPos(this)[1] === y) {
        // si la position du carré correspond à la position spécifiée
        // Supprime le carré du DOM et de la liste des carrés actifs
        me.canvas.removeChild(this)
        me.sqs.splice(i, 1)
      }
    })
  },
  // Méthode pour placer un bloc à une position spécifique sur le plateau de jeu
  setBlock: function (x, y, block) {
    this.markBoardAt(x, y, 1) // Marque la position dans le tableau du jeu comme occupée (1)
    // Calcule les nouvelles coordonnées de gauche et de haut pour le bloc
    var newX = x * this.pSize
    var newY = y * this.pSize
    // Met à jour la position du bloc dans le DOM
    block.style.left = newX + 'px'
    block.style.top = newY + 'px'
  },
  // Méthode pour vérifier si un bloc est à une position spécifique sur le plateau de jeu
  isAt: function (x, y, block) {
    if (this.getPos(block)[0] === x && this.getPos(block)[1] === y) {
      // si la position du bloc correspond aux coordonnées spécifiées
      return true
    }
    return false
  },
  // Méthode pour obtenir les coordonnées (position) d'un bloc dans le plateau de jeu
  getPos: function (block) {
    var p = [] // tableau pour stocker les coordonnées du bloc
    p.push(parseInt(block.style.left, 10) / this.pSize) // Ajoute la coordonnée horizontale (left) convertie en unités de taille de pixel à la position du bloc
    p.push(parseInt(block.style.top, 10) / this.pSize) // Ajoute la coordonnée verticale (top) convertie en unités de taille de pixel à la position du bloc
    return p // Retourne les coordonnées du bloc
  },
  // Méthode pour obtenir l'index dans le tableau du plateau de jeu en fonction des coordonnées (x, y)
  getBoardIdx: function (x, y) {
    return x + y * this.boardWidth // Formule pour calculer l'index en fonction des coordonnées et de la largeur du plateau
  },
  // Méthode pour obtenir la valeur du plateau de jeu à une position spécifique (x, y)
  boardPos: function (x, y) {
    return this.board[x + y * this.boardWidth] // Utilise la méthode getBoardIdx pour obtenir l'index, puis récupère la valeur correspondante dans le tableau du plateau
  },
  // Méthode pour marquer une position spécifique (x, y) sur le plateau de jeu avec une valeur donnée (val)
  markBoardAt: function (x, y, val) {
    this.board[this.getBoardIdx(x, y)] = val // Utilise la méthode getBoardIdx pour obtenir l'index, puis assigne la valeur spécifiée au tableau du plateau
  },
  // Méthode pour marquer la forme (p) sur le plateau de jeu à la position spécifiée (x, y)
  markBoardShape: function (x, y, p) {
    var me = this // Stocke la référence à l'objet 'this' dans la variable 'me' pour l'utiliser à l'intérieur de la fonction de rappel
    // Itère sur les éléments de la forme (p) et marque chaque position correspondante sur le plateau de jeu
    p.eachdo(function (i) {
      // Calcule les nouvelles coordonnées sur le tableau pour le point actuel de la forme
      var newX = p[i][0] + x
      var newY = p[i][1] + y
      me.markBoardAt(newX, newY, 1) // Appelle la méthode markBoardAt pour marquer la position sur le plateau de jeu comme occupée (1)
    })
  },
  // Méthode pour vérifier si le navigateur est Internet Explorer pour windows
  isIE: function () {
    return this.bTest(/IE/) // la méthode bTest avec une expression régulière pour tester la présence de "IE" dans le nom du navigateur
  },
  // Méthode pour vérifier si le navigateur est Firefox pour linux
  isFirefox: function () {
    return this.bTest(/Firefox/) //methode comme la methode au dessus
  },
  // Méthode pour vérifier si le navigateur est Safari pour Apple technologies
  isSafari: function () {
    return this.bTest(/Safari/) //methode comme la methode au dessus
  },
  // Méthode pour tester une regex sur la chaîne de l'agent utilisateur du navigateur
  bTest: function (rgx) {
    return rgx.test(navigator.userAgent) // méthode test de la regex pour vérifier si elle correspond à la chaîne de l'agent utilisateur
  }
}
// Sélectionne l'élément du DOM avec l'ID 'start' et l'assigne à la variable btn
const btn = document.querySelector('#start') //recuperer le bouton start dans une variable btn
const btnRestart = document.querySelector('#restart') //recuperer le bouton restart dans une variable btnRestart
const message = document.querySelector('#message') //recuperer la message dans une variable message
btn.addEventListener('click', function () {
  // écouteur d'événements au clic sur le bouton
  btn.style.display = 'none' // cacher le bouton start
  btnRestart.style.display = 'inline' //afficher le bouton restart cacher
  message.style.display = 'block' //afficher la message cacher
  if (!isStart) {
    // si le jeu n'est pas déjà démarré
    tetris.init() // Initialise le jeu Tetris en appelant la méthode init() de l'objet tetris
  }
})
//methode pour sauvegarder les données de jeu
function saveGameData (level, score, lines, time) {
  var gameData = {
    level: level,
    score: score,
    lines: lines,
    time: time
  } //objet pour stocker les données
  var existingData = JSON.parse(localStorage.getItem('gameData')) || [] //récuperer les données existantes
  existingData.push(gameData) //ajouter les nouvelles données
  if (existingData.length > 10) {
    //limiter le nombre entrées à une valeur maximale (par exemple, 10)
    existingData.shift() //supprimer la plus ancienne
  }
  localStorage.setItem('gameData', JSON.stringify(existingData)) //sauvegarder dans le localStorage
}
//Methode pour recommencer le jeu
document.addEventListener('DOMContentLoaded', function () {
  //
  const btnRestart = document.getElementById('restart') // sélection l'élément du DOM avec l'ID 'restart' et l'assigne à la variable btnRestart
  btnRestart.addEventListener('click', function () {
    //écouteur d'événements au clic sur le bouton restart
    saveGameData(tetris.level, tetris.score, tetris.lines, tetris.time)
    location.reload() //rafraichisser la page du jeu
  })
})
//methode utiliser pour retourner au page d'acceuil
function index () {
  return (window.location.href = 'index.html') // aller vers l'index.html
}
// Vérifie si la méthode eachdo n'est pas déjà définie pour les objets de type Array
if (!Array.prototype.eachdo) {
  // Si la méthode n'existe pas, l'ajoute au prototype de Array
  Array.prototype.eachdo = function (fn) {
    // Parcours chaque élément du tableau
    for (var i = 0; i < this.length; i++) {
      fn.call(this[i], i) // Appelle la fonction fn pour chaque élément du tableau, avec l'élément comme contexte et l'indice comme argument
    }
  }
}
// si la méthode remDup n'est pas déjà définie pour les objets de type Array
if (!Array.prototype.remDup) {
  Array.prototype.remDup = function () {
    // Si la méthode n'existe pas, l'ajoute au prototype de Array
    var temp = [] // tableau temporaire pour stocker les éléments uniques
    for (var i = 0; i < this.length; i++) {
      // Parcours chaque élément du tableau
      var bool = true // Initialise un booléen pour suivre si l'élément est unique
      for (var j = i + 1; j < this.length; j++) {
        // Parcours les éléments suivants dans le tableau
        if (this[i] === this[j]) {
          // si l'élément actuel est égal à un élément ultérieur
          bool = false // Si égal, marque le booléen comme faux (non unique)
        }
      }
      if (bool === true) {
        // Si l'élément est unique, l'ajoute au tableau temporaire
        temp.push(this[i])
      }
    }
    return temp // Retourne le tableau temporaire contenant des éléments uniques
  }
}
