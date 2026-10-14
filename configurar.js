'use strict';
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process'),{createInterface}=require('node:readline/promises');
const root=__dirname;
function validateSerial(serial){if(!/^[\w.:-]{1,100}$/.test(serial))throw Error('Serial ADB inválido');return serial;}
function run(adb,args){return execFileSync(adb,args,{windowsHide:true,timeout:7000,encoding:'utf8',stdio:['ignore','pipe','pipe']}).trim();}
function locateAdb(config){
 const candidates=[config.adb,process.env.ProgramFiles&&path.join(process.env.ProgramFiles,'BlueStacks_nxt_cn/HD-Adb.exe'),process.env.ProgramFiles&&path.join(process.env.ProgramFiles,'BlueStacks_nxt/HD-Adb.exe')];
 for(const p of candidates)if(p&&fs.existsSync(p))return p;
 try{return execFileSync('where.exe',['adb'],{windowsHide:true,encoding:'utf8'}).split(/\r?\n/).find(p=>p&&fs.existsSync(p));}catch{return null;}
}
async function main(){
 if(process.platform!=='win32'||process.arch!=='x64'||Number(process.versions.node.split('.')[0])<24)throw Error('Requer Windows e Node.js 24+ x64');
 const configPath=path.join(root,'settings.json'),template=path.join(root,'settings.example.json');
 const config=JSON.parse(fs.readFileSync(fs.existsSync(configPath)?configPath:template,'utf8').replace(/^\uFEFF/,''));
 const check=process.argv.includes('--verificar');
 if(check){
  require('koffi');if(!fs.existsSync(path.join(root,'node_modules/electron/dist/electron.exe')))throw Error('Electron não está instalado');
  if(!fs.existsSync(path.join(root,'bin/vzx_ff_reader_x86_64')))throw Error('Auxiliar nativo ausente');
  validateSerial(config.serial);console.log('OK: Node.js x64, Electron, Koffi, auxiliar e configuração.');
  console.log('Esta verificação não modifica arquivos nem comprova conexão com o jogo.');return;
 }
 console.log('Abra o BlueStacks e habilite ADB em Configurações > Avançado.');
 const rl=createInterface({input:process.stdin,output:process.stdout});
 let adb=locateAdb(config);
 try{
  config.serial=validateSerial((await rl.question(`Serial/porta ADB [${config.serial||'127.0.0.1:5555'}]: `)).trim()||config.serial||'127.0.0.1:5555');
  config.target=(await rl.question(`Título da janela [${config.target||'BlueStacks 5'}]: `)).trim()||config.target||'BlueStacks 5';
  if(config.target.length>150)throw Error('Título de janela muito longo');
  if(!adb){const input=(await rl.question('Caminho do HD-Adb.exe (Enter para configurar depois): ')).trim().replace(/^"|"$/g,'');if(input){if(!fs.existsSync(input))throw Error('Executável ADB não encontrado');adb=input;}}
 }finally{rl.close();}
 if(adb)config.adb=adb;
 const backupDir=path.join(root,'backups');fs.mkdirSync(backupDir,{recursive:true});
 if(fs.existsSync(configPath))fs.copyFileSync(configPath,path.join(backupDir,'settings-'+new Date().toISOString().replace(/[:.]/g,'-')+'.json'));
 const temp=configPath+'.tmp';fs.writeFileSync(temp,JSON.stringify(config,null,2));fs.renameSync(temp,configPath);
 fs.mkdirSync(path.join(root,'logs'),{recursive:true});console.log('Configuração salva; as preferências visuais existentes foram preservadas.');
 if(!adb){console.log('AVISO: ADB não encontrado. Instale/configure o BlueStacks e execute novamente.');return;}
 console.log('Verificando ADB em '+config.serial+'...');
 try{
  if(config.serial.includes(':'))run(adb,['connect',config.serial]);
  const devices=run(adb,['devices']);const ready=devices.split(/\r?\n/).some(row=>{const fields=row.trim().split(/\s+/);return fields[0]===config.serial&&fields[1]==='device';});
  if(!ready)throw Error('Dispositivo não está em estado device; confira porta, ADB e instância.');
  console.log('OK: conexão ADB.');
  let rootCommand=null;
  if(run(adb,['-s',config.serial,'shell','id']).includes('uid=0('))rootCommand='';
  else for(const candidate of ['su','/system/xbin/bstk/su']){try{if(run(adb,['-s',config.serial,'shell',candidate+' -c id']).includes('uid=0(')){rootCommand=candidate;break;}}catch{}}
  console.log(rootCommand===null?'AVISO: shell root não encontrado. Habilitar ADB não concede root.':'OK: shell root disponível.');
  const abi=run(adb,['-s',config.serial,'shell','getprop ro.product.cpu.abi']);console.log(abi==='x86_64'?'OK: Android x86_64.':'AVISO: auxiliar exige Android x86_64; encontrado '+abi);
  const pid=run(adb,['-s',config.serial,'shell','pidof com.dts.freefireth']);console.log(pid?'OK: processo do jogo encontrado.':'AVISO: abra o Free Fire antes de iniciar.');
 }catch(error){console.log('AVISO: '+(error.status?'Não foi possível completar a verificação ADB/root/jogo. Abra o emulador e confira a porta.':error.message));}
 console.log('O instalador não ativa root, não altera o emulador e não aplica o aim.');
}
if(require.main===module)main().catch(error=>{console.error('Erro: '+error.message);process.exitCode=1;});
module.exports={validateSerial};

