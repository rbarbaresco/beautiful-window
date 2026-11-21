// Lógica do tempo: funções puras e o carregamento da previsão. Único seam de teste.

export const CIDADE_PADRAO = {
  nome: 'São Paulo, São Paulo, Brasil',
  latitude: -23.5475,
  longitude: -46.63611,
};

export function urlDaPrevisao(latitude, longitude) {
  const parametros = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: 'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    forecast_days: '5',
    timezone: 'auto',
  });
  return `https://api.open-meteo.com/v1/forecast?${parametros}`;
}

// Códigos WMO usados pela Open-Meteo em `weather_code`.
const CONDICOES = {
  0: { texto: 'Céu limpo', emoji: '☀️' },
  1: { texto: 'Predominantemente limpo', emoji: '🌤️' },
  2: { texto: 'Parcialmente nublado', emoji: '⛅' },
  3: { texto: 'Nublado', emoji: '☁️' },
  45: { texto: 'Neblina', emoji: '🌫️' },
  48: { texto: 'Neblina com geada', emoji: '🌫️' },
  51: { texto: 'Garoa fraca', emoji: '🌦️' },
  53: { texto: 'Garoa', emoji: '🌦️' },
  55: { texto: 'Garoa forte', emoji: '🌦️' },
  56: { texto: 'Garoa congelante', emoji: '🌧️' },
  57: { texto: 'Garoa congelante forte', emoji: '🌧️' },
  61: { texto: 'Chuva fraca', emoji: '🌦️' },
  63: { texto: 'Chuva', emoji: '🌧️' },
  65: { texto: 'Chuva forte', emoji: '🌧️' },
  66: { texto: 'Chuva congelante', emoji: '🌧️' },
  67: { texto: 'Chuva congelante forte', emoji: '🌧️' },
  71: { texto: 'Neve fraca', emoji: '🌨️' },
  73: { texto: 'Neve', emoji: '🌨️' },
  75: { texto: 'Neve forte', emoji: '❄️' },
  77: { texto: 'Grãos de neve', emoji: '🌨️' },
  80: { texto: 'Pancadas de chuva fracas', emoji: '🌦️' },
  81: { texto: 'Pancadas de chuva', emoji: '🌧️' },
  82: { texto: 'Pancadas de chuva fortes', emoji: '⛈️' },
  85: { texto: 'Pancadas de neve', emoji: '🌨️' },
  86: { texto: 'Pancadas de neve fortes', emoji: '❄️' },
  95: { texto: 'Trovoada', emoji: '⛈️' },
  96: { texto: 'Trovoada com granizo', emoji: '⛈️' },
  99: { texto: 'Trovoada com granizo forte', emoji: '⛈️' },
};

const CONDICAO_DESCONHECIDA = { texto: 'Condição desconhecida', emoji: '🌡️' };

export function descreverCondicao(codigo) {
  return CONDICOES[codigo] ?? CONDICAO_DESCONHECIDA;
}

export function montarTela(resposta) {
  const agora = resposta.current;
  return {
    tempoAgora: {
      temperatura: Math.round(agora.temperature_2m),
      sensacaoTermica: Math.round(agora.apparent_temperature),
      condicao: descreverCondicao(agora.weather_code),
      vento: Math.round(agora.wind_speed_10m),
      umidade: Math.round(agora.relative_humidity_2m),
    },
    previsaoDiaria: resposta.daily.time.map((data, i) => ({
      diaDaSemana: diaDaSemana(data),
      maxima: Math.round(resposta.daily.temperature_2m_max[i]),
      minima: Math.round(resposta.daily.temperature_2m_min[i]),
      condicao: descreverCondicao(resposta.daily.weather_code[i]),
      chanceDeChuva: resposta.daily.precipitation_probability_max[i],
    })),
  };
}

// `daily.time` vem como "AAAA-MM-DD" já no fuso do Local (timezone=auto). Lido e formatado
// em UTC, o dia não escorrega para o fuso do navegador.
const FORMATO_DIA_DA_SEMANA = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', timeZone: 'UTC' });

function diaDaSemana(data) {
  return FORMATO_DIA_DA_SEMANA.format(new Date(`${data}T00:00:00Z`));
}

export function urlDaBusca(nome) {
  return `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(nome)}&count=1&language=pt`;
}

// Devolve o Local da primeira cidade encontrada, ou null quando a busca não encontra nada
// (a Open-Meteo omite a chave `results` nesse caso).
export function escolherLocal(resposta) {
  const cidade = resposta.results?.[0];
  if (!cidade) return null;
  return {
    nome: [cidade.name, cidade.admin1, cidade.country].filter(Boolean).join(', '),
    latitude: cidade.latitude,
    longitude: cidade.longitude,
  };
}
