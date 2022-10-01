/*
This function will parse the data into chicago form. Once it is complete, it
will return the data back to the function the request was
sent from so it can return back to the frontend.
*/
async function parseDataMLA(citationData) {

    let newCitationData = JSON.parse(citationData);

    let name = `${newCitationData.results[0].csl.author[0].given} ${newCitationData.results[0].csl.author[0].family}`

    let titleOfStory = `"${newCitationData.results[0].csl.title}"`
    titleOfStory = await formatTitle(titleOfStory);

    let section = newCitationData.results[0].csl['title-short']

    let publisher = newCitationData.results[0].csl.publisher;

    let yearPublished = newCitationData.results[0].feedback._publishedYear

    let finalResult = `${name}. ${titleOfStory.slice(0, -1)}, ${section}, edited by ${name}, ${yearPublished}`

    return finalResult;

}

/*
This function is to re-format the date into a more readable format. This format will
be number -> date. That will then be added to the citation and then returned back to the
main function.
*/
async function formatTitle(title) {

    let returnVal = "";

    title = title.split(" ");

    for(let i = 0; i < title.length; i++){
        title[i] = title[i].charAt(0).toUpperCase() + title[i].slice(1) +  " ";
        returnVal = returnVal + title[i]
    }

    return returnVal;
}

module.exports = {parseDataMLA}