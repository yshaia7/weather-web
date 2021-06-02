/**
 * This function will trigger on error.
 *
 * if there is no picture for weather to show
 * will show default picture
 */
function weatherImageError() {
    document.getElementById("myImg").src = "photo/weatherFailed.png";
}

(function () {
    document.addEventListener('DOMContentLoaded', function () {

        document.getElementById("showLocation").addEventListener("click", fetchDataFromServer);
        document.getElementById("search_location").addEventListener("submit", getData);
        document.getElementById("deleteLocation").addEventListener("click", deleteLocation);
        document.getElementById("myImg").style.display = 'none';
        document.getElementById("selectList").style.display = 'none';

    }, false);

    /* arr that contain list of coordinate of longitude latitude*/
    var arrLocation = [];

    /**
     * This is a model dialog to show the user pop up messages
     *
     * @param {messageTitle} The Type of the message of the model dialog
     * @param {message} The body message of the model dialog
     *
     * Returns - Void
     */
    function openDialog(messageTitle = 'General Message', message) {

        /* insert the message alert into the model dialog */
        $('#exampleModal').find('.modal-title').text(messageTitle);
        $('#exampleModal').find('.modal-body').text(message);

        /* pop up the message on the screen */
        $('#exampleModal').modal('show');
    }

    /**
     * This Function fetch the inputs of the user
     * by the form method. the trigger of that function
     * is the submit button. the function catch the submit
     * and forward the extract values to the next function.
     *
     * function will trigger on button click
     *
     * Returns - Void
     */
    function getData() {

        /* catch the submit */
        event.preventDefault();

        /* extract inputs values */
        let location = document.getElementById("location-input");
        let longitude = document.getElementById("longitude-input");
        let latitude = document.getElementById("latitude-input");

        /* create new option in the options list */
        insertNewLocation(location, longitude.value, latitude.value);

        /* clean the inputs text after value was insert */
        location.value = '';
        longitude.value = '';
        latitude.value = '';
    }

    /**
     * This Function create new option element and insert into
     * the options list. also the function save each coordinate
     * into arr coordinate for fetch the weather later
     *
     * @param {loc} Location of the place to insert into the options list
     * @param {long} longitude of the place to insert into the options list
     * @param {lat} latitude of the place to insert into the options list
     *
     * Returns - Void
     */
    function insertNewLocation(loc, long, lat) {

        var optionList = document.getElementById("optionList");
        let locName = loc.value;

        /* validate the name or the coordinate not already exist */
        if (validateDuplicate(locName, long, lat)) {
            /* create new option and insert into the options list */
            var opt = document.createElement('option');
            opt.innerHTML = locName;
            optionList.appendChild(opt);

            document.getElementById("selectList").style.display = 'block';
            /* insert the lon and lat into arr location */
            arrLocation.push([long, lat]);
        }
    }

    /**
     * This Function Validate duplicate values
     *
     * @param {loc} Location of the place
     * @param {long} longitude of the place
     * @param {lat} latitude of the place
     *
     * Returns - Boolean that tell if value already
     * exist in the list options
     */
    function validateDuplicate(loc, long, lat) {

        /* check if the coordinate already exist in the list options*/
        let find = arrLocation.find(x => x.every(y => [long, lat].includes(y)));
        if (find) {
            openDialog('Duplicate Location coordination',
                'your Location coordination already exist');
            return false;
        }

        /* check if the Location name already exist in the list options*/
        if ($('#optionList').find("option:contains('" + loc + "')").length) {
            openDialog('Duplicate Location Name',
                loc + ' Location already exist is the list');
            return false;
        }
        return true;
    }

    /**
     * This Function fetch the selected value
     * location for display the correct location weather
     *
     * function will trigger on button click
     *
     * Returns - Void
     */
    function fetchDataFromServer() {

        let longitude;
        let latitude;
        let selectElement = document.getElementById("optionList");
        let place = selectElement.selectedIndex;

        /* if list is empty and user click on show weather, nothing to display */
        if (selectElement.childElementCount > 0) {
            longitude = arrLocation[place][0];
            latitude = arrLocation[place][1];
            /* fetch the coordinate weather from the remote server */
            fetchWeatherData(longitude, latitude);
        } else {
            openDialog('Database Error Massage',
                'your Location list is empty, please insert new location');
        }
    }

    /**
     * This Function get weather database arr
     * and insert the data into html table
     *
     * @param {arrWeather} 7 days weather Data
     *
     * Returns - Void
     */
    function displayWeatherResult(arrWeather) {

        let table = document.getElementById('mytable');
        let k = 0;

        /* insert weather of 7 day into html table*/
        for (var i = 1; row = table.rows[i]; i++) {
            row.cells[1].innerHTML = arrWeather[k].weather;
            row.cells[2].innerHTML = arrWeather[k].temp2m.min + "-" + arrWeather[k].temp2m.max + " degrees";
            arrWeather[k].wind10m_max == 1 ? row.cells[3].innerHTML = '' :
                row.cells[3].innerHTML = arrWeather[k].wind10m_max;
            k++;
        }
        displayPicture();
    }


    /**
     * This Function get weather database arr
     * and insert the data into html table
     *
     * @param {arrWeather} 7 days weather Data
     *
     * Returns - Void
     */
    function displayPicture() {

        /* get the correct selected value from the Location list*/
        let selectElement = document.getElementById("optionList");
        let place = selectElement.selectedIndex;

        let longitude = arrLocation[place][0];
        let latitude = arrLocation[place][1];

        /* build the url for the image*/
        let img = "http://www.7timer.info/bin/astro.php? lon=" +
            longitude +
            "&lat=" +
            latitude +
            "&ac=0&lang=en&unit=metric&output=internal&tzshift=0";

        /* show the image*/
        document.getElementById("myImg").setAttribute("src", img);

        /* if image hidden cancel hidden affect*/

            document.getElementById("myImg").style.display = 'block';

    }

    /**
     * This Function build the url of arr weather to fetch
     *
     * @param {longitude} longitude coordinate
     * @param {latitude} latitude coordinate
     *
     * Returns - url for fetch the weather arr of 7 day to the relevant locations
     */
    function buildUrlOfWeatherToFetch(longitude, latitude) {

        let url = "http://www.7timer.info/bin/api.pl?lon=" +
            longitude + "&lat=" +
            latitude +
            "&product=civillight&output=json";

        return url;
    }

    /**
     * This Function delete location from options list
     * and insert the data into html table
     *
     * function will trigger on button click
     *
     * Returns - url for fetch the weather arr of 7 day to the relevant locations
     */
    function deleteLocation() {

        /* get the correct location to delete */
        let selectElement = document.getElementById("optionList");
        let locToDelete = selectElement.selectedIndex;

        /* if list of the locations is not empty, there is value to delete */
        if (selectElement.childElementCount > 0) {
            arrLocation.splice(locToDelete, 1);
            selectElement.remove(locToDelete);

            /* clean the weather table after delete the location */
            cleanWeatherTable();

            /* clean the image after delete the location */
            document.getElementById("myImg").setAttribute("src", '');

        } else { /* list of locations is empty, nothing to delete*/
            openDialog('Database Error Massage',
                'your Location list is empty, nothing to delete');
        }
        /* hide the locations list if there is no locations on the list*/
        if (selectElement.childElementCount == 0) {
            document.getElementById("selectList").style.display = 'none';
        }
        document.getElementById("myImg").style.display  = 'none';

    }

    /**
     * This Function clean weather table
     */
    function cleanWeatherTable() {

        let table = document.getElementById('mytable');

        let k = 0;
        for (var i = 1; row = table.rows[i]; i++) {

            row.cells[1].innerHTML = '';
            row.cells[2].innerHTML = '';
            row.cells[3].innerHTML = '';

            k++;
        }
    }

    /**
     * This Function fetch the arr weather from the remote
     *
     * @param {long} longitude coordinate to fetch
     * @param {lat} latitude coordinate to fetch
     *
     */
    function fetchWeatherData(long, lat) {
        fetch(buildUrlOfWeatherToFetch(long, lat))
            .then(function (response) {
                    // handle the error
                    if (response.status !== 200) {
                        openDialog('Server Error Data Message',
                            'look like you have error with get the data of the weather');
                        return;
                    }
                    return response.json();
                }
                /* extract the 7 day arr from the json */
            ).then((responseData) => {
            return responseData.dataseries;
        })
            /* display the weather */
            .then(displayWeatherResult)
            .catch(function (err) {
                openDialog('Server Error Connection Message',
                    'weather forecast service is not available right now, please try again later');
            });
    };

})();



