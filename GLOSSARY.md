# Beautiful Window

Um app simples de previsão do tempo, feito para ser construído ao vivo numa apresentação.

## Language

**Local**:
O lugar cuja previsão está na tela: a Cidade padrão, uma cidade buscada ou Sua localização.
_Avoid_: Lugar, cidade (quando pode ser Sua localização)

**Cidade padrão**:
O Local que aparece quando o app abre: São Paulo.
_Avoid_: Cidade inicial, cidade default

**Sua localização**:
O Local obtido da posição do aparelho de quem usa o app, sempre exibido sem nome de cidade.
_Avoid_: Localização atual, minha cidade, GPS

**Tempo agora**:
As condições do Local neste momento.
_Avoid_: Clima atual, tempo real

**Previsão diária**:
As condições esperadas para cada um dos próximos 5 dias no Local.
_Avoid_: Forecast, previsão semanal

**Dados de exemplo**:
Um Tempo agora e uma Previsão diária gravados antes da apresentação e exibida, sempre sinalizada, quando os dados ao vivo não chegam.
_Avoid_: Mock, fallback, cache, dados falsos
