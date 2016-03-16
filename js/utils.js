var applier, highlighter, highlights, language, filename, rootNode, ranges;

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

function saveHighlights(hl) {
    highlights = highlighter.serialize();
}

function hideHighlights() {
    //saveHighlights();
    highlighter.removeAllHighlights();
}

function showHighlights() {
    if(highlights)
        highlighter.deserialize(highlights);
}

function highlightSelection(serialized_range) {
    var rangySelection = rangy.deserializeSelection(serialized_range, rootNode);
    var hl = highlighter.highlightSelection("selected", {'selection': rangySelection});

    return hl;
}

function unhighlightSelection(serialized_range) {
    var rangySelection = rangy.deserializeSelection(serialized_range, rootNode);
    var hl = highlighter.unhighlightSelection(rangySelection);

    return hl;
}

function handleUserSelection() {
    var selectionData = {
        "language": language,
        "filename": filename,
        "serialized_range": serializeSelectedRange(),
        "body_html": getSelectedText(true),
        "body_text": getSelectedText()
    };
    //console.log(selectionData);

    saveSelectionToServer(selectionData, function (selection) {
        console.log(selection);

        if(selection.status == "Added")
            var hl = highlightSelection(selection.serialized_range);
        else
            var hl = unhighlightSelection(selection.serialized_range);
        console.log(hl);
        //else {
        //    for(var i=0; i<highlighter.highlights.length; i++) {
        //        if(highlighter.highlights[i])
        //    }
        //}

        showHighlights();

        if(highlights && hl)
            highlighter.highlights.push(hl[0]);

        saveHighlights();

        //rangy.getSelection().removeAllRanges();
    });
}

function loadPage(lang, file) {
    //console.log(lang, file);
    highlighter.removeAllHighlights();

    if(lang == undefined || file == undefined) {
        $("#content").empty();
        $("#footer").hide();
    } else {
        $("#footer").show();
        getSourceDocumentationPage(lang, file, function(result) {
            $("#content").html(result);
        });
    }
}

$( document ).ready(function() {
    rangy.init();
    applier = rangy.createClassApplier("selected");
    highlighter = rangy.createHighlighter(null,"TextRange"); //If this is too slow, can omit "TextRange" algorithm converter
    highlighter.addClassApplier(applier);
    rootNode = document.getElementById("content");

    $("body").on("mousedown", function(el) {//console.log(el);
        hideHighlights();
    });

    $("body").on("mouseup", function(el) {//console.log(el);
        setTimeout(function() {
            if(isValidSelection()) {
                handleUserSelection();
            }
            else
                showHighlights();
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