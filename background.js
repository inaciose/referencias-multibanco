// working code disabled only because I dont want context menu
/*

var id = chrome.contextMenus.create({"title": "Insert MB reference", 
                                      "contexts":["editable"], 
                                      "onclick": insertOnClick});

function insertOnClick(info, tab) {

  // get extension configuration asyncronous 
  chrome.storage.local.get({mbEntidade: '', mbSubentidade: ''}, function(items) {
    // colect the configuration
    mbEntidade = items.mbEntidade;
    mbSubentidade = items.mbSubentidade;

    // select app
    tmpurl = tab.url.toLowerCase();
    if(tmpurl.startsWith("https://www.moloni.com/")) {
      app = 'moloni';
    } else {
      app = 'generic'
    }

    // continue
    insertReference(tab.id, mbEntidade, mbSubentidade, app);
  });  
}

function insertReference(tabid, entity, subentity, app) {
  chrome.tabs.sendMessage(tabid, { entity: entity, subentity: subentity, app: app, mode: 'inline' });
}

*/