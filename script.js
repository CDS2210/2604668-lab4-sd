document.getElementById('fetch-country').addEventListener('click', function() {
    const countryName = document.getElementById('country-name').value.trim();
    
    if (countryName == "") {
        showError("Please enter a country name.");
        return;
    }

    const CountrySite = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;

    fetch(CountrySite)
        .then(response => {
            if (!response.ok) {
                throw new Error('Country not found');
            }
            return response.json();
        })
        .then(data => {
            const country = data[0];
            updateCountryInfo(country);
        })
        .catch(error => {
            showError(error.message);
        });
});

function updateCountryInfo(country) {
    document.getElementById('error-message').textContent = '';
    document.getElementById('capital').textContent = country.capital ? country.capital[0] : 'N/A';
    document.getElementById('population').textContent = country.population.toLocaleString();
    document.getElementById('region').textContent = country.region;
    document.getElementById('flag').src = country.flags[1];
    

    const bordersList = document.getElementById('borders-list');
    bordersList.innerHTML = ''; 

    if (country.borders) {
        country.borders.forEach(border => {
            fetch(`https://restcountries.com/v3.1/alpha/${border}`)
                .then(response => response.json())
                .then(data => {
                    const borderCountry = data[0];
                    const li = document.createElement('li');
                    li.innerHTML = `<img src="${borderCountry.flags[1]}" alt="${borderCountry.name.common} flag" /> ${borderCountry.name.common}`;
                    bordersList.appendChild(li);
                });
        });
    } else {
        bordersList.innerHTML = '<li>No bordering countries.</li>';
    }
}

function showError(message) {
    document.getElementById('error-message').textContent = message;
}


