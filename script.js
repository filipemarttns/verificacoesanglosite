let map, marker, autocomplete;
let kmzUrls = {
    mina_cuiaba: 'https://drive.google.com/uc?export=download&id=1gHnX2piAX9wBXQ9K1Z5pGUPJYukuvQj2',  
    mina_lamego: 'https://drive.google.com/uc?export=download&id=1ipjcVyBNdsXaPK1WrgM4s1_v3OZdUjrI',     
    mina_queiroz: 'https://drive.google.com/uc?export=download&id=1cq8x4SznjPVtKt_QjXYxT6PdrBUbZEq1'  
};

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -19.8157, lng: -43.9542 },
        zoom: 12,
    });

    marker = new google.maps.Marker({
        map: map,
    });

    const input = document.getElementById("search");
    autocomplete = new google.maps.places.Autocomplete(input);
    autocomplete.addListener("place_changed", onPlaceChanged);
}

function onPlaceChanged() {
    const place = autocomplete.getPlace();
    if (!place.geometry) return;
    if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport);
    } else {
        map.setCenter(place.geometry.location);
        map.setZoom(17);
    }
    marker.setPosition(place.geometry.location);
}

function searchLocation() {
    let address = document.getElementById("search").value;
    let geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: address }, function (results, status) {
        if (status === "OK") {
            map.setCenter(results[0].geometry.location);
            marker.setPosition(results[0].geometry.location);
            map.setZoom(17);
        } else {
            alert("Endereço não encontrado: " + status);
        }
    });
}

function startMap(mina) {
    document.getElementById("intro-screen").style.display = "none";
    document.getElementById("map-screen").style.display = "block";
    initMap();
    loadKMZ(kmzUrls[mina]);  // Carrega o KMZ correspondente ao botão clicado
}

function loadKMZ(kmzUrl) {
    const kmzLayer = new google.maps.KmlLayer({
        url: kmzUrl,
        map: map,
        suppressInfoWindows: true,  // Para não mostrar janelas de info
    });
}
