$(document).ready(function () {
    let cityData = [];
    let cityDataName = [];


    // debugger;

    $(".btn").click(function () {
        cityData = [];
        // console.log($("#cityInput").val());

        let city = $("#cityInput").val().toLowerCase().split(", ", 1);
        let city2 = city.toString();
        let city3 = city2.replace(" ", "-");
        let teleport = "https://api.teleport.org/api/urban_areas/slug:" + city3 + "/scores/";
        let chartTitle = $("#cityInput").val();
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
                x: cityData,
                y: cityDataName,
                type: "bar",
                text: cityData.map(String),
                textposition: 'auto',
                orientation: "h",
            }];

            let layout = {
                title:'Quality of Life Scores in ' + chartTitle,
                yaxis: {
                    // tickangle: -45,
                    automargin: true,
                },
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
                width: 540,
            };

            Plotly.newPlot("cityChart", data, layout);
        });

        let teleportImg = "https://api.teleport.org/api/urban_areas/slug:" + city3 + "/images/";
        $.ajax({
            url: teleportImg,
            method: "GET"
        }).then(function (imgresponse) {
            console.log(imgresponse);
            $("#backgroundImage").attr("style", "background-image: url(" + imgresponse.photos[0].image.mobile + "); background-repeat: no-repeat; background-size: cover;");
        })

    })


});
