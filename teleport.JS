$(document).ready(function () {
    let cityData = [];
    let cityDataName = [];


    // debugger;

    $(".btn").click(function () {

        // console.log($("#cityInput").val());

        let city = $("#cityInput").val().toLowerCase().split(", ", 1);
        let city2 = city.toString(); 
        let city3 = city2.replace(" ", "-");
        let teleport = "https://api.teleport.org/api/urban_areas/slug:" + city3 + "/scores/";
        console.log(city3);

        $.ajax({
            url: teleport,
            method: "GET"
        }).then(function (response) {
            // console.log(response);

            for (let i = 0; i < response.categories.length; i++) {
                score = response.categories[i].score_out_of_10;
                score = score.toFixed();
                cityData.push(score);
                cityDataName.push(response.categories[i].name);
            };

            // console.log(cityData);

            let data = [{
                type: "bar",
                x: cityData,
                y: cityDataName,
                orientation: "h",
            }];

            let layout = {
                title: {
                  text:'',}};

            Plotly.newPlot("cityChart", data, layout);
        });

        let teleportImg = "https://api.teleport.org/api/urban_areas/slug:" + city3 + "/images/";
        $.ajax({
            url: teleportImg,
            method: "GET"
<<<<<<< HEAD
        }).then(function (imgresponse) {
            console.log(imgresponse);
            $("#picImg").attr("src", imgresponse.photos[0].image.mobile);
=======
        }).then(function(imgresponse){
            console.log(imgresponse); 
            $("#backgroundImage").attr("style", "background-image: url(" + imgresponse.photos[0].image.mobile + "); background-repeat: no-repeat; background-size: cover;");
>>>>>>> 22fdee7ab41e194e7adbc3436285cfd7446e0d5b
        })

    })


});
