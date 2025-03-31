let map, marker, autocomplete;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -19.8157, lng: -43.9542 }, // Belo Horizonte como padrão
        zoom: 12
    });

    marker = new google.maps.Marker({
        map: map,
    });

    // Configura o autocomplete para o campo de busca
    const input = document.getElementById("search");
    autocomplete = new google.maps.places.Autocomplete(input);

    // Vincula o autocomplete ao campo de texto
    autocomplete.addListener("place_changed", onPlaceChanged);
}

function onPlaceChanged() {
    const place = autocomplete.getPlace();

    if (!place.geometry) {
        return; // Se não encontrar um lugar, retorna
    }

    // Verifica se o lugar tem uma geometria associada
    if (place.geometry.viewport) {
        map.fitBounds(place.geometry.viewport); // Ajusta o mapa para o local encontrado
    } else {
        map.setCenter(place.geometry.location); // Ajusta o mapa para o local
        map.setZoom(17); // Aumenta o zoom
    }

    marker.setPosition(place.geometry.location); // Coloca o marcador no local encontrado
}

function searchLocation() {
    let address = document.getElementById("search").value;
    let geocoder = new google.maps.Geocoder();
    
    geocoder.geocode({ address: address }, function(results, status) {
        if (status === "OK") {
            map.setCenter(results[0].geometry.location);
            marker.setPosition(results[0].geometry.location);
            map.setZoom(17); // Aproxima o mapa para o endereço encontrado
        } else {
            alert("Endereço não encontrado: " + status);
        }
    });
}

window.onload = initMap;
