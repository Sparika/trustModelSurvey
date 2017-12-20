var express = require('express');
//var fs = require('fs');
//var json2csv = require('json2csv');
var fields = [
  'mobile',
  'intMobile',
  'ott',
  'company',
  'ottCompany',
  'widget',
  'idp',
  'insecure',

  'webrtcHelpClarify',
  'webrtcHelpTrust',
  'webrtcAgree',
  'webrtcComment',

  'webExpertise',
  'securityExpertise',
  'rtcExpertise',
  'timestamp'
              ]

/* GET home page. */
module.exports = function(router, storage){
  router.get('/', function(req, res) {
    res.render('index', { title: 'Express' });
  });

  router.post('/survey', function(req, res){
    storage.loadCollections(['survey'])
    storage.survey.save(req.body)
    // 
    // json2csv({ data: req.body, fields: fields, hasCSVColumnTitle: false, eol:"\n", quotes:""}, function(err, csv) {
    //   if (err) console.log(err);
    //   var writer = fs.createWriteStream('results.txt', {'flags': 'a'});
    //   writer.write(csv);
    // });

    res.sendStatus(200)
  });

  router.get('/survey', function(req, res){
    storage.loadCollections(['survey'])
    res.send(storage.survey.find());
  });
}
