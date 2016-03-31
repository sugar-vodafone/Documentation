App.module("Navigation", function(NavigationModule, App, Backbone, Marionette, $, _) {
    var NavMenuModel = Backbone.Model.extend({
        initialize: function() {
            App.reqres.setHandler("getLanguage", function() {
                return this.get('language');
            }.bind(this));
            App.reqres.setHandler("getFilename", function() {
                return this.get('filename');
            }.bind(this));
            App.commands.setHandler("nav:update", function(page, language, filename) {
                this.set({
                    page: page,
                    language: language,
                    filename: filename
                });
            }.bind(this));
        }
    });

    var NavMenuView = Marionette.ItemView.extend({
        template: Handlebars.templates.navmenu,
        //onRender: function(view) {
        //    console.log(view.model.get("filename"));
        //},
        serializeData: function() {
            //console.log(App.language, App.filename);
            var page = this.model.get("page");
            var language = this.model.get("language");
            var filename = this.model.get("filename");
            var fileList = this.model.get('fileList');
            fileList.map(function(item) {
                if(item.language == language && item.filename == filename)
                    item.active = true;
                else
                    item.active = false;
            });

            var data = {
                fileList: fileList,
                edit: (page == 'edit'),
                selections: (page == 'selections'),
                review: (page == 'review')
            };
            //console.log(data);
            return data;
        },
        getPageFromUrlFragment: function() {
            var fragment = Backbone.history.getHash();
            if(fragment.indexOf("/"))
                var page = fragment.split("/")[0];
            else
                var page = fragment;

            return page;
        },
        getSectionFromUrlFragment: function() {
            var fragment = Backbone.history.getHash();
            var parts;

            if(fragment.indexOf("/")) {
                parts = {
                    language: fragment.split("/")[1],
                    filename: fragment.split("/")[2]
                };
            }

            //var section = parts['language'] + "/" + parts['filename'];
            var section = parts;

            return section;
        },
        ui: {
            "fileList": "select.fileList",
            "pages": "ul.nav.pages",
            "clientDownloadBtn": ".download-btn1",
            "serverDownloadBtn": ".download-btn2",
            "toggleHighlightsBtn": ".toggle-highlights"
        },
        modelEvents: {
            'all': 'render'
        },
        events: {
            'change @ui.fileList': 'changeSelection',
            'click @ui.pages li': 'changePage',
            'click @ui.clientDownloadBtn': 'downloadFromStream',
            'click @ui.serverDownloadBtn': 'downloadFromServer',
            'click @ui.toggleHighlightsBtn': 'toggleHighlights'
        },
        changeSelection: function(e) { //rename to loadPage
            console.log(e);
            var val = this.ui.fileList.val();
            var path = val.split("/");
            var language = path[0];
            var filename = path[1];
            var page = this.model.get("page");

            if(language && filename)
                App.router.navigate(page+"/"+language+"/"+filename, {trigger: true});
            else
                App.router.navigate(page, {trigger: true});
        },
        changePage: function(e) {
            var page = $(e.currentTarget).attr('id');
            var language = this.model.get("language");
            var filename = this.model.get("filename");

            if(language && filename)
                App.router.navigate(page+"/"+language+"/"+filename, {trigger: true});
            else
                App.router.navigate(page, {trigger: true});
        },
        downloadFromStream: function(e) {
            var language = this.model.get("language");
            var filename = this.model.get("filename");

            if(language && filename) {
                App.commands.execute("downloadFromStream");
            }
            else {
                alert('Please select a file');
            }
        },
        downloadFromServer: function(e) {
            var language = this.model.get("language");
            var filename = this.model.get("filename");

            if(language && filename) {
                App.commands.execute("downloadFromServer");
            }
            else {
                alert('Please select a file');
            }
        },
        toggleHighlights: function() {
            App.commands.execute("edit:toggleHighlights");
        }
    });

    this.on("start", function() {
        //var navlist = new Backbone.Collection(config.fileList);
        var model = new NavMenuModel({
            fileList: config.fileList
        });
        //console.log(model);
        //console.log(navlist);
        var view = new NavMenuView({
            model: model
        });
        App.navigationRegion.show(view);

    });
});