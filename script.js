document.addEventListener('DOMContentLoaded', function() {
    const countryInput = document.getElementById('country-input');
    const searchBtn = document.getElementById('search-btn');
    const countryInfo = document.getElementById('country-info');
    const borderingCountries = document.getElementById('bordering-countries');
    const errorMessage = document.getElementById('error-message');

    // Add event listener to search button
    searchBtn.addEventListener('click', searchCountry);
    
    // Add event listener for Enter key on input
    countryInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevent form submission
            searchCountry();
        }
    });

    function searchCountry() {
        const countryName = countryInput.value.trim();
        
        // Validate input
        if (countryName === '') {
            displayError('No country name entered');
            return;
        }
        
        // Clear previous results and errors
        countryInfo.innerHTML = '';
        borderingCountries.innerHTML = '';
        countryInfo.style.display = 'none';
        borderingCountries.style.display = 'none';
        errorMessage.textContent = '';
        
        // Show loading state
        displayError('Loading');
        
        // Fetch country data
        fetchCountryData(countryName);
    }

    function fetchCountryData(countryName) {
        fetch(`https://restcountries.com/v3.1/name/${countryName}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Country not found. Please try another country name.');
                }
                return response.json();
            })
            .then(data => {
                // Take the first country from the results
                const country = data[0];
                displayCountryInfo(country);
                
                // Check if the country has borders
                if (country.borders && country.borders.length > 0) {
                    fetchBorderingCountries(country.borders);
                } else {
                    displayBorderingCountries([]);
                }
            })
            .catch(error => {
                displayError(error.message);
            });
    }

    function fetchBorderingCountries(borderCodes) {
        fetch(`https://restcountries.com/v3.1/alpha?codes=${borderCodes.join(',')}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch bordering countries.');
                }
                return response.json();
            })
            .then(data => {
                displayBorderingCountries(data);
            })
            .catch(error => {
                displayError(error.message);
            });
    }

    function displayCountryInfo(country) {
        // Clear error/loading message
        errorMessage.textContent = '';
        
        // Extract required information
        const name = country.name.common;
        const capital = country.capital ? country.capital[0] : 'N/A';
        const population = country.population.toLocaleString();
        const region = country.region;
        const flagUrl = country.flags.png;
        

        countryInfo.innerHTML = `
            <header class="country-header">
                <img class="country-flag" src="${flagUrl}" alt="${name} flag">
                <h2 class="country-name">${name}</h2>
            </header>
            <article class="country-details">
                <p><strong>Capital:</strong> ${capital}</p>
                <p><strong>Population:</strong> ${population}</p>
                <p><strong>Region:</strong> ${region}</p>
            </article>
        `;
        
        // Show the country info section
        countryInfo.style.display = 'block';
    }

    function displayBorderingCountries(countries) {
        if (countries.length === 0) {
            borderingCountries.innerHTML = '<h2>No Bordering Countries</h2>';
        } else {
            let borderHTML = '<h2>Bordering Countries</h2>';
            borderHTML += '<ul class="border-countries-grid">';
            
            countries.forEach(country => {
                const name = country.name.common;
                const flagUrl = country.flags.png;
                
                borderHTML += `
                    <li class="border-country-card">
                        <img class="border-country-flag" src="${flagUrl}" alt="${name} flag">
                        <p class="border-country-name">${name}</p>
                    </li>
                `;
            });
            
            borderHTML += '</ul>';
            borderingCountries.innerHTML = borderHTML;
        }
        
        // Show the bordering countries section
        borderingCountries.style.display = 'block';
    }

    function displayError(message) {
        errorMessage.textContent = message;
    }
});
