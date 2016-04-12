App.module("Review", function(ReviewModule, App, Backbone, Marionette, $, _) {
    var SourceModel = Backbone.Model.extend({
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

    var ReviewCollection = Backbone.Collection.extend({
        getSelectionsFromServer: function(callback) {
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
        }
    });

    var ReviewView = Marionette.ItemView.extend({
        initialize: function() {
            this.selectionsStore = new ReviewCollection();

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
                this.selectionsStore.getSelectionsFromServer(function(result) {
                    this.selectionsStore.reset(result);
                    this.cleanupDocument();
                    App.getRegion("modalOverlayRegion").$el.modal("hide");
                }.bind(this));
            }.bind(this));
        },
        removeSelectionsFromPage: function() {
            var ranges = this.getAllSelectionRanges();
            ranges.forEach(function(range) {
                range.deleteContents();
            });
        },
        cleanupDocument: function() {
            this.removeSelectionsFromPage();

            //TODO finish
            config.patterns.forEach(function(pattern) {
                //console.log(this.el, pattern);
                this.el.innerHTML = this.el.innerHTML.replace(pattern.search, pattern.replace);
            }.bind(this));
        },
        downloadContentFromStream: function() {
            var language = App.reqres.request("getLanguage");
            var filename = App.reqres.request("getFilename");

            $("form #contents").val(document.getElementById("content").innerHTML);
            $("form #lang").val(language);
            $("form #file").val(filename);
            $("form[name=download]").attr("action", config.appRoot + "/api/stream");
            $("form[name=download]").submit();
        },
        getAllSelectionRanges: function(serialized) {
            serialized = serialized || false;

            if(serialized) {
                var ranges = this.selectionsStore.pluck("serialized_range");
            }
            else {
                var ranges = this.selectionsStore.pluck("serialized_range").map(function(serialized_range) {
                    return rangy.deserializeRange(serialized_range, this.el);
                }.bind(this));
            }

            return ranges;
        },
    });

    var ReviewController = App.Controller.extend({
        loadReviewView: function(language, filename) {
            console.log("loading review view");
            App.commands.execute("nav:update", "review", language, filename);

            if(language && filename) {
                var model = new SourceModel();
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