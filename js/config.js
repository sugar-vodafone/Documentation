var config = {
    'appRoot': 'http://localhost/clients/Vodafone/Documentation',
    'fileList': [
        {'language': 'English', 'filename': 'MS_Excel_Plug-in_Installation_Guide'},
        {'language': 'English', 'filename': 'MS_Excel_Plug-in_User_Guide'},
        {'language': 'English', 'filename': 'MS_Outlook_Plug-in_Installation_Guide_2.x'},
        {'language': 'English', 'filename': 'MS_Outlook_Plug-in_User_Guide_2.x'},
        {'language': 'English', 'filename': 'MS_Word_Plug-in_Installation_Guide'},
        {'language': 'English', 'filename': 'MS_Word_Plug-in_User_Guide'},
        {'language': 'English', 'filename': 'SugarCRM_Mobile_for_Android_User_Guide'},
        {'language': 'English', 'filename': 'SugarCRM_Mobile_for_iOS_User_Guide'},
        {'language': 'English', 'filename': 'Sugar_Enterprise_7.6_Administration_Guide'},
        {'language': 'English', 'filename': 'Sugar_Enterprise_7.6_Application_Guide'},
        {'language': 'English', 'filename': 'Sugar_Enterprise_7.6_Portal_Deployment_User_Guide'},
        {'language': 'Italian', 'filename': 'MS_Excel_Plug-in_Installation_Guide'},
        {'language': 'Italian', 'filename': 'MS_Excel_Plug-in_User_Guide'},
        {'language': 'Italian', 'filename': 'MS_Outlook_Plug-in_Installation_Guide_2.x'},
        {'language': 'Italian', 'filename': 'MS_Outlook_Plug-in_User_Guide_2.x'},
        {'language': 'Italian', 'filename': 'MS_Word_Plug-in_Installation_Guide'},
        {'language': 'Italian', 'filename': 'MS_Word_Plug-in_User_Guide'},
        {'language': 'Italian', 'filename': 'SugarCRM_Mobile_for_Android_User_Guide'},
        {'language': 'Italian', 'filename': 'SugarCRM_Mobile_for_iOS_User_Guide'},
        {'language': 'Italian', 'filename': 'Sugar_Enterprise_7.6_Administration_Guide'},
        {'language': 'Italian', 'filename': 'Sugar_Enterprise_7.6_Application_Guide'},
        {'language': 'Italian', 'filename': 'Sugar_Enterprise_7.6_Portal_Deployment_User_Guide'}
    ],
    'patterns': [ //str.replace(re, "$2, $1");
        //{'search': /\\"/g, 'replace': '"'},
        //{'search': /\\'/g, 'replace': "'"},
        //{'search': /SugarCRM/g, 'replace': 'VodafoneCRM'},
        //{'search': /Sugar/g, 'replace': 'VodafoneCRM'}, 
        {'search': /(?!<a[^>]*>)(Sugar(CRM)?)(?![^<]*<\/a>)/g, 'replace': 'VodafoneCRM'},
        {'search': /href="#([^A-Z"]*)/g, 'replace': 'href=\"#'}, //remove guids from inline anchor tags
        {'search': /id="([^A-Z"]*)/g, 'replace': 'id=\"'}, //remove guids from inline anchor ids
        //{'search': /<[^\/>][^>]*><\/[^>]+>/g, 'replace': ''},
        //Sugar_Enterprise_7.6_Application_Guide.html
        {'search': /href="(http:\/\/support\.sugarcrm\.com\/Documentation\/Sugar_Versions\/7\.6\/Ent\/Application_Guide[^"]*[\/|#](\w+))/g, 'replace': 'href="Sugar_Enterprise_7.6_Application_Guide.html#$2"'},
        {'search': /href="(http:\/\/support\.sugarcrm\.com\/02_Documentation\/01_Sugar_Editions\/02_Sugar_Enterprise\/Sugar_Enterprise_7\.6\/Application_Guide[^"]*[\/|#](\w+))/g, 'replace': 'href="Sugar_Enterprise_7.6_Application_Guide.html#$2"'},
        {'search': /href="(http:\/\/support\.sugarcrm\.com\/support\.sugarcrm\.com\/02_Documentation\/01_Sugar_Editions\/04_Sugar_Professional\/Sugar_Professional_7.6\/Application_Guide[^"]*[\/|#](\w+))/g, 'replace': 'href="Sugar_Enterprise_7.6_Application_Guide.html#$2"'},
        {'search': /href="(http:\/\/support\.sugarcrm\.com\/02_Documentation\/01_Sugar_Editions\/01_Sugar_Ultimate\/Sugar_Ultimate_7\.1\/Application_Guide[^"]*[\/|#](\w+))/g, 'replace': 'href="Sugar_Enterprise_7.6_Application_Guide.html#$2"'},
        {'search': /href="(http:\/\/support\.sugarcrm\.com\/02_Documentation\/01_Sugar_Editions\/01_Sugar_Ultimate\/Sugar_Ultimate_7\.5\/Application_Guide[^"]*[\/|#](\w+))/g, 'replace': 'href="Sugar_Enterprise_7.6_Application_Guide.html#$2"'},
        {'search': /href="(http:\/\/support\.sugarcrm\.com\/02_Documentation\/01_Sugar_Editions\/01_Sugar_Ultimate\/Sugar_Ultimate_7\.1\/Application_Guide[^"]*[\/|#](\w+))/g, 'replace': 'href="Sugar_Enterprise_7.6_Application_Guide.html#$2"'},
        {'search': /href="http:\/\/support.sugarcrm.com\/Documentation\/Sugar_Versions.?">Application Guide<\/a>/g, 'replace': 'href="Sugar_Enterprise_7.6_Application_Guide.html">Application Guide</a>'},
        //Sugar_Enterprise_7.6_Administration_Guide.html
        {'search': /href="(http:\/\/support\.sugarcrm\.com\/02_Documentation\/01_Sugar_Editions\/02_Sugar_Enterprise\/Sugar_Enterprise_7\.6\/Administration_Guide[^"]*[\/|#](\w+))/g, 'replace': 'href="Sugar_Enterprise_7.6_Administration_Guide.html#$2"'},
        {'search': /href="(http:\/\/support\.sugarcrm\.com\/02_Documentation\/01_Sugar_Editions\/01_Sugar_Ultimate\/Sugar_Ultimate_7\.2\/Administration_Guide[^"]*[\/|#](\w+))/g, 'replace': 'href="Sugar_Enterprise_7.6_Administration_Guide.html#$2"'},
        {'search': /href="(http:\/\/support\.sugarcrm\.com\/02_Documentation\/01_Sugar_Editions\/01_Sugar_Ultimate\/Sugar_Ultimate_7\.0\/Administration_Guide[^"]*[\/|#](\w+))/g, 'replace': 'href="Sugar_Enterprise_7.6_Administration_Guide.html#$2"'},
        {'search': /href="(http:\/\/support\.sugarcrm\.com\/Documentation\/Sugar_Versions\/7\.6\/Ent\/Administration_Guide[^"]*[\/|#](\w+))/g, 'replace': 'href="Sugar_Enterprise_7.6_Administration_Guide.html#$2"'},
        //SugarCRM_Mobile_for_iOS_User_Guide.html
        {'search': /href="(http:\/\/dock\.sugarcrm\.net\/dock\/cache\/preview\/64e62fbf-98fd-45bb-16bd-54e38ae38f47\/02_Documentation\/02_Mobile_Solutions\/SugarCRM_Mobile\/SugarCRM_Mobile_for_iOS_User_Guide[^"]*[\/|#](\w+))/g, 'replace': 'href="SugarCRM_Mobile_for_iOS_User_Guide.html#$2"'},
        //Sugar_Enterprise_7.6_Portal_Deployment_User_Guide.html
        {'search': /href="(http:\/\/support\.sugarcrm\.com\/02_Documentation\/01_Sugar_Editions\/02_Sugar_Enterprise\/Sugar_Enterprise_7\.6\/Portal_Deployment_User_Guide[^"]*[\/|#](\w+))/g, 'replace': 'href="Sugar_Enterprise_7.6_Portal_Deployment_User_Guide.html#$2"'},
        //MS_Word_Plug-in_Installation_Guide.html
        {'search': /href="(http:\/\/support\.sugarcrm\.com\/Documentation\/Plug-ins\/MS_Word_Plug-in\/MS_Word_Plug-in_Installation_Guide[^"]*[\/|#](\w+))/g, 'replace': 'href="MS_Word_Plug-in_Installation_Guide.html#$2"'},
        //MS_Excel_Plug-in_Installation_Guide.html
        {'search': /href="(http:\/\/support\.sugarcrm\.com\/Documentation\/Plug-ins\/MS_Excel_Plug-in\/MS_Excel_Plug-in_Installation_Guide[^"]*[\/|#](\w+))/g, 'replace': 'href="MS_Excel_Plug-in_Installation_Guide.html#$2"'},
        {'search': /href="http:\/\/support\.sugarcrm\.com\/Documentation\/Plug-ins\/MS_Excel_Plug-in\/MS_Excel_Plug-in_Installation_Guide[^"]*/g, 'replace': 'href="MS_Excel_Plug-in_Installation_Guide.html"'},
        //MS_Outlook_Plug-in_User_Guide_2.x.html
        {'search': /href="(http:\/\/support\.sugarcrm\.com\/02_Documentation\/03_Plug-ins\/MS_Outlook_Plug-in\/01_MS_Outlook_Plug-in_User_Guide[^"]*[\/|#](\w+))/g, 'replace': 'href="MS_Outlook_Plug-in_User_Guide_2.x.html#$2"'},
        //MS_Outlook_Plug-in_Installation_Guide_2.x.html
        {'search': /href="(http:\/\/support\.sugarcrm\.com\/Documentation\/Plug-ins\/MS_Outlook_Plug-in\/MS_Outlook_Plug-in_Installation_Guide_2.x[^"]*[\/|#](\w+))/g, 'replace': 'href="MS_Outlook_Plug-in_Installation_Guide_2.x.html#$2"'},
    ]
};