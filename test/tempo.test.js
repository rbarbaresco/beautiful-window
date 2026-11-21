import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CIDADE_PADRAO } from '../tempo.js';

test('a Cidade padrão é São Paulo, nas coordenadas do geocoding da Open-Meteo', () => {
  assert.deepEqual(CIDADE_PADRAO, {
    nome: 'São Paulo, São Paulo, Brasil',
    latitude: -23.5475,
    longitude: -46.63611,
  });
});
