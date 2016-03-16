var applier, highlighter, highlights, language, filename, rootNode;

function getSourceDocumentationPage(lang, file, callback) {
    $.get({
        url: "http://localhost/clients/Vodafone/Documentation/" + lang + "/" + file + ".html",
        success: function (result) {
            //console.log(result);
            callback(result);
        }
    });
}

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

//TODO currently unused
//function deleteSelectionFromServer(selection) {
//    if(selection) {
//        var serializedSelection = getSerializedSelection(rangySelection);
//        $.delete({
//            url: "http://localhost/clients/Vodafone/Documentation/selections",
//            data: {
//                "serialized_selection": serializedSelection
//            },
//            dataType: "json",
//            success: function(result) {
//                deleteSelectionFromLocalStorage(result, true);
//            }
//        });
//    }
//}

function getSelectionsFromLocalStorage() {
    var data = JSON.parse(localStorage.getItem("vodafone_documentation_selections")) || [];
    return data;
}

function saveSelectionToLocalStorage(selection) {
    //deleteSelectionFromLocalStorage(selection);

    var data = getSelectionsFromLocalStorage();
    data.push(selection);
    data = JSON.stringify(data);
    localStorage.setItem("vodafone_documentation_selections", data);

    return data
}

function deleteSelectionFromLocalStorage(selection) {
    var data = getSelectionsFromLocalStorage();

    for(var i=0; i<data.length; i++) {
        if(selection.serialized_selection != data[i].serialized_selection)
            data.splice(i, 1);
    }

    localStorage.setItem("vodafone_documentation_selections", JSON.stringify(data));
    return data;
}

function downloadModifiedFile() {
    var html = $("body").html();
    var filename = window.location.pathname.split("/").pop();

    var base64doc = btoa(unescape(encodeURIComponent(html))),
        a = document.createElement('a'),
        e = document.createEvent("HTMLEvents");

    a.download = filename;
    a.href = 'data:text/html;base64,' + base64doc;
    e.initEvent('click');
    a.dispatchEvent(e);
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
            getSelectionsFromServer(function(selections) {
                selections.forEach(function(selection) {
                    //saveSelectionToLocalStorage(selection, true);
                    var rangySelection = getDeserializedSelection(selection.serialized_selection);
                    highlightSelection(rangySelection);
                });
            });
        });
    }
}

function checkForOverlappingSection() {
    //make a new highlight that aligns with or overlaps existing highlight
    //var a = highlighter.highlightSelection("selected")
    //get the selection for the existing highlight
    //???
    //get the range from newly combined highlight
    //var range = a[0].getRange()
    //add the range to the rangy selection objet
    //selection.addRange(range)
    //save selected text
    //saveSelectionToServer()

    //if(sel.rangeCount) {
    //    var range = sel.getRangeAt(0);
    //    var selections = JSON.parse(localStorage.getItem("vodafone_documentation_selections"));
    //    selections.forEach(function(selection) {
    //        console.log(selection.serialized_selection);
    //        if(rangy.canDeserializeSelection(selection.serialized_selection)) {
    //            var existingRange = getDeserializedSelection(selection.serialized_selection);
    //            console.log(range, existingRange);
    //            if(range.intersectsOrTouchesRange(existingRange)) {
    //                //deleteRange(range);
    //                console.log(selection.serialized_selection);
    //            }
    //        }
    //    });
    //}

    //if(overlaps)
    //    deleteRange(range);
    //else
    //    saveSelectionToServer();

    var rangySelection = getCurrentSelection();

    if(rangySelection) {
        var selectionData = {
            "language": language,
            "filename": filename,
            "serialized_selection": getSerializedSelection(rangySelection),
            "body_html": rangySelection.toHtml(),
            "body_text": rangySelection.text()
        };

        saveSelectionToServer(selectionData, function (selection) {
            console.log(selection);
            if (selection.status == "Added") {
                highlightSelection(rangySelection);
                saveSelectionToLocalStorage(selection);
            }
            else {
                unhighlightSelection(rangySelection);
            }
        });
    }
}

function highlightSelection(rangySelection) {
    //console.log(rangySelection);
    highlighter.highlightSelection("selected", {'selection': rangySelection});
    saveHighlights();
    rangySelection.removeAllRanges();
}

function saveHighlights() {
    highlights = highlighter.serialize();
}

function hideHighlights() {
    saveHighlights();
    highlighter.removeAllHighlights();
}

function showHighlights() {
    highlighter.deserialize(highlights);
}

function unhighlightSelection(rangySelection) {
    //console.log(rangySelection);
    highlighter.unhighlightSelection(rangySelection);
    //rangySelection.removeAllRanges();
}

function getCurrentSelection() {
    hideHighlights();
    var sel = rangy.getSelection();
    //console.log(sel);
    //showHighlights();
    return sel;
}

function getSerializedSelection(rangySelection) {
    saveHighlights();
    highlighter.removeAllHighlights();
    serializedSelection = rangy.serializeSelection(rangySelection, true, rootNode);
    highlighter.deserialize(highlights);
    return serializedSelection;
}

function getDeserializedSelection(serializedSelection) {
    //console.log(serializedSelection);
    var selection = rangy.deserializeSelection(serializedSelection, rootNode);
    return selection;
}

function getSelectedText() {
    return getCurrentSelection().toHtml()
}

$( document ).ready(function() {
    rangy.init();
    applier = rangy.createClassApplier("selected");
    highlighter = rangy.createHighlighter(null,"TextRange"); //If this is too slow, can omit "TextRange" algorithm converter
    highlighter.addClassApplier(applier);
    rootNode = document.getElementById("content");

    $("body").on("mouseup", function(el) {//console.log(el);
        if(getSelectedText() != "")
            checkForOverlappingSection();
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