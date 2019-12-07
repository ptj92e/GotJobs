let searchLocation="";
let theMuseApiKey="1f7d0ddf14cfd38dbdeeb9248ab3bff908d85e1bcc104a2a73cf76790d0c82eb";
let mapquestApiKey="jOoSJlKWI2v4lP46nMd8fKQ8SdfGXJkI"; 
let page= 1; 
let ongoingJobCount=0; 
let category=""; 
let isLastResult= false; 
let isMessageHidden=true; 
let savedJobs;
let level=""; 
let lowercase="abcdefghijklmnopqrstuvwxyz";

$(document).ready(function(){

    let messageSorry={h3: "Sorry!",
                        p1: "Your search resulted in no job postings.",
                        p2:""};

    let messageError={h3: "Input Error!",
                        p1: "Make sure you enter the location as the full city name, state abbreviation.",
                        p2: "For example: Nashville, TN"};

    let messageNoCategory= {h3: "Input Error!",
                        p1: "You need to select a job type from the dropdown list.",
                        p2: ""};

    function addButtons(){
        let jobCardEls=$(".job").children(); 
        for (let i=0; i<jobCardEls.length; i++){
            let newDiv=$("<div>");
            newDiv.addClass("jobsavebuttonbox d-flex justify-content-center");
            let newButton= $("<button>"); 
            newButton.attr("class", "save btn"); 
            newButton.text("Save"); 
            $(newDiv).append(newButton); 
            $(jobCardEls[i]).append(newDiv); 
        }
    }

    function populateJobPostCards(initial, response){
        if (!isMessageHidden) {
            $("#message").hide(); 
            isMessageHidden=true;   
        } 
        let results= response.results;
        let jobCount=1;
        $(".job").show(); 
        let difference= results.length-ongoingJobCount; 
        if (difference !== 0 & !isLastResult){
            if (difference<5){
                let startOfBlanks= difference+ 1;
                while (startOfBlanks <6){
                    $("#job"+startOfBlanks).parent().hide();
                    startOfBlanks++; 
                }
                isLastResult=true; 
            }
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
        } else {  
            console.log("There are no results"); 
            $("#message").removeAttr("hidden"); 
            $("#message").show(); 
            $("#message").find("h3").text(messageSorry.h3);
            $("#message").find("#p-one").text(messageSorry.p1);
            $("#message").find("#p-two").text(messageSorry.p2);
            isMessageHidden=false; 
            $(".job").hide(); 
        }
    }
  
    function formatInput(input){
        if (input === level){
            input=input.replace(/ /g, "-");
        } else {
            input=input.replace(/ /g, "%20");
        }
        input= input.replace(/,/g, "%2C");
        input= input.replace(/&/g, "%26");
        return input; 
    }

    function searchJobs(){
        searchLocation= $("#cityInput").val().trim();
        searchLocation= formatInput(searchLocation); 
        console.log(searchLocation);
        category = $("#jobOptions").val().replace(/ /g, "%20"); 
        category= formatInput(category); 
        console.log(category); 
        level= $("#experienceOptions").val();
        level= formatInput(level); 
        console.log(level); 
        let theMuseURL="https://www.themuse.com/api/public/jobs?category="+category+"&location="+searchLocation+"&page=1&api_key="+theMuseApiKey; 
        console.log("The value of experience Options is", $("#experienceOptions").val());
        if ($("#experienceOptions").val() !== "Experience Level"){
            theMuseURL="https://www.themuse.com/api/public/jobs?category="+category+"&location="+searchLocation+"&level="+level+"&page=1&api_key="+theMuseApiKey; 
            console.log("added level into search url"); 
        }
        console.log(theMuseURL); 
        isLastResult=false; 
        $.ajax({
            url: theMuseURL,
            method: "GET"
        }).then(function(response){  
            page=1; 
            ongoingJobCount=0; 
            populateJobPostCards(0, response); 
            alertInput();     
        }); 
    }

    function moreJobs(){
        if (ongoingJobCount === 20){
            page++;
            ongoingJobCount=0; 
        }
        console.log("The last listed job is #" + ongoingJobCount+"and the page searched is "+page)      
        let theMuseURL="https://www.themuse.com/api/public/jobs?category="+category+"&location="+searchLocation+"&page="+page+"&api_key="+theMuseApiKey; 
        if ($("#experienceOptions").val() !== "Experience Level"){
            theMuseURL="https://www.themuse.com/api/public/jobs?category="+category+"&location="+searchLocation+"&level="+level+"&page=1&api_key="+theMuseApiKey; 
            console.log("added level into search url"); 
        }

        $.ajax({
            url: theMuseURL,
            method: "GET"
        }).then(function(response){
            populateJobPostCards(ongoingJobCount, response); 
        }); 

    }  

    function backJobs(){ 
        if(ongoingJobCount >5 || page >1){
            ongoingJobCount -= 10;
            if (ongoingJobCount <0 && page>1){
                    ongoingJobCount = 15; 
                    page--; 
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
        
    }

    function getMap(){
        let mapquestUrl="https://open.mapquestapi.com/staticmap/v5/map?key="+mapquestApiKey+"&center="+searchLocation+"&size=600,400@2x"
        $("#mapImg").attr("src", mapquestUrl); 
    }
    
    function alertInput(){
        if (!isMessageHidden){
            let cityInput=$("#cityInput").val().trim(); 
            cityInputArr= cityInput.split(", ");
            console.log(cityInputArr);
            if (cityInputArr.length !==2 || cityInputArr[1].length !== 2){
                $("#message").find("h3").text(messageError.h3);
                $("#message").find("#p-one").text(messageError.p1);
                $("#message").find("#p-two").text(messageError.p2); 
            } else if (lowercase.indexOf(cityInputArr[1][0]) !== -1 || lowercase.indexOf(cityInputArr[1][1]) !== -1){
                $("#message").find("h3").text(messageError.h3);
                $("#message").find("#p-one").text(messageError.p1);
                $("#message").find("#p-two").text(messageError.p2); 
            } else if ($("#jobOptions").val()==="Please Select an Option"){
                $("#message").find("h3").text(messageNoCategory.h3);
                $("#message").find("#p-one").text(messageNoCategory.p1);
                $("#message").find("#p-two").text(messageNoCategory.p2); 
            }  
        }
    }

    function getHistory(){
        savedJobs=JSON.parse(localStorage.getItem("savedJobs")); 
        if (savedJobs===null){
            savedJobs=[]; 
        }
    }

    function addLocalStorage(newJobObject){
        savedJobs.push(newJobObject); 
        localStorage.setItem("savedJobs", JSON.stringify(savedJobs)); 
        console.log(savedJobs); 
    }

    function compareHistoryAndSave(newJobObject){
        getHistory();  
        let isUnique=false; 
        for (let i=0; i<savedJobs.length; i++){
            if (savedJobs[i].description===newJobObject.description){
                isUnique=false; 
                break; 
            } else {
                isUnique= true; 
            }
        }
        if (savedJobs.length===0){
            isUnique=true; 
        }
        if (isUnique){
            addLocalStorage(newJobObject); 
            console.log("saving job"); 
        } else {
            console.log("job already saved"); 
        }
        addJobCardtoCarousel(newJobObject); 
    }

    function saveJob(jobEl){
        debugger; 
        console.log(jobEl); 
        let x=jobEl.find(".location").text(); 
        if (x !==""){
            let newJobObject={};
            newJobObject.location= jobEl.find(".location").text(); 
            newJobObject.position=jobEl.find(".position").text(); 
            newJobObject.description=jobEl.find(".description").text();
            newJobObject.company=jobEl.find(".company").text(); 
            newJobObject.qualifications=jobEl.find(".qualifications").text();
            compareHistoryAndSave(newJobObject); 
        }
    }
    
    function addJobCardtoCarousel(currentJob){
        let htmlTemplate = 
        `    <div class="mt-2 mb-2 rounded">
                <div class="card-body savedJob">
                    <h3>Position: <span class="position">${currentJob.position}</span></h3>
                    <p>Location: <span class="location">${currentJob.location}</span></p>
                    <p>Company: <span class="company">${currentJob.company}</span></p>
                    <p>Qualifications: <span class="qualifications">${currentJob.qualifications}</span></p>
                    <p>Description: <a href="${currentJob.description}" target="_blank" class="description">${currentJob.description}</a></p>
                    <div class="buttonbox d-flex justify-content-center"></div>
                </div>
            </div>`
        let newItem=$("<div>");
        newItem.attr("class", "carousel-item");   
        newItem.html(htmlTemplate); 
        $(".carousel-inner").append(newItem);

        let deletebtn = $("<button>");
        deletebtn.addClass("delete btn");
        deletebtn.text("Delete");
        deletebtn.on("click", function(){
            event.stopPropagation(); 
            let currentJob= $(this).parent(); 
            deleteSavedJob(currentJob); 
        });
        newItem.find(".buttonbox").append(deletebtn); 
        
    }

    function deleteSavedJob(currentJob){ 
        getHistory(); 
        let entireJobEl= $(currentJob).parentsUntil(".stop"); 
        let currentDescription=$(entireJobEl).find(".description").text();
        for (let i=0; i<savedJobs.length; i++){
            if(savedJobs[i].description=== currentDescription){
                savedJobs.splice(i,1); 
            }
        }
        localStorage.setItem("savedJobs", JSON.stringify(savedJobs));
        console.log(entireJobEl); 
        console.log(currentJob); 
        console.log("next is ",$(entireJobEl).next().attr("class"));
        $(entireJobEl).addClass("deleted"); 
        if ($(entireJobEl).next().attr("class") !== undefined){
            $(entireJobEl).next().addClass("active"); 
            $(entireJobEl).next().show(); 
        } else {
            $(entireJobEl).prev().addClass("active"); 
            $(entireJobEl).prev().show(); 
        }
        $(".deleted").remove();
        console.log("job deleted"); 

    }
    function populateCarousel(){ 
        getHistory();
        for (let i=0; i<savedJobs.length; i++){
            let currentJob=savedJobs[i];
            addJobCardtoCarousel(currentJob);
        }
    }
    function initializePage(){
        getHistory(); 
        addButtons();  
        populateCarousel(); 
    }
   
    initializePage(); 
    
    $(".save").on("click", function(){
        event.preventDefault();
        let jobEl= $(this).parentsUntil(".job");  
        saveJob(jobEl); 
    })

    $("#searchbtn").on("click", function(){
        event.preventDefault(); 
        searchJobs();
        getMap();   
    }); 

    $("#morebtn").on("click", function(){
        event.preventDefault(); 
        moreJobs(); 
    }); 

    $("#backbtn").on("click", function(){
        event.preventDefault();
        backJobs();
    })


}); 