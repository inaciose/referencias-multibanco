$(function () {
  var mb = new Multibanco();
  
  $("#tabs").tabs();

  $("#dataForm").dialog({
    autoOpen: false,
    buttons: {
      "Ok": () => {
        $(this).dialog("close");
      },
    }
  });

  chrome.storage.local.get("mbEntidade", function (items) {
    $("#entidadeConfiguracao").val(items.mbEntidade);
  });

  chrome.storage.local.get("mbSubentidade", function (items) {
    $("#subentidadeConfiguracao").val(items.mbSubentidade);
  });

  $("#gerarReferencia").on("click", function () {
    $("#messageGerar").empty();

    var id = $("#idGerar").val();
    var valor = $("#valorGerar").val();

    var entidade;
    var subentidade;
    var attempts = 0;

    entidade = chrome.storage.local.get("mbEntidade", function (items) {
      (function waitForEntidade() {
        entidade = items.mbEntidade;
        if (entidade < 0) {
          if (attempts < 5) {
            setTimeout(waitForEntidade, 500);
            attempts++;
          } else {
            clearTimeout(waitForEntidade);
          }
        }
      }());
    });

    chrome.storage.local.get("mbSubentidade", function (items) {
      (function waitForSubentidade() {
        subentidade = items.mbSubentidade;
        if (subentidade < 0) {
          if (attempts < 5) {
            setTimeout(waitForSubentidade, 500);
            attempts++;
          } else {
            clearTimeout(waitForSubentidade);
          }
        }
      }());
    });

    (function waitForReadyState() {
      if (valor > 0 && id > 0 && entidade > 0 && subentidade > 0) {
          if (valor < 999999) {
            var ref = mb.getPaymentRef(entidade, subentidade, id, valor);
            var refStr = "Entidade: " + ref["entidade"] + "\nReferência: " + ref["referencia"] + "\nValor: " + ref["valor"] + "€";
            $("#completo").val(refStr);
            $("#completo").select();
          } else {
            $("#messageGerar").text("Valor máximo 999999!").css("color", "#FF0000");
          }
      } else {
        if (attempts < 5) {
          setTimeout(waitForReadyState, 500);
        } else {
          clearTimeout(waitForReadyState);
          $("#messageGerar").text("Campos em falta!").css("color", "#FF0000");
        }
      }
    }());
  });

  $("#data").keypress(function (e) {
    if (e.which === 13) {
      $("#dataForm").dialog("close");
    }
  });

  $("#verificarReferencia").on("click", function () {
    $("#messageVerificar").empty();

    var entidade = $("#entidadeVerifica").val();
    var referencia = $("#referenciaVerifica").val();
    var valor = $("#valorVerifica").val();

    if (entidade > 0 && referencia > 0 && valor > 0) {

      var subentidade = referencia.substring(0, 3);
      var id = referencia.substring(3, 7);

      var referenciaGerada = mb.getPaymentRef(entidade, subentidade, id, valor);

      if (referencia.replace(/\s/g, "") === referenciaGerada["referencia"].replace(/\s/g, "")) {
        $("#messageVerificar").text("Referência válida").css("color", "#007F00");
      } else {
        $("#messageVerificar").text("Referência inválida").css("color", "#FF0000");
      }
    } else {
      $("#messageVerificar").text("Campos em falta!").css("color", "#FF0000");
    }
  });

  $("#guardarDados").on("click", function () {
    $("#messageGuardar").empty();

    var entidade = $("#entidadeConfiguracao").val();
    var subentidade = $("#subentidadeConfiguracao").val();

    if (entidade > 0 && subentidade > 0 && entidade.length === 5 && subentidade.length === 3) {
      chrome.storage.local.set({ "mbEntidade": entidade }, function () { });
      chrome.storage.local.set({ "mbSubentidade": subentidade }, function () { });
    } else {
      $("#messageGuardar").text("Campos em falta!").css("color", "#FF0000");
    }
  });

  $("#refmoloni").on("click", function () {
    $("#messageGerar").empty();

    // get extension configuration asyncronous 
    chrome.storage.local.get({mbEntidade: '', mbSubentidade: ''}, function(items) {
      // colect the configuration
      mbEntidade = items.mbEntidade;
      mbSubentidade = items.mbSubentidade;
      
      // get active tab asyncronous
      chrome.tabs.query({currentWindow: true, active : true}, function(tabs){
        var currentTab = tabs[0]; // there will be only one in this array
        // continue
        //alert(currentTab.id);
        insertReference(currentTab.id, mbEntidade, mbSubentidade, 'moloni');
      })
      
    });
  });

});

function insertReference(tabid, entity, subentity, app) {
  chrome.tabs.sendMessage(tabid, { entity: entity, subentity: subentity, app: app, mode: 'append' });
}

