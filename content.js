/*

moloni source
numero_ent (html)
valor_total (input)

moloni destination
observacoes (textarea)

requires: multibanco.js
*/

var sID = "";

document.addEventListener(
  "mousedown", function(event){
    var el = event.target;
    sID = el.id;
  },
  true
);

chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse){
    // set DOM element to insert on
    var objField = document.getElementById(sID);
    
    var id = '';
    var valor = '';
    
    switch(request.app) {
      case 'moloni': 
        // get data from DOM
        id = document.getElementById("numero_ent").innerHTML;
        valor = document.getElementById("valor_total").value;
        break;
      default:
        return;
        break;
    }
    
    // generateRef
    var ref = generateRef(request.entity, request.subentity, id, valor);
    
    // prepare text
    var insertText = "\nEntidade: " + ref['entidade'] + "\nReferência: " + ref['referencia'] + "\nValor: " + ref['valor'] + "€\n";
    
    if(request.mode == 'inline') {
      // insert on DOM element
      insertAtCursor(objField, insertText);
    } else {
      
      switch(request.app) {
        case 'moloni':
          // set DOM element to insert on 
          objField = document.getElementById("observacoes");
          break;
        default:
          return;
          break;
      }
      // insert on DOM element
      insertAtCursor(objField, insertText);
    }
  }
);

//
// functions
//

function insertAtCursor(sField, sValue){
  if (sField.selectionStart || sField.selectionStart == '0'){
    var nStart = sField.selectionStart;
    var nEnd = sField.selectionEnd;
  
    sField.value = sField.value.substring(0, nStart) + sValue + sField.value.substring(nEnd, sField.value.length);
    sField.selectionStart = nStart + sValue.length;
    sField.selectionEnd = nStart + sValue.length;
  } else {
    sField.value += sValue;
  }
}

function generateRef(entidade, subentidade, id, valor) {
  var mb = new Multibanco();
  if (valor > 0 && id > 0 && entidade > 0 && subentidade > 0) {
    if (valor < 999999) {
      var ref = mb.getPaymentRef(entidade, subentidade, id, valor);
      return ref;
    } else {
      return false;
    }
  }  
}
