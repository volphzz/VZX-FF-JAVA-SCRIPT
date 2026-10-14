# VZX — documentação de instalação e configuração

- [Guia de instalação e configuração](Documentacao/INSTALACAO-CONFIGURACAO.md)

Os guias descrevem a versão JavaScript/Electron usada na pasta local `X:\JAVA`.

Esta publicação contém documentação e o instalador assistido. O código e os binários do aplicativo não estão incluídos; os comandos do guia pressupõem que você já possui a pasta completa do projeto.

## Instalador

Baixe juntos [`instalar.bat`](instalar.bat), [`configurar.js`](configurar.js) e [`settings.example.json`](settings.example.json) e coloque-os na **pasta completa do aplicativo**. Dê dois cliques em `instalar.bat`.

O BAT verifica/instala Node.js LTS x64, prepara Electron e Koffi e orienta a configuração do ADB. BlueStacks, jogo e shell root precisam estar preparados separadamente.

**O instalador não baixa o aplicativo:** este repositório ainda não contém seus fontes, `package.json`, `package-lock.json` ou o auxiliar nativo necessários para executar a instalação completa.
