#target indesign

#include "json2.js"
#include "functions.jsx"

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
myDocumentPreferences.pageWidth = content.pageWidth;
myDocumentPreferences.pageHeight = content.pageHeight;

// Sets bleed on all edges (others follow top when documentBleedUniformSize is true)
myDocumentPreferences.documentBleedTopOffset = content.bleedSize;

var pages = ["frontPage", "backPage"];

for (var i = 0; i < pages.length; i++) {
    if (content[pages[i]]) {
        var pageContent = content[pages[i]]["content"];

        // Add the page in InDesign
        var page = null;
        if (pages[i] === "frontPage")
            page = myDocument.pages.item(0);
        else {
            page = myDocument.pages.add();
        }

        // Set margin preferences
        if (content.marginPreferences) {
            // Loop through top, left, right, and bottom margin lengths
            for (var key in content.marginPreferences) {
                page.marginPreferences[key] = content.marginPreferences[key];
            }
        }

        // Apply page specific content
        //app.doScript(dir + pageContent.scriptName + ".jsx", ScriptLanguage.JAVASCRIPT);

        if (pageContent) {
            addPageItems(page, pageContent);
        }
    }
    
}