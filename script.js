$(document).ready(function(){
    //Having trouble getting jooble to work 
    // let joobleApiKey="05fa0270-b152-4931-b17e-312cf6c786d5"; 
    // let joobleurl= "https://jooble.org/api/"; 
    // var params = "{ keywords: 'it', location: 'Bern'}"
   
    //This needs to be a tech search term like ruby or java
    // let description= "javascript";
    //This is a city name or zip code
    
    // also can search by lat and long if no location and full_time as a boolean 
    // let gitHubUrl="https://jobs.github.com/positions.json?description="+description+"&location="+location; 

    // console.log(gitHubUrl); 
    // $.ajax({
    //     url: gitHubUrl,
    //     method: "GET"
    // }).then(function(response){
    //     console.log(response); 
    // }); 
    
//
    // {
    //     "id": "054e52ee-918c-4981-b45c-178fa0b9e827",
    //     "type": "Full Time",
    //     "url": "https://jobs.github.com/positions/054e52ee-918c-4981-b45c-178fa0b9e827",
    //     "created_at": "Tue Nov 26 15:10:46 UTC 2019",
    //     "company": "BentoBox",
    //     "company_url": "http://www.getbento.com",
    //     "location": "New York, NY",
    //     "title": "Software Engineer",
    //     "description": "<p>BentoBox empowers restaurants to own their presence, profits and relationships. The hospitality platform disrupts third-party services that come between the restaurant and the guest. BentoBox puts the restaurant first and offers tools that drive high-margin revenue directly through the restaurant’s website. BentoBox is trusted and loved by over 5,000 restaurants worldwide including The Meatball Shop, Joseph Leonard, Union Square Hospitality Group, Major Food Group, Rose’s Luxury, Eleven Madison Park &amp; many more. Learn more at <a href=\"http://www.getbento.com\">www.getbento.com</a></p>\n<p>We’re looking for a mid-level Software Engineer to help build the world’s best digital operations platform for restaurants. Our current technology stack consists mostly of Django / Python and React, but we are always looking to use the tools that are most appropriate for the task at hand.</p>\n<p>Responsibilities</p>\n<ul>\n<li>Work with designers, product managers, and other engineers to implement new features on our platform</li>\n<li>Contribute clean, clear, high-quality production code</li>\n<li>Help the product and design teamwork through the product specification, design, and feasibility process</li>\n<li>Contribute unit and integration tests for new and existing features</li>\n<li>Provide effective and constructive feedback on other engineer’s contributions</li>\n<li>Research and recommend new technologies, help set best practices and coding standards</li>\n<li>Uphold BentoBox’s core mission, vision, and values</li>\n</ul>\n<p>Skills and Attributes</p>\n<ul>\n<li>2-5 years of experience writing production code</li>\n<li>Some experience with writing code within the context of a web-based framework such as Django or Rails</li>\n<li>A strong understanding of Javascript fundamentals</li>\n<li>Some level of experience with React (with or without Redux)</li>\n</ul>\n<p>What We Offer</p>\n<ul>\n<li>Competitive salary + equity </li>\n<li>Full benefits (medical, dental, vision, 401(k), commuter benefits, life insurance)</li>\n<li>Flexible vacation plan</li>\n<li>Paid parental leave</li>\n<li>Professional development, growth, and support</li>\n<li>Perks when dining with BentoBox customers such as tip reimbursement</li>\n<li>Stylish SoHo office with fresh snacks, seltzer, cold brew coffee, and a bar</li>\n<li>Delicious catered lunches from BentoBox customers every Friday</li>\n<li>Making a positive impact on the hospitality community</li>\n</ul>\n<p>Please share with us why you’re interested in this position. Include a link to your Github account, or any other public code samples you’d like to share with us.</p>\n<p>Hiring Process</p>\n<p>Candidates for this position can expect the hiring process to follow the order below. </p>\n<ul>\n<li>Qualified applicants will be invited to schedule a 30-minute screening call with our Recruiting team.</li>\n<li>Next, they will have a 45-minute technical phone screen with our VP of Engineering.</li>\n<li>Candidates who pass the exercise will be invited to our office to meet with our CTO, VP of Engineering, and Engineering Manager.</li>\n<li>Successful candidates will be made an offer.</li>\n</ul>\n",
    //     "how_to_apply": "<p>Please apply via this link:</p>\n<p><a href=\"https://grnh.se/26602b2d2\">https://grnh.se/26602b2d2</a></p>\n",
    //     "company_logo": "https://jobs.github.com/rails/active_storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBbVI0IiwiZXhwIjpudWxsLCJwdXIiOiJibG9iX2lkIn19--761b15286b7a5a9db5c64b268a134b722323c29a/bentobox-logo-320px.png"
    //     }

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
            let locationArr=[]; 
            for (let i=0; i<results.length; i++){
                let city= results[i].locations[0].name;
                console.log(city); 
            } 
        }); 
    }
    
    $("#searchbtn").on("click", function(){
        event.preventDefault(); 
        searchJobs(); 
    }); 

}); 