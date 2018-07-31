class Map {
    constructor() {
        this.map = this.initMap();
        this.btnBook = $(".book");
        this.infosContainer = $(".infos-container");
        this.canvasContainer = $(".canvas-container");
        this.markers = [];

        this.getDatas();
    }

    // déclaration de la methode initMap pour définir la carte
    initMap() {
        // Map options
        const options = {
            zoom: 14,
            center: {
                lat: 45.764043,
                lng: 4.835659
            }
        };
        // New map
        const map = new google.maps.Map(document.getElementById('map'), options);

        return map;
    }
    
    // get stationsDatas
    getDatas() {
        // creation d'une requete GET pour l'API JC Decaux
        ajaxGet("https://api.jcdecaux.com/vls/v1/stations?contract=Lyon&apiKey=e417c28cf423d1a3f9da21fdf77c5bbcd5b96cfe", (reponse) => {
            const stations = JSON.parse(reponse);
            stations.forEach((station) => {
                this.createMarker(station);
            });
            // markerCluster 
            const markerCluster = new MarkerClusterer(this.map, this.markers, {
                imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'
            });
        });
    }
    
    // mise en place des markers sur la carte
    createMarker(station) {
        const marker = new google.maps.Marker({
            position: new google.maps.LatLng(station.position.lat, station.position.lng),
            map: this.map,
            icon: '../projet3/images/biker.png'
        });
        this.markers.push(marker);

        this.createMarkerEvent(station, marker);
    }

    createMarkerEvent(station, marker) {
        marker.addListener("click", () => {
            this.getMarkerInfos(station);
        });
    }

    // Récupération des données nom et adresse
    getMarkerInfos(station) {
        const status = station.status;
        const availableBikes = station.available_bikes;
        const availableBikeStands = station.available_bike_stands;
        const address = station.address;
        this.displayMarkerInfos(name, status, availableBikes, availableBikeStands, address);
    }

    // Affichage des données de la station sélectionnée
    displayMarkerInfos(name, status, availableBikes, availableBikeStands, address) {
        $("#status, #infosStation p").empty();
        $("#selectStation").hide();
        $("#infosStation").show();
        // Etat de la station
        $("#status").text(status);
        if (status === "OPEN") {
            $("#status").css("color", "#789d4a");
        } else if (status === "CLOSED") {
            $("#status").css("color", "#E54B4B");
        }
        //  Nombre de vélos dispo
        $("#availableBikes").text((availableBikes || availableBikes === 0) ? availableBikes : "non communiqué");
        if (availableBikes <= 0) {
            $("#availableBikes").css("color", "red");
        } else {
            $("#availableBikes").removeAttr("style");
        }
        // Nombre d'emplacements dispo
        $("#availableBikeStands").text((availableBikeStands || availableBikes === 0) ? availableBikeStands : "non communiqué");
        // Lieu station
        $("#address").text(address ? address : "non communiqué");

        this.checkDatas(status, availableBikes);
        this.displayCanvas();
    }

    // vérification du statut et du nb de vélos dispo
    checkDatas(status, availableBikes) {
        if ((status === "CLOSED") || (availableBikes <= 0)) {
            this.btnBook.prop("disabled", true);
        } else {
            this.btnBook.prop("disabled", false);
        }
    }

    // affiche le canvas lorsqu'on clique sur le bouton "réserver"
    displayCanvas() {
        this.btnBook.on("click", () => {
            this.infosContainer.hide();
            this.canvasContainer.show();
        });
    }
}