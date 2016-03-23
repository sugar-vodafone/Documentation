var applier, highlighter, highlightStore, language, filename, rootNode, rangeStore;

function getSelectionsFromServer(callback) {
    $.get({
        url: config.apiRoot + "/selections",
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

function getSelectionFromServerByRange(range, callback) {
    $.get({
        url: config.apiRoot + "/selections",
        data: {
            "range": range
        },
        dataType: "json",
        success: function(result) {
            callback(result);
        }
    });
}

function saveSelectionToServer(selection, callback) {
    $.post({
        url: config.apiRoot + "/selections",
        data: selection,
        dataType: "json",
        success: function (result) {
            callback(result);
        }
    });
}

function getSourceDocumentationPage(lang, file, callback) {
    $.get({
        url: config.apiRoot + "/" + lang + "/" + file + ".html",
        success: function (result) {
            //console.log(result);
            callback(result);
        }
    });
}

function getSelectedRange() {
    var range = rangy.getSelection().getRangeAt(0);

    return range;
}

function serializeSelectedRange() {
    var range = getSelectedRange();
    return (range) ? rangy.serializeRange(range, true, rootNode) : undefined;
}

function getSelectedText(html) {
    if(html)
        return rangy.getSelection().toHtml();
    else
        return rangy.getSelection().text();
}

function isValidSelection(offsets) {
    var selX = Math.abs(offsets['x_down'] - offsets['x_up']);
    var selY = Math.abs(offsets['y_down'] - offsets['y_up']);

    var sel = rangy.getSelection();
    //console.log(selX,selY,sel.nativeSelection.type);
    if((selX > 5 || selY > 5) && sel.nativeSelection.type == "Range") {
        console.log("valid selection");
        return true;
    }
    else {
        return false;
    }
}

function intersectsExistingRange(serialized_range) {
    var intersectsExistingRange = false;
    var newRange = rangy.deserializeRange(serialized_range, rootNode);

    for(var i=0; i<rangeStore.length; i++) {
        var range = rangy.deserializeRange(rangeStore[i], rootNode);
        if(intersectsExistingRange = newRange.intersectsRange(range))
            break;
    }

    return intersectsExistingRange;
}

function getIntersectingRange(serialized_range, return_serialized) {
    var newRange = rangy.deserializeRange(serialized_range, rootNode);
    var return_serialized = (return_serialized)?true:false;

    for(var i=0; i<rangeStore.length; i++) {
        var range = rangy.deserializeRange(rangeStore[i], rootNode);
        if(newRange.intersectsRange(range)) {
            if(return_serialized)
                return rangeStore[i];
            else
                return range;

            break;
        }
    }
}

//function hideHighlights() {
//    $(".selected").tooltipster("disable");
//    $(".selected").removeClass("tooltipstered");
//    highlighter.removeAllHighlights();
//}

//function showHighlights(ranges) {
//    hideHighlights(); //remove any existing highlights from the screen
//    highlighter.highlightRanges("selected", ranges);
//    $(".selected").tooltipster({
//        interactive: true,
//        position: "top",
//        content: "<span href='#' onclick='alertTest();' class='link'>Remove</span> this selection.",
//        contentAsHTML: true,
//        //autoClose: false
//    });
//}

//function alertTest() {
//    alert("Removing selection");
//}

//function showAllHighlights() {
//    var ranges = [];
//    for(var i=0; i<rangeStore.length; i++) {
//        try {
//            var range = rangy.deserializeRange(rangeStore[i], rootNode);
//            //range.document = document;
//            ranges.push(range);
//        }
//        catch(err) {
//            console.log(err);
//            getSelectionFromServerByRange(rangeStore[i], function(result) {
//                console.log(result);
//            });
//        }
//    }
//
//    showHighlights(ranges);
//}

//function showAllHighlightsNew() {
//    var sortedRangeStore = _.sortBy(rangeStore, function(val){ return -parseInt(val.split(",")[0].split(":")[0].replace(/\D+/g,'')); }); console.log(sortedRangeStore);
//
//    for(var i=0; i<sortedRangeStore.length; i++) {
//        try {
//            var el = document.createElement("span");
//            el.className = "selected";
//
//            var range = rangy.deserializeRange(sortedRangeStore[i], rootNode);
//            range.surroundContents(el);
//
//            //$(".selected").tooltipster({
//            //    interactive: true,
//            //    position: "top",
//            //    content: "<span class='link' data-range='"+sortedRangeStore[i]+"'>Remove</span> this selection.",
//            //    contentAsHTML: true,
//            //    //autoClose: false
//            //});
//        }
//        catch(err) {
//            console.log(err);
//            getSelectionFromServerByRange(sortedRangeStore[i], function(result) {
//                console.log(result);
//            });
//        }
//    }
//}

function addRangeToStore(serialized_range) {
    console.log("Added");
    rangeStore.push(serialized_range);
    //console.log(rangeStore);
}

function removeRangeFromStore(serialized_range) {
    console.log("Removed");
    for(var i=0; i<rangeStore.length; i++) {
        if(rangeStore[i] == serialized_range) {
            //console.log(rangeStore[i], serialized_range, i);
            rangeStore.splice(i, 1);
        }
    }
}

function handleUserSelection() {
    var selectionData = {
        "language": language,
        "filename": filename,
        "serialized_range": serializeSelectedRange(),
        "body_html": getSelectedText(true),
        "body_text": getSelectedText()
    };

    if(!intersectsExistingRange(selectionData.serialized_range)) {
        saveSelectionToServer(selectionData, function (selection) {
            console.log(selection);
            addRangeToStore(selection.serialized_range);
            //console.log(rangeStore);
            //showAllHighlights();
        });
    }
    else {
        //showAllHighlights();
        alert("You've already selected this range!");
    }
}

function beginPollingSelectionsFromServer() {
    setInterval(function() {
        getSelectionsFromServer(function(selections) {
            console.log(selections);
            rangeStore = [];
            selections.forEach(function(selection) {
                rangeStore.push(selection.serialized_range);
            });
            //hideHighlights();
            //showAllHighlights();
        });
    }, 30000);
}

function loadPage(lang, file) {
    console.log(lang, file);
    highlighter.removeAllHighlights();

    if(lang == undefined || file == undefined) {
        $("#content").empty();
        $("#footer").hide();
    } else {
        $("#footer").hide();
        $("#content").empty();
        $("#content").html("<h1>Loading...</h1>");
        rangeStore = [];
        getSourceDocumentationPage(lang, file, function(result) {
            $("#content").empty();
            $("#content").html(result);
            //$("#footer").show();
            getSelectionsFromServer(function(selections) {
                console.log(selections);
                selections.forEach(function(selection) {
                    rangeStore.push(selection.serialized_range);
                    //beginPollingSelectionsFromServer();
                });
                //showAllHighlights();
            });
        });
    }
}

$( document ).ready(function() {
    var offsets = [];
    rangy.init();
    applier = rangy.createClassApplier("selected");
    highlighter = rangy.createHighlighter(null,"TextRange"); //If this is too slow, can omit "TextRange" algorithm converter
    highlighter.addClassApplier(applier);
    rootNode = document.getElementById("content");
    rangeStore = [];

    $("body").on("mousedown", function(el) {//console.log(el);
        offsets['x_down'] = el.offsetX;
        offsets['y_down'] = el.offsetY;
        //hideHighlights();
    });

    $("body").on("mouseup", function(el) {//console.log(el);
        offsets['x_up'] = el.offsetX;
        offsets['y_up'] = el.offsetY;

        //isValidSelection(offsets);
        setTimeout(function() {
            if(isValidSelection(offsets)) {
                handleUserSelection();
            }
            //else
                //showAllHighlights();
        }, 100);
    });

    $("#fileList").on("change", function(el) {
        var val = $(el.currentTarget).val();
        var path = val.split("/");
        language = path[0];
        filename = path[1];
        loadPage(language, filename);
    });

    if(window.location.hash) {
        var hash = window.location.hash.substr(1,window.location.hash.length);
        $("#fileList").val(hash);
        $("#fileList").trigger("change");
    }

});


//$(".selected").tooltipster({
//    interactive: true,
//    position: "top",
//    content: "Click <a href='#'>here</a> to remove this selection.",
//    contentAsHTML: true,
//    //autoClose: false
//});