let map, marker, autocomplete;

const kmzFiles = {
    mina_cuiaba: "https://drive.google.com/uc?export=download&id=1gHnX2piAX9wBXQ9K1Z5pGUPJYukuvQj2",
    mina_lamego: "https://drive.google.com/uc?export=download&id=1ipjcVyBNdsXaPK1WrgM4s1_v3OZdUjrI",
    mina_queiroz: "https://drive.google.com/uc?export=download&id=1cq8x4SznjPVtKt_QjXYxT6PdrBUbZEq1"
};

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -19.8157, lng: -43.9542 },
        zoom: 12,
    });

    marker = new google.maps.Marker({ map: map });

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

function startMap(mineName) {
    document.getElementById("intro-screen").style.display = "none";
    document.getElementById("map-screen").style.display = "block";

    initMap();
    
    const kmzUrl = kmzFiles[mineName];
    if (kmzUrl) {
        loadKMZ(kmzUrl);
    } else {
        alert("Arquivo KMZ não encontrado para esta mina.");
    }
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
            content: `<strong>${name}</strong>`,
            position: event.latLng
        });
        infoWindow.open(map);
    });

    google.maps.event.addListener(kmzLayer, 'mouseover', function (event) {
        const lineStyle = {
            strokeColor: '#D35400', 
            strokeOpacity: 1.0, 
            strokeWeight: 4 
        };
        kmzLayer.setOptions({ styles: [lineStyle] });
    });

    google.maps.event.addListener(kmzLayer, 'mouseout', function (event) {
        const lineStyle = {
            strokeColor: '#FFA500',
            strokeOpacity: 0.8, 
            strokeWeight: 2 
        };
        kmzLayer.setOptions({ styles: [lineStyle] });
    });
}


window.onload = () => {
    document.getElementById("intro-screen").style.display = "flex";
    document.getElementById("map-screen").style.display = "none";
};
