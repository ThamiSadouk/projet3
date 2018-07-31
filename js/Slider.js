class Slider {
    constructor() {
        this.$prev = $(".prev");
        this.$next = $(".next");
        this.$innerWrap = $(".inner-wrapper");
        this.$slide = $(".slide");
        
        this.listenButtonClickEvents();
        this.listenButtonEventsKeypress()
    }

    listenButtonClickEvents() {
        /* lorsque je clique sur le prev bouton je vais viser la div innerWrap (enveloppe interne) et je vais l'animer en bougeant la position left de -100% à 0% sur une period de 300ms */
        this.$prev.on("click", () => {
            this.goToPreviousSlide();
        });

        this.$next.on("click", () => {
            this.goToNextSlide();
        });
    }

    goToPreviousSlide() {
        this.$innerWrap.animate({
            left: "0%"
        }, 300, () => {
            // lorsque l'animation se déclenche, on déclare la valeur de position left à -100%
            this.$innerWrap.css("left", "-100%");
            // on sélectionne le dernier slide qu'on place avant le premier slide
            $(".slide").first().before($(".slide").last());
        });
    }

    goToNextSlide() {
        this.$innerWrap.animate({
            left: "-200%"
        }, 300, () => {
            // lorsque l'animation se déclenche, on déclare la valeur de position left à 100%
            this.$innerWrap.css("left", "-100%");
            // on sélectionne le premier slide qu'on place arpès le dernier slide
            $(".slide").last().after($(".slide").first());
        });
    }
    
    // Event keydown 
    listenButtonEventsKeypress() {
        //  appeler l'event click des boutons next et prev pour naviquer dans le slider avec les touches directionnelles
        $(document).on("keydown", (e) => {
            let code = e.keyCode;
            if (code === 39) {
                this.goToNextSlide();
            }
            if (code === 37) {
                this.goToPreviousSlide();
            }
        });
    }
}