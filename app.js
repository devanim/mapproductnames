// require csvtojson module
const CSVToJSON = require('csvtojson');
const fs = require('fs');
// convert users.csv file to JSON array
const csvwriter = require('csv-writer');
var createCsvWriter = csvwriter.createObjectCsvWriter

// Passing the column names intp the module
const csvWriter = createCsvWriter({

    // Output csv file name is geek_data
    path: 'geek_data.csv',
    header: [

        // Title of the columns (column_names)
        { id: 'id', title: 'ID' },
        { id: 'denumireprodus', title: 'denumireprodus' },
        { id: 'denumireprodus_extra', title: 'denumireprodus_extra' },
        { id: 'denumireprodusOld', title: 'denumireprodusOld' },
    ]
});

CSVToJSON().fromFile('input/SugestiiDenumiriProduse.csv')
    .then(productNamingSuggestions => {
        // users is a JSON array
        // log the JSON array
        //console.log(productNamingSuggestions);
        const data = JSON.stringify(productNamingSuggestions);
        fs.writeFile('./sugestii.json', data, 'utf8', (err) => {

            if (err) {
                console.log(`Error writing file: ${err}`);
            } else {
                console.log(`File is written successfully!`);
            }

        });
    }).catch(err => {
        // log error if any
        console.log(err);
    });

CSVToJSON().fromFile('input/DenumiriProdusePieseAuto.csv')
    .then(productNames => {
        try {
            const data = fs.readFileSync('./sugestii.json', 'utf8');
            const sugestii = JSON.parse(data);
            let i = 1;
            productNames.forEach((productName) => {
                i++;
                //f (i < 500) {
                sugestii.forEach(sugestie => {
                    if (sugestie.nume === productName.denumireprodus) {
                        productName.denumireprodusOld = productName.denumireprodus;
                        productName.denumireprodus = sugestie.sugestie;
                    }
                });
                //}
            })

            csvWriter
                .writeRecords(productNames)
                .then(() => console.log('Data uploaded into csv successfully'));

        } catch (err) {
            console.log(`Error reading file from disk: ${err}`);
        }


    }).catch(err => {
        // log error if any
        console.log(err);
    });

