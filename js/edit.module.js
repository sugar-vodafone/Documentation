App.module("Edit", function(EditModule, App, Backbone, Marionette, $, _) {
    var SourceModel = Backbone.Model.extend({
        initialize: function() {
        },
        getSourceDocumentationHTML: function(callback) {
            var language = App.reqres.request("getLanguage");
            var filename = App.reqres.request("getFilename");

            $.get({
                url: config.appRoot + "/" + language + "/" + filename + ".html",
                success: function (result) {
                    callback(result);
                    //setTimeout(function() { callback(result); }, 3000);
                }
            });
        }
    });

    var EditCollection = Backbone.Collection.extend({
        getSelectionsFromServer: function(callback) {
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
        getSelectionFromServerByRange: function(range, callback) {
            $.get({
                url: config.appRoot + "/api/selections",
                data: {
                    "range": range
                },
                dataType: "json",
                success: function(result) {
                    callback(result);
                }
            });
        },
        saveSelectionToServer: function(selection, callback) {
            $.post({
                url: config.appRoot + "/api/selections",
                data: selection,
                dataType: "json",
                success: function (result) {
                    callback(result);
                }
            });
        },
        getSelectionRanges: function() {
            var ranges = [];
            this.each(function(model) {
                ranges.push(model.get('serialized_range'));
            });

            return ranges;
        }
    });

    var EditView = Marionette.ItemView.extend({
        initialize: function() {
            this.mouseOffsets = [];
            this.selectionsStore = new EditCollection();
        },
        template: Handlebars.templates.editview,
        className: "content col-md-12",
        onBeforeShow: function() {
            App.getRegion("modalOverlayRegion").$el.modal("show");
            //var model = this.model;
            this.model.getSourceDocumentationHTML(function(result) {
                this.model.set({source: result});
                App.getRegion("modalOverlayRegion").$el.modal("hide");
            }.bind(this));

            this.selectionsStore.getSelectionsFromServer(function(result) {
                this.selectionsStore.reset(result);
            }.bind(this));
        },
        handleUserSelection: function() {
            var selectionsStore = this.selectionsStore;

            var selectionData = {
                "language": App.reqres.request("getLanguage"),
                "filename": App.reqres.request("getFilename"),
                "serialized_range": this.serializeSelectedRange(),
                "body_html": this.getSelectedText(true),
                "body_text": this.getSelectedText()
            };

            if(!this.intersectsExistingRange(selectionData.serialized_range)) {
                selectionsStore.saveSelectionToServer(selectionData, function (selection) {
                    console.log(selection);
                    //addRangeToStore(selection.serialized_range);
                    selectionsStore.set({serialized_range: selection.serialized_range});
                    //console.log(rangeStore);
                    //showAllHighlights();
                });
            }
            else {
                //showAllHighlights();
                alert("You've already selected this range!");
            }
        },
        getSelectedRange: function() {
            var range = rangy.getSelection().getRangeAt(0);

            return range;
        },
        serializeSelectedRange: function() {
            var range = this.getSelectedRange();
            return (range) ? rangy.serializeRange(range, true, this.el) : undefined;
        },
        getSelectedText: function(html) {
            if(html)
                return rangy.getSelection().toHtml();
            else
                return rangy.getSelection().text();
        },
        isValidSelection: function(mouseOffsets) {
            var selX = Math.abs(mouseOffsets['x_down'] - mouseOffsets['x_up']);
            var selY = Math.abs(mouseOffsets['y_down'] - mouseOffsets['y_up']);

            var sel = rangy.getSelection();
            //console.log(selX,selY,sel.nativeSelection.type);
            if((selX > 5 || selY > 5) && sel.nativeSelection.type == "Range") {
                console.log("valid selection");
                return true;
            }
            else {
                return false;
            }
        },
        intersectsExistingRange: function(serialized_range) {
            var intersectsExistingRange = false;
            var newRange = rangy.deserializeRange(serialized_range, this.el);
            var rangeStore = this.selectionsStore.getSelectionRanges();

            for(var i=0; i<rangeStore.length; i++) {
                var range = rangy.deserializeRange(rangeStore[i], this.el);
                if(intersectsExistingRange = newRange.intersectsRange(range))
                    break;
            }

            return intersectsExistingRange;
        },
        getIntersectingRange: function(serialized_range, return_serialized) {
            var newRange = rangy.deserializeRange(serialized_range, this.el);
            var return_serialized = (return_serialized)?true:false;
            var rangeStore = this.selectionsStore.getSelectionRanges();

            for(var i=0; i<rangeStore.length; i++) {
                var range = rangy.deserializeRange(rangeStore[i], this.el);
                if(newRange.intersectsRange(range)) {
                    if(return_serialized)
                        return rangeStore[i];
                    else
                        return range;

                    break;
                }
            }
        },
        modelEvents: {
            "change": "render"
        },
        events: {
            "mousedown": "beginSelect",
            "mouseup": "endSelect"
        },
        beginSelect: function(e) {
            this.mouseOffsets['x_down'] = e.offsetX;
            this.mouseOffsets['y_down'] = e.offsetY;
            //hideHighlights();
        },
        endSelect: function(e) {
            this.mouseOffsets['x_up'] = e.offsetX;
            this.mouseOffsets['y_up'] = e.offsetY;

            //delay checking valid selection to give selection type time to update
            setTimeout(function() {
                if(this.isValidSelection(this.mouseOffsets)) {
                    this.handleUserSelection();
                }
            }.bind(this), 100);
        }
    });

    var EditController = App.Controller.extend({
        loadEditView: function(language, filename) {
            console.log("loading edit view");
            App.commands.execute("nav:update", "edit", language, filename);

            if(language && filename) {
                var model = new SourceModel();
                var view = new EditView({model: model});
            }
            else {
                var view = new App.DefaultView();
            }
console.log(view);
            App.contentRegion.show(view);
        }
    });

    var controller = new EditController();

    var EditRouter = new App.Router({
        controller: controller,
        appRoutes: {
            "": "loadDefaultView",
            "edit(/:language)(/:filename)": "loadEditView"
        }
    });

});