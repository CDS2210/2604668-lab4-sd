// Function to fetch country data when the button is clicked
document.getElementById('fetch-country').addEventListener('click', fetchCountryData);

// Allow pressing Enter in the input field to trigger the search
document.getElementById('country-name').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        fetchCountryData();
    }
});

// Function to fetch country data from the API
function fetchCountryData() {
    const countryName = document.getElementById('country-name').value.trim();
    if (!countryName) {
        document.getElementById('error-message').textContent = 'Please enter a country name';
        return;
    }

    // Show loading state
    document.getElementById('error-message').textContent = 'Loading...';
    
    // Fetch country data from the REST Countries API
    fetch(`https://restcountries.com/v3.1/name/${countryName}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Country not found');
            }
            return response.json();
        })
        .then(data => {
            if (data && data.length > 0) {
                updateCountryInfo(data[0]);
            } else {
                throw new Error('No country information available');
            }
        })
        .catch(error => {
            document.getElementById('error-message').textContent = error.message;
            // Clear previous country info
            clearCountryInfo();
        });
}

// Function to clear country info when there's an error
function clearCountryInfo() {
    document.getElementById('capital').textContent = '';
    document.getElementById('population').textContent = '';
    document.getElementById('region').textContent = '';
    document.getElementById('flag').src = '';
    document.getElementById('flag').alt = '';
    document.getElementById('borders-list').innerHTML = '';
}

function updateCountryInfo(country) {
    // Clear any previous error message
    document.getElementById('error-message').textContent = '';
    // Update the country information
    document.getElementById('capital').textContent = country.capital ? country.capital[0] : 'N/A';
    document.getElementById('population').textContent = country.population ? country.population.toLocaleString() : 'N/A';
    document.getElementById('region').textContent = country.region;
    // Set the flag, check if it exists
    const flagElement = document.getElementById('flag');
    if (country.flags && country.flags.png) {
        flagElement.src = country.flags.png;
        flagElement.alt = `${country.name.common} flag`;
    } else {
        flagElement.src = '';  // Fallback or empty image
        flagElement.alt = "Flag not available";
    }
    // Update the bordering countries
    const bordersList = document.getElementById('borders-list');
    bordersList.innerHTML = ''; // Clear the previous list
    if (country.borders && country.borders.length > 0) {
        country.borders.forEach(border => {
            fetch(`https://restcountries.com/v3.1/alpha/${border}`)
                .then(response => response.json())
                .then(data => {
                    const borderCountry = data[0];
                    const li = document.createElement('li');
                    const img = document.createElement('img');
                    if (borderCountry.flags && borderCountry.flags.png) {
                        img.src = borderCountry.flags.png;
                        img.alt = `${borderCountry.name.common} flag`;
                        li.appendChild(img);
                        li.appendChild(document.createTextNode(` ${borderCountry.name.common}`));
                    } else {
                        li.textContent = `${borderCountry.name.common} (Flag not available)`;
                    }
                    bordersList.appendChild(li);
                })
                .catch(error => {
                    console.error("Error fetching border country data:", error);
                    const li = document.createElement('li');
                    li.textContent = "Error fetching border country data";
                    bordersList.appendChild(li);
                });
        });
    } else {
        const li = document.createElement('li');
        li.textContent = 'No bordering countries.';
        bordersList.appendChild(li);
    }
}
