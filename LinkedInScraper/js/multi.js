
const Nightmare = require('nightmare')
const nightmare = Nightmare({ show: true , })

var config = {
    "username" : "pramodnanduri@gmail.com",
    "password" : "Mani2019",
    "linkedin" : "https://www.linkedin.com/",
    "search" : "https://www.linkedin.com/search/results/people/?keywords=Artificial%20Intelligence&origin=SWITCH_SEARCH_VERTICAL&page=2"
}

var selectors = {
    "email" : "input#login-email",
    "password" : "input#login-password",
    "submit" : "input#login-submit"
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

function extract(nightmare, profile) {
  console.log("Extracting: " + profile);
  nightmare.goto(profile)
  .wait("h1.pv-top-card-section__name")
  .evaluate(function() {
		var name = $('h1.pv-top-card-section__name').text();
    var company = $('h3.pv-top-card-section__company').text();
    var data = {
      "name" : name,
      "company" : company.trim(),
      "url" : profile
    };
		return data;
		//console.log("Element: " + element);
	}).then(function(result){
      console.log(result);
  })
}
