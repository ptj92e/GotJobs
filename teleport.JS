$(document).ready(function () {
    let cityData = [];
    let cityDataName = [];


    // debugger;

    $(".btn").click(function () {



        let city = "nashville";
        let teleport = "https://api.teleport.org/api/urban_areas/slug:" + city + "/scores/";

        $.ajax({
            url: teleport,
            method: "GET"
        }).then(function (response) {
            console.log(response);
            for (let i = 0; i < response.categories.length; i++) {
                score = response.categories[i].score_out_of_10;
                score = score.toFixed();
                cityData.push(score);
                cityDataName.push(response.categories[i].name);
            };
            
            console.log(cityData);
            
            let data = [{
                type: "bar",
                x: cityData,
                y: cityDataName,
                orientation: "h",
                
            }];
    
            Plotly.newPlot("cityChart", data);
        });

        
        
    });
});

