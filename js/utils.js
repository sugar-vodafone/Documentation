var applier, highlighter, highlightStore, language, filename, rootNode, rangeStore;

function getSelectionsFromServer(callback) {
    $.get({
        url: "http://localhost/clients/Vodafone/Documentation/selections",
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

function saveSelectionToServer(selection, callback) {
    $.post({
        url: "http://localhost/clients/Vodafone/Documentation/selections",
        data: selection,
        dataType: "json",
        success: function (result) {
            callback(result);
        }
    });
}

function getSourceDocumentationPage(lang, file, callback) {
    $.get({
        url: "http://localhost/clients/Vodafone/Documentation/" + lang + "/" + file + ".html",
        success: function (result) {
            //console.log(result);
            callback(result);
        }
    });
}

function getSelectedRange() {
    var range;

    if(isValidSelection()) {
        range = rangy.getSelection().getRangeAt(0);
    }

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

function isValidSelection() {
    var sel = rangy.getSelection();
    if(sel.nativeSelection.type == "Range")
        return true;
    else
        return false;
}

function hideHighlights() {
    highlighter.removeAllHighlights();
}

function showHighlights(ranges) {
    hideHighlights(); //remove any existing highlights from the screen
    highlighter.highlightRanges("selected", ranges);
}

function showAllHighlights() {
    var ranges = [];
    for(var i=0; i<rangeStore.length; i++) {
        var range = rangy.deserializeRange(rangeStore[i], rootNode);
        //range.document = document;
        ranges.push(range);
    }

    showHighlights(ranges);
}

function addRangeToStore(serialized_range) {
    console.log("Added");
    rangeStore.push(serialized_range);
    //console.log(rangeStore);
}

function removeRangeFromStore(serialized_range) {
    console.log("Removed");
    for(var i=0; i<rangeStore.length; i++) {
        if(rangeStore[i] == serialized_range) {
            console.log(rangeStore[i], serialized_range, i);
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

    saveSelectionToServer(selectionData, function (selection) {
        console.log(selection);

        if(selection.status == "Added")
            addRangeToStore(selection.serialized_range);
        else
            removeRangeFromStore(selection.serialized_range);
        console.log(rangeStore);
        showAllHighlights();

    });
}

function loadPage(lang, file) {
    console.log(lang, file);
    highlighter.removeAllHighlights();

    if(lang == undefined || file == undefined) {
        $("#content").empty();
        $("#footer").hide();
    } else {
        $("#footer").show();
        rangeStore = [];
        getSourceDocumentationPage(lang, file, function(result) {
            $("#content").empty();
            $("#content").html(result);
            getSelectionsFromServer(function(selections) {
                console.log(selections);
                selections.forEach(function(selection) {
                   rangeStore.push(selection.serialized_range);
                });
                showAllHighlights();
            });
        });
    }
}

$( document ).ready(function() {
    rangy.init();
    applier = rangy.createClassApplier("selected");
    highlighter = rangy.createHighlighter(null,"TextRange"); //If this is too slow, can omit "TextRange" algorithm converter
    highlighter.addClassApplier(applier);
    rootNode = document.getElementById("content");
    rangeStore = [];

    $("body").on("mousedown", function(el) {//console.log(el);
        hideHighlights();
    });

    $("body").on("mouseup", function(el) {//console.log(el);
        setTimeout(function() {
            if(isValidSelection()) {
                handleUserSelection();
            }
            else
                showAllHighlights();
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