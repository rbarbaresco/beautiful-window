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

function mostrarPrevisaoDiaria(previsaoDiaria) {
  const lista = document.getElementById('previsao-diaria');
  lista.replaceChildren(
    ...previsaoDiaria.map((dia) => {
      const item = document.createElement('li');
      item.className = 'dia';
      item.innerHTML = `
        <p class="dia-da-semana"></p>
        <p class="emoji" aria-hidden="true"></p>
        <p class="condicao"></p>
        <p class="maxima-minima"><span class="maxima"></span> <span class="minima"></span></p>
        <p class="chance-de-chuva"></p>`;
      item.querySelector('.dia-da-semana').textContent = dia.diaDaSemana;
      item.querySelector('.emoji').textContent = dia.condicao.emoji;
      item.querySelector('.condicao').textContent = dia.condicao.texto;
      item.querySelector('.maxima').textContent = `${dia.maxima}°`;
      item.querySelector('.minima').textContent = `${dia.minima}°`;
      item.querySelector('.chance-de-chuva').textContent = `💧 ${dia.chanceDeChuva}%`;
      return item;
    }),
  );
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
    const { tempoAgora, previsaoDiaria } = montarTela(await resposta.json());
    mostrarTempoAgora(local, tempoAgora);
    mostrarPrevisaoDiaria(previsaoDiaria);
    mensagem.hidden = true;
  } catch {
    // Os Dados de exemplo entram num ticket próprio (Carregar previsão); por ora, só avisa.
    secaoTempoAgora.setAttribute('aria-busy', 'false');
    mostrarMensagem('Não foi possível carregar o Tempo agora.');
  }
}

document.getElementById('local').textContent = CIDADE_PADRAO.nome;
mostrarLocal(CIDADE_PADRAO);
