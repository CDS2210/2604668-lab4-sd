// Get references to DOM elements
const submitButton = document.getElementById('submit-button');
const countryNameInput = document.getElementById('country-name');
const countryInfoSection = document.getElementById('country-info');
const borderingCountriesSection = document.getElementById('bordering-countries');

// Add an event listener for the submit button click
submitButton.addEventListener('click', async function() {
    const countryName = countryNameInput.value.trim();

    // Clear previous content
    countryInfoSection.innerHTML = '';
    borderingCountriesSection.innerHTML = '';

    // If country name is empty, show an error message
    if (!countryName) {
        countryInfoSection.innerHTML = '<p>Please enter a country name.</p>';
        return;
    }

    try {
        // Fetch data from the REST Countries API
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);

        // If the response is not ok, throw an error
        if (!response.ok) {
            throw new Error('Country not found. Please check the country name and try again.');
        }

        // Parse the JSON response
        const data = await response.json();

        // Extract relevant country information from the response
        const country = data[0];
        const capital = country.capital ? country.capital[0] : 'No capital available';
        const population = country.population.toLocaleString();
        const region = country.region;
        const flag = country.flags[1] || country.flags[0]; // Get the flag (may have two versions)

        // Display country information
        countryInfoSection.innerHTML = `
            <h3>Country: ${country.name.common}</h3>
            <img src="${flag}" alt="Flag of ${country.name.common}" width="100">
            <p><strong>Capital:</strong> ${capital}</p>
            <p><strong>Population:</strong> ${population}</p>
            <p><strong>Region:</strong> ${region}</p>
        `;

        // Handle bordering countries
        if (country.borders) {
            const borderCountries = await getBorderingCountries(country.borders);
            if (borderCountries.length > 0) {
                let borderingCountriesHTML = '<h4>Bordering Countries:</h4><ul>';
                borderCountries.forEach(border => {
                    borderingCountriesHTML += `
                        <li>${border.name} <img src="${border.flag}" alt="Flag of ${border.name}" width="30"></li>
                    `;
                });
                borderingCountriesHTML += '</ul>';
                borderingCountriesSection.innerHTML = borderingCountriesHTML;
            } else {
                borderingCountriesSection.innerHTML = '<p>No bordering countries available.</p>';
            }
        } else {
            borderingCountriesSection.innerHTML = '<p>This country has no bordering countries listed.</p>';
        }

    } catch (error) {
        // Display an error message if the fetch fails or country is not found
        countryInfoSection.innerHTML = `<p>Error: ${error.message}</p>`;
    }
});

// Function to fetch and return information about bordering countries
async function getBorderingCountries(borders) {
    const borderCountries = [];

    // Loop through all border country codes and fetch their information
    for (const borderCode of borders) {
        try {
            const response = await fetch(`https://restcountries.com/v3.1/alpha/${borderCode}`);
            if (response.ok) {
                const data = await response.json();
                const borderCountry = data[0];
                borderCountries.push({
                    name: borderCountry.name.common,
                    flag: borderCountry.flags[1] || borderCountry.flags[0] // Get the flag (may have two versions)
                });
            }
        } catch (error) {
            console.error('Error fetching border country:', error);
        }
    }

    return borderCountries;
}

