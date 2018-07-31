class Reservation {
    constructor() {
        this.timer = this.setTimer();
        this.clock = {
            min: 0,
            sec: 0
        };
        this.interval;
        
        // selection des éléments du DOM
        this.$min = $(".min");
        this.$sec = $(".sec");
        this.$bookingDetails = $("#booking-details");
        this.$addressSpan = $(".confirm-message span");
        this.addressBooked = "addressBooked";
        this.$canvas = $("#canvas");
        this.$address = $("#address")[0];
        this.$infosContainer = $(".infos-container");
        this.$infosStation = $("#infosStation");
        this.$selectStation = $("#selectStation");
        this.$infosTitle = $(".infos-container h2")
        this.$btnCancel = $("#btn-cancel-booking");
        
        this.getSession();
        this.cancelListener();
    }
    
    // Met en place le timer
    setTimer() {
        this.minParam = 20;
        this.counter = 0;
        this.timeLeft = this.minParam * 60;
    }

    convertSeconds(s) {
        return {
            min: Math.floor(s / 60), // la valeur minute correspond  au nb de secondes divisé par 60
            sec: s % 60 // la valeur seconde correspond au nb restant de la division par 60. ex : 122 / 60 => 2 sec restants 
        }
    }
    
    // Initialise le timer
    initTimer() {
        this.interval = setInterval(() => {
            this.counter++;
            this.clock = this.convertSeconds(this.timeLeft - this.counter)
            // assembler le résultat de la fonction converSeconds avec la valeur de la div timer
            sessionStorage.setItem("counterDownMin", this.clock.min);
            sessionStorage.setItem("counterDownSec", this.clock.sec);
            this.$min.text(this.clock.min + " minute(s) ");
            this.$sec.text(this.clock.sec + " seconde(s)");
            if (this.clock.min === 0 && this.clock.sec === 0) {
                this.$selectStation.show();
                this.setTimer();
                this.clearTimer();
                this.clearDisplay();
                this.notify();
            }
        }, 1000);
    }

    // en cas d'actualisation de la page 
    getSession() {
        if (sessionStorage.getItem("counterDownSec")) {
            this.$min.text(sessionStorage.getItem("counterDownMin") + " minute(s) ");
            this.$sec.text(sessionStorage.getItem("counterDownSec") + " seconde(s)");
            let minLeft = Number(sessionStorage.getItem("counterDownMin"));
            let secLeft = Number(sessionStorage.getItem("counterDownSec"));
            this.timeLeft = (minLeft * 60) + secLeft;
            this.$addressSpan.text(sessionStorage.getItem(this.addressBooked));
            this.initTimer();
            this.$bookingDetails.show();
        }
    }

    // indique à l'utilisateur lorsque la réservation est expirée
    notify() { 
        if (!("Notification" in window)) { // si le navigateur ne supporte pas 
            alert("Votre réservation a expirée");
        } else if (Notification.permission === "granted") {
            const notification = new Notification("Votre réservation a expirée !");
        } else if (Notification.permission !== "denied") { // 
            Notification.requestPermission(permission => {
                if ("permission" === "granted") { // si on autorise la notification
                    const notification = new Notification("Votre réservation a expirée !");
                } else {
                    alert("Votre réservation a expirée");
                }
            });
        }
    }

    display() {
        this.$bookingDetails.show();
        // sélection éléments du DOM qui renferment les données à sauvegarder
        sessionStorage.setItem(this.addressBooked, this.$address.textContent);
        this.$addressSpan.text(sessionStorage.getItem(this.addressBooked));
        this.initTimer();
    }

    clearTimer() {
        this.$min.empty();
        this.$sec.empty();
        clearInterval(this.interval);
        sessionStorage.clear();
        this.$infosContainer.show();
    }

    clearDisplay() {
        this.$infosStation.hide();
        this.$bookingDetails.hide();
        this.$selectStation.show();
        this.$infosTitle.show();
    }

    cancelListener() {
        this.$btnCancel.on("click", () => {
            this.clearTimer();
            this.clearDisplay();
            this.setTimer();
        });
    }
}