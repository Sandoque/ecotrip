# Calculadora EcoTrip

[![Demo](https://img.shields.io/badge/Demo-GitHub%20Pages-blue)](https://sandoque.github.io/ecotrip/)

Uma calculadora simples para estimar o impacto ambiental de viagens usando diferentes meios de transporte.

## Descrição

O projeto "Calculadora EcoTrip" é uma aplicação web estática que permite aos usuários calcular e comparar as emissões de carbono associadas a viagens em bicicleta, carro, ônibus e caminhão. Com um design responsivo e moderno, utiliza HTML, CSS e JavaScript puros, sem frameworks externos além do Font Awesome para ícones.

## Demo

Acesse a demo ao vivo: [https://sandoque.github.io/ecotrip/](https://sandoque.github.io/ecotrip/)

## Como Rodar Localmente

Para executar o projeto localmente, você precisa de uma extensão como o Live Server no VS Code:

1. Instale a extensão "Live Server" no VS Code.
2. Abra o arquivo `index.html` no VS Code.
3. Clique com o botão direito no arquivo e selecione "Open with Live Server".
4. O navegador abrirá automaticamente com a aplicação rodando.

## Como Funciona

A aplicação calcula emissões de CO₂ baseadas em distância e modal de transporte selecionado.

### Geocoding
- Utiliza a API Nominatim (OpenStreetMap) para converter endereços de texto em coordenadas geográficas (latitude e longitude).
- Suporte a autocomplete: enquanto o usuário digita, sugere locais relevantes com debounce de 400ms.

### Cálculo de Rota
- Usa a API OSRM (Open Source Routing Machine) para calcular a distância dirigível entre dois pontos.
- Retorna a rota mais curta por estrada, convertendo metros para quilômetros.

### Fatores de Emissão
- **Bicicleta**: 0 kg CO₂/km (zero emissões).
- **Carro**: 0,192 kg CO₂/km (média para veículo médio).
- **Ônibus**: 0,105 kg CO₂/km (por passageiro, simplificado).
- **Caminhão**: 0,800 kg CO₂/km (alto, dependendo da carga).

**Fórmula**: Emissão = Distância (km) × Fator (kg CO₂/km)

### Fluxo do Usuário
1. Insira origem e destino (com autocomplete).
2. Opcionalmente, digite a distância manualmente.
3. Selecione um modal de transporte clicando nos ícones.
4. Clique em "Calcular" para obter emissões e comparações.

## Limitações e Disclaimer

- **Estimativas aproximadas**: Os fatores de emissão são baseados em médias gerais e podem variar dependendo de condições reais (tipo de veículo, combustível, eficiência, etc.).
- **APIs externas**: Depende de Nominatim e OSRM, que podem ter limitações de uso ou indisponibilidade temporária.
- **Distância**: Calculada para rotas de carro; pode não refletir trajetos reais para outros modais.
- **Fins educativos**: Não substitui análises ambientais profissionais. Use para conscientização e comparações relativas.

## Prints da Aplicação

*(Adicione prints reais aqui após deploy)*

- ![Tela Principal](https://via.placeholder.com/600x400?text=Tela+Principal)
- ![Resultado de Cálculo](https://via.placeholder.com/600x400?text=Resultado+de+Cálculo)
- ![Comparação de Modais](https://via.placeholder.com/600x400?text=Comparação+de+Modais)

## Checklist de Features Implementadas

- [x] Interface responsiva com design moderno
- [x] Seleção de modal de transporte (bicicleta, carro, ônibus, caminhão)
- [x] Autocomplete para origem/destino com Nominatim
- [x] Cálculo automático de distância via OSRM
- [x] Cálculo de emissões de CO₂ com fatores realistas
- [x] Exibição de resultados formatados (kg/g, separadores brasileiros)
- [x] Comparação entre todos os modais
- [x] Tratamento de erros e validações
- [x] Acessibilidade (teclas Enter/Space, role="alert")
- [x] Loading states e UX polida
- [x] Modo fallback para distância manual
- [x] Deploy no GitHub Pages

## Tecnologias

- **HTML5**: Estrutura semântica
- **CSS3**: Estilos com variáveis, grid responsivo
- **JavaScript (ES6+)**: Lógica assíncrona, fetch API
- **APIs Externas**: Nominatim, OSRM
- **Ícones**: Font Awesome via CDN

## Deploy no GitHub Pages

1. Faça commit e push do código para um repositório no GitHub.
2. Vá para as configurações do repositório (Settings > Pages).
3. Selecione a branch principal (main) e a pasta raiz (/).
4. Salve as configurações. O GitHub Pages irá gerar a URL do site (geralmente https://username.github.io/repository-name).

Certifique-se de que o repositório seja público para que o GitHub Pages funcione.