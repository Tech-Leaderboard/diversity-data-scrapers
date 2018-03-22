const Nightmare = require('nightmare')
const nightmare = Nightmare({
  show: true,
})

var config = {
  "username": "Taken from Input",
  "password": "Taken from Input",
  "linkedin": "https://www.linkedin.com/",
  "searchUrl": "https://www.linkedin.com/search/results/people/?keywords=",
  "query": "Taken from Input",
  "search": "",
  "page": 1,
  "pageMax": 100,
  "outputfile" : "./linkedindata.json"
}

var selectors = {
  "email": "input#login-email",
  "password": "input#login-password",
  "submit": "input#login-submit",
  "profileClass": ".search-result search-result__occluded-item"
}

handleInput();
navigateHome();


function readFile() {
  var fs = require('fs');
  fs.readFile('DATA', 'utf8', function(err, contents) {
    console.log(contents);
  });
  console.log('after calling readFile');
}

function writeToFile(textToWrite) {
  var fs = require('fs');
  fs.appendFile(config.outputfile, textToWrite , function(err) {
    if (err) {
      return console.log(err);
    }
    console.log("The file was saved!");
  });

}

function handleInput() {
  if (process.argv.length <= 4) {
    console.log("Username, password, search term mandatory in same order!");
  } else {
    config.username = process.argv[2];
    config.password = process.argv[3];
    config.query = process.argv[4];
    config.search = config.searchUrl + config.query;
    var page = process.argv[5];
    if (page == null) {
      page = 1;
    }
    config.page = page;
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
  doSearch(config);
}

function doSearch(config) {
  //Going to search function
  nightmare.goto(config.search + "&page=" + config.page)
    .scrollTo(3000, 0)
    .wait('.search-result__info')
    .evaluate(function() {

      //Extract search page count:
      var searchCount = $('.search-results__total').text().trim().split(" ")[1];


      //Extracting search result urls
      var links = [];
      $('.search-results__cluster-content ul li').each(function() {
        var link = $('.search-result__info a', this).attr('href');
        if (link != null && link != '#') {
          links.push('http://linkedin.com' + link);
        }
      });
      return links;
    })
    .then(function(result) {
      extract(nightmare, result, config);
    })
    .catch(function(error) {
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

function extract(nightmare, links, config) {
  var profile = links.pop();
  console.log("Extracting: " + profile);
  nightmare.goto(profile)
    .scrollTo(1000, 0)
    .wait("#experience-section")
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
        "name": name,
        "company": latestcompany,
        "school": latestschool,
        "pic": pic,
        "location": currentlocation,
        "link": profile
      };

      //education
      var education = [];
      $('#education-section ul li').each(function() {
        var schoolName = $('.pv-entity__school-name', this).text().trim();
        var schoolDegree = $('.pv-entity__secondary-title .pv-entity__comma-item', this).text().trim();
        var schoolExtra = $('.pv-entity__extra-details .pv-entity__description', this).text().trim();
        var schoolDates = $('.pv-entity__dates span:eq(1)', this).text().trim();

        var school = {
          "name": schoolName,
          "degree": schoolDegree,
          "extra": schoolExtra,
          "dates": schoolDates
        }
        education.push(school);
      });

      var work = [];
      //Work experiencere
      $('#experience-section ul li').each(function() {
        var jobTitle = $('.pv-entity__summary-info h3', this).text().trim();
        var jobCompany = $('.pv-entity__summary-info .pv-entity__secondary-title', this).text().trim();
        var jobDates = $('.pv-entity__summary-info .pv-entity__date-range span:eq(1)', this).text().trim();
        var jobLocation = $('.pv-entity__summary-info .pv-entity__location span:eq(1)', this).text().trim();
        var jobDescription = $('.pv-entity__extra-details .pv-entity__description ', this).text().trim();

        var job = {
          "title": jobTitle,
          "company": jobCompany,
          "dates": jobDates,
          "location": jobLocation,
          "description": jobDescription
        }

        work.push(job);
      });

      var data = {
        "profile": profile,
        "education": education,
        "job": work
      }

      return data;
      //console.log("Element: " + element);
    }).then(function(result) {
      //console.log(result);
      writeToFile(JSON.stringify(result) + ",");
      if (links.length != 0) {
        extract(nightmare, links, config);
      } else {
        console.log("Done Fetching results of page " + config.page);
        config.page = config.page + 1;
        if (config.page <= config.pageMax) {
          console.log("Now Fetching page : " + config.page);
          doSearch(config);
        } else {
          console.log("Maximum page threshold reached!");
        }

      }
    })
}
