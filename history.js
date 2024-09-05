//création de l'élement audio
var audio = new Audio()
//Fonction pour jouer la musique
function jouerMusique (src) {
  audio.src = src
  audio.play()
}
//Fonction pour arrêter la musique
function arreterMusique () {
  audio.pause()
  audio.currentTime = 0
}

jouerMusique('AMV.mp3')//pour jouer la musique

var data = JSON.parse(localStorage.getItem('gameData')) //pour récuperer la valeur dans localStorage par clé
var table = document.createElement('table') //création de tableau à partir de variable
var thead = document.createElement('thead') //création de header du tableau
var tbody = document.createElement('tbody') //création de body du tableau
var headerRow = document.createElement('tr') //création de row de la header
//header de player
var headerCell0 = document.createElement('th')
headerCell0.textContent = 'Player'
//header de level
var headerCell1 = document.createElement('th')
headerCell1.textContent = 'Level'
//header de la score
var headerCell2 = document.createElement('th')
headerCell2.textContent = 'Score'
//header de la lines
var headerCell3 = document.createElement('th')
headerCell3.textContent = 'Lines'
//header de la time
var headerCell4 = document.createElement('th')
headerCell4.textContent = 'Time'
//ajout de la header à la row de header
headerRow.appendChild(headerCell0)
headerRow.appendChild(headerCell1)
headerRow.appendChild(headerCell2)
headerRow.appendChild(headerCell3)
headerRow.appendChild(headerCell4)
thead.appendChild(headerRow) //ajout de headerRow à la thead
for (var key in data) {
  //pour itérer sur les propriétés de l'objet "data"
  if (data.hasOwnProperty(key)) {
    // vérification si l'objet possède la propriété "obj"
    //ajout des valeurs colone par colone
    var row = document.createElement('tr')
    //pour le numero de player
    var cell0 = document.createElement('td')
    cell0.textContent = Number(key) + 1 // converter le key en nombre
    //pour lines
    var cell1 = document.createElement('td')
    cell1.textContent = data[key].level
    //pour score
    var cell2 = document.createElement('td')
    cell2.textContent = data[key].score
    //pour lines
    var cell3 = document.createElement('td')
    cell3.textContent = data[key].lines
    //pour time
    var cell4 = document.createElement('td')
    cell4.textContent = data[key].time + ' second'
    //tester les valeurs en console s'il existe ou pas
    console.log(data[key].level) //pour level
    console.log(data[key].score) //pour score
    console.log(data[key].lines) //pour lines
    console.log(data[key].time) //pour time
    //ajout les valeurs en une ligne
    row.appendChild(cell0)
    row.appendChild(cell1) // pour la colonne 1
    row.appendChild(cell2) // pour la colonne 2
    row.appendChild(cell3) //   pour la colonne 3
    row.appendChild(cell4) // pour la colonne 4
    //ajout la ligne au body
    tbody.appendChild(row)
    //ajout de la tête et le body à la table
    table.appendChild(thead)
    table.appendChild(tbody)
    document.body.appendChild(table) //ajout du table à la page
  }
}
//methode utiliser pour retourner au page d'acceuil
function index () {
  arreterMusique();//Pour arrêter la musique à moment donné
  return (window.location.href = 'index.html') // aller vers
}
//methode pour retourner au page de jeu
function run () {
  arreterMusique();//Pour arrêter la musique à moment donné
  return (window.location.href = 'game.html')
}
