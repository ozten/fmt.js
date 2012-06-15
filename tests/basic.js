var foo = require('foo');

foo.zombify(function(err, zombie){ console.log('Created a Zombie!', zombie); });
function findShelter(env){console.log('Seeking shelter in',env)}
exports.hide = function(bar){try {findShelter()}catch(err){}};