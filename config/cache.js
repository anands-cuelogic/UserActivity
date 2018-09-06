const mongoose = require('mongoose');
const exec = mongoose.Query.prototype.exec;

mongoose.Query.exec = function(){
    console.log('I am about to execute');

    return exec.apply(this, arguments);
};