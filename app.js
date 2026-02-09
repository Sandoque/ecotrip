// Constantes
// Fatores de emissão em kg CO₂ por passageiro-km (estimativas para demo)
const EMISSION_FACTORS = {
    // Bicicleta: zero emissão direta
    bicicleta: 0,
    // Carro médio por passageiro-km
    carro: 0.192,
    // Ônibus por passageiro-km (inferior ao carro, simplificado)
    onibus: 0.105,
    // Caminhão por passageiro-km (alto, aproximado)
    caminhao: 0.800
};

let selectedModal = null;
let debounceTimers = {};

// Debounce function
function debounce(func, delay) {
    return function(...args) {
        clearTimeout(debounceTimers[func.name]);
        debounceTimers[func.name] = setTimeout(() => func.apply(this, args), delay);
    };
}

// Autocomplete
async function fetchAutocomplete(query) {
    if (query.length < 3) return [];
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`;
    const response = await fetch(url);
    if (!response.ok) return [];
    const data = await response.json();
    return data.map(item => item.display_name);
}

function showAutocomplete(inputId, suggestions) {
    const list = document.getElementById(`autocomplete-${inputId}`);
    list.innerHTML = '';
    if (suggestions.length > 0) {
        suggestions.forEach(suggestion => {
            const li = document.createElement('li');
            li.textContent = suggestion;
            li.addEventListener('click', () => {
                document.getElementById(inputId).value = suggestion;
                list.style.display = 'none';
            });
            list.appendChild(li);
        });
        list.style.display = 'block';
    } else {
        list.style.display = 'none';
    }
}

function hideAutocomplete(inputId) {
    document.getElementById(`autocomplete-${inputId}`).style.display = 'none';
}

// Selecionar modal
function selectModal(modal) {
    const cards = document.querySelectorAll('.transport-card');
    cards.forEach(card => card.classList.remove('selected'));
    const selectedCard = document.querySelector(`[data-modal="${modal}"]`);
    selectedCard.classList.add('selected');
    selectedModal = modal;
}

// Geocoding com Nominatim
async function geocode(location) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location)}&limit=1`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Erro no geocoding');
    const data = await response.json();
    if (data.length === 0) throw new Error('Local não encontrado');
    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
}

// Calcular rota com OSRM
async function getRouteDistance(originCoords, destCoords) {
    const { lat: lat1, lon: lon1 } = originCoords;
    const { lat: lat2, lon: lon2 } = destCoords;
    const url = `https://router.project-osrm.org/route/v1/driving/${lon1},${lat1};${lon2},${lat2}?overview=false`;
    const response = await fetch(url);
    if (!response.ok) throw new Error('Erro na rota');
    const data = await response.json();
    if (!data.routes || data.routes.length === 0) throw new Error('Rota não encontrada');
    return data.routes[0].distance / 1000; // metros para km
}

// Calcular emissão
function calculateEmission(distance, modal) {
    return distance * EMISSION_FACTORS[modal];
}

// Formatar número
function formatNumber(num) {
    return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

// Formatar emissão
function formatEmission(emissionKg) {
    const kg = formatNumber(emissionKg);
    if (emissionKg < 1) {
        const g = formatNumber(emissionKg * 1000);
        return { primary: `${kg} kg CO₂`, secondary: `${g} g` };
    }
    return { primary: `${kg} kg CO₂`, secondary: '' };
}

// Renderizar resultado
function renderResult(origem, destino, distancia, modal, emissao, isAutoDistance) {
    document.getElementById('result-origem').textContent = origem;
    document.getElementById('result-destino').textContent = destino;
    document.getElementById('result-distancia').textContent = formatNumber(distancia);
    document.getElementById('result-modal').textContent = modal.charAt(0).toUpperCase() + modal.slice(1);
    const formattedEmission = formatEmission(emissao);
    const emissionEl = document.getElementById('result-emissao');
    emissionEl.textContent = formattedEmission.primary;
    let secondaryEl = document.getElementById('result-emissao-secondary');
    if (!secondaryEl) {
        secondaryEl = document.createElement('small');
        secondaryEl.id = 'result-emissao-secondary';
        emissionEl.parentElement.appendChild(document.createElement('br'));
        emissionEl.parentElement.appendChild(secondaryEl);
    }
    secondaryEl.textContent = formattedEmission.secondary;
    secondaryEl.style.display = formattedEmission.secondary ? 'inline' : 'none';
    const note = document.getElementById('distance-note');
    note.textContent = isAutoDistance ? '(calculada automaticamente)' : '';
    document.getElementById('result-section').style.display = 'block';
}

// Renderizar comparação
function renderComparison(distancia) {
    const titles = {
        bicicleta: 'Bicicleta',
        carro: 'Carro',
        onibus: 'Ônibus',
        caminhao: 'Caminhão'
    };
    const icons = {
        bicicleta: 'bicycle',
        carro: 'car',
        onibus: 'bus',
        caminhao: 'truck'
    };
    const container = document.querySelector('.comparison-cards');
    const cardsHtml = Object.keys(EMISSION_FACTORS).map(modal => {
        const emissao = calculateEmission(distancia, modal);
        const formatted = formatEmission(emissao);
        const secondaryLine = formatted.secondary
            ? `<small>${formatted.secondary}</small>`
            : '';
        return `
            <div class="comparison-card">
                <i class="fas fa-${icons[modal]}"></i>
                <h3>${titles[modal]}</h3>
                <p><strong>${formatted.primary}</strong></p>
                ${secondaryLine}
            </div>
        `;
    }).join('');
    container.innerHTML = cardsHtml;
    document.getElementById('comparison-section').style.display = 'block';
}

// Mostrar erro
function showError(message) {
    const errorDiv = document.getElementById('error-message');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    errorDiv.setAttribute('role', 'alert');
}

// Esconder erro
function hideError() {
    document.getElementById('error-message').style.display = 'none';
}

// Loading state
function setLoading(isLoading) {
    const button = document.querySelector('button[type="submit"]');
    button.disabled = isLoading;
    button.textContent = isLoading ? 'Calculando...' : 'Calcular';
}

// Handle submit
async function handleSubmit(event) {
    event.preventDefault();
    hideError();

    const origem = document.getElementById('origem').value.trim();
    const destino = document.getElementById('destino').value.trim();
    let distancia = parseFloat(document.getElementById('distancia').value);
    const isManualDistance = !isNaN(distancia) && distancia > 0;

    if (!origem || !destino) {
        showError('Origem e destino são obrigatórios.');
        return;
    }
    if (!selectedModal) {
        showError('Selecione um modal de transporte.');
        return;
    }

    setLoading(true);

    try {
        let isAutoDistance = false;
        if (!isManualDistance) {
            // Calcular distância automaticamente
            const originCoords = await geocode(origem);
            const destCoords = await geocode(destino);
            distancia = await getRouteDistance(originCoords, destCoords);
            isAutoDistance = true;
        }

        const emissao = calculateEmission(distancia, selectedModal);
        renderResult(origem, destino, distancia, selectedModal, emissao, isAutoDistance);
        renderComparison(distancia);
    } catch (error) {
        if (!isManualDistance) {
            showError('Erro ao calcular rota. Digite a distância manualmente.');
        } else {
            showError(error.message);
        }
    } finally {
        setLoading(false);
    }
}

// Event listeners
document.getElementById('trip-form').addEventListener('submit', handleSubmit);

// Autocomplete listeners
['origem', 'destino'].forEach(id => {
    const input = document.getElementById(id);
    input.addEventListener('input', debounce(async () => {
        const query = input.value.trim();
        if (query) {
            const suggestions = await fetchAutocomplete(query);
            showAutocomplete(id, suggestions);
        } else {
            hideAutocomplete(id);
        }
    }, 400));
    input.addEventListener('blur', () => setTimeout(() => hideAutocomplete(id), 150)); // Delay to allow click
});

// Acessibilidade nos cards
document.querySelectorAll('.transport-card').forEach(card => {
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            selectModal(card.dataset.modal);
        }
    });
});