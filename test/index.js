/****START SETTINGS****/
var jenkins_user = "SAP";
var jenkins_password = "SAP";
var baseUrl = 'http://'+jenkins_user+':'+jenkins_password+'@localhost:8080';
/****END SETTINGS****/

/* Doc https://github.com/silas/node-jenkins#readme */
var jenkins = require('jenkins')({ baseUrl: baseUrl, crumbIssuer: true });

jenkins.info(function(err, data) {
    if (err) throw err;
  
    console.log('info', data);
});

jenkins.job.list(function(err, data) {
    if (err) throw err;
  
    console.log('jobs', data);

    for (let index = 0; index < data.length; index++) {
        const job = data[index];

        jenkins.job.get(job.name, function(err, data) {
            if (err) throw err;
        
            //TODO GET BUILD STATUS
            console.log('job', data);
        });

    }

});

/*jenkins.job.config('01-T124_BU-Procurement-displayOverviewPage', function(err, data) {
    if (err) throw err;

    console.log('xml', data);
});*/

/*jenkins.view.list(function(err, data) {
    if (err) throw err;

    console.log('views', data);
});*/

/*jenkins.view.config('ALL_USERS', function(err, data) {
    if (err) throw err;

    console.log('xml', data);
});*/