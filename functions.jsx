function addPageItems(page, content) {
    // Loop through all pageItems
    for (var contentKey in content) {
        var pageItems = content[contentKey];

        // Loop through each pageItem
        for (var i = 0; i < pageItems.length; i++) {
            var pageItem = pageItems[i];

            // Optionally add pageItem properties to frame
            if (pageItem["properties"])
                var frame = page[contentKey].add(pageItem["properties"]);

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