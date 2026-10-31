(function(){
  'use strict';
  var methods=new Set(["EMP_PUSH26_REGISTRAR","EMP_PUSH26_ELIMINAR","EMP_PUSH26_CONSENTIMENT_REGISTRAR","EMP_ACTES_BD_26_ACTUALITZAR_IDP","EMP_APP_BD26_ACTUALITZAR_PARTITS","EMP_APP_BD26_ESTAT_ACTUALITZACIO_PARTITS","EMP_APP_BD26_obtenirActa","EMP_APP_BD26_obtenirActes","EMP_APP_BD26_obtenirPartitsClubs","EMP_APP_BD26_precarregarAlMinutAgenda","EMP_APP_BOOTSTRAP","EMP_JUGADORS_BD26_detall","EMP_JUGADORS_BD26_detalls","EMP_JUGADORS_BD26_obtenir","EMP_JUGADORS_BD26_obtenirLleuger","EMP_LIVE_ACTUALITZAR_ADMIN","EMP_SUGGERIMENTS_ENVIAR","EMP_USR_guardarFavorits","EMP_USR_identificarPerTelefon","EMP_USR_obtenirCataleg","EMP_USR_obtenirCatalegJugadors","EMP_USR_obtenirCatalegJugadorsLleuger","EMP_USR_obtenirFavorits","EMP_USR_registrarUsuari","EMP_USR_restaurarSessio","actualitzarClassificacionsApp","obtenirAlMinutApp","obtenirClassificacionsApp","obtenirPartitsApp","obtenirResultatsApp"]);
  var url='https://script.google.com/macros/s/AKfycbw7MfcJqnKlZ1t5M84OIn8PcJE36jMnLT49rJRM8YnYabpqL1z9nHKyDbqetKdw-cnr/exec?bridge=207';
  var bytes=new Uint32Array(4);crypto.getRandomValues(bytes);
  var token=Array.from(bytes).map(function(n){return n.toString(16);}).join('-');
  var peer=null,origin='',ready=false,seq=0,pending=new Map(),queue=[];
  var frame=document.createElement('iframe');frame.hidden=true;frame.title='Connexió de dades';frame.setAttribute('aria-hidden','true');frame.src=url;
  var diag=window.ZH_TRANSPORT_DIAG={inici:performance.now(),readyMs:null};
  function descendant(source){try{for(var i=0;i<8&&source;i++){if(source===frame.contentWindow)return true;var p=source.parent;if(!p||p===source||p===window)return false;source=p;}}catch(e){}return false;}
  function finish(id,ok,value){var p=pending.get(id);if(!p)return;pending.delete(id);clearTimeout(p.timer);var f=ok?p.success:p.failure;if(f)f(value,p.user);else if(!ok)console.error(value.message);}
  function send(q){peer.postMessage({tipus:'ZH_BRIDGE_CALL',token:token,id:q.id,nom:q.nom,args:q.args},origin);}
  window.addEventListener('message',function(e){
    if(!/^https:[/][/](?:script[.]google[.]com|[a-z0-9-]+-script[.]googleusercontent[.]com)$/.test(e.origin)||!descendant(e.source))return;
    var d=e.data||{};
    if(d.tipus==='ZH_BRIDGE_READY'&&d.versio===207){
      if(peer&&peer!==e.source)return;peer=e.source;origin=e.origin;
      peer.postMessage({tipus:'ZH_BRIDGE_INIT',token:token},origin);return;
    }
    if(e.source!==peer||e.origin!==origin||d.token!==token)return;
    if(d.tipus==='ZH_BRIDGE_ACK'){
      if(ready)return;ready=true;diag.readyMs=performance.now()-diag.inici;
      var q=queue;queue=[];q.forEach(function(x){if(pending.has(x.id))send(x);});return;
    }
    if(d.tipus==='ZH_BRIDGE_RESULT')finish(d.id,d.ok,d.ok?d.value:{message:String(d.error||'No s’ha pogut completar la consulta.')});
  });
  function runner(success,failure,user){return new Proxy({}, {get:function(_,name){
    if(name==='withSuccessHandler')return function(f){return runner(f,failure,user);};
    if(name==='withFailureHandler')return function(f){return runner(success,f,user);};
    if(name==='withUserObject')return function(v){return runner(success,failure,v);};
    if(!methods.has(name))return undefined;
    return function(){
      var id=String(++seq),q={id:id,nom:name,args:Array.prototype.slice.call(arguments)};
      pending.set(id,{success:success,failure:failure,user:user,timer:setTimeout(function(){finish(id,false,{message:'La connexió triga més del previst. Torna-ho a provar.'});},240000)});
      if(ready)send(q);else queue.push(q);
    };
  }});}
  window.google=window.google||{};window.google.script={run:runner(null,null,undefined)};
  // Request the small Google connection in parallel with parsing the interface.
  document.head.appendChild(frame);
})();
