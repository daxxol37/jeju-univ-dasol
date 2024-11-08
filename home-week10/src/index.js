    // form fields
    const form = document.querySelector('.form-data');
    const region1 = document.querySelector('#region1');
    const region2 = document.querySelector('#region2');
    const region3 = document.querySelector('#region3');
    const apiKey = document.querySelector('.api-key');
    // results
    const errors = document.querySelector('.errors');
    const loading = document.querySelector('.loading');
    const results = document.querySelector('.result-container');
    const usage1 = document.querySelector('.carbon-usage1');
    const usage2 = document.querySelector('.carbon-usage2');
    const usage3 = document.querySelector('.carbon-usage3');
    const fossilfuel1 = document.querySelector('.fossil-fuel1');
    const fossilfuel2 = document.querySelector('.fossil-fuel2');
    const fossilfuel3 = document.querySelector('.fossil-fuel3');
    const myregion1 = document.querySelector('.my-region1');
    const myregion2 = document.querySelector('.my-region2');
    const myregion3 = document.querySelector('.my-region3');
    const clearBtn = document.querySelector('.clear-btn');

    function reset(e) {
        e.preventDefault();
        chrome.storage.local.remove(['regionName1', 'regionName2', 'regionName3', 'apiKey'], () => {
            console.log('Data removed from chrome.storage.local');
            form.style.display = 'block';
            results.style.display = 'none';
            loading.style.display = 'none';
            clearBtn.style.display = 'none';
            errors.textContent = '';
            init();
        });
    }

    function init() {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            chrome.storage.local.get(['apiKey', 'regionName1', 'regionName2', 'regionName3'], (items) => {
                const { apiKey: storedApiKey, regionName1: storedRegion1, regionName2: storedRegion2, regionName3: storedRegion3 } = items;
                console.log('Fetched data from chrome.storage.local:', items);

                if (!storedApiKey || !storedRegion1 || !storedRegion2 || !storedRegion3) {
                    form.style.display = 'block';
                    results.style.display = 'none';
                    loading.style.display = 'none';
                    clearBtn.style.display = 'none';
                    errors.textContent = '';
                } else {
                    loading.style.display = 'block';
                    form.style.display = 'none';
                    results.style.display = 'none';
                    clearBtn.style.display = 'none';
                    displayCarbonUsage(storedApiKey, storedRegion1, storedRegion2, storedRegion3);
                }
            });
        } else {
            console.error('chrome.storage.local is not available. Ensure the code is running in an extension context.');
        }
    }

    function handleSubmit(e) {
        e.preventDefault();
        setUpUser(apiKey.value, region1.value, region2.value, region3.value);
    }

    const displayCarbonUsage = async (apiKey, region1, region2, region3) => {
        try {
            loading.style.display = 'block';
            errors.textContent = '';
            results.style.display = 'none';

            const [response1, response2, response3] = await Promise.all([
                axios.get('https://api.co2signal.com/v1/latest', {
                    params: { countryCode: region1 },
                    headers: { 'auth-token': apiKey },
                }),
                axios.get('https://api.co2signal.com/v1/latest', {
                    params: { countryCode: region2 },
                    headers: { 'auth-token': apiKey },
                }),
                axios.get('https://api.co2signal.com/v1/latest', {
                    params: { countryCode: region3 },
                    headers: { 'auth-token': apiKey },
                })
            ]);

            loading.style.display = 'none';
            form.style.display = 'none';
            
            myregion1.textContent = region1;
            usage1.textContent = response1.data.data.carbonIntensity != null 
                ? Math.round(response1.data.data.carbonIntensity) + ' grams (grams CO2 emitted per kilowatt hour)' 
                : 'No data available';
            fossilfuel1.textContent = response1.data.data.fossilFuelPercentage != null 
                ? response1.data.data.fossilFuelPercentage.toFixed(2) + '% (percentage of fossil fuels used to generate electricity)' 
                : 'No data available';

            myregion2.textContent = region2;
            usage2.textContent = response2.data.data.carbonIntensity != null 
                ? Math.round(response2.data.data.carbonIntensity) + ' grams (grams CO2 emitted per kilowatt hour)' 
                : 'No data available';
            fossilfuel2.textContent = response2.data.data.fossilFuelPercentage != null 
                ? response2.data.data.fossilFuelPercentage.toFixed(2) + '% (percentage of fossil fuels used to generate electricity)' 
                : 'No data available';

            myregion3.textContent = region3;
            usage3.textContent = response3.data.data.carbonIntensity != null 
                ? Math.round(response3.data.data.carbonIntensity) + ' grams (grams CO2 emitted per kilowatt hour)' 
                : 'No data available';
            fossilfuel3.textContent = response3.data.data.fossilFuelPercentage != null 
                ? response3.data.data.fossilFuelPercentage.toFixed(2) + '% (percentage of fossil fuels used to generate electricity)' 
                : 'No data available';

            results.style.display = 'block';
            clearBtn.style.display = 'block';
        } catch (error) {
            console.error(error);
            loading.style.display = 'none';
            results.style.display = 'none';
            form.style.display = 'block';
            clearBtn.style.display = 'none';
            errors.textContent = 'Sorry, we have no data for one or more of the regions you have requested.';
        }
    };


    function setUpUser(apiKey, regionName1, regionName2, regionName3) {
        if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
            chrome.storage.local.set({ apiKey, regionName1, regionName2, regionName3 }, () => {
                console.log('Data saved to chrome.storage.local:', { apiKey, regionName1, regionName2, regionName3 });
                loading.style.display = 'block';
                errors.textContent = '';
                clearBtn.style.display = 'none';
                displayCarbonUsage(apiKey, regionName1, regionName2, regionName3);
            });
        } else {
            console.error('chrome.storage.local is not available. Ensure the code is running in an extension context.');
        }
    }

    // Event listeners
    form.addEventListener('submit', (e) => handleSubmit(e));
    clearBtn.addEventListener('click', (e) => reset(e));

    init();
    