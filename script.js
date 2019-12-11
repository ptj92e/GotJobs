let searchLocation="";
let theMuseApiKey="1f7d0ddf14cfd38dbdeeb9248ab3bff908d85e1bcc104a2a73cf76790d0c82eb";
let mapquestApiKey="jOoSJlKWI2v4lP46nMd8fKQ8SdfGXJkI"; 
let page= 1; 
let ongoingJobCount=0; 
let category=""; 
let isLastResult= false; 
let isMessageHidden=true; 
let savedJobs; 
let lowercase="abcdefghijklmnopqrstuvwxyz";
let isAfterFirstCall=false; 
let isFirstCall= false; 
let jobCount=1; 
let isAfterNoResults=false; 

$(document).ready(function(){

    // user messages
    let messageSorry={h3: "Sorry!",
                        p1: "Your search resulted in no job postings.",
                        p2:""};

    let messageError={h3: "Input Error!",
                        p1: "Make sure you enter the location as the full city name, state abbreviation.",
                        p2: "For example: Nashville, TN"};

    let messageNoCategory= {h3: "Input Error!",
                        p1: "You need to select a job type from the dropdown list.",
                        p2: ""};

    // adds save buttons to the jobcards. Used to initialize the page
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

    //how to use api results to make job postings on the job cards including not showing unfilled job cards
    function populateJobPostCards(initial, response){
        if (!isMessageHidden) {
            $("#message").hide(); 
            isMessageHidden=true;   
        } 
        let results= response.results;
        jobCount=1;
        $(".job").show(); 
        let difference= results.length-ongoingJobCount; 
        if (difference !== 0 && !isLastResult){
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
            isAfterNoResults=true; 
            $(".job").hide(); 
        }
    }
  
    // formating user input for theMUSE api call
    function formatInput(input){
        input=input.replace(/ /g, "%20");
        input= input.replace(/,/g, "%2C");
        input= input.replace(/&/g, "%26");
        return input; 
    }

    // api call when first searching the input
    function searchJobs(){
        searchLocation= formatInput($("#cityInput").val().trim()); 
        category= formatInput($("#jobOptions").val()); 
        let theMuseURL="https://www.themuse.com/api/public/jobs?category="+category+"&location="+searchLocation+"&page=1&api_key="+theMuseApiKey; 
        isLastResult=false;
        isFirstCall=true; 
        isAfterFirstCall=false;  
        isAfterNoResults=false;  
        $.ajax({
            url: theMuseURL,
            method: "GET"
        }).then(function(response){  
            page=1; 
            ongoingJobCount=0; 
            populateJobPostCards(0, response); 
            alertInput(); 
            deleteStar();   
            addStar();     
        }); 
    }

    //api call when searching for additional jobs
    function moreJobs(){  
        debugger; 
        if (isFirstCall){
            isAfterFirstCall=true; 
        }
        isFirstCall=false; 
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
            deleteStar();   
            addStar(); 
        }); 
        isAfterNoResults=false; 
    }  

    // api call when going back to the pervious job postings
    function backJobs(){ 
        debugger; 
        if (isFirstCall){
            isAfterFirstCall=true; 
        }
        isFirstCall=false;
        isLastResult=false;
        if(isAfterFirstCall){
            if (isAfterNoResults){
                ongoingJobCount -=jobCount
            } else {
                ongoingJobCount -= (4+jobCount);
            }
            if (ongoingJobCount <=0 && page>1){
                if (ongoingJobCount === -5 || isAfterNoResults){
                    ongoingJobCount = 15; 
                    page--; 
                } else {
                    ongoingJobCount = 0
                }
            } else if (ongoingJobCount < 0 && page === 1){
                    ongoingJobCount = 0;
            }
            console.log("The last listed job is #" + ongoingJobCount+"and the page searched is "+page)      
            let theMuseURL="https://www.themuse.com/api/public/jobs?category="+category+"&location="+searchLocation+"&page="+page+"&api_key="+theMuseApiKey; 
            console.log(theMuseURL); 
            $.ajax({
                url: theMuseURL,
                method: "GET"
            }).then(function(response){
                console.log(response); 
                populateJobPostCards(ongoingJobCount, response); 
                deleteStar();   
                addStar(); 
            }); 
        }
        isAfterNoResults=false; 
    }

    // api call for map 
    function getMap(){
        let mapquestUrl="https://open.mapquestapi.com/staticmap/v5/map?key="+mapquestApiKey+"&center="+searchLocation+"&size=600,400@2x"
        $("#mapImg").attr("src", mapquestUrl); 
    }
    
    // determining which user alert message to show if no job postings
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
            } else if ($("#jobOptions").val()==="Job Type"){
                $("#message").find("h3").text(messageNoCategory.h3);
                $("#message").find("#p-one").text(messageNoCategory.p1);
                $("#message").find("#p-two").text(messageNoCategory.p2); 
            }  
        }
    }

    // retrieving saved jobs from local storage
    function getHistory(){
        savedJobs=JSON.parse(localStorage.getItem("savedJobs")); 
        if (savedJobs===null){
            savedJobs=[]; 
        }
    }

    // adding new job to local storage
    function addLocalStorage(newJobObject){
        savedJobs.push(newJobObject); 
        localStorage.setItem("savedJobs", JSON.stringify(savedJobs)); 
        console.log(savedJobs); 
    }

    // making sure saved job is not already saved before adding job
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
            addJobCardtoModal(newJobObject); 
        } else {
            console.log("job already saved"); 
        }
    }

    // writing new job card and determining if it should be saved- then calling functions to save it
    function saveJob(jobEl){ 
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
    
    //wirting a new job card to add to the modal of saved jobs
    function addJobCardtoModal(currentJob){
        let htmlTemplate = 
                `<div class="card-body savedJobCard">
                    <h3>Position: <span class="position">${currentJob.position}</span></h3>
                    <p>Location: <span class="location">${currentJob.location}</span></p>
                    <p>Company: <span class="company">${currentJob.company}</span></p>
                    <p>Qualifications: <span class="qualifications">${currentJob.qualifications}</span></p>
                    <p>Description: <a href="${currentJob.description}" target="_blank" class="description">${currentJob.description}</a></p>
                    <div class="buttonbox d-flex justify-content-center"></div>
                </div>`
        let newItem=$("<div>");
        newItem.attr("class", "mt-2 mb-2 savedJob rounded");   
        newItem.html(htmlTemplate); 
        $(".modal-body").append(newItem);

        let deletebtn = $("<button>");
        deletebtn.addClass("delete btn");
        deletebtn.text("Delete");
        deletebtn.on("click", function(){ 
            let currentJob= $(this).parentsUntil(".modal-body"); 
            deleteSavedJob(currentJob); 
        });
        newItem.find(".buttonbox").append(deletebtn); 
        
    }

    //deleting the selected job from the modal and local storage
    function deleteSavedJob(currentJob){ 
        getHistory(); 
        let currentDescription=$(currentJob).find(".description").text();
        for (let i=0; i<savedJobs.length; i++){
            if(savedJobs[i].description=== currentDescription){
                savedJobs.splice(i,1); 
            }
        }
        localStorage.setItem("savedJobs", JSON.stringify(savedJobs)); 
        console.log(currentJob); 
        $(currentJob).remove();
        console.log("job deleted"); 

    }

    // putting all saved jobs into the saved job modal
    function populateModal(){ 
        getHistory();
        for (let i=0; i<savedJobs.length; i++){
            let currentJob=savedJobs[i];
            addJobCardtoModal(currentJob);
        }
    }

    // removing all saved jobs from the modal and local storage
    function clearSavedJobs(){
        savedJobs=[]; 
        localStorage.clear(); 
        $(".savedJob").remove();
    }

    // adding the star icon to the job card
    function addStar(jobEl){
        if (jobEl === undefined){
            getHistory(); 
            let allDisplayedJobs=$(".job");  
            for (let i=0; i<savedJobs.length; i++){
                for (let j=0; j<allDisplayedJobs.length; j++){
                    let saved= savedJobs[i].description;
                    let current= $(allDisplayedJobs[j]).find(".description").text();
                    if (savedJobs[i].description=== $(allDisplayedJobs[j]).find(".description").text()){
                        let fav= $(allDisplayedJobs[j]).find(".far"); 
                        console.log(fav); 
                        fav.removeAttr("hidden");
                        fav.show(); 
                    }
                }
            } 
        } else {
            let fav= jobEl.find(".far"); 
            fav.removeAttr("hidden");
            fav.show(); 
        } 
    }

    // hiding all star icons
    function deleteStar(){
        $(".far").hide(); 
    }

    // functions required to start the page
    function initializePage(){
        getHistory(); 
        addButtons();  
        populateModal(); 
    }

    // scroll to top of screen
    function topFunction() {
        $('html,body').animate({ scrollTop: 0 }, 400);
    }
   
    initializePage(); 
    
    $("#deleteHistory").on("click", function(){
        clearSavedJobs(); 
    }); 

    $(".save").on("click", function(){
        event.preventDefault();
        let jobEl= $(this).parentsUntil(".job");  
        saveJob(jobEl); 
        addStar(jobEl); 
    });

    $("#searchbtn").on("click", function(){
        event.preventDefault(); 
        searchJobs();
        getMap(); 
    }); 

    $("#morebtn").on("click", function(){
        event.preventDefault(); 
        moreJobs();
        topFunction(); 
    }); 

    $("#backbtn").on("click", function(){
        event.preventDefault();
        backJobs();
        topFunction(); 
    })

    $("#closeHistory").on("click", function(){ 
        deleteStar(); 
        addStar(); 
    }); 
}); 