// Dados de exemplo: resposta real da API de previsão da Open-Meteo, gravada para São Paulo
// em 2026-11-21T18:15 (hora local), antes da fala. Exibidos, sempre com aviso,
// quando os dados ao vivo não chegam. Módulo ES para carregar igual no navegador e no Node.
export const DADOS_DE_EXEMPLO = {
  "latitude": -23.514938,
  "longitude": -46.610504,
  "generationtime_ms": 0.31197071075439453,
  "utc_offset_seconds": -10800,
  "timezone": "America/Sao_Paulo",
  "timezone_abbreviation": "GMT-3",
  "elevation": 745,
  "current_units": {
    "time": "iso8601",
    "interval": "seconds",
    "temperature_2m": "°C",
    "apparent_temperature": "°C",
    "relative_humidity_2m": "%",
    "wind_speed_10m": "km/h",
    "weather_code": "wmo code"
  },
  "current": {
    "time": "2026-11-21T18:15",
    "interval": 900,
    "temperature_2m": 24.4,
    "apparent_temperature": 27,
    "relative_humidity_2m": 77,
    "wind_speed_10m": 9.2,
    "weather_code": 3
  },
  "daily_units": {
    "time": "iso8601",
    "weather_code": "wmo code",
    "temperature_2m_max": "°C",
    "temperature_2m_min": "°C",
    "precipitation_probability_max": "%"
  },
  "daily": {
    "time": [
      "2026-11-21",
      "2026-11-22",
      "2026-11-23",
      "2026-11-24",
      "2026-11-25"
    ],
    "weather_code": [
      95,
      95,
      96,
      95,
      95
    ],
    "temperature_2m_max": [
      31,
      30.4,
      28.7,
      30.6,
      28.5
    ],
    "temperature_2m_min": [
      20.3,
      20.2,
      21.7,
      20.8,
      20.2
    ],
    "precipitation_probability_max": [
      94,
      82,
      98,
      92,
      100
    ]
  }
};
