$(document).ready(function(){
    function searchJobs(){
        let location= $("#cityInput").val();
        let category= $("#keywordInput").val(); 
        let theMuseApiKey="1f7d0ddf14cfd38dbdeeb9248ab3bff908d85e1bcc104a2a73cf76790d0c82eb";
        let theMuseURL="https://www.themuse.com/api/public/jobs?category="+category+"&location="+location+"&page=2&api_key="+theMuseApiKey; 
        
        console.log(theMuseURL); 
        console.log(location); 
        
        $.ajax({
            url: theMuseURL,
            method: "GET"
        }).then(function(response){
            console.log(response); 
            let results= response.results;
            console.log(results); 
            let jobCount=1; 
            for (let i=0; i<results.length; i++){
                let city= results[i].locations[0].name;
                console.log(city); 
                let jobEl=$("#job"+jobCount); 
                jobEl.find(".location").text(city); 
                jobEl.find(".position").text(results[i].name); 
                jobEl.find(".description").text(results[i].refs.landing_page);
                jobEl.find(".description").attr("href", results[i].refs.landing_page); 
                jobEl.find(".company").text(results[i].company.name); 
                jobEl.find(".qualifications").text(results[i].levels[0].name); 
                jobCount++; 
            } 
        }); 
    }
    
    $("#searchbtn").on("click", function(){
        event.preventDefault(); 
        searchJobs(); 
    }); 

}); 