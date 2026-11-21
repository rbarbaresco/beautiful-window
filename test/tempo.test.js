import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { CIDADE_PADRAO, urlDaPrevisao, descreverCondicao, montarTela } from '../tempo.js';

test('a Cidade padrão é São Paulo, nas coordenadas do geocoding da Open-Meteo', () => {
  assert.deepEqual(CIDADE_PADRAO, {
    nome: 'São Paulo, São Paulo, Brasil',
    latitude: -23.5475,
    longitude: -46.63611,
  });
});

test('a URL da previsão pede o Tempo agora e a Previsão diária de 5 dias no fuso do Local', () => {
  const url = new URL(urlDaPrevisao(-23.5475, -46.63611));
  assert.equal(url.origin + url.pathname, 'https://api.open-meteo.com/v1/forecast');
  assert.equal(url.searchParams.get('latitude'), '-23.5475');
  assert.equal(url.searchParams.get('longitude'), '-46.63611');
  assert.equal(
    url.searchParams.get('current'),
    'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,weather_code',
  );
  assert.equal(
    url.searchParams.get('daily'),
    'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
  );
  assert.equal(url.searchParams.get('forecast_days'), '5');
  assert.equal(url.searchParams.get('timezone'), 'auto');
});

test('códigos WMO conhecidos viram texto em português e emoji', () => {
  assert.deepEqual(descreverCondicao(0), { texto: 'Céu limpo', emoji: '☀️' });
  assert.deepEqual(descreverCondicao(3), { texto: 'Nublado', emoji: '☁️' });
  assert.deepEqual(descreverCondicao(63), { texto: 'Chuva', emoji: '🌧️' });
  assert.deepEqual(descreverCondicao(95), { texto: 'Trovoada', emoji: '⛈️' });
});

test('código WMO desconhecido devolve uma condição padrão, sem quebrar', () => {
  assert.deepEqual(descreverCondicao(42), { texto: 'Condição desconhecida', emoji: '🌡️' });
  assert.deepEqual(descreverCondicao(undefined), { texto: 'Condição desconhecida', emoji: '🌡️' });
});

test('montar tela a partir da resposta real de São Paulo produz o Tempo agora arredondado', () => {
  const resposta = JSON.parse(
    readFileSync(new URL('./fixtures/forecast-sao-paulo.json', import.meta.url), 'utf8'),
  );
  // Fixture: temperature_2m 24.4, apparent_temperature 27.0, wind_speed_10m 9.2,
  // relative_humidity_2m 77, weather_code 3.
  assert.deepEqual(montarTela(resposta).tempoAgora, {
    temperatura: 24,
    sensacaoTermica: 27,
    condicao: { texto: 'Nublado', emoji: '☁️' },
    vento: 9,
    umidade: 77,
  });
});

test('montar tela arredonda o Tempo agora para o inteiro mais próximo, com .5 para cima', () => {
  const resposta = {
    current: {
      temperature_2m: 18.5,
      apparent_temperature: -0.6,
      relative_humidity_2m: 64.5,
      wind_speed_10m: 12.5,
      weather_code: 0,
    },
  };
  assert.deepEqual(montarTela(resposta).tempoAgora, {
    temperatura: 19,
    sensacaoTermica: -1,
    condicao: { texto: 'Céu limpo', emoji: '☀️' },
    vento: 13,
    umidade: 65,
  });
});
