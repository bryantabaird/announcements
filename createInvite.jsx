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

var pages = content["pages"];
var firstPage = true;
for (var i = 0; i < pages.length; i++) {
    var page = pages[i];

    // Add the page in InDesign
    var myPage = null;
    alert(myDocument.pages.length);
    if (firstPage) {
        myPage = myDocument.pages.item(0);
        firstPage = false;
    }
    else {
        myPage = myDocument.pages.add();
    }

    // Set margin preferences
    if (content.marginPreferences) {
        // Loop through top, left, right, and bottom margin lengths
        for (var key in content.marginPreferences) {
            myPage.marginPreferences[key] = content.marginPreferences[key];
        }
    }

    if (page) {
        addPageItems(myPage, page);
    }    
}