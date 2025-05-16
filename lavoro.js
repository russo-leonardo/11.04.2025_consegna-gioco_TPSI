let scroll_velocita = 10;  // Velocità iniziale di scorrimento
let cont = 0;  // Contatore per tenere traccia dei cicli


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
    x: 422,
    y: 600,
    image: new Image(), // Carica un'immagine singola per l'auto


    loadImages: function() {
        this.image.src = 'macchinaP.png'; // Carica l'immagine dell'auto
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


var BucObject = {
    width: 100,
    height: 100,
    x: Math.random() * (myGameArea.canvas.width - 50),  // Posizione iniziale casuale
    y: -50,  // Inizia sopra il canvas
    image: new Image(), // Carica l'immagine della buca


    loadImage: function() {
        this.image.src = 'buca.png'; // Carica l'immagine della buca
    },


    update: function() {
        this.y += scroll_velocita * 0.8; // La buca si sposta più velocemente in base alla velocità dello sfondo
       
        // Se la buca esce dal canvas, la ricreiamo in una posizione casuale sopra il canvas
        if (this.y > myGameArea.canvas.height) {
            this.x = Math.random() * (myGameArea.canvas.width - this.width); // Nuova posizione casuale
            this.y = -this.height;  // Riposiziona sopra il canvas
        }
    },


    checkCollision: function(car) {
        // Controlla se la buca tocca l'auto (collisione semplice)
        if (car.x < this.x + this.width &&
            car.x + car.width > this.x &&
            car.y < this.y + this.height &&
            car.y + car.height > this.y) {
            // Collisione, fai qualcosa (per esempio cambia schermata)
            window.location.href = "game_over.html"; // Redirige a una nuova pagina
        }
    },


    draw: function() {
        myGameArea.context.drawImage(this.image, this.x, this.y, this.width, this.height); // Disegna la buca
    }
};
console.log(scroll_velocita);


// Funzione per aggiornare la posizione e ridisegnare la scena
function updateGameArea() {
    myGameArea.clearCanva();
    cont++;  // Incrementa il contatore di ciclo


    // Modifica la velocità di scorrimento ogni 50 cicli, se il contatore è sotto 500
    if (cont % 50 === 0 && cont < 500) {
        scroll_velocita += 0.8;  // Aumenta la velocità di scorrimento
    }


 
    // Scorrimento dello sfondo con la velocità aggiornata
    myGameArea.backgroundY += scroll_velocita;  
    if (myGameArea.backgroundY >= myGameArea.canvas.height) {
        myGameArea.backgroundY = 0; // Riposiziona lo sfondo quando arriva alla fine
    }


    // Aggiorna e disegna l'auto
    CarObject.update();
    myGameArea.draw(CarObject);


    // Aggiorna la buca e verifica la collisione
    BucObject.update();
    BucObject.checkCollision(CarObject); // Controlla se c'è collisione con l'auto
    BucObject.draw();  // Disegna la buca
}


// Funzione per iniziare il gioco
function startGame() {
    myGameArea.start();
}


// Funzione per gestire l'input della tastiera
function controlCar(event) {
    switch (event.key) {
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
    if (event.key == 'ArrowLeft' || event.key == 'ArrowRight') {
        CarObject.speedX = 0;
    }
}


// Ascolta gli eventi della tastiera per muovere l'auto
window.addEventListener('keydown', controlCar);
window.addEventListener('keyup', stopCar);


// Avvia il gioco
CarObject.loadImages();
BucObject.loadImage();



