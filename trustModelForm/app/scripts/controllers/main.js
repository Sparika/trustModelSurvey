'use strict';

/**
 * @ngdoc function
 * @name trustModelFormApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the trustModelFormApp
 */
angular.module('trustModelFormApp')
  .factory('data', function (){
    // Test if cookie exists and load it
    // else create empty object
    return {}
  })
  .controller('MainCtrl', ['$scope','$route', '$routeParams', function ($scope, $route, $routeParams) {
    $scope.page = $routeParams.page
    $scope.$route = $route;

    $scope.loadModel = false
    var trustModel = {}
    trustModel.widht = 0
    trustModel.height = 0

    function createLoadFunction(urlJson, width, height){
      function loadModel(){
        if(self.fetch) {
            // run my fetch request here
            fetch('../models/'+urlJson)
            .then(response => response.json())
            .then(json => reloadTrustModel(json, width, height))
        } else {
            // do something with XMLHttpRequest?
            console.log('fetch not supported')
        }
      }
      return loadModel
    }

    var modelList = [,,,,,,
    createLoadFunction('tlsViz.json', 760, 800),
    createLoadFunction('webRTCfpViz.json', 760, 800)]

    $scope.$on('$routeChangeSuccess', function () {
      if(modelList[$scope.page]){
        $scope.loadModel = true
        modelList[$scope.page]()
      } else {
        $scope.loadModel = false
      }
    });
  }])
  .controller('ModelFormController', ['$scope', 'data', function($scope, data) {
      var modelTips = {
        tlsModel: {
          'rsa2048aes256sha256': "",
          'rsa2048aes256sha1': "In this configuration, SHA-1 is weak. With an estimated entropy of 53bits for a "+
                               "recommended value of 200bits ... (tbc)",
          'rsa1024aes256sha256': "In this configuration, RSA is weak as it is using a 1024bits key. The recommended size"+
                                 " for factoring modulus algorithm is 2000bits of entropy. ... (tbc)"},
        trustModel: {
          'all': "This is a standard WebRTC configuration. In this scenario, the IdP and CSP are the same actors and thus"+
                 " share the same trust level. Trust on the overall system is entirely dependent on trust given to the CSP/IdP.",
          'noidp': "In this configuration, the IdP is untrusted. Although the CSP may be trusted, the authentication by the IdP"+
                   "may be compromised.",
          'nocsp': "In this configuration, the CSP is untrusted. However, a trusted IdP provides an identity assertion"+
                   " authenticating the other user. This assertion ensures that no man-in-the-middle attack is taking "+
                   "place, as long as the IdP is trusted."}
      }
      $scope.modelTip = ""
      $scope.displayModelTip = function(){return $scope.modelTip!=""}
      $scope.tlschoice = {
        name: 'rsa2048aes256sha256'
      }
      $scope.trustChoice = {
        name: 'all'
      }
      $scope.rsa2048aes256sha256 = data.rsa2048aes256sha256
      $scope.rsa2048aes256sha1 = data.rsa2048aes256sha1
      $scope.rsa1024aes256sha256 = data.rsa1024aes256sha256
      $scope.webRTC = data.webRTC
      $scope.webRTCwtID = data.webRTCwtID
      $scope.webRTCwutID = data.webRTCwutID

      $scope.onTrustModelChange = function(){
        $scope.modelTip = modelTips.trustModel[$scope.trustChoice.name]
        switch ($scope.trustChoice.name) {
          case 'all':
            setActorTrust({CSP: $scope.webRTC/10||1, IdP: $scope.webRTC/10||1}, true)
            break;
          case 'noidp':
            setActorTrust({CSP: '1', IdP: '0'}, true)
            break;
          case 'nocsp':
            setActorTrust({CSP: '0', IdP: '1'}, true)
            break;
          }
      }

      $scope.onTLSModelChange = function(){
        $scope.modelTip = modelTips.tlsModel[$scope.tlschoice.name]
        switch ($scope.tlschoice.name) {
          case 'rsa2048aes256sha256':
              setEntropy({sha_key: '256', rsa_key: '2048'})
          break;
          case 'rsa2048aes256sha1':
              setEntropy({sha_key: '53', rsa_key: '2048'})
          break;
          case 'rsa1024aes256sha256':
              setEntropy({sha_key: '256', rsa_key: '1024'})
          break;
        }
      }
  }])
  .controller('FormController', ['$scope', '$routeParams', 'data', '$location', function($scope, $routeParams, data, $location) {
  $scope.variable = data
  $scope.schema = {
    type: 'object',
    properties: {
      lockColor: {type: 'string', enum:['green (valid)', 'yellow (warning)', 'red (error)'],
                  title: 'In this situation, which type of warning would you expect your browser to display?',
                  description: '<img src="https://lh5.googleusercontent.com/fb2iovaPq1TailtGP5kv3v-aguTzKHazIo33j-N-_'+
                                'oiCsPiivQCFM6PxxsmFzI2cu4zB0Q" width="127px">'},
      sha1: {type:'string', enum:['0','1','2','3','4','5','6','7','8','9','10'], title: 'Sha-1 Security level',
                  description:'SHA-1 hashing algorithm producing a 160bits hash, used for hashing (collision resistance).'},
      sha256: {type:'string', enum:['0','1','2','3','4','5','6','7','8','9','10'], title: 'Sha-256 Security level',
                  description:'SHA-256 hashing algorithm producing a 256bits hash, used for hashing (collision resistance).'},
      sha512: {type:'string', enum:['0','1','2','3','4','5','6','7','8','9','10'], title: 'Sha-512 Security level',
                  description:'SHA-512 hashing algorithm producing a 512bits hash, used for hashing (collision resistance).'},
      aes128: {type:'string', enum:['0','1','2','3','4','5','6','7','8','9','10'], title: 'AES 128 Security level',
                  description:'AES encryption algorithm with a 128bits key, used for encryption (confidentiality resistance).'},
      aes256: {type:'string', enum:['0','1','2','3','4','5','6','7','8','9','10'], title: 'AES 256 Security level',
                  description:'AES encryption algorithm with a 256bits key, used for encryption (confidentiality resistance).'},
      rsa1024: {type:'string',enum:['0','1','2','3','4','5','6','7','8','9','10'], title: 'RSA 1024 Security level',
                  description:'RSA with a 1024bits key, used for signature (authentication strength).'},
      rsa2048: {type:'string',enum:['0','1','2','3','4','5','6','7','8','9','10'], title: 'RSA 2048 Security level',
                  description:'RSA with a 2048bits key, used for signature (authentication strength).'},
      rsa2048aes128sha1: {type:'string',enum:['0','1','2','3','4','5','6','7','8','9','10'], title: 'TLS with RSA(2048)_AES_128_SHA',
                  description:'TLS configured with RSA 2048, AES 128 and SHA-1'},
      rsa2048aes256sha1: {type:'string',enum:['0','1','2','3','4','5','6','7','8','9','10'], title: 'TLS with RSA(2048)_AES_256_SHA',
                  description:'TLS configured with RSA 2048, AES 256 and SHA-1'},
      rsa2048aes128sha256: {type:'string',enum:['0','1','2','3','4','5','6','7','8','9','10'], title: 'TLS with RSA(2048)_AES_128_SHA256',
                  description:'TLS configured with RSA 2048, AES 128 and SHA-256'},
      rsa2048aes256sha256: {type:'string',enum:['0','1','2','3','4','5','6','7','8','9','10'], title: 'TLS with RSA(2048)_AES_256_SHA256',
                  description:'TLS configured with RSA 2048, AES 256 and SHA-256'},
      rsa1024aes128sha256: {type:'string',enum:['0','1','2','3','4','5','6','7','8','9','10'], title: 'TLS with RSA(1024)_AES_128_SHA256',
                  description:'TLS configured with RSA 1024, AES 128 and SHA-256'},
      rsa1024aes256sha256: {type:'string',enum:['0','1','2','3','4','5','6','7','8','9','10'], title: 'TLS with RSA(1024)_AES_256_SHA256',
                  description:'TLS configured with RSA 1024, AES 256 and SHA-256'},
      mobile:  {type:'string',enum:['0','1','2','3','4','5','6','7','8','9','10'],
                      title: 'You use your personal mobile phone for a national call.',
                      description:'Each operators handling the call would thus be operating in your country.'},
      internationalmobile:  {type:'string',enum:['0','1','2','3','4','5','6','7','8','9','10'],
                      title: 'You use your personal mobile phone for an international call. ',
                      description:'Operators handling the call would thus be unknown to you.'},
      ott:  {type:'string',enum:['0','1','2','3','4','5','6','7','8','9','10'],
             title: 'You use a well known OTT service for a communication.',
             description:'For instance on services such as Hangouts, Messenger, or Whatsapp.'},
      webRTC:  {type:'string',enum:['0','1','2','3','4','5','6','7','8','9','10'],
                title: 'You use a WebRTC service integrated into a web-page.',
                description:'For instance a gaming web-page, with integrated WebRTC service and authentication through the gaming page only, '+
                'i.e. the website is responsible for authenticating users.'},
      webRTCwtID:  {type:'string',enum:['0','1','2','3','4','5','6','7','8','9','10'],
                   title: 'You use a WebRTC service integrated into a web-page, but delegating authentication to a third party.',
                   description:'Similar to the previous use-case, however you get an identity assertion, asserting that '+
                   'the other participant was authenticated through an Identity Provider you trust.'},
      webRTCwutID:  {type:'string',enum:['0','1','2','3','4','5','6','7','8','9','10'],
                   title: 'You use a WebRTC service integrated into a web-page, but delegating authentication to an untrusted third party.',
                   description:'Similar to the previous use-case, however the Identity Provider asserting the identity is '+
                   'unknown to you.'},

      webExpertise: {type:'string', //description:'How would you qualify your expertise with Web technologies?',
                                      enum:['End-User','Intermediate','Expert'],
                                      title: 'Qualify your degree of expertise with Web technologies'},
      securityExpertise: {type:'string', //description:'How would you qualify your expertise with computer security?',
                                      enum:['End-User','Intermediate','Expert'],
                                      title: 'Qualify your degree of expertise with Computer security'},
      field: {type:'string', enum:['Academic', 'Industrial'], title: 'Field of work'},
      company: {type:'string', title: 'Company (optional)'},

      tlsHelpClarify: {type:'string', enum:['Interesting point of view', 'Slightly interesting', 'No'],
                       title: 'Evaluate the model\'s interest',
                       description: 'Does this representation of a WebRTC identity model help you understand the situation?'},
      tlsHelpTrust: {type:'string', enum:['Interesting point of view', 'Slightly interesting', 'No'],
                     title: 'Evaluate the trust layer\'s interest',
                     description: 'Does the trust layer bring a new point of view to your understanding of security issues?'},
      tlsAgree: {type:'string', enum:['Yes', 'Some errors', 'No'],
                 title: 'Overall, do you agree with this model?'},
      tlsComment: {type:'string', title: 'Any comments?'},

      webrtcHelpClarify: {type:'string', enum:['Interesting point of view', 'Slightly interesting', 'No'],
                       title: 'Evaluate the model\'s interest',
                       description: 'Does this representation of a WebRTC identity model help you understand the situation?'},
      webrtcHelpTrust: {type:'string', enum:['Interesting point of view', 'Slightly interesting', 'No'],
                     title: 'Evaluate the trust layer\'s interest',
                     description: 'Does the trust layer bring a new point of view to your understanding of security issues?'},
      webrtcAgree: {type:'string', enum:['Yes', 'Some errors', 'No'],
                 title: 'Overall, do you agree with this model?'},
      webrtcComment: {type:'string', title: 'Any comments?'}
    },

    'required': [
        'field',//'company',
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
        'webRTCwutID'
      ]

  };

  $scope.formContent = [
  [], // Introduction
  [{type: 'fieldset', // Personal Informations
         title: 'Personal level of expertise',
         items: [{type: 'help',
                          helpvalue: '<p>In order to qualify your answers to this survey, we would like to know '+
                          'your field of work as well as your degree of knowledge and experience in the fields '+
                          'of web technologies and computer security.'}]
    },
    {"type": "section",
        "htmlClass": "row",
        "items": [
          {
            "type": "section",
            "htmlClass": "col-xs-6",
            "items": [
              {"key": "webExpertise",
                  "type": "radios",
                  "titleMap": [
                    {
                      value: 'End-User',
                      name: 'End-User <br> I only use the Web.'
                    },
                    {
                      value: 'Intermediate',
                      name: 'Intermediate <br> I have some knowledge with web technologies.'
                    },
                    {
                      value: 'Expert',
                      name: 'Expert <br> Working on Web technologies is my daily job.',
                    }
                  ]
              },
              {key: 'field',
                "style": {
                  "selected": "btn-success",
                  "unselected": "btn-default"
                },
                "type": "radiobuttons"
              }
            ]
          },
          {
            "type": "section",
            "htmlClass": "col-xs-6",
            "items": [
              {"key": "securityExpertise",
                "type": "radios",
                "titleMap": [
                {
                  value: "End-User",
                  name: "End-User <br> I may use security algorithms but don't know the details."
                },
                {
                  value: "Intermediate",
                  name: "Intermediate <br> I have some knowledge on computer security."
                },
                {
                  value: 'Expert',
                  name: 'Expert <br> Computer security is my field of expertise.',
                }]
              },
              "company"
            ]
          }
        ]
    }
  ],
  [
    {key: 'lockColor',
     type: 'radios-inline'},
    {type: 'fieldset', // Personal Informations
      items: [{type: 'help',
              helpvalue: '<br><b>Regarding SHA algorithms, how would you evaluate their respective security on a scale of 0-10?</b>'+
                          '<div class="help-block">On this scale 0 represents a compromised security level, '+
                           'not secure enough for real use-case, while 10 stands for an optimal security level.</div>'}]
    },
     {"type": "section",
             "htmlClass": "row",
             "items": [
             {
               "type": "section",
               "htmlClass": "col-xs-6",
               "items": [
                {key: 'sha1',
                type: 'radios-inline'},
                {key: 'sha512',
                type: 'radios-inline'}
               ]
             },
             {
               "type": "section",
               "htmlClass": "col-xs-6",
               "items": [
                  {key: 'sha256',
                  type: 'radios-inline'}
               ]
             }
             ]
     }
  ],
  [{type: 'fieldset', // Personal Informations
         items: [{type: 'help',
                 helpvalue: '<br><b>How would you evaluate the security of the following algorithms on a scale of 0-10?</b>'+
                            '<div class="help-block">On this scale 0 represents a compromised security level, '+
                            'not secure enough for real use-case, while 10 stands for an optimal security level.</div>'}]
       },
     {"type": "section",
             "htmlClass": "row",
             "items": [
             {
               "type": "section",
               "htmlClass": "col-xs-6",
               "items": [
                 {key: 'aes128',
                 type: 'radios-inline'},
                 {key: 'rsa1024',
                 type: 'radios-inline'}
               ]
             },
             {
               "type": "section",
               "htmlClass": "col-xs-6",
               "items": [
                 {key: 'aes256',
                 type: 'radios-inline'},
                 {key: 'rsa2048',
                 type: 'radios-inline'}
               ]
             }
             ]
     },
     {type: 'fieldset', // Personal Informations
              items: [{type: 'help',
                      helpvalue: '<br><br><b>How would you evaluate the security of the following TLS configurations, on a scale of 0-10?</b>'+
                                  '<div class="help-block">On this scale 0 represents a compromised security level, '+
                                  'not secure enough for real use-case, while 10 stands for an optimal security level.</div>'}]
            },

     {"type": "section",
        "htmlClass": "row",
        "items": [
        {
          "type": "section",
          "htmlClass": "col-xs-6",
          "items": [
            {key: 'rsa2048aes128sha1',
            type: 'radios-inline'},
            {key: 'rsa2048aes128sha256',
            type: 'radios-inline'},
            {key: 'rsa1024aes128sha256',
            type: 'radios-inline'}
          ]
        },
        {
          "type": "section",
          "htmlClass": "col-xs-6",
          "items": [
            {key: 'rsa2048aes256sha1',
            type: 'radios-inline'},
            {key: 'rsa2048aes256sha256',
            type: 'radios-inline'},
            {key: 'rsa1024aes256sha256',
            type: 'radios-inline'}
          ]
        }
        ]
     },
  ],
  [{type: 'fieldset', // Personal Informations
                 items: [{type: 'help',
                         helpvalue: '<br><br><b>How would you evaluate the security of the following communication scenarios, '+
                                     'on a scale of 0-10?</b>'+
                                     '<div class="help-block">On this scale 0 represents a compromised security level, '+
                                     'not secure enough for real use-case, while 10 stands for an optimal security level.</div>'}]
      },

           {"type": "section",
              "htmlClass": "row",
              "items": [
              {
                "type": "section",
                "htmlClass": "col-xs-6",
                "items": [
      {key: 'mobile',
       type: 'radios-inline'},
      {key: 'ott',
       type: 'radios-inline'}
                ]
              },
              {
                "type": "section",
                "htmlClass": "col-xs-6",
                "items": [
      {key: 'internationalmobile',
       type: 'radios-inline'},
                ]
              }
              ]
           },
{type: 'fieldset', // Personal Informations
                 items: [{type: 'help',
                         helpvalue: '<br><br>'}]
      },

           {"type": "section",
              "htmlClass": "row",
              "items": [
              {
                "type": "section",
                "htmlClass": "col-xs-6",
                "items": [
      {key: 'webRTC',
       type: 'radios-inline'},
      {key: 'webRTCwutID',
       type: 'radios-inline'}
                ]
              },
              {
                "type": "section",
                "htmlClass": "col-xs-6",
                "items": [
      {key: 'webRTCwtID',
       type: 'radios-inline'},
                ]
              }
              ]
           },

  ],
  [],// Model description
  // Model Example 1 -- TLS
  [{type: 'fieldset', // Personal Informations
            title: 'Model evaluation'},
       {"type": "section",
           "htmlClass": "row",
           "items": [
             {
               "type": "section",
               "htmlClass": "col-xs-6",
               "items": [
                 {"key": "tlsHelpClarify",
                   "style": {
                     "selected": "btn-success",
                     "unselected": "btn-default"
                   },
                     "type": "radiobuttons"
                 },
                 {key: 'tlsAgree',
                   "style": {
                     "selected": "btn-success",
                     "unselected": "btn-default"
                   },
                   "type": "radiobuttons"
                 }
               ]
             },
             {
               "type": "section",
               "htmlClass": "col-xs-6",
               "items": [
                 {"key": "tlsHelpTrust",
                   "style": {
                     "selected": "btn-success",
                     "unselected": "btn-default"
                   },
                   "type": "radiobuttons"
                 },
                 {
                   "key": "tlsComment",
                   "type": "textarea",
                   "placeholder": "Comment"
                 },
               ]
             }
           ]
       }
  ],
  // Model Example 2 -- WebRTC
  [{type: 'fieldset', // Personal Informations
            title: 'Model evaluation'},
       {"type": "section",
           "htmlClass": "row",
           "items": [
             {
               "type": "section",
               "htmlClass": "col-xs-6",
               "items": [
                 {"key": "webrtcHelpClarify",
                   "style": {
                     "selected": "btn-success",
                     "unselected": "btn-default"
                   },
                     "type": "radiobuttons"
                 },
                 {key: 'webrtcAgree',
                   "style": {
                     "selected": "btn-success",
                     "unselected": "btn-default"
                   },
                   "type": "radiobuttons"
                 }
               ]
             },
             {
               "type": "section",
               "htmlClass": "col-xs-6",
               "items": [
                 {"key": "webrtcHelpTrust",
                   "style": {
                     "selected": "btn-success",
                     "unselected": "btn-default"
                   },
                   "type": "radiobuttons"
                 },
                 {
                   "key": "webrtcComment",
                   "type": "textarea",
                   "placeholder": "Comment"
                 },
               ]
             }
           ]
       }
  ],
  ]

  $scope.nextAction = {type: 'button', style: 'btn-info', title: 'Next', onClick: 'next()'}
  $scope.backAction = {type: 'button', style: 'btn-info', title: 'Back', onClick: 'back()'}
  $scope.validateAction = {type: 'submit', style: 'btn-save', title: 'Save'}

  $scope.max = $scope.formContent.length - 1

  function addControl(fc, i){
    var actions;
    if(i === 0) {
      actions = [$scope.nextAction]
    } else if(i < $scope.max) {
      actions = [$scope.backAction, $scope.nextAction]
    } else {
      actions = [$scope.backAction, $scope.validateAction]
    }

    fc.push(
      {type: 'actions',
      htmlClass: 'pull-right',
      items: actions})
  }
  $scope.formContent.forEach(addControl)

  $scope.next = function(){
      // Store Cookie
      // First we broadcast an event so all fields validate themselves
      //$scope.$broadcast('schemaFormValidate');

      // Then we check if the form is valid
      //if ($scope.form.$valid) {
        //$scope.count ++
        var pgNb = parseInt($routeParams.page)+1
        $location.path(pgNb)
      //}

  }
  $scope.back = function(){
      // Store Cookie
      // First we broadcast an event so all fields validate themselves
      //$scope.$broadcast('schemaFormValidate');

      // Then we check if the form is valid
      //if ($scope.form.$valid) {
        var pgNb = parseInt($routeParams.page)-1
        $location.path(pgNb)
      //}
  }

  $scope.form = $scope.formContent[$routeParams.page]

  $scope.model = data;

  $scope.onSubmit = function() {
      // First we broadcast an event so all fields validate themselves
      //$scope.$broadcast('schemaFormValidate');

      // Then we check if the form is valid
      //if ($scope.form.$valid) {
        // ... do whatever you need to do with your data.
      $scope.model.timestamp = Date.now()
      var xhttp = new XMLHttpRequest();
      xhttp.open("POST", "http://localhost:3000/survey", true);
      xhttp.setRequestHeader("Content-type", "application/json");
      xhttp.setRequestHeader( 'Access-Control-Allow-Origin', '*');
      xhttp.send(JSON.stringify($scope.model));
      //}
      $location.path('thanks')
    };
}])
