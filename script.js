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
    document.getElementById('region').textContent = country.region || 'N/A';
    
    // Set the flag, check if it exists
    const flagElement = document.getElementById('flag');
    if (country.flags && country.flags.png) {
        flagElement.src = country.flags.png;
        flagElement.alt = `${country.name.common} flag`;
    } else {
        flagElement.src = '';
        flagElement.alt = "Flag not available";
    }
    
    // Update the bordering countries
    const bordersList = document.getElementById('borders-list');
    // Clear the previous list
    while (bordersList.firstChild) {
        bordersList.removeChild(bordersList.firstChild);
    }
    
    if (country.borders && country.borders.length > 0) {
        // Create a counter to track when all borders are loaded
        let loadedBorders = 0;
        const totalBorders = country.borders.length;
        
        country.borders.forEach(border => {
            fetch(`https://restcountries.com/v3.1/alpha/${border}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Border country not found');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data && data.length > 0) {
                        const borderCountry = data[0];
                        const li = document.createElement('li');
                        
                        if (borderCountry.flags && borderCountry.flags.png) {
                            const img = document.createElement('img');
                            img.src = borderCountry.flags.png;
                            img.alt = `${borderCountry.name.common} flag`;
                            li.appendChild(img);
                            li.appendChild(document.createTextNode(` ${borderCountry.name.common}`));
                        } else {
                            li.textContent = `${borderCountry.name.common} (Flag not available)`;
                        }
                        
                        bordersList.appendChild(li);
                    }
                })
                .catch(error => {
                    console.error("Error fetching border country data:", error);
                    const li = document.createElement('li');
                    li.textContent = `Error fetching border country: ${border}`;
                    bordersList.appendChild(li);
                })
                .finally(() => {
                    loadedBorders++;
                    // If all borders have been processed and none loaded successfully,
                    // show a message
                    if (loadedBorders === totalBorders && bordersList.children.length === 0) {
                        const li = document.createElement('li');
                        li.textContent = 'Error loading bordering countries.';
                        bordersList.appendChild(li);
                    }
                });
        });
    } else {
        const li = document.createElement('li');
        li.textContent = 'No bordering countries.';
        bordersList.appendChild(li);
    }
}
