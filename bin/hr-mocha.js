#!/usr/bin/env node

var os = require('os');
var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;
var async = require('async');
var browserify = require('browserify');


var input = path.resolve(process.cwd(), process.argv[2]);
var binFolder = path.resolve(__dirname, "../node_modules/.bin");
var tmpInput = path.resolve(os.tmpdir(), Date.now()+".js");
var htmlInput = path.resolve(__dirname, "index.html");
var tmpHtml = path.resolve(os.tmpdir(), "index.html");


// Build HTML input
var HTML = fs.readFileSync(htmlInput, { encoding: "utf-8" });
HTML = HTML.replace(/{INPUT}/g, tmpInput)
        .replace(/{ROOT}/g, path.resolve(__dirname, ".."));
fs.writeFileSync(tmpHtml, HTML);

async.series([
    function (callback) {
        exec(path.resolve(binFolder, "browserify")+" "+input+" > "+tmpInput, callback);
    },
    function (callback) {
        exec(path.resolve(binFolder, "mocha-phantomjs")+" "+tmpHtml, callback);
    }
], function(err, cmd) {
    var log = cmd[1];
    process.stdout.write(cmd[0].toString());
    process.stderr.write(cmd[1].toString());
    process.exit(err? 1 : 0);
});

