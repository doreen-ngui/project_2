// DOM Elements
const fromCurrency = document.getElementById('from-currency');
const toCurrency = document.getElementById('to-currency');
const amountInput = document.getElementById('amount');
const convertBtn = document.getElementById('convert-btn');
const swapBtn = document.getElementById('swap-currencies');
const resultDisplay = document.getElementById('result-display');
const conversionResult = document.getElementById('conversion-result');
const conversionRate = document.getElementById('conversion-rate');
const conversionDate = document.getElementById('conversion-date');
const ratesTableBody = document.getElementById('rates-table-body');
const baseCurrencySelect = document.getElementById('base-currency-select');
const updateTime = document.getElementById('update-time');
const fromSymbol = document.getElementById('from-symbol');
const loadingConverter = document.getElementById('loading-converter');
const apiStatus = document.getElementById('api-status');

// Currency data with symbols and names
const currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$', flag: '🇺🇸' },
    { code: 'KES', name: 'Kenyan Shilling', symbol: 'KSh', flag: '🇰🇪' },
    { code: 'EUR', name: 'Euro', symbol: '€', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', symbol: '£', flag: '🇬🇧' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥', flag: '🇯🇵' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '🇦🇺' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '🇨🇦' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', flag: '🇨🇭' },
    { code: 'CNY', name: 'Chinese Yuan', symbol: '¥', flag: '🇨🇳' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹', flag: '🇮🇳' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$', flag: '🇸🇬' },
    { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$', flag: '🇳🇿' },
    { code: 'MXN', name: 'Mexican Peso', symbol: '$', flag: '🇲🇽' },
    { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '🇧🇷' },
    { code: 'ZAR', name: 'South African Rand', symbol: 'R', flag: '🇿🇦' },
    { code: 'KRW', name: 'South Korean Won', symbol: '₩', flag: '🇰🇷' },
    { code: 'TRY', name: 'Turkish Lira', symbol: '₺', flag: '🇹🇷' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', flag: '🇦🇪' }
];

// Exchange rates data
let exchangeRates = {};
let baseCurrency = 'USD';

// Initialize the application
async function initApp() {
    // Populate currency dropdowns
    populateCurrencyDropdowns();
    
    // Fetch exchange rates
    await fetchExchangeRates();
    
    // Set up event listeners
    setupEventListeners();
    
    // Hide loading indicator
    loadingConverter.style.display = 'none';
    resultDisplay.style.display = 'block';
    
    // Perform initial conversion
    performConversion();
}

// Populate currency dropdowns
function populateCurrencyDropdowns() {
    let fromOptions = '';
    let toOptions = '';
    let baseOptions = '';
    
    currencies.forEach(currency => {
        const option = `<option value="${currency.code}">${currency.code} - ${currency.name}</option>`;
        
        fromOptions += option;
        toOptions += option;
        baseOptions += `<option value="${currency.code}">${currency.code} (${currency.name})</option>`;
    });
    
    fromCurrency.innerHTML = fromOptions;
    toCurrency.innerHTML = toOptions;
    baseCurrencySelect.innerHTML = baseOptions;
    
    // Set default values
    fromCurrency.value = 'USD';
    toCurrency.value = 'KES';
    baseCurrencySelect.value = 'USD';
    
    // Update currency symbol
    updateCurrencySymbol();
}

// Fetch exchange rates from API
async function fetchExchangeRates() {
    apiStatus.textContent = 'Fetching data...';
    apiStatus.style.color = 'var(--beige-deep)';
    
    try {
        // Using ExchangeRate-API (free tier)
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
        
        if (!response.ok) {
            throw new Error(`API returned status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Store exchange rates
        exchangeRates = data.rates;
        
        // Update UI with fetched data
        updateTime.textContent = new Date().toLocaleString();
        updateExchangeRatesTable();
        
        apiStatus.textContent = 'Live data loaded';
        apiStatus.style.color = 'green';
        
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
        
        // Fallback to static data if API fails
        useFallbackData();
        apiStatus.textContent = 'Using cached data';
        apiStatus.style.color = 'orange';
    }
}

// Use fallback data when API fails
function useFallbackData() {
    // Static fallback exchange rates
    const fallbackRates = {
        USD: 1, KES: 130, EUR: 0.92, GBP: 0.79, JPY: 149.50,
        AUD: 1.56, CAD: 1.37, CHF: 0.90, CNY: 7.30,
        INR: 83.20, SGD: 1.36, NZD: 1.68, MXN: 18.25,
        BRL: 5.05, ZAR: 18.90, KRW: 1342.50, TRY: 28.75, AED: 3.67
    };
    
    exchangeRates = fallbackRates;
    updateTime.textContent = new Date().toLocaleString();
    updateExchangeRatesTable();
}

// Update exchange rates table
function updateExchangeRatesTable() {
    let tableHTML = '';
    
    // Get popular currencies to display
    const popularCurrencies = ['KES','EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR'];
    
    popularCurrencies.forEach(currencyCode => {
        const currency = currencies.find(c => c.code === currencyCode);
        if (!currency || !exchangeRates[currencyCode]) return;
        
        // Calculate a random change for demonstration
        const change = (Math.random() * 2 - 1).toFixed(3);
        const changeSymbol = change >= 0 ? '+' : '';
        
        tableHTML += `
            <tr>
                <td><span style="font-size: 1.2em;">${currency.flag}</span> ${currency.name}</td>
                <td><strong>${currency.code}</strong></td>
                <td>${exchangeRates[currencyCode].toFixed(4)}</td>
                <td style="color: ${change >= 0 ? 'green' : 'red'}">${changeSymbol}${change}%</td>
            </tr>
        `;
    });
    
    ratesTableBody.innerHTML = tableHTML;
}

// Perform currency conversion
function performConversion() {
    const amount = parseFloat(amountInput.value);
    const fromCurr = fromCurrency.value;
    const toCurr = toCurrency.value;
    
    // Validate amount
    if (isNaN(amount) || amount <= 0) {
        conversionResult.textContent = 'Invalid amount';
        conversionRate.textContent = 'Please enter a valid number';
        return;
    }
    
    // Check if we have the exchange rates
    if (!exchangeRates[fromCurr] || !exchangeRates[toCurr]) {
        conversionResult.textContent = 'Data unavailable';
        conversionRate.textContent = 'Exchange rate data not available';
        return;
    }
    
    // Calculate conversion
    const amountInBaseCurrency = amount / exchangeRates[fromCurr];
    const convertedAmount = amountInBaseCurrency * exchangeRates[toCurr];
    
    // Get currency symbols
    const fromCurrencyData = currencies.find(c => c.code === fromCurr);
    const toCurrencyData = currencies.find(c => c.code === toCurr);
    
    // Update result display
    conversionResult.textContent = `${toCurrencyData.symbol} ${convertedAmount.toFixed(2)}`;
    
    // Calculate and display exchange rate
    const rate = exchangeRates[toCurr] / exchangeRates[fromCurr];
    conversionRate.textContent = `1 ${fromCurr} = ${rate.toFixed(4)} ${toCurr}`;
    
    // Update date
    conversionDate.textContent = `Date: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`;
}

// Update currency symbol based on selected currency
function updateCurrencySymbol() {
    const selectedCurrency = currencies.find(c => c.code === fromCurrency.value);
    if (selectedCurrency) {
        fromSymbol.textContent = selectedCurrency.symbol;
    }
}

// Swap the from and to currencies
function swapCurrencies() {
    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;
    
    updateCurrencySymbol();
    performConversion();
}

// Change base currency for rates table
function changeBaseCurrency() {
    baseCurrency = baseCurrencySelect.value;
    
    // Show loading state
    ratesTableBody.innerHTML = `
        <tr>
            <td colspan="4" style="text-align: center;">
                <div class="loading">
                    <div class="spinner"></div>
                    <p>Loading exchange rates for ${baseCurrency}...</p>
                </div>
            </td>
        </tr>
    `;
    
    // Fetch new rates with new base currency
    fetchExchangeRates();
}

// Set up event listeners
function setupEventListeners() {
    convertBtn.addEventListener('click', performConversion);
    swapBtn.addEventListener('click', swapCurrencies);
    
    fromCurrency.addEventListener('change', () => {
        updateCurrencySymbol();
        performConversion();
    });
    
    toCurrency.addEventListener('change', performConversion);
    amountInput.addEventListener('input', performConversion);
    baseCurrencySelect.addEventListener('change', changeBaseCurrency);
    
    // Auto-refresh rates every 60 seconds
    setInterval(fetchExchangeRates, 60000);
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);