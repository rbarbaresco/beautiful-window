// Interface: liga a Lógica do tempo à tela (DOM, eventos, geolocalização). Sem testes.
import { CIDADE_PADRAO, urlDaPrevisao, montarTela } from './tempo.js';

const secaoTempoAgora = document.getElementById('tempo-agora');
const mensagem = document.getElementById('mensagem');

function mostrarCarregando() {
  secaoTempoAgora.setAttribute('aria-busy', 'true');
  secaoTempoAgora.querySelector('.agora')?.remove();
  if (!secaoTempoAgora.querySelector('.carregando')) {
    const carregando = document.createElement('p');
    carregando.className = 'carregando';
    carregando.textContent = 'carregando…';
    secaoTempoAgora.append(carregando);
  }
}

function mostrarTempoAgora(local, tempoAgora) {
  document.getElementById('local').textContent = local.nome;

  const agora = document.createElement('div');
  agora.className = 'agora';
  agora.innerHTML = `
    <p class="temperatura"><span class="emoji" aria-hidden="true"></span><span class="graus"></span></p>
    <p class="condicao"></p>
    <dl class="detalhes">
      <div><dt>Sensação térmica</dt><dd class="sensacao"></dd></div>
      <div><dt>Vento</dt><dd class="vento"></dd></div>
      <div><dt>Umidade</dt><dd class="umidade"></dd></div>
    </dl>`;
  agora.querySelector('.emoji').textContent = tempoAgora.condicao.emoji;
  agora.querySelector('.graus').textContent = `${tempoAgora.temperatura} °C`;
  agora.querySelector('.condicao').textContent = tempoAgora.condicao.texto;
  agora.querySelector('.sensacao').textContent = `${tempoAgora.sensacaoTermica} °C`;
  agora.querySelector('.vento').textContent = `${tempoAgora.vento} km/h`;
  agora.querySelector('.umidade').textContent = `${tempoAgora.umidade}%`;

  secaoTempoAgora.querySelector('.carregando')?.remove();
  secaoTempoAgora.querySelector('.agora')?.remove();
  secaoTempoAgora.append(agora);
  secaoTempoAgora.setAttribute('aria-busy', 'false');
}

function mostrarMensagem(texto) {
  mensagem.textContent = texto;
  mensagem.hidden = false;
}

async function mostrarLocal(local) {
  mostrarCarregando();
  try {
    const resposta = await fetch(urlDaPrevisao(local.latitude, local.longitude));
    if (!resposta.ok) throw new Error(`HTTP ${resposta.status}`);
    const { tempoAgora } = montarTela(await resposta.json());
    mostrarTempoAgora(local, tempoAgora);
    mensagem.hidden = true;
  } catch {
    // Os Dados de exemplo entram num ticket próprio (Carregar previsão); por ora, só avisa.
    secaoTempoAgora.setAttribute('aria-busy', 'false');
    mostrarMensagem('Não foi possível carregar o Tempo agora.');
  }
}

// Sua localização: pede a posição com limite de 5 s (o nosso, porque o `timeout` da API
// não conta o tempo do pop-up de permissão). Falha ou demora mantêm o Local atual.
const LIMITE_LOCALIZACAO_MS = 5000;
const botaoLocalizacao = document.getElementById('usar-localizacao');

botaoLocalizacao.addEventListener('click', () => {
  if (!navigator.geolocation) {
    mostrarMensagem('Este navegador não informa Sua localização. Mantivemos o Local atual.');
    return;
  }
  botaoLocalizacao.disabled = true;
  let respondeu = false;
  const terminar = () => {
    respondeu = true;
    clearTimeout(limite);
    botaoLocalizacao.disabled = false;
  };
  const limite = setTimeout(() => {
    if (respondeu) return;
    terminar();
    mostrarMensagem('Sua localização não respondeu em 5 s. Mantivemos o Local atual.');
  }, LIMITE_LOCALIZACAO_MS);

  navigator.geolocation.getCurrentPosition(
    (posicao) => {
      if (respondeu) return;
      terminar();
      mostrarLocal({
        nome: '📍 Sua localização',
        latitude: posicao.coords.latitude,
        longitude: posicao.coords.longitude,
      });
    },
    (erro) => {
      if (respondeu) return;
      terminar();
      mostrarMensagem(
        erro.code === erro.PERMISSION_DENIED
          ? 'Sem permissão para usar Sua localização. Mantivemos o Local atual.'
          : 'Não foi possível obter Sua localização. Mantivemos o Local atual.',
      );
    },
    { timeout: LIMITE_LOCALIZACAO_MS, maximumAge: 60000 },
  );
});

document.getElementById('local').textContent = CIDADE_PADRAO.nome;
mostrarLocal(CIDADE_PADRAO);
