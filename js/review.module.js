App.module("Review", function(ReviewModule, App, Backbone, Marionette, $, _) {
    var ReviewModel = Backbone.Model.extend({
        getSelections: function(callback) {
            var language = App.reqres.request("getLanguage");
            var filename = App.reqres.request("getFilename");

            $.get({
                url: config.appRoot + "/api/selections",
                data: {
                    "language": language,
                    "filename": filename
                },
                dataType: "json",
                success: function(result) {
                    callback(result);
                }
            });
        },
        getSourceDocumentationHTML: function(callback) {
            var language = App.reqres.request("getLanguage");
            var filename = App.reqres.request("getFilename");

            $.get({
                url: config.appRoot + "/" + language + "/" + filename + ".html",
                success: function (result) {
                    callback(result);
                }
            });
        },
        getServerRevisedSourceDocumentationPage: function(callback) {
            var language = App.reqres.request("getLanguage");
            var filename = App.reqres.request("getFilename");

            $.get({
                url: config.appRoot + "/api/selections/document",
                data: {
                    "language": language,
                    "filename": filename,
                    "download": false
                },
                success: function (result) {
                    //console.log(result);
                    callback(result);
                }
            });
        }
    });

    var ReviewView = Marionette.ItemView.extend({
        initialize: function() {
            App.commands.setHandler("downloadFromStream", function() {
                this.downloadContentFromStream();
            }.bind(this));

            App.commands.setHandler("downloadFromServer", function() {
                var language = App.reqres.request("getLanguage");
                var filename = App.reqres.request("getFilename");

                var url = config.appRoot + "/api/selections/document/download?language=" + language + "&filename=" + filename;
                window.open(url);
            }.bind(this));
        },
        template: Handlebars.templates.reviewview,
        className: "content col-md-12",
        modelEvents: {
            "change": "render"
        },
        onBeforeShow: function() {
            App.getRegion("modalOverlayRegion").$el.modal("show");

            //display page with edits loaded from server
            //this.model.getServerRevisedSourceDocumentationPage(function(pageSource) {
            //    this.model.set({source: pageSource});
            //    App.getRegion("modalOverlayRegion").$el.modal("hide");
            //}.bind(this));

            this.model.getSourceDocumentationHTML(function (result) {
                this.model.set({source: result});
                this.removeSelectionsFromPage();
                App.getRegion("modalOverlayRegion").$el.modal("hide");
            }.bind(this));
        },
        //old method of removing selections directly from the DOM
        removeSelectionsFromPage: function() {
            this.model.getSelections(function(selections) {
                var contents = document.getElementById("content");
                selections.forEach(function(item) {
                    //                    source = source.replace(item.body_html, "REMOVED");
                    contents.innerHTML = contents.innerHTML.replace(item.body_html, "");
                });
            });
        },
        downloadContentFromStream: function() {
            var language = App.reqres.request("getLanguage");
            var filename = App.reqres.request("getFilename");

            $("form #contents").val(document.getElementById("content").innerHTML);
            $("form #lang").val(language);
            $("form #file").val(filename);
            $("form[name=download]").attr("action", config.appRoot + "/api/stream");
            $("form[name=download]").submit();
        }
    });

    var ReviewController = App.Controller.extend({
        loadReviewView: function(language, filename) {
            console.log("loading review view");
            App.commands.execute("nav:update", "review", language, filename);

            if(language && filename) {
                var model = new ReviewModel();
                var view = new ReviewView({model: model});
            }
            else {
                var view = new App.DefaultView();
            }

            App.contentRegion.show(view);
        }
    });

    var controller = new ReviewController();

    var ReviewRouter = new App.Router({
        controller: controller,
        appRoutes: {
            "review(/:language)(/:filename)": "loadReviewView"
        }
    });

});