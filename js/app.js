var App = new Marionette.Application();

App.addRegions({
    navigationRegion: "#nav",
    contentRegion: "#content",
    modalOverlayRegion: "#modalOverlay"
});

App.EmptyView = Marionette.ItemView.extend({
    template: Handlebars.templates.emptyview,
    className: "content col-md-12"
});

var NotFoundView = Marionette.ItemView.extend({
    template: Handlebars.templates.notfoundview,
    className: "content col-md-12"
});

App.DefaultView = Marionette.ItemView.extend({
    template: Handlebars.templates.defaultview,
    className: "content col-md-12"
});

App.Controller = Marionette.Object.extend({
    loadDefaultView: function() {
        //default to edit view
        router.navigate("edit", {trigger: true});
    },
    loadNotFoundView: function() {
        console.log("route not found");
        var view = new NotFoundView();
        App.contentRegion.show(view);
    }
});

var controller = new App.Controller();

App.Router = Marionette.AppRouter.extend({
    controller: controller,
    appRoutes: {
        "": "loadDefaultView",
        "*notFound": "loadNotFoundView"
    },
    onRoute: function(name, path, args) {
        console.log(name, path, args);
    }
});

App.router = new App.Router();
//router.on("route", function(page, options) {console.log(page, options);
//    $(".pages").find("li").removeClass("active");
//    $(".pages").find("#"+page).addClass("active");
//
//    if(options)
//        $("select.fileList").val(options[0]+"/"+options[1]);
//    else
//        $("select.fileList").val("");
//});


App.on("start", function(options) {
    console.log("Starting App", this, options);

    if(Backbone.history)
        Backbone.history.start();
});

$( document ).ready(function() {
    //var bh = Backbone.history.start({pushState: false, root: "/clients/Vodafone/Documentation/index.html"});
    //console.log(bh);
    //
    //$("select.fileList").on("change", function(el) {
    //    var val = $(el.currentTarget).val();
    //    var path = val.split("/");
    //    language = path[0];
    //    filename = path[1];
    //
    //    if(language && filename)
    //        router.navigate("selections/"+language+"/"+filename, {trigger: true});
    //    else
    //        router.navigate("selections");
    //});
    App.start();
});
