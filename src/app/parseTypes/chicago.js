/*
This function will parse the data into chicago form. Once it is complete, it
will return the data back to the function the request was
sent from so it can return back to the frontend.
*/
async function parseDataChicago(citationData) {

    let newCitationData = JSON.parse(citationData);

    let name = `${newCitationData.results[0].csl.author[0].given} ${newCitationData.results[0].csl.author[0].family}`

    let titleOfStory = `"${newCitationData.results[0].csl.title}"`

    let publisher = newCitationData.results[0].csl.publisher;

    let dayPublished = newCitationData.results[0].feedback._publishedDay
    let yearPublished = newCitationData.results[0].feedback._publishedYear
    let datepublished = newCitationData.results[0].feedback._publishedMonth;
    datepublished = await parseDates(datepublished);

    let finalResult = `${name} ${titleOfStory}, published on ${datepublished} ${dayPublished}, ${yearPublished} by ${publisher}.`

    return finalResult;

}

/*
This function is to re-format the date into a more readable format. This format will
be number -> date. That will then be added to the citation and then returned back to the
main function.
*/
async function parseDates(date) {

    let returnVal = "";

    if(date == "01") {
        returnVal = "January";
    } else if(date == "02") {
        returnVal = "February";
    } else if(date == "03") {
        returnVal = "March";
    } else if(date == "04") {
        returnVal = "April";
    } else if(date == "05") {
        returnVal = "May";
    } else if (date == "06") {
        returnVal = "June";
    } else if (date == "07") {
        returnVal = "July";
    } else if (date == "08") {
        returnVal = "August";
    } else if (date == "09") {
        returnVal = "September";
    } else if (date == "10") {
        returnVal = "October";
    } else if (date == "11") {
        returnVal = "November";
    } else if (date == "12") {
        returnVal = "December";
    }

    return returnVal;
}

module.exports = {parseDataChicago}