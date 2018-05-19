#target indesign

#include "json2.js"

var dir = "/Users/baird/Library/Preferences/Adobe InDesign/Version 13.0/en_US/Scripts/Scripts Panel/";

// Add a new document
var myDocument = app.documents.add();

// Parse JSON file
var content = getJSONFromFile(dir + "userResponses/userResponseA.json");

// Set measurement units to inches
myDocument.viewPreferences.horizontalMeasurementUnits = MeasurementUnits.INCHES;
myDocument.viewPreferences.verticalMeasurementUnits = MeasurementUnits.INCHES;

// Set document preferences
var myDocumentPreferences = myDocument.documentPreferences;
myDocumentPreferences.facingPages = false;
myDocumentPreferences.pageWidth = content["pageWidth"];
myDocumentPreferences.pageHeight = content["pageHeight"];

// Sets bleed on all edges (others follow top when documentBleedUniformSize is true)
myDocumentPreferences.documentBleedTopOffset = content.bleedSize;

var pages = content["pages"];
var firstPage = true;
for (var i = 0; i < pages.length; i++) {
    var page = pages[i];

    // Add the page in InDesign
    var myPage;
    if (firstPage) {
        myPage = myDocument.pages.item(0);
        firstPage = false;
    }
    else {
        myPage = myDocument.pages.add();
    }

    // Set margin preferences
    if (content["marginPreferences"]) {
        // Loop through top, left, right, and bottom margin lengths
        for (var key in content.marginPreferences) {
            myPage.marginPreferences[key] = content["marginPreferences"][key];
        }
    }

    if (page) {
        addItems(myPage, page);
    }    
}

// Help functions

function addItems(root, content) {
    // Loop through all pageItems
    for (var contentKey in content) {
        var pageItems = content[contentKey];

        // Loop through each pageItem
        for (var i = 0; i < pageItems.length; i++) {
            var pageItem = pageItems[i];

            // Optionally add pageItem properties to frame
            if (pageItem["properties"])
                var frame = root[contentKey].add(pageItem["properties"]);

            // Optionally run specified methods
            if (pageItem["methods"]) {
                var methods = pageItem["methods"];
                for (var j = 0; j < methods.length; j++) {
                    var method = pageItem["methods"][j];

                    // Handle special case of type conversion for image file
                    // Ideal to modify JSON inputs if there are many function calls
                    if (method["name"] === "place")
                        method["params"][0] = new File(method["params"][0])

                    // For now, only 1 parameter supported
                    frame[method["name"]](method["params"][0]);
                }
            }
        }
    }    
}

function evaluateJSONObject(obj) {
    for (var key in obj) {

        // Ignore object prototype properties
        if (!obj.hasOwnProperty(key))
            continue;

        // Recurse if object value is another object
        if (obj[key] !== null && typeof obj[key] == "object") {
            evaluateJSONObject(obj[key]);
        }

        // Evaluate the json property value, ignoring the "None" literal
        else {
            try {
                obj[key] = eval(obj[key])
            } catch (e) {
                // If the string can't be evaluated, do nothing
            }
        }
    }

    return obj;
}

function getJSONFromFile(fileLocation) {
    var fileContent = readFileContent(fileLocation)
    return evaluateJSONObject(JSON.parse(fileContent));
}

function readFileContent(fileLocation) {
    var scriptFile = File(fileLocation);
    scriptFile.open('r');  
    var content = scriptFile.read();  
    scriptFile.close();
    return content;
}