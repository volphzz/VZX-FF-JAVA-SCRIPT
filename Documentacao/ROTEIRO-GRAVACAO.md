# Roteiro de gravação — VZX JavaScript

Referência: pasta X:\JAVA, versão sem login/API.
Duração sugerida: 8–12 minutos, ajustando ao tempo de instalação e download.

| Etapa | Mostrar na tela | Explicação sugerida |
|---|---|---|
| 1. Apresentação | Pasta X:\JAVA | “Esta é a versão JavaScript/Electron. A configuração fica em settings.json.” |
| 2. Requisitos | Guia de instalação | “Precisa de Windows x64, Node.js, BlueStacks com ADB e shell root já preparado.” |
| 3. Node.js | Site oficial e instalador x64 | “Instale a linha 24 LTS com npm e PATH.” |
| 4. Verificar runtime | node --version; npm.cmd --version | “Feche e reabra o terminal depois de instalar.” |
| 5. Dependências | npm.cmd ci; instalador do Electron | “Use package-lock.json para instalar as versões do projeto.” |
| 6. ADB | Configurações → Avançado no BlueStacks | “Habilite ADB, salve e anote a porta desta instância.” |
| 7. Conexão | HD-Adb connect/devices | “O serial configurado precisa corresponder ao dispositivo em estado device.” |
| 8. Preferências | settings.json | “Confirme target, serial, alcance, box, esqueleto e espessura. Salve antes de iniciar.” |
| 9. Iniciar | Jogo em treino; iniciar.ps1 | “O overlay aparece quando o BlueStacks está em foco.” |
| 10. Diagnóstico | HUD e quadro de atalhos | “FPS de desenho e tempo de coleta são medidas diferentes.” |
| 11. Controles | F7 para pausar e retomar | “F7 pausa o ESP; não restaura o aim.” |
| 12. Aim, se demonstrado | F2 e barra de progresso | “O progresso mostra a busca/aplicação. Teste o resultado no ambiente usado; não confunda candidatas com eficácia.” |
| 13. Captura | F8 e indicação ON/OFF/INDISP. | “A proteção depende do Windows e do método de captura. INDISP. significa que não foi confirmada.” |
| 14. Encerrar | Delete e desaparecimento do overlay | “Delete solicita restauração e encerramento normal.” |
| 15. Alternativa | Comando stop.request na pasta correta | “Se o atalho não funcionar, crie o pedido de parada dentro dos logs desta cópia.” |

## Comandos para deixar preparados

```powershell
Set-Location -LiteralPath 'X:\JAVA'
node --version
npm.cmd --version
npm.cmd ci
node .\node_modules\electron\install.js
.\iniciar.ps1
```

Para encerrar pelo terminal:

```powershell
New-Item -ItemType File -Force 'X:\JAVA\logs\stop.request'
```

## Antes de gravar

- Prepare a instância compatível e confira que o jogo está funcionando.
- Confira a origem da pasta que será mostrada: este roteiro não usa Protegido.
- Deixe os comandos num bloco de notas e execute um por vez.
- Faça primeiro uma gravação curta para conferir áudio, legibilidade e captura.
- Para demonstrar visualmente o ESP, confirme que ele aparece no vídeo de teste.
- Não confie no stream mode para ocultar informações: ele falhou no teste deste PC.
- Não mostre senhas, tokens, chaves privadas, notificações pessoais ou perfis privados
  caso tenha outras versões abertas. Eles não são necessários neste tutorial.

## Como concluir

Mostre a configuração usada, a versão do ambiente e o encerramento normal.
Informe quais passos realmente funcionaram. Downloads podem ser cortados na
edição; erros relevantes e suas soluções devem ser explicados com clareza.

