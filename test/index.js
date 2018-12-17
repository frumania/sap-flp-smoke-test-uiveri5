/****START SETTINGS****/
var jenkins_user = "SAP";
var jenkins_password = "SAP";
var baseUrl = 'http://'+jenkins_user+':'+jenkins_password+'@localhost:8080';
/****END SETTINGS****/

/* Doc https://github.com/silas/node-jenkins#readme */
var jenkins = require('jenkins')({ baseUrl: baseUrl, crumbIssuer: true });

jenkins.info(function(err, data) {
    if (err) throw err;
  
    console.log('INFO Jenkins Config: ', data);
});

jenkins.job.list(function(err, data) {
    if (err) throw err;

    if (data.length == 0) throw "ERROR No jobs found!";
  
    console.debug('DEBUG Jobs', data);

    for (let index = 0; index < data.length; index++) {
        const job = data[index];

        jenkins.job.get(job.name, function(err, data) {
            if (err) throw err;

            console.debug('DEBUG Job', data);

            //CHECK IF BUILD IS STABLE
            if(data.lastStableBuild != "null" && data.lastStableBuild != null)
            {
                console.log("INFO Job "+job.name+" successfully built!");
            }
            else
            {
                if(job.name.includes("Shell"))
                {throw "ERROR Job "+job.name+" could not be built successfully!";}
                else
                {console.log("INFO Job "+job.name+" could not be built successfully!");}
            }

            var req = {};
            req.path =  '/job/'+job.name+'/Console_20Errors/error.json';
            req.params = {};

            jenkins._post(
                req,
                "",
                "",
                function(err, result){
                    console.log("DEBUG Output: ", result.body);
                }
            );


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