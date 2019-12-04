$(document).ready(function () {
    let city = "nashville";
    let teleport = "https://api.teleport.org/api/urban_areas/slug:" + city + "/scores/";

    $.ajax({
        url: teleport,
        method: "GET"
    }).then(function (response) {
        console.log(response);
    })
});

