(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['defaultview'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<h1>Please make a selection above <i class=\"glyphicon glyphicon-arrow-up\"></i></h1>";
},"useData":true});
templates['editview'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return ((stack1 = ((helper = (helper = helpers.source || (depth0 != null ? depth0.source : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"source","hash":{},"data":data}) : helper))) != null ? stack1 : "");
},"useData":true});
templates['emptyview'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<h1>No Results</h1>";
},"useData":true});
templates['navmenu'] = template({"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "                    <option value=\""
    + alias4(((helper = (helper = helpers.language || (depth0 != null ? depth0.language : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"language","hash":{},"data":data}) : helper)))
    + "/"
    + alias4(((helper = (helper = helpers.filename || (depth0 != null ? depth0.filename : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"filename","hash":{},"data":data}) : helper)))
    + "\" "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.active : depth0),{"name":"if","hash":{},"fn":container.program(2, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + ">"
    + alias4(((helper = (helper = helpers.language || (depth0 != null ? depth0.language : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"language","hash":{},"data":data}) : helper)))
    + " - "
    + alias4(((helper = (helper = helpers.filename || (depth0 != null ? depth0.filename : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"filename","hash":{},"data":data}) : helper)))
    + "</option>\n";
},"2":function(container,depth0,helpers,partials,data) {
    return "selected=\"selected\"";
},"4":function(container,depth0,helpers,partials,data) {
    return "        <li style=\"margin-left: 25px;\">\n            <form name=\"download\" target=\"_blank\" method=\"post\">\n                <input id=\"contents\" name=\"contents\" type=\"hidden\" />\n                <input id=\"lang\" name=\"language\" type=\"hidden\" />\n                <input id=\"file\" name=\"filename\" type=\"hidden\" />\n                <button type=\"button\" class=\"btn btn-default navbar-btn download-btn1\">Download (Client)</button>\n            </form>\n        </li>\n        <li style=\"margin-left: 25px;\">\n            <button type=\"button\" class=\"btn btn-default navbar-btn download-btn2\">Download (Server)</button>\n        </li>\n";
},"6":function(container,depth0,helpers,partials,data) {
    return "class=\"active brian\"";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=depth0 != null ? depth0 : {};

  return "<div class=\"navbar-header\">\n    <a class=\"navbar-brand\" href=\"#\">Vodafone Documentation</a>\n</div>\n<div id=\"navbar\" class=\"navbar-collapse collapse\">\n    <ul class=\"nav navbar-nav\">\n        <li>\n            <select class=\"fileList\">\n                <option value=\"\">Select which file you'd like to load</option>\n"
    + ((stack1 = helpers.each.call(alias1,(depth0 != null ? depth0.fileList : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "            </select>\n        </li>\n"
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.review : depth0),{"name":"if","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "    </ul>\n    <ul class=\"nav navbar-nav navbar-right pages\" style=\"margin-right: 25px;\">\n        <li id=\"edit\" "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.edit : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "><a role=\"button\" tabindex=\"0\">Edit</a></li>\n        <li  id=\"selections\" "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.selections : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "><a role=\"button\" tabindex=\"0\">Selections</a></li>\n        <li id=\"review\" "
    + ((stack1 = helpers["if"].call(alias1,(depth0 != null ? depth0.review : depth0),{"name":"if","hash":{},"fn":container.program(6, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "><a role=\"button\" tabindex=\"0\">Review</a></li>\n    </ul>\n</div>";
},"useData":true});
templates['notfoundview'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<h1>Not Found</h1>";
},"useData":true});
templates['reviewview'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper;

  return ((stack1 = ((helper = (helper = helpers.source || (depth0 != null ? depth0.source : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : {},{"name":"source","hash":{},"data":data}) : helper))) != null ? stack1 : "");
},"useData":true});
templates['selectionsrow'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

  return "<div class=\"hidden-xs hidden-sm col-md-1 text-center\">"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "</div>\n<div class=\"col-xs-10 col-md-10\" style=\"border-left: 1px solid #ddd; border-right: 1px solid #ddd;\">"
    + ((stack1 = ((helper = (helper = helpers.body_html || (depth0 != null ? depth0.body_html : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"body_html","hash":{},"data":data}) : helper))) != null ? stack1 : "")
    + "</div>\n<div class=\"col-xs-2 col-md-1 text-center\"><button id=\"delete\" type='button' class='btn btn-danger' data-selection-id='"
    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
    + "'>Delete</button></div>";
},"useData":true});
templates['selectionstable'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"row row-eq-height\">\n    <div class=\"hidden-xs hidden-sm col-md-1 text-center\"><h4>ID</h4></div>\n    <div class=\"col-xs-10 col-md-10\" style=\"border-left: 1px solid #ddd; border-right: 1px solid #ddd;\"><h4>Selection</h4></div>\n    <div class=\"col-xs-2 col-md-1\">&nbsp;</div>\n</div>";
},"useData":true});
templates['selectionsview'] = template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<h1>Please make a selection above <i class=\"glyphicon glyphicon-arrow-up\"></i></h1>";
},"useData":true});
})();