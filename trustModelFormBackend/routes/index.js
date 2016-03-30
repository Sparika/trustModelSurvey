var express = require('express');
var router = express.Router();
var fs = require('fs');
var json2csv = require('json2csv');
var fields = [
        'field','company',
        'webExpertise','securityExpertise',
        'lockColor',
        'sha1',
        'sha256',
        'sha512',
        'aes128',
        'aes256',
        'rsa1024',
        'rsa2048',
        'rsa2048aes128sha1',
        'rsa2048aes256sha1',
        'rsa2048aes128sha256',
        'rsa2048aes256sha256',
        'rsa1024aes128sha256',
        'rsa1024aes256sha256',
        'mobile',
        'internationalmobile',
        'ott',
        'webRTC',
        'webRTCwtID',
        'webRTCwutID',
        'tlsHelpClarify','tlsHelpTrust','tlsAgree','tlsComment',
        'webrtcHelpClarify','webrtcHelpTrust','webrtcAgree','webrtcComment',
        'timestamp'
              ]

/* GET home page. */

router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.post('/survey', function(req, res){
  console.log(req.body)
  json2csv({ data: req.body, fields: fields, hasCSVColumnTitle: false, eol:"\n", quotes:""}, function(err, csv) {
    if (err) console.log(err);
    console.log(csv);
    var writer = fs.createWriteStream('results.txt', {'flags': 'a'});
    writer.write(csv);
  });

  res.render('index', {title: 'Express'})
});

router.get('/survey', function(req, res){
  res.render('index', { title: 'Express' });
});
module.exports = router;
