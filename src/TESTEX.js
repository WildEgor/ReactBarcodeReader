let xlsx = require('../node_modules/xlsx')

let wb = xlsx.readFile('../public/api/save/test.xlsx');

let ws = wb.Sheets['New Data'];

let dataJSON = xlsx.utils.sheet_to_json(ws);

let newWB = xlsx.utils.book_new();

console.log(dataJSON);

function find_elem(elem) {
    return elem.partnumber === 123;
}

let indexOfRecord = dataJSON.findIndex(find_elem)

if (indexOfRecord != -1) {
    var removedData = dataJSON[indexOfRecord];
    dataJSON.splice(indexOfRecord, 1);
}

dataJSON.push(removedData)

let newWS = xlsx.utils.json_to_sheet(dataJSON);

console.log(dataJSON.findIndex(find_elem));

console.log(dataJSON);

xlsx.utils.book_append_sheet(newWB, newWS, "New Data");

xlsx.writeFile(newWB, "../public/api/save/test.xlsx");
