App.module("Selections", function(SelectionsModule, App, Backbone, Marionette, $, _) {
    var SelectionsCollection = Backbone.Collection.extend({
        initialize: function(options) {
            //if(options.pollingInterval) {
            //    var collection = this;
            //    this.timerId = setInterval(function () {
            //        collection.getSelections(true, function (results) {
            //            console.log(results);
            //        });
            //    }, options.pollingInterval);
            //}
        },
        getSelections: function(callback) {
            $.get({
                url: config.appRoot + "/api/selections",
                data: {
                    "language": App.reqres.request("getLanguage"),
                    "filename": App.reqres.request("getFilename")
                },
                dataType: "json",
                success: function(result) {
                    callback(result);
                }
            });
        },

        deleteSelection: function(id, callback) {
            $.ajax({
                url: config.appRoot + "/api/selections/" + id,
                method: 'DELETE',
                dataType: "json",
                success: function(result) {
                    callback(result);
                }
            });
        }
    });

    var SelectionsDefaultView = Marionette.ItemView.extend({
        template: Handlebars.templates.selectionsview,
        className: "content col-md-12"
    });

    var SelectionsRowView = Marionette.ItemView.extend({
        template: Handlebars.templates.selectionsrow,
        className: "row row-striped row-eq-height"
    });

    var SelectionsTableView = Marionette.CompositeView.extend({
        className: "content col-md-12",
        emptyView: App.EmptyView,
        template: Handlebars.templates.selectionstable,
        childView: SelectionsRowView,
        //render: function(e) {console.log(this);
        //    var data = this.collection.toJSON();
        //    for(var i=0; i<data.length; i++) {
        //        //                data[i].body_html = data[i].body_html.replace(/\\"/g,'"');
        //        //                data[i].body_html = data[i].body_html.replace(/\\'/g,"'");
        //        //                console.log(data[i].body_html);
        //    }
        //    //            console.log(this.collection.toJSON());
        //    var list = this.template({ selections: data });
        //    this.$el.html(list);
        //    //$(".content").find("table").addClass("table"); //jquery hack to apply bootstrap style to tables
        //
        //    return this;
        //},
        onBeforeShow: function() {
            App.getRegion("modalOverlayRegion").$el.modal("show");
            this.collection.getSelections(function (results) {
                console.log(results);
                this.collection.reset(results);
                App.getRegion("modalOverlayRegion").$el.modal("hide");
            }.bind(this));
        },
        onDestroy: function() {
            clearInterval(this.timerId);
        },
        collectionEvents: {
            'add': 'setStatusNew',
            'all': 'render'
        },
        events: {
            "click #delete" : "deleteSelection"
        },
        deleteSelection: function(e) {
            var confirmDelete = confirm("Are you sure you want to delete this selection?");
            if (confirmDelete) {
                var selectionId = $(e.currentTarget).data('selectionId');
                deleteSelection(selectionId, function(result) {
                    //                console.log("deleted", result, this);
                    this.collection.remove(selectionId);
                }.bind(this));
            } else {
                console.log("Cancelled deletion");
            }
        },
        setStatusNew: function(model) {console.log("setStatusNew");
            model.set({status: true});
            setTimeout(function() {
                this.set({status: false});
            }.bind(model), 3000);
        }
    });

    var SelectionsController = App.Controller.extend({
        loadSelectionsView: function(language, filename) {
            console.log("loading selections view");
            App.commands.execute("nav:update", "selections", language, filename);

            if(language && filename) {
                var selections = new SelectionsCollection({
                    //pollingInterval: 10000
                });
                var view = new SelectionsTableView({
                    collection: selections
                });
            }
            else {
                var view = new App.DefaultView();
            }
            App.contentRegion.show(view);
        }
    });

    var controller = new SelectionsController();console.log(controller);

    var SelectionsRouter = new App.Router({
        controller: controller,
        appRoutes: {
            "selections": "loadSelectionsView",
            "selections/:language/:filename": "loadSelectionsView"
        }
    });

    this.on("start", function() {
        console.log(SelectionsModule);
        console.log("Module Started", this);
//    this.actionsCollection = new ActionsCollection();
    });
});