var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = 950;
        this.canvas.height = 900;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.background = new Image();
        this.background.src = 'autostrada.png'; // Carica l'immagine di sfondo
        this.backgroundY = 0; // Posizione iniziale dello sfondo
        this.interval = setInterval(updateGameArea, 20);  // Aggiorna la scena ogni 20 ms (50 fps)
    },
    draw: function(component) {
        // Disegna lo sfondo che si muove
        this.context.drawImage(this.background, 0, this.backgroundY, this.canvas.width, this.canvas.height); // Parte superiore
        this.context.drawImage(this.background, 0, this.backgroundY - this.canvas.height, this.canvas.width, this.canvas.height); // Parte inferiore

        // Disegna l'auto sopra lo sfondo
        this.context.drawImage(component.image, component.x, component.y, component.width, component.height);
    },
    clearCanva: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);  // Pulisce la scena
    }
};

var CarObject = {
    speedX: 0,
    speedY: 0,
    width: 110,
    height: 190,
    x: 130,
    y: 120,
    image: new Image(), // Carica un'immagine singola per l'auto

    loadImages: function() {
        var self = this;
        this.image.src = 'macchinaP.png'; // Carica l'immagine dell'auto (sostituisci con il percorso corretto)
        this.image.onload = function() {
            startGame();
        };
    },

    update: function() {
        this.tryY = this.y + this.speedY;
        this.tryX = this.x + this.speedX;

        // Aggiorna le coordinate solo se non sono fuori dai bordi del canvas
        if (this.tryX >= 0 && this.tryX + this.width <= myGameArea.canvas.width) {
            this.x = this.tryX;
        }
        if (this.tryY >= 0 && this.tryY + this.height <= myGameArea.canvas.height) {
            this.y = this.tryY;
        }
    }
};

// Funzione per aggiornare la posizione e ridisegnare la scena
function updateGameArea() {
    myGameArea.clearCanva();
    
    // Scorrimento dello sfondo
    myGameArea.backgroundY += 100;  // Imposta la velocità di scorrimento dello sfondo
    if (myGameArea.backgroundY >= myGameArea.canvas.height) {
        myGameArea.backgroundY = 0; // Riposiziona lo sfondo quando arriva alla fine
    }

    CarObject.update();
    myGameArea.draw(CarObject); // Disegna l'auto sopra lo sfondo
}

// Funzione per iniziare il gioco
function startGame() {
    myGameArea.start();
}

// Funzione per gestire l'input della tastiera
function controlCar(event) {
    switch (event.key) {
        case 'ArrowUp':
            CarObject.speedY = -5;  // Muovi verso l'alto
            break;
        case 'ArrowDown':
            CarObject.speedY = 5;  // Muovi verso il basso
            break;
        case 'ArrowLeft':
            CarObject.speedX = -5;  // Muovi verso sinistra
            break;
        case 'ArrowRight':
            CarObject.speedX = 5;  // Muovi verso destra
            break;
    }
}

// Funzione per fermare l'auto quando le frecce vengono rilasciate
function stopCar(event) {
    if (event.key == 'ArrowUp' || event.key == 'ArrowDown') {
        CarObject.speedY = 0;
    }
    if (event.key == 'ArrowLeft' || event.key == 'ArrowRight') {
        CarObject.speedX = 0;
    }
}

// Ascolta gli eventi della tastiera per muovere l'auto
window.addEventListener('keydown', controlCar);
window.addEventListener('keyup', stopCar);

// Avvia il gioco
CarObject.loadImages();
