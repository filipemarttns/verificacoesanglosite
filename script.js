let map, marker, autocomplete;
let userLocation = null;

const kmzFiles = {
    mina_cuiaba: "https://drive.google.com/uc?export=download&id=1gHnX2piAX9wBXQ9K1Z5pGUPJYukuvQj2",
    mina_lamego: "https://drive.google.com/uc?export=download&id=1ipjcVyBNdsXaPK1WrgM4s1_v3OZdUjrI",
    mina_queiroz: "https://drive.google.com/uc?export=download&id=1cq8x4SznjPVtKt_QjXYxT6PdrBUbZEq1"
};

window.onload = () => {
    document.getElementById("intro-screen").style.display = "flex";
    document.getElementById("map-screen").style.display = "none";

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
            },
            () => {
                console.warn("Usuário negou a geolocalização ou ocorreu um erro. Usando posição padrão.");
            }
        );
    } else {
        console.warn("Geolocalização não suportada pelo navegador.");
    }
};

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: userLocation || { lat: -19.8157, lng: -43.9542 },
        zoom: userLocation ? 17 : 12,
        gestureHandling: "greedy",
        styles: [
            { featureType: "poi", stylers: [{ visibility: "off" }] },
            { featureType: "transit", stylers: [{ visibility: "off" }] }
        ]
    });

    marker = new google.maps.Marker({ 
        map: map,
        animation: google.maps.Animation.DROP,
        icon: {
            url: "passageiro.png",
            scaledSize: new google.maps.Size(45, 45) 
        }
    });

    if (userLocation) {
        marker.setPosition(userLocation);
    }

    const input = document.getElementById("search");
    autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener("place_changed", onPlaceChanged);
}

function onPlaceChanged() {
    const place = autocomplete.getPlace();
    if (!place.geometry) return;

    map.panTo(place.geometry.location);
    map.setZoom(17);
    marker.setPosition(place.geometry.location);
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(() => marker.setAnimation(null), 1500);
}

function searchLocation() {
    let address = document.getElementById("search").value;
    let geocoder = new google.maps.Geocoder();

    geocoder.geocode({ address: address }, function (results, status) {
        if (status === "OK") {
            map.panTo(results[0].geometry.location);
            marker.setPosition(results[0].geometry.location);
            marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(() => marker.setAnimation(null), 1500);
            map.setZoom(17);
        } else {
            alert("Endereço não encontrado: " + status);
        }
    });
}

function startMap(mineName) {
    document.getElementById("intro-screen").style.opacity = "1";
    document.getElementById("intro-screen").style.transition = "opacity 1s ease-out";
    document.getElementById("intro-screen").style.opacity = "0";
    setTimeout(() => {
        document.getElementById("intro-screen").style.display = "none";
        document.getElementById("map-screen").style.display = "block";
        document.getElementById("map-screen").style.opacity = "0";
        document.getElementById("map-screen").style.transition = "opacity 1s ease-in";
        document.getElementById("map-screen").style.opacity = "1";
        initMap();
        
        const kmzUrl = kmzFiles[mineName];
        if (kmzUrl) {
            loadKMZ(kmzUrl);
        } else {
            alert("Arquivo KMZ não encontrado para esta mina.");
        }
    }, 1000);
}

function loadKMZ(kmzUrl) {
    const kmzLayer = new google.maps.KmlLayer({
        url: kmzUrl,
        map: map,
        preserveViewport: true,
        suppressInfoWindows: true,
    });

    google.maps.event.addListener(kmzLayer, 'click', function (event) {
        const name = event.featureData.name;
        const infoWindow = new google.maps.InfoWindow({
            content: `<div style="font-weight:bold; padding:10px; transition: opacity 0.5s ease-in-out;">${name}</div>`,
            position: event.latLng
        });
        infoWindow.open(map);
        setTimeout(() => infoWindow.setContent(`<div style="opacity: 0.7;">${name}</div>`), 1000);
    });
}
