$(document).ready(function () {
    let cityData = [];
    let cityDataName = [];




    $("#searchbtn").click(function () {
        cityData = [];
        $("#cityChart").empty();

        let city = $("#cityInput").val().toLowerCase().split(", ", 1);
        let city2 = city.toString();
        let city3 = city2.replace(/ /g, "-");
        let teleport = "https://api.teleport.org/api/urban_areas/slug:" + city3 + "/scores/";
        let chartTitle = $("#cityInput").val();

        $.ajax({
            url: teleport,
            method: "GET"
        }).then(function (response) {


            for (let i = 0; i < response.categories.length; i++) {
                score = response.categories[i].score_out_of_10;
                score = score.toFixed();
                cityData.push(score);
                cityDataName.push(response.categories[i].name);
            };



            let data = [{
                y: cityData,
                x: cityDataName,
                type: "bar",
                text: cityData.map(String),
                textposition: 'auto',
                // orientation: "h",
            }];

            let layout = {
                title: 'Quality of Life Scores in ' + chartTitle,
                xaxis: {
                    tickangle: -45,
                    automargin: true,
                },
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
                width: 540,
                font: {
                    // found on http://fontcdn.org/
                    family: "'Sulphur Point', sans-serif",
                    size: "3rem"
                },
                hovermode: false,
            };

            Plotly.newPlot("cityChart", data, layout, {responsive: true});
        }).fail(function () {

            $("#cityChart").text($("#cityInput").val() + " isn't currently in our Database.");
            $("#cityChart").css("font-family", "Sulphur Point");
            $("#cityChart").css("font-size", "2.5rem");
        });

        let teleportImg = "https://api.teleport.org/api/urban_areas/slug:" + city3 + "/images/";
        $.ajax({
            url: teleportImg,
            method: "GET"
        }).then(function (imgresponse) {
            $("#backgroundImage").attr("style", "background-image: url(" + imgresponse.photos[0].image.mobile + "); background-repeat: no-repeat; background-size: cover;");
        })

    })


});
