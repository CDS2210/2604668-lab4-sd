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
                    if (borderCountry.flags && borderCountry.flags.png) {
                        li.innerHTML = `<img src="${borderCountry.flags.png}" alt="${borderCountry.name.common} flag" /> ${borderCountry.name.common}`;
                    } else {
                        li.innerHTML = `${borderCountry.name.common} (Flag not available)`;
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
        bordersList.innerHTML = '<li>No bordering countries.</li>';
    }
}

