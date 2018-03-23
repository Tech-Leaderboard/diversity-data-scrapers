
const Nightmare = require('nightmare')
const nightmare = Nightmare({ show: true , })

var config = {
    "username" : "dummy",
    "password" : "dummy",
    "linkedin" : "https://www.linkedin.com/",
    "searchUrl" : "https://www.linkedin.com/search/results/people/?keywords=",
    "query" : "dummy",
    "search" : ""
}

var selectors = {
    "email" : "input#login-email",
    "password" : "input#login-password",
    "submit" : "input#login-submit",
    "profileClass" : ".search-result search-result__occluded-item"
}


handleInput();
navigateHome();


function handleInput() {
  if (process.argv.length <= 4) {
      console.log("Username, password, search term mandatory in same order!");
  } else {
    config.username = process.argv[2];
    config.password = process.argv[3];
    config.query = process.argv[4];
    config.search = config.searchUrl + config.query;
    console.log(config);
  }
}

function navigateHome() {
  nightmare
  	.goto(config.linkedin)
    .type(selectors.email, config.username)
  	.type(selectors.password, config.password)
    .click(selectors.submit)
  	.wait('#nav-typeahead-wormhole')
  	.goto(config.search)
  	.wait('.search-result__info')
  	.evaluate(function() {
  		var element = $('div.search-result__info a:first').attr('href');
  		return element;
  		//console.log("Element: " + element);
  	})
    //.end()
  	//.goto('http://linkedin.com')
      .then(function (result) {
        console.log("Link : http://linkedin.com" + result)
  			profile = 'http://linkedin.com' + result;
        extract(nightmare, profile);
      })

      .catch(function (error) {
        console.error('Error:', error);
      });
}

/**
Name,
Location,
Work History (Company Name, Title, Job Description, Dates of Employment),
Education - Degree Information (
    University Name,
    Degree Type,
    Degree Title,
    Graduation Date
)

**/

function extract(nightmare, profile) {


  console.log("Extracting: " + profile);
  nightmare.goto(profile)
  .wait("h1.pv-top-card-section__name")
  .evaluate(function() {

    //profile
		var name = $('h1.pv-top-card-section__name').text().trim();
    var latestcompany = $('h3.pv-top-card-section__company').text().trim();
    var latestschool = $('pv-top-card-section__school').text().trim();
    var currentlocation = $('pv-top-card-section__location').text().trim();
    //Image url
    var pic = $(".pv-top-card-section__photo").css("background-image");
    pic = pic.replace(/.*\s?url\([\'\"]?/, '').replace(/[\'\"]?\).*/, '');

    var profile = {
      "name" : name,
      "company" : latestcompany,
      "school" : latestschool,
      "pic" : pic,
      "location" : currentlocation
    };

    //education
    var education = [];
    $('#education-section ul li').each(function() {
      	var schoolName = $('.pv-entity__school-name',this).text().trim();
      	var schoolDegree = $('.pv-entity__secondary-title .pv-entity__comma-item',this).text().trim();
      	var schoolExtra = $('.pv-entity__extra-details .pv-entity__description',this).text().trim();
      	var schoolDates = $('.pv-entity__dates span:eq(1)',this).text().trim();

        var school = {
            "name": schoolName,
            "degree": schoolDegree,
            "extra" : schoolExtra,
            "dates" : schoolDates
        }

        education.push(school);
    });

    var work = [];
    //Work experiencere
    $('#experience-section ul li').each(function() {
      	var jobTitle = $('.pv-entity__summary-info h3',this).text().trim();
        var jobCompany = $('.pv-entity__summary-info .pv-entity__secondary-title',this).text().trim();
        var jobDates = $('.pv-entity__summary-info .pv-entity__date-range span:eq(1)',this).text().trim();
        var jobLocation = $('.pv-entity__summary-info .pv-entity__location span:eq(1)',this).text().trim();
      	var jobDescription = $('.pv-entity__extra-details .pv-entity__description ',this).text().trim();

        var job = {
          "title" : jobTitle,
          "company" : jobCompany,
          "dates" : jobDates,
          "location" : jobLocation,
          "description" : jobDescription
        }

        work.push(job);
    });

    var data = {
      "profile" : profile,
      "education" : education,
      "job" : work
    }

		return data;
		//console.log("Element: " + element);
	}).then(function(result){
      console.log(result);
  })
}
