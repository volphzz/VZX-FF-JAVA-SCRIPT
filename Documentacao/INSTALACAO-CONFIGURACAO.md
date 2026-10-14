# VZX ESP — instalação e configuração

Guia da versão JavaScript/Electron em `X:\JAVA`.
Revisão: 14/10/2026.

## 1. Qual versão este guia usa

Este guia é para o aplicativo SEM LOGIN e SEM API em `X:\JAVA`.
Ele não usa `localhost:17871`, usuário Volphx ou a pasta Protegido.
A versão com autenticação é outro aplicativo e tem outro procedimento.

O aplicativo não tem painel de configurações. Você edita `settings.json`,
encerra e abre novamente para aplicar as alterações.

## 2. Requisitos

| Item | Necessário |
|---|---|
| Sistema | Windows x64 |
| Runtime | Node.js 24 LTS x64 com npm |
| Emulador | BlueStacks 5, com ADB habilitado |
| Permissão Android | Shell root previamente disponível |
| Arquitetura | Android x86_64; processo do jogo IL2CPP ARM32 |
| Projeto | Pasta completa, incluindo `bin/vzx_ff_reader_x86_64` |
| Internet | Para baixar Node.js, Electron e Koffi na instalação |

Python e React não são necessários. Visual Studio, compilador e SDK Android
não são necessários para executar os binários que acompanham o projeto.

O root não é instalado nem ativado pelo aplicativo. Habilitar ADB não concede
root. Sem um shell root já funcional, a coleta de memória não inicia.

Os offsets deste pacote correspondem ao perfil validado anteriormente para
Free Fire `versionCode 2019121229`, `versionName 1.132.1`, ARM32. Atualizações do
jogo podem exigir outro perfil; não existe garantia de compatibilidade com
qualquer versão, instância ou arquitetura.

## 3. Preparar a pasta

1. Copie a pasta inteira do projeto, e não apenas `main.js`.
2. Para seguir este tutorial, use `X:\JAVA`. Se escolher outra pasta, adapte
   os caminhos dos comandos. A letra X não é obrigatória.
3. Confirme estes arquivos:

```text
JAVA/
  package.json
  package-lock.json
  iniciar.ps1
  settings.json
  main.js
  bridge.js
  protocol.js
  delivery.js
  windows.js
  renderer.js
  overlay.html
  overlay.css
  preload.js
  aim-worker.js
  aim-signature.json
  bin/
    vzx_ff_reader_x86_64
```

`node_modules` será criada na instalação. `logs` é criada na execução.
`native`, `tests` e `Documentacao` são fontes, verificações e documentação;
não substituem os arquivos necessários acima.

## 4. Instalar o Node.js

1. Abra a [página oficial de download do Node.js](https://nodejs.org/en/download).
2. Selecione a linha 24 LTS, Windows e arquitetura x64.
3. Instale com npm e a opção de adicionar ao PATH.
4. Feche e abra o terminal após a instalação.
5. Confira:

```powershell
node --version
npm.cmd --version
```

O primeiro comando deve mostrar `v24.x.x`. Se aparecer “não reconhecido”,
reabra o terminal e confira a instalação e o PATH.

## 5. Instalar as dependências do aplicativo

Abra PowerShell na pasta do projeto:

```powershell
Set-Location -LiteralPath 'X:\JAVA'
npm.cmd ci
node .\node_modules\electron\install.js
```

Aguarde terminar sem erros. `npm ci` usa as versões do `package-lock.json`,
sem atualizar o pacote arbitrariamente.

Este projeto fixa Electron `44.7.2` e Koffi `3.3.3`. O Electron cria a janela
transparente; o Koffi fornece a integração com APIs do Windows.
O instalador do Electron baixa o runtime caso ele ainda não esteja presente.

Verificação opcional das dependências:

```powershell
node -e "console.log(require('koffi').version)"
Test-Path -LiteralPath '.\node_modules\electron\dist\electron.exe'
```

O segundo comando deve retornar `True`. Se houver erro de download, confira
internet, proxy e a mensagem do instalador antes de repetir a instalação.

## 6. Configurar o BlueStacks e conferir o ADB

1. Abra o BlueStacks 5.
2. Abra Configurações → Avançado → Android Debug Bridge (ADB).
3. Habilite ADB e salve. Anote a porta mostrada pela sua instância.
4. O exemplo deste projeto usa `127.0.0.1:5555`; outra instância pode usar
   outra porta.

Procedimento conforme o [suporte oficial do BlueStacks](https://support.bluestacks.com/hc/en-us/articles/23925869130381-How-to-enable-Android-Debug-Bridge-on-BlueStacks-5).

Localize o ADB fornecido pelo emulador:

```powershell
$vzxAdb = @(
  "$env:ProgramFiles\BlueStacks_nxt_cn\HD-Adb.exe",
  "$env:ProgramFiles\BlueStacks_nxt\HD-Adb.exe"
) | Where-Object { Test-Path -LiteralPath $_ } | Select-Object -First 1

if (-not $vzxAdb) { throw 'HD-Adb.exe não encontrado; confira a pasta do BlueStacks.' }
& $vzxAdb connect '127.0.0.1:5555'
& $vzxAdb devices
& $vzxAdb -s '127.0.0.1:5555' shell id
```

Use sua porta real nos três comandos. O dispositivo deve aparecer como
`device`, não `offline` ou `unauthorized`. A conta de `shell id` pode não ser
root: o aplicativo também verifica os executáveis `su` disponíveis.

O ambiente utilizado no desenvolvimento tinha `/system/xbin/bstk/su`.
Se esse arquivo existir na sua instância, a verificação é:

```powershell
& $vzxAdb -s '127.0.0.1:5555' shell '/system/xbin/bstk/su -c id'
```

`uid=0(root)` confirma esse shell root. Se o comando não existir ou não tiver
permissão, isso não é corrigido instalando npm: a preparação da instância
Android precisa ser resolvida separadamente.

## 7. Configurar settings.json

Abra `settings.json` no editor e modifique os campos necessários. Mantenha
JSON válido: aspas duplas, sem comentários e sem vírgula após o último campo.
Não edite `aim-signature.json` para ajustar resolução, cor ou desempenho.

| Campo | Configuração atual | Função |
|---|---:|---|
| `target` | `BlueStacks 5` | Título exato da janela |
| `serial` | `127.0.0.1:5555` | Dispositivo/porta ADB |
| `skeleton` | `true` | Desenha o esqueleto |
| `boxes` | `true` | Desenha a box |
| `snaplines` | `false` | Linha até os pés |
| `head_dot` | `false` | Ponto na cabeça |
| `health` | `false` | Barra de vida horizontal |
| `name` | `true` | Nome do jogador |
| `distance` | `true` | Distância no rótulo |
| `show_bots` | `false` | Inclui bots quando habilitado |
| `diagnostics` | `true` | Mostra o HUD de diagnóstico |
| `thickness` | `0.5` | Espessura das linhas |
| `max_distance` | `43` | Alcance em metros |
| `max_entities` | `32` | Limite de entidades desenhadas |
| `refresh_hz` | `120` | Frequência solicitada de coleta |
| `fps` | `240` | Limite solicitado de desenho |
| `aim_mode` | `0` | Neck; `1` Neck Left; `2` Neck Right |
| `aim_key` | `113` | Código Windows de F2 |
| `pause_key` | `118` | Código Windows de F7 |
| `stream_key` | `119` | Código Windows de F8 |
| `stop_key` | `46` | Código Windows de Delete |
| `stream_mode` | `false` | Inicia com proteção de captura desligada |

As cores de esqueleto, box, snapline e ponto da cabeça usam `#ffffff`.
A barra de vida usa seu próprio gradiente, quando `health` é habilitado.
`menu_key` e `menu_key_name` são campos antigos: F6 não abre painel nesta versão.
`bot_filter` também não é um controle ativo no coletor atual; use `show_bots`.

O valor `fps: 240` não garante 240 FPS: o desenho depende do monitor, do Chromium
 e do Windows. 120 Hz de coleta também é uma meta, não um resultado garantido.

## 8. Iniciar

1. Abra o BlueStacks.
2. Abra o jogo e entre em treino ou partida.
3. Execute na pasta do projeto:

```powershell
.\iniciar.ps1
```

O inicializador remove um pedido de parada anterior e abre o aplicativo.
Se a política do PowerShell bloquear `.ps1`, use esta alternativa:

```powershell
Remove-Item -LiteralPath '.\logs\stop.request' -ErrorAction SilentlyContinue
npm.cmd start
```

Volte o foco para a janela do BlueStacks. O overlay fica oculto quando você
muda para outro aplicativo ou minimiza o emulador.

## 9. Atalhos

| Tecla | Ação |
|---|---|
| F2 | Busca/aplica o aim; se já aplicado, solicita restauração |
| F2 durante a busca | Cancela a busca |
| F7 | Pausa/retoma a exibição e coleta |
| F8 | Solicita alternância do stream mode |
| Delete | Solicita encerramento normal e restauração do aim |

Os atalhos funcionam com o BlueStacks em foco. O aim inicia desativado.
O progresso representa a varredura das regiões selecionadas e a etapa de
aplicação. Entradas encontradas/alteradas não provam o efeito do aim no jogo.
F7 não restaura o aim: use F2 para restaurar ou Delete para encerrar.

### Stream mode

O modo usa a proteção de captura do Windows. No teste deste computador, o
Windows recusou a exclusão com erro 8. O quadro mostra `INDISP.` quando isso
ocorre. Não apresente o recurso como funcionando sem testar sua gravação real.
A compatibilidade depende do aplicativo e do método de captura.

## 10. Encerrar normalmente

Com o jogo em foco, pressione Delete. Aguarde a restauração do aim e o fechamento.

Alternativa pelo terminal, dentro da pasta correta:

```powershell
New-Item -ItemType File -Force '.\logs\stop.request'
```

Se estiver em outro diretório, use o caminho completo:

```powershell
New-Item -ItemType File -Force 'X:\JAVA\logs\stop.request'
```

Não confunda a pasta X:\JAVA com as cópias antigas em .gemini: cada instância
consulta o arquivo de parada da sua própria pasta. Encerramento forçado não
garante que os valores modificados pelo aim sejam restaurados.

## 11. Diagnóstico

| Sintoma | Conferir |
|---|---|
| Não aparece nada ao alternar para o editor | Overlay só aparece com BlueStacks em foco |
| Aplicativo abre e fecha | Pedido `logs/stop.request` restante; use iniciar.ps1 |
| Node/npm não reconhecido | Instalação x64 e PATH; reabra o terminal |
| Electron não encontrado | `npm.cmd ci` e o instalador de Electron |
| ADB não conecta | ADB habilitado, porta e `serial` corretos |
| Root indisponível | Shell root da instância; ADB sozinho não basta |
| Sem entidades | Partida ativa, perfil compatível, bots filtrados e alcance de 43 m |
| HUD mostra dados, mas não há inimigos perto | Aumente `max_distance` após encerrar e reinicie |
| Aparente atraso | Confira Hz real, FPS, idade dos dados e carga do emulador |
| F2 não encontra candidatas | Assinatura/build/instância incompatível; não substitua bytes aleatoriamente |
| F8 mostra INDISP. | Windows recusou a proteção de captura |
| Delete não encerra | BlueStacks em foco; código `stop_key: 46`; reinicie após editar |

A coleta exclui local player, mortos e entidades identificadas como time.
Bots ficam ocultos quando `show_bots` é false.

Arquivos de diagnóstico: `logs/runtime.json` e `logs/app.log`.
A idade dos dados não representa toda a latência de apresentação na tela.
`readMs` mede a coleta/transporte/decodificação, não o FPS do jogo.

Verificações opcionais, quando houver dependências instaladas:

```powershell
npm.cmd test
npm.cmd run probe
```

Os testes não comprovam o alinhamento visual nem o efeito do aim em jogo.
O probe gera `logs/probe.json`, coleta dados e encerra sem abrir o overlay.

