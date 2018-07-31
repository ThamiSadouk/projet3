class Canvas {
    constructor(reservation) {
        this.reservation = reservation;
        this.$canvas = $("#canvas");
        this.ctx = this.$canvas[0].getContext("2d");
        this.position = {
            x: 0,
            y: 0
        };
        this.drawing = false;
        this.hasBeenSigned = false;
        this.btnCancel = $(".btn-cancel");
        this.btnErase = $(".btn-erase");
        this.btnAccept = $(".btn-accept");
        this.$infosContainer = $(".infos-container");
        this.$canvasContainer = $(".canvas-container");
        
        this.listenMouseEvents();
        this.listenTouchEvents();
        this.cancelListener();
        this.eraseListener();
        this.bookListener();
    }

    // initialise le tracer
    init() {
        if (this.drawing) {
            this.ctx.lineTo(this.position.x, this.position.y);
            this.ctx.stroke();
            this.ctx.beginPath(); // mousedown s'exécutera ici
            this.ctx.moveTo(this.position.x, this.position.y);
        }
    }
    
    // évènements souris
    listenMouseEvents() {
        this.$canvas.on("mousedown", (e) => {
            this.drawing = true;
            this.position = this.getMousePos(e);
            this.init();
        });

        this.$canvas.on("mousemove", (e) => {
            this.position = this.getMousePos(e);
            this.init();
        });

        this.$canvas.on("mouseup", (e) => {
            this.drawing = false;
            this.ctx.beginPath(); // ouvre un chemin pour pouvoir éviter de créer un tracé avec le dernier point
            this.hasBeenSigned = true;
        });
    }

    // Obtient la position de mouseEvent relative au canvas
    getMousePos(mouseEvent) {
        return {
            x: mouseEvent.offsetX,
            y: mouseEvent.offsetY
        };
    }
    
    // évènements touch
    listenTouchEvents() {
        this.$canvas.on("touchstart", (e) => { 
            this.drawing = true;
            this.position = this.getTouchPos(e);
            this.init();
        })

        this.$canvas.on("touchmove", (e) => {
            this.position = this.getTouchPos(e);
            this.init(); 
        })

        this.$canvas.on("touchend", (e) => {
            this.drawing = false; 
            this.ctx.beginPath(); 
            this.hasBeenSigned = true;
        });
    }

    // Obtient la position de touchEvent relative au canvas
    getTouchPos(touchEvent) {
        let rect = this.$canvas[0].getBoundingClientRect();
        return {
            x: touchEvent.touches[0].clientX - rect.left,
            y: touchEvent.touches[0].clientY - rect.top
          };
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.$canvas[0].width, this.$canvas[0].height);
    }
    
    // on rétablit les détails de station
    cancelListener() { 
        this.btnCancel.on("click", () => {
            this.$canvasContainer.hide();
            this.$infosContainer.show();
            this.clearCanvas()
        });
    }

    eraseListener() {
        this.btnErase.on("click", () => {
            this.clearCanvas();
        });
    }

    bookListener() {
        this.btnAccept.on("click", () => {
            if (this.hasBeenSigned !== true) {
                alert("Vous devez signez pour compléter votre réservation")
            } else {
                this.hasBeenSigned = false;
                this.$canvasContainer.hide();
                // supprime les données sauvegardées précédemment 
                sessionStorage.clear();
                this.clearCanvas();
                this.reservation.clearTimer();
                // active Timer
                this.reservation.setTimer();
                this.reservation.display();
                // ancre
                $("#accept").attr("href", "#booking-details");
            }
        });
    }
}