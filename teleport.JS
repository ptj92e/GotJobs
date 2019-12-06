$(document).ready(function () {
    let cityData = [];
    let cityDataName = [];


    // debugger;

    $(".btn").click(function () {



        let city = "nashville";
        let teleport = "https://api.teleport.org/api/urban_areas/slug:" + city + "/scores/";
        let teleportImg="https://api.teleport.org/api/urban_areas/slug:"+city+"/images/";
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

      
        })

        $.ajax({
            url: teleportImg,
            method: "GET"
        }).then(function(imgresponse){
            console.log(imgresponse); 
            $("#picImg").attr("src", imgresponse.photos[0].image.mobile);
        })

    });
});

function getMap(){
    let mapquestUrl="https://open.mapquestapi.com/staticmap/v5/map?key="+mapquestApiKey+"&center="+searchLocation+"&size=600,400@2x"
    
}