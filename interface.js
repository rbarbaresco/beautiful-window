// Interface: liga a Lógica do tempo à tela (DOM, eventos, geolocalização). Sem testes.
import { CIDADE_PADRAO, carregarPrevisao } from './tempo.js';

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

// Aviso fixo enquanto os Dados de exemplo estão na tela; some no próximo carregamento ao vivo.
function mostrarAvisoDeDadosDeExemplo(visivel) {
  document.getElementById('aviso-dados-de-exemplo').hidden = !visivel;
}

async function mostrarLocal(local) {
  mostrarCarregando();
  const { origem, tela } = await carregarPrevisao(local, fetch);
  const exemplo = origem === 'dados de exemplo';
  // Os Dados de exemplo são de São Paulo: mostrar o nome do Local pedido seria enganar.
  const { tempoAgora } = tela;
  mostrarTempoAgora(exemplo ? CIDADE_PADRAO : local, tempoAgora);
  mensagem.hidden = true;
  mostrarAvisoDeDadosDeExemplo(exemplo);
}

document.getElementById('local').textContent = CIDADE_PADRAO.nome;
mostrarLocal(CIDADE_PADRAO);
