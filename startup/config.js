const config = require('config');

module.exports=function() {
    if(!config.get('jwtPrivateKey')){
        throw new Error('Fatal error jwtPrivateKey not specified'); //  $env:planner_jwtPrivateKey="myprivateKey"
    }
}