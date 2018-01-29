
const Nightmare = require('nightmare')
const nightmare = Nightmare({ show: true , })

nightmare
	.goto('https://www.linkedin.com/')
  	.type('input#login-email', 'pramodnanduri@gmail.com')
	.type('input#login-password', 'Mani2019')	
  	.click('input#login-submit')
	.goto('https://www.linkedin.com/search/results/people/?keywords=Artificial%20Intelligence&origin=SWITCH_SEARCH_VERTICAL&page=2')
	.click('h3#ember1245 > span.name-and-icon:nth-child(1) > span.name.actor-name:nth-child(1)')
  .end()
    .then(function (result) {
      console.log(result)
    })
    .catch(function (error) {
      console.error('Error:', error);
    });

  .click('h3#ember2896 > span.name-and-icon:nth-child(1) > span.name.actor-name:nth-child(1)')
