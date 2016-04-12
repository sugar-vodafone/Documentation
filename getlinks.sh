#!/bin/bash

echo "Type the name of the file you wish to check:"

read filename

grep -oh "http://support.sugarcrm.com/Resources/Supported_Platforms/Plug-ins_Supported_Platforms" English/$filename
grep -oh "http://support.sugarcrm.com/Documentation/Sugar_Versions" English/$filename
grep -oh "http://support.sugarcrm.com/Resources/Supported_Platforms/Mobile_Supported_Platforms" English/$filename
grep -oh "http://dock.sugarcrm.net/02_Documentation/01_Sugar_Editions" English/$filename
grep -oh "http://support.sugarcrm.com/02_Documentation/01_Sugar_Editions/02_Sugar_Enterprise/Sugar_Enterprise_7.6/Portal_User_Guide" English/$filename
grep -oh "http://support.sugarcrm.com/02_Documentation/04_Sugar_Developer/Sugar_Developer_Guide_6.7" English/$filename
grep -oh "http://support.sugarcrm.com/02_Documentation/01_Sugar_Editions/02_Sugar_Enterprise/Sugar_Enterprise_7.6/Installation_and_Upgrade_Guide" English/$filename
grep -oh "http://support.sugarcrm.com/05_Resources/03_Supported_Platforms/Mobile_Supported_Platforms" English/$filename
grep -oh "http://support.sugarcrm.com/02_Documentation/02_Mobile_Solutions/SugarCRM_Mobile" English/$filename
grep -oh "http://support.sugarcrm.com/05_Resources/03_Supported_Platforms" English/$filename
grep -oh "http://support.sugarcrm.com/02_Documentation/03_Plug-ins" English/$filename
grep -oh "http://support.sugarcrm.com/05_Resources/035_Accessibility" English/$filename
grep -oh "http://support.sugarcrm.com/02_Documentation/03_Plug-ins/Lotus_Notes_Plug-in/01_Lotus_Notes_Plug-in_User_Guide_2.0" English/$filename
grep -oh "http://support.sugarcrm.com/02_Documentation/01_Sugar_Editions" English/$filename
grep -oh "http://support.sugarcrm.com/Documentation/Sugar_Versions/7.6/Ent/Portal_User_Guide" English/$filename



#cat English/$filename | perl -nle 'print $1 while m/href="(http:\/\/support\.sugarcrm\.com\/Resources\/Supported_Platforms\/Plug-ins_Supported_Platforms[^"]*)/g'
#cat English/$filename | perl -nle 'print $1 while m/href="(http:\/\/support\.sugarcrm\.com\/Documentation\/Sugar_Versions[^"]*)/g'
#cat English/$filename | perl -nle 'print $1 while m/href="(http:\/\/support.sugarcrm.com\/Resources\/Supported_Platforms\/Mobile_Supported_Platforms[^"]*)/g'
#cat English/$filename | perl -nle 'print $1 while m/href="(http:\/\/dock.sugarcrm.net\/02_Documentation\/01_Sugar_Editions[^"]*)/g'
#cat English/$filename | perl -nle 'print $1 while m/href="(http:\/\/support.sugarcrm.com\/02_Documentation\/01_Sugar_Editions\/02_Sugar_Enterprise\/Sugar_Enterprise_7.6\/Portal_User_Guide[^"]*)/g'
#cat English/$filename | perl -nle 'print $1 while m/href="(http:\/\/support.sugarcrm.com\/02_Documentation\/04_Sugar_Developer\/Sugar_Developer_Guide_6.7[^"]*)/g'
#cat English/$filename | perl -nle 'print $1 while m/href="(http:\/\/support.sugarcrm.com\/02_Documentation\/01_Sugar_Editions\/02_Sugar_Enterprise\/Sugar_Enterprise_7.6\/Installation_and_Upgrade_Guide[^"]*)/g'
#cat English/$filename | perl -nle 'print $1 while m/href="(http:\/\/support.sugarcrm.com\/05_Resources\/03_Supported_Platforms\/Mobile_Supported_Platforms[^"]*)/g'
#cat English/$filename | perl -nle 'print $1 while m/href="(http:\/\/support.sugarcrm.com\/02_Documentation\/02_Mobile_Solutions\/SugarCRM_Mobile[^"]*)/g'
#cat English/$filename | perl -nle 'print $1 while m/href="(http:\/\/support.sugarcrm.com\/05_Resources\/03_Supported_Platforms[^"]*)/g'
#cat English/$filename | perl -nle 'print $1 while m/href="(http:\/\/support.sugarcrm.com\/02_Documentation\/03_Plug-ins[^"]*)/g'
#cat English/$filename | perl -nle 'print $1 while m/href="(http:\/\/support.sugarcrm.com\/05_Resources\/035_Accessibility[^"]*)/g'
#cat English/$filename | perl -nle 'print $1 while m/href="(http:\/\/support.sugarcrm.com\/02_Documentation\/03_Plug-ins\/Lotus_Notes_Plug-in\/01_Lotus_Notes_Plug-in_User_Guide_2.0[^"]*)/g'
#cat English/$filename | perl -nle 'print $1 while m/href="(http:\/\/support.sugarcrm.com\/02_Documentation\/01_Sugar_Editions[^"]*)/g'
#cat English/$filename | perl -nle 'print $1 while m/href="(http:\/\/support.sugarcrm.com\/Documentation\/Sugar_Versions\/7.6\/Ent\/Portal_User_Guide[^"]*)/g'
#cat English/$filename | perl -nle 'print $1 while m/href="(http:\/\/support.sugarcrm.com)/g'
