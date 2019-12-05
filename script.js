let searchLocation="";
let theMuseApiKey="1f7d0ddf14cfd38dbdeeb9248ab3bff908d85e1bcc104a2a73cf76790d0c82eb";
let page= 1; 
let ongoingJobCount=0; 

let category=""; 

$(document).ready(function(){

    function populateJobPostCards(initial, response){
        let results= response.results;
        let jobCount=1;
        for (let i=initial; i<results.length; i++){
            let jobEl=$("#job"+jobCount); 
            jobEl.find(".location").text(results[i].locations[0].name); 
            jobEl.find(".position").text(results[i].name); 
            jobEl.find(".description").text(results[i].refs.landing_page);
            jobEl.find(".description").attr("href", results[i].refs.landing_page); 
            jobEl.find(".company").text(results[i].company.name); 
            jobEl.find(".qualifications").text(results[i].levels[0].name); 
            jobCount++; 
            ongoingJobCount++; 
            if(jobCount > 5){
                break; 
            }
        }
        console.log("You are currently on the " +ongoingJobCount+ " job posting"); 
    }
  
    let isMessageHidden= true; 

    function clearJobPosts(){
        $(".location").text(""); 
        $(".position").text("");
        $(".description").text("");
        $(".description").attr("href", "");
        $(".company").text("");
        $(".qualifications").text("");
    }

    function searchJobs(){
        searchLocation= $("#cityInput").val();
        category= $("#keywordInput").val(); 
        let theMuseURL="https://www.themuse.com/api/public/jobs?category="+category+"&location="+searchLocation+"&page=1&api_key="+theMuseApiKey; 

        $.ajax({
            url: theMuseURL,
            method: "GET"
        }).then(function(response){  
            page=1; 
            ongoingJobCount=0; 
            populateJobPostCards(0, response);     
        }); 
    }

    function moreJobs(){
        // let location= $("#cityInput").val();
        // let category= $("#keywordInput").val(); 
        if (ongoingJobCount === 20){
            page++;
            ongoingJobCount=0; 
        }
        console.log("The last listed job is #" + ongoingJobCount+"and the page searched is "+page)      
        let theMuseURL="https://www.themuse.com/api/public/jobs?category="+category+"&location="+searchLocation+"&page="+page+"&api_key="+theMuseApiKey; 

        $.ajax({
            url: theMuseURL,
            method: "GET"
        }).then(function(response){
            populateJobPostCards(ongoingJobCount, response); 
        }); 

    }  
    
    $("#searchbtn").on("click", function(){
        event.preventDefault(); 
        searchJobs(); 
    }); 

    $("#morebtn").on("click", function(){
        event.preventDefault(); 
        moreJobs(); 
    }); 

}); 