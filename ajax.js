var zaman = null;

function AJAX() {

   var ajax = false;
   // Internet Explorer (5.0+)
   if(typeof ActiveXObject != 'undefined') {
   try {
     ajax = new ActiveXObject("Msxml2.XMLHTTP");
   } catch (e) {
      try {
        ajax = new ActiveXObject("Microsoft.XMLHTTP");
      } catch (e) {
        ajax = false;
      }
   }
   }

   // Mozilla veya Safari
   if ( !ajax && typeof XMLHttpRequest != 'undefined' ) {
     try{
        ajax = new XMLHttpRequest();
     }catch(e) {
        ajax = false;
     }
   }
   // Diger (IceBrowser)
   if ( !ajax && window.createRequest ) {
	 try{
        ajax = window.createRequest();
     }catch(e) {
        ajax = false;
     }
   }
	return ajax;
}

// POST işlemleri
function post(yukleniyor, yer, dosya, sc) {
	var ajax = new AJAX();

	if ( ajax ) {
		ajax.onreadystatechange = function () {}
		ajax.abort()
	}

	if(sc) {
		sc = fldenc_(sc);
	}

	ajax.onreadystatechange = function () {
		ajaxCevapla(ajax, yer, yukleniyor, dosya);
	}

	ajax.open('POST', dosya, true);
	ajax.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT");
	ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
//	ajax.setRequestHeader("Content-type", "text/html; charset=UTF-8");
//	ajax.setRequestHeader("Content-Language", "tr");
//	ajax.setRequestHeader("Content-length", sc.length);
//	ajax.setRequestHeader("Connection", "close");
	ajax.send(sc);
}

// GET işlemleri
function get(yukleniyor, yer, dosya, sc) {
	var ajax = new AJAX();

	if ( ajax ) {
		ajax.onreadystatechange = function () {};
		ajax.abort();
	}

	if(sc) {
		dosya = dosya +'?'+ fldenc_(sc);
	}

	ajax.onreadystatechange = function () {
		ajaxCevapla(ajax, yer, yukleniyor, dosya);
	}

	ajax.open('GET', dosya, true);
	ajax.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT");
	ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded; charset=UTF-8");
//	ajax.setRequestHeader("Content-type", "text/html; charset=UTF-8");
//	ajax.setRequestHeader("Content-Language", "tr");
//	ajax.setRequestHeader("Connection", "close");
	ajax.send(null);
}

function ajaxCevapla(ajax, yer, yukleniyor, dosya) {
		var elyer = document.getElementById(yer);
		if( yukleniyor == 1 && yer != 'no_id' ) {
			if( ajax.readyState == 1 || ajax.readyState == 2 || ajax.readyState == 3 ) {
				var loading = '<center><img src="images/loading.gif" loop="infinite" align="middle" alt="yukleniyor.."/></center>'
				if(elyer) elyer.innerHTML = loading;
			}
		}

		if( ajax.readyState == 4 && yer != 'no_id' ) {
			if (ajax.status == 200 ) {
				if(elyer) {
				elyer.innerHTML = ajax.responseText;
				//gelen scriptleri çalistirmak icin ekledim
				var scripts = elyer.getElementsByTagName('script');
			        for (var xx =0; xx < scripts.length; xx++) {
			            with (elyer) {
			                eval(scripts[xx].text);
			            }
			        }
				}

			} else {
				var HataMesaj = ajax.responseText;
				var uHataMesaj = '';
              if(ajax.status==404) {
				HataMesaj = 'Sayfa bulunamadı..<br><br>';
				uHataMesaj = 'Sayfa bulunamadı..<br>Hata: '+ ajax.status +'';
              } else {
                if(ajax.status==0) {
				  uHataMesaj = 'Bağlantı hatası..';
                } else {
				  uHataMesaj = 'Beklenmedik bir hata oluştu..<br>Hata: '+ ajax.status +'';

				  var HataMesajIlk = HataMesaj.toString().indexOf('<font face="Arial" size=2>');
				  if(HataMesajIlk >=0) {
				  HataMesaj = HataMesaj.toString().substring(HataMesajIlk);
				  }
				}
              }
//				HataMesaj = HataMesaj +'<textarea id="iisErrText" rows="6" cols="50">'+ HataMesaj.replace(/<br>/g, '\r').replace(/<.*?>/g, '') +'</textarea>';
				if(elyer) elyer.innerHTML = '<p class="ErrFONT">'+ uHataMesaj +'<textarea id="iisErrText" style="visibility:hidden;" rows="1" cols="1">'+ HataMesaj +'</textarea></p>';

				HataMesaj = ajax.status +'<br>';
				HataMesaj += document.getElementById('iisErrText').value.replace(/<.*?>/g, '').replace(/\n/g, '<br>') +'<br>';
				HataMesaj += dosya +'<br>';
                post(0,'no_id','AdmLogErrDesc.asp', HataMesaj.replace(/<br><br>/g, '<br>'));
                (elem=document.getElementById('iisErrText')).parentNode.removeChild(elem);
			}
			function AJAX() {};
		}
}

// zararı karakter temizle( Fix Character )
function fc_(text) {
	var temp;
	temp = encodeURIComponent(text);
	return temp;
}

// ajax sc icerigini dondurerek encodeURIComponent yapiyor
function fldenc_(text) {
  var temp='';
  var arrtext='';
  var arrfld='';
	arrtext = text.split('&');
	for (var i = 0; i < arrtext.length; i++) {
        arrfld = arrtext[i].split('=');
        for (var j = 0; j < arrfld.length; j++) {
          temp += encodeURIComponent(arrfld[j]);
		if(j+1 < arrfld.length) temp +='=';
        }
	if(i+1 < arrtext.length) temp +='&';
	}
  return temp;
}
//asdf = 'ID=1&fd=cdffd&=&cd=2';
//alert(asdf +'\r'+ fldenc_(asdf));

function createQuery(form){
  var elements = form.elements;
  var pairs = new Array();
	for (var i = 0; i < elements.length; i++) {
		if ((name = elements[i].name) && (value = elements[i].value))
			pairs.push(name + "=" + encodeURIComponent(value));
		}
		//pairs.push("param1=1");
	return pairs.join("&");
}

//http://www.openjs.com/scripts/data/ued_url_encoded_data/
function ued_(arr) {
	var query = ""
	if(typeof(arr) == 'object') {
		var params = new Array();
		for(key in arr) {
			var data = arr[key];
			var key_value = key;
				params.push(encodeURIComponent(key_value) +"="+ encodeURIComponent(data));
		}
		query = params.join("&");
	} else {
		query = encodeURIComponent(arr);
	}
alert(query);
	return query;
}


//-- enter ile gecis fonksiyonu
var eDurak=null;
var code;
 function DetectEventCode(event) {
	if (window.event) e = window.event;
	else e = event;
	var evt = e
	if (e.keycode) code = e.keycode; // ie and mozilla/gecko
	else if (e.which) code = e.which;
 }

 function en2tab(event) {
  if(eDurak != null) {
 	DetectEventCode(event);
	setTimeout('code = "";',1000);

    if (window.event) var evDurak = window.event.srcElement; //code for ie
    else var evDurak = event.target; //code for firefox

    var gitDurak = null;
	if(code == '13' && evDurak != null) {
	  if(evDurak.id != 'Hesaplarim_Text' && evDurak.id != 'Hesaplarim_TextAna') {
        for(var i=0; i<eDurak.length; i++){
	      if(eDurak[i]==evDurak.id) {
	  	    gitDurak = evDurak;
	  	  	break;
		  }
        }
//        if(evDurak.id=='submit')
//        if(evDurak.id.indexOf('submit')>-1)
        if(evDurak.id=='submit' || evDurak.id.indexOf('submit')>-1) {
	    	gitDurak=null;
	    }
	    get2en2tab(gitDurak);
	  }
	}
  }
 }
 function get2en2tab(durak) {
	if(durak == null) {
		var i=0
     	durak=document.getElementById(eDurak[i]);
		while(durak == null || durak.disabled || durak.type=='hidden') {
			i=i+1
     		if(i == eDurak.length) {
     			break;
     		} else {
     			durak=document.getElementById(eDurak[i]);
     		}
		}
		if(durak != null) {
			 	if(durak.id=='YeniEkle') {
			 		durak.onclick();
			 	} else {
					if(durak) durak.focus();
					if(durak) { if(durak.type == 'text') durak.setSelectionRange(durak.value.length, durak.value.length); }
					if(durak.tagName.toUpperCase() == 'TEXTAREA') { durak.setSelectionRange(durak.value.length, durak.value.length); }
				}
					durak=null;
		}
	} else {
		durak = durak.id;
    	for(var i=0; i<eDurak.length; i++){
	     if(eDurak[i]==durak){
	     	i=i+1
	     	durak=document.getElementById(eDurak[i]);
			while(durak == null || durak.disabled || durak.type=='hidden') {
				//durak disabled ise sonraki duraklara git
				i=i+1
	     		if(i >= eDurak.length) {
	     			break;
	     		} else {
	     			durak=document.getElementById(eDurak[i]);
	     		}
	     	}
					if(durak) durak.focus();
					if(durak) {
					if(durak.type == 'text') durak.setSelectionRange(durak.value.length, durak.value.length);
					if(durak.tagName.toUpperCase() == 'TEXTAREA') durak.setSelectionRange(durak.value.length, durak.value.length);
					if(navigator.userAgent.toLowerCase().indexOf('firefox') > -1){
					  if(durak.id=='submit' || durak.id.indexOf('submit')>-1) durak.onclick();
					}
					}
//					if(durak.type == 'text' && !isNaN(paraEN1(durak.value))) {
//					  durak.onkeypress=function(){return false;};
//					  durak.select();
//					}
//					if(durak.type == 'text' && (durak.name.search(/Date/i)>-1 || durak.name.search(/Tarih/i)>-1)) {
//					  durak.select();
//					}

					durak=null;
	     break;
	     }
		}
	}
 }
 document.onkeydown = onKeyDownHandler;
 function onKeyDownHandler(event) {
	DetectEventCode(event);
	//F5(116) ve backspace(8) engelle
    if (code === 8 || code ===116) {
        var o = event.srcElement || event.target;
        if ((o.tagName.toUpperCase() === 'INPUT' && (o.type.toUpperCase() === 'TEXT' || o.type.toUpperCase() === 'PASSWORD' || o.type.toUpperCase() === 'FILE'))|| o.tagName.toUpperCase() === 'TEXTAREA') {
        //    doPrevent = d.readOnly || d.disabled;
        } else {
			if(!o.isContentEditable) return false;
        }
    }
	// Alt Enter ise
	if(code == '13' && e.shiftKey){
		if (window.event) eDrk = window.event.srcElement; //code for ie
		else eDrk = event.target; //code for firefox
		if(eDrk.tagName.toUpperCase() == 'TEXTAREA') {
			var caret = getCaret(eDrk);
            eDrk.value = eDrk.value.substring(0, caret) + "\n" + eDrk.value.substring(caret, eDrk.value.length);
			eDrk.setSelectionRange(caret+1, caret+1);
			return false;
		}
	}
	en2tab(event);
 }

function getCaret(el) {
    if (el.selectionStart) {
        return el.selectionStart;
    } else if (document.selection) {
        el.focus();
        var r = document.selection.createRange();
        if (r == null) {
            return 0;
        }
        var re = el.createTextRange(), rc = re.duplicate();
        re.moveToBookmark(r.getBookmark());
        rc.setEndPoint('EndToStart', re);
        return rc.text.length;
    }
    return 0;
}
//-- enter son

//-- sagTus MENU --bas
function clickIE4(){
	if (event.button==2){
	//	alert(message);
		return false;
	}
}
function clickNS4(e){
	if (document.layers||document.getElementById&&!document.all){
		if (e.which==2||e.which==3){
		//	alert(message);
			return false;
		}
	}
}
if (document.layers){
	document.captureEvents(Event.MOUSEDOWN);
	document.onmousedown=clickNS4;
}
else if (document.all&&!document.getElementById){
	document.onmousedown=clickIE4;
}
document.oncontextmenu = createRCmenu;
//document.onselectstart = function(){return false;} // html metin seçimi
document.ondblclick = function(){return false;};

var menuskin = "RCskin"; //class
var RCzaman = null;
var RCitems = '';
var aRCitems = '';

function createRCmenu(event) {
  if(document.getElementById('RCmenu')!=null)document.body.removeChild(RCmenu);
	stopedRCmenu();
  aRCitems = '';
//RCitems = event.srcElement.getAttribute('RCitems');
  if(RCitems==null || RCitems==undefined)RCitems='';
  if(RCitems!='')aRCitems=RCitems.split("][");
 if(aRCitems!='') {
	//RC nin target elementi
	//var RCevT = window.event || event; //
	//var RCtargElm = RCevT.target || RCevT.srcElement;
	//RCtargElm

    var RCelement = document.createElement('div');
	document.body.appendChild(RCelement);
    RCelement.id = 'RCmenu';
    RCelement.name = 'RCmenu';
    RCelement.className = 'RCskin';
	RCelement.onmouseover = stopedRCmenu;
	RCelement.onmouseout = removeRCmenu;
     for(var i=0; i<aRCitems.length; i++){
//		if(i!=0 && i<aRCitems.length) { //her bir itemin arasina hr koymak icin
		if(aRCitems[i]=='HRitem') {
		  var RCitem = document.createElement('div');
		  RCelement.appendChild(RCitem);
//		  RCitem.style.border = '1px inset #FFFFFF';
		  RCitem.className = 'RCmenuHRitem';
		  i++; //sonrakine gec
		}
	    var RCitem = document.createElement('div');
	    RCelement.appendChild(RCitem);
    	RCitem.id = i;
	    RCitem.className = 'RCmenuitems';
		RCitem.onmouseover = function() {this.className='RCmenuitemsover';};
		RCitem.onmouseout = function() {this.className='RCmenuitems';};
				var aRCitemsi = aRCitems[i].split(",")
				var sdsd='';
			if(aRCitemsi[1]=='0') {
        		RCitem.onclick = function() {
        				RCMid = this.id;
        				RCMi = aRCitems[RCMid].split(",");
        				document.location.href=RCMi[2]; return false;
        		};
        		RCitem.innerHTML='<img src="images/openWinThis.gif" width="15" height="15" align="absmiddle"> ';
				sdsd = "(function(){document.location.href='"+ aRCitemsi[2] +"'; return false;})();";
			}
			if(aRCitemsi[1]=='1') {
        		RCitem.onclick = function() {
        				RCMid = this.id;
        				RCMi = aRCitems[RCMid].split(",");
        				parent.customFunctionCreateWindow(RCMi[2], RCMi[3], RCMi[4], RCMi[5], RCMi[6], RCMi[7]); return false;
        //				alert(RCMi[2] +'---'+ RCMi[3] +'---'+ RCMi[4] +'---'+ RCMi[5] +'---'+ RCMi[6] +'---'+ RCMi[7]);
        		};
        		RCitem.innerHTML='<img src="images/openWinNew.gif" width="15" height="15" align="absmiddle"> ';
//				sdsd = "(function(){parent.customFunctionCreateWindow('"+ aRCitemsi[2] +"','"+ aRCitemsi[3] +"',"+ aRCitemsi[4] +","+ aRCitemsi[5] +","+ aRCitemsi[6] +","+ aRCitemsi[7] +"); return false;})();";
			}
			//TaskBar
			if(aRCitemsi[1]=='2') {
        		RCitem.onclick = function() {
        				RCMid = this.id;
        				RCMi = aRCitems[RCMid].split(",");
//        				document.getElementById('Pencereler'+RCMi[2].replace(/[^0-9]/g,'')).onclick(); //tasbar buton sec
        				document.getElementById(RCMi[2]).onclick();
        				(elem=document.getElementById('RCmenu')).parentNode.removeChild(elem); // islemden sonra RCmenuyu sil
        		};
        				document.getElementById('Pencereler'+aRCitemsi[2].replace(/[^0-9]/g,'')).onclick(); //tasbar buton sec
        		RCitem.innerHTML='<img alt="-" src="'+ replaceFileName(document.getElementById(aRCitemsi[2]).src, '1', '0') +'" width="15" height="15" align="absmiddle" style="background-color:rgba(50, 100, 200, 0.4)"> ';
        		bImg=document.getElementById(aRCitemsi[2]).src;
        		if (bImg.indexOf('minimize')>=0) {
        			aRCitemsi[0] = aRCitemsi[0].split("/")[0];
        		} else if (bImg.indexOf('maximize')>=0) {
        			aRCitemsi[0] = aRCitemsi[0].split("/")[1];
        		} else if (bImg.indexOf('fs_minimize')>=0) {
        			aRCitemsi[0] = aRCitemsi[0].split("/")[0];
        		} else if (bImg.indexOf('fs_maximize')>=0) {
        			aRCitemsi[0] = aRCitemsi[0].split("/")[1];
        		}
//				sdsd = "(function(){document.location.href='"+ aRCitemsi[2] +"'; return false;})();";
			}

//		RCitem.onclick = sdsd;
	    var txt = document.createTextNode(aRCitemsi[0]);
//	    var txt = document.createTextNode(aRCitemsi[0] +''+ sdsd );
	    RCitem.appendChild(txt);
     }

    var RCposition = document.createElement('div');
    RCelement.appendChild(RCposition);
    RCposition.className = 'RCposition';

	var rightedge = document.body.clientWidth-event.clientX;
	var bottomedge = document.body.clientHeight-event.clientY;
	if (rightedge < RCelement.offsetWidth) {
		RCelement.style.left = document.body.scrollLeft + event.clientX - RCelement.offsetWidth;
		RCposition.style.left = RCelement.offsetWidth-6;
	} else {
		RCelement.style.left = document.body.scrollLeft + event.clientX;
		RCposition.style.left = -3;
	}
	if (bottomedge < RCelement.offsetHeight) {
		RCelement.style.top = document.body.scrollTop + event.clientY - RCelement.offsetHeight;
		RCposition.style.top = RCelement.offsetHeight-6;
	} else {
		RCelement.style.top = document.body.scrollTop + event.clientY;
		RCposition.style.top = -3;
	}
	removeRCmenu();
 }
 return false;
}
function removeRCmenu() {
//    tt = function(){if(document.getElementById('RCMenu')!=null){document.body.removeChild(RCmenu);}};
//    RCzaman = setTimeout(tt, 600);
    RCzaman = setTimeout("if(document.getElementById('RCmenu')) (elem=document.getElementById('RCmenu')).parentNode.removeChild(elem);", 1500);
}
function stopedRCmenu() {
    window.clearTimeout(RCzaman);
}
function jumptoie5() {
	if (event.srcElement.className == 'menuitems') {
		if (event.srcElement.getAttribute('target') != null) {
			window.open(event.srcElement.url, event.srcElement.getAttribute('target'));
		} else {
			window.location = event.srcElement.url;
		}
	}
}
//-- sagTus MENU --son

//-- sayfaYazdir --bas
function printPartOfPage(elementId) {
  if (!document.getElementById(elementId)) {
   var GelenMetin = document.body.innerHTML;
   } else {
  var GelenMetin = document.getElementById(elementId).innerHTML;
   }
  GelenMetin = GelenMetin.replace(/div id="AltMenuBarDiv"/gi,'div style="display:none"');
  GelenMetin = GelenMetin.replace(/overflow:auto;/gi,'');
  GelenMetin = GelenMetin.replace(/overflow-y:auto;/gi,'');
  GelenMetin = GelenMetin.replace(/overflow-y:scroll;/gi,'');
  GelenMetin = GelenMetin.replace(/height:[^>]+;/g,'');
  GelenMetin = GelenMetin.replace(/max-height:[^>]+;/g,'');
  GelenMetin = GelenMetin.replace(/type="submit"/gi,'type="hidden"');
  GelenMetin = GelenMetin.replace(/class="Button"/gi,'');
  GelenMetin = GelenMetin.replace(/<img[^>]+>/g,'');

  var printWindow = window.open('', '', 'width=300px,height=300px,top=150px,left=150px,location=no,toolbars=no,scrollbars=no,menubar=no,titlebar=no,status=no,resizable=no');
//  var printWindow = window.open('', "", "width=10,height=10,top=200,left=200,toolbars=no,scrollbars=no,status=no,resizable=no");
	  printWindow.document.write('<html><head>');
	  printWindow.document.write('<link rel="stylesheet" type="text/css" href="css/Sekil.css"/>');
	  printWindow.document.write('<style></style></head>');
	  printWindow.document.write('<body onload="window.print(); window.close();">');
	  printWindow.document.write('<div align="center" style="position:relative;">');
	  printWindow.document.write('<table border="0" cellspacing="0" cellpadding="0"><tr><td align="center">');
	  printWindow.document.write(GelenMetin);
	  printWindow.document.write('</td></tr></table>');
	  printWindow.document.write('</div>');
  	  printWindow.document.write('</body></html>');
	  printWindow.document.close();
  printWindow.focus();
}
//-- sayfaYazdir --son


//-- imgGizleGoster --bas
function imgGG(id,gg) {
  var igElem = document.getElementById(id);
  if(igElem) {
    if(gg==0) {igElem.style.visibility='hidden';}
    if(gg==1) {igElem.style.visibility='visible';}
  }
  return false;
}
//-- imgGizleGoster --son

//-- tableToExcel --bas
function tableToExcel(table, name) {

	includeSignatureJsFiles(['export-xlsx-core-min.js','export-xlsx-Blob.js','export-xlsx-Export2Excel.js','export-xlsx-FileSaver.js']);

  if (typeof export_table_to_excel === 'undefined') {
        setTimeout(function(){tableToExcel(table, name);}, 1000);
  } else {

    if (!document.getElementById(table[0])) {
		if (!table.nodeType) table = document.getElementById(table);
	}
	if(!table) return false;

	var tbl = document.createElement("table");
	var cTr = []; //col style
	for(var i=0; i<table.length;i++){
		aTable = document.getElementById(table[i]);
		if (aTable){

			var cols = aTable.getElementsByTagName('col'); //--ilk satır style için
			if (cols.length==0) cols = aTable.rows[0].cells;

			var xtr = aTable.rows;

			for(var tr=0; tr<xtr.length; tr++){
				var row = document.createElement("tr");
				var xtd = aTable.rows[tr].cells
				var cTd = [];
				for(var td=0; td<xtd.length; td++){
					var cell = document.createElement("td");
					cVal = aTable.rows[tr].cells[td].innerText; //textContent;
					if((cVal === undefined || cVal == null || cVal.length <= 0)) cVal = '';
					if((cVal === 0)) cVal = '';
					var cellText = document.createTextNode(cVal);
					cell.appendChild(cellText);
					row.appendChild(cell);
						var colspan = aTable.rows[tr].cells[td].getAttribute('colspan');
						var rowspan = aTable.rows[tr].cells[td].getAttribute('rowspan');
						if(colspan != null) cell.colSpan = colspan;
						if(rowspan != null) cell.rowSpan = rowspan;

					cStyle='s';
					if(cols[td] && cols[td].getAttribute('class') != null) {
					if (cols[td].className == 'colTutar') cStyle='n';
					else if (cols[td].className == 'colTarih') cStyle='t';
					else cStyle='s';
					}
					else cStyle='s';
					cTd.push(cStyle);
				}
				tbl.appendChild(row);
				cTr.push(cTd);
			}
		}
	}

	if(!tbl.nodeType) return false;
	export_table_to_excel(tbl, cTr, name);
  }
};
//-- tableToExcel --son

function clearTable(tables) {
  var temp = '';
	if (!document.getElementById(tables[0])) return false;
	for(var i=0; i<tables.length; i++){
	  if (document.getElementById(tables[i])) {
		temp += '<table>';
		var xtable = document.getElementById(tables[i])
		var xtr = xtable.rows;
		for(var tr=0; tr<xtr.length; tr++){
			temp += '<tr>';
			var xtd = xtable.rows[tr].cells
			for(var td=0; td<xtd.length; td++){
				temp += '<td>';
				temp += xtable.rows[tr].cells[td].textContent;
				temp += '</td>';
			}
			temp += '</tr>';
		}
		temp += '</table>';
	  }
	}
  return temp;
}
function arrayTable(tables) {
  //aray dizesinde string döndürür. kullanacağın yerde arraya çevir.
  var temp = '';
	if (!document.getElementById(tables[0])) return false;
	for(var i=0; i<tables.length; i++){
	  if (document.getElementById(tables[i])) {
		temp += '[';
		var xtable = document.getElementById(tables[i])
		var xtr = xtable.rows;
		for(var tr=0; tr<xtr.length; tr++){
			temp += '[';
			var xtd = xtable.rows[tr].cells
			for(var td=0; td<xtd.length; td++){
				temp += '["';
				temp += xtable.rows[tr].cells[td].textContent;
				if(td+1<xtd.length) temp += '"],'; else temp += '"]';
			}
			if(tr+1<xtr.length) temp += '],'; else temp += ']';
		}
	    if(i+1<tables.length) temp += '],'; else temp += ']';
	  }
	}
  return temp;
}
function arrayTableForAsp(tables) {
  //aray dizesinde string döndürür. kullanacağın yerde arraya çevir.
  var temp = '';
	if (!document.getElementById(tables[0])) return false;
	for(var i=0; i<tables.length; i++){
	  if (document.getElementById(tables[i])) {
		var xtable = document.getElementById(tables[i])
			//--ilk satır style için
			var cols = xtable.getElementsByTagName('col');
			if (!cols) cols = xtable.rows[0].cells
			for (var c=0; c < cols.length; c++) {
				if (cols[c].className == 'colTutar') {
					temp += 'n';
				} else {
					temp += 's';
				}
				if(c+1<cols.length) temp += '[^c],';
			}
			temp += '[^r],';
			//--
		var xtr = xtable.rows;
		for(var tr=0; tr<xtr.length; tr++){
			var xtd = xtable.rows[tr].cells
			for(var td=0; td<xtd.length; td++){
				temp += ''+ xtable.rows[tr].cells[td].textContent +'';
				if(td+1<xtd.length) temp += '[^c],';
			}
			if(tr+1<xtr.length) temp += '[^r],';
		}
	    if(i+1<tables.length) temp += '[^t],';
	  }
	}
  return temp;
}
//-- TdSum --bas
function addSumHandlers(tableId) {
    var tbl = document.getElementById(''+tableId+'');
    var cols = tbl.getElementsByTagName('col');
	for (var c=0; c < cols.length; c++) {
	  if (cols[c].className == 'colTutar') {
		var rows = Array.prototype.slice.call(tbl.getElementsByTagName('tr'));
		for(var r in rows){
			if (rows[r].cells[c] && rows[r].cells[c].textContent && rows[r].cells[c].textContent.replace(/[^0-9]/g,'')>0) {
			rows[r].cells[c].onclick = function(){TdSum(this);};
			rows[r].cells[c].style.cursor = 'cell';
			}
		}
	  }
	}
	var TdSumScreen = document.createElement('div');
	tbl.parentNode.insertBefore(TdSumScreen, tbl.parentNode.childNodes[0]);
	TdSumScreen.id = 'TdSumScreen_'+tableId;
	TdSumScreen.className = 'TdSumScreen';
	TdSumScreen.style.display='none';
	var val = document.createTextNode('0');
	TdSumScreen.appendChild(val);
	var xTdSumScreen = document.querySelector('.TdSumScreen');
	xTdSumScreen.onclick = function (e) {
		if (e.offsetX > xTdSumScreen.offsetWidth) {
			TdSumExit(this.id.replace('TdSumScreen_',''));
			this.style.display='none';
			this.textContent='0';
		};
	};
}
function TdSumExit(tableId){
	var td = Array.prototype.slice.call(document.getElementById(''+tableId+'').getElementsByTagName('td'));
	for(var i in td){
		td[i].style.backgroundColor='';
		if (td[i].style.backgroundColor=='rgb(135, 206, 235)') {
		td[i].style.backgroundColor='';
		}
	}
}
function TdSum(bu){
  DetectEventCode(event);
  if (e.ctrlKey || e.shiftKey) {
	var tbl = document.getElementById(''+bu.parentNode.parentNode.parentNode.id+'');
    var SumResultDiv = document.getElementById('TdSumScreen_'+tbl.id);
    var SumResult = 0;
	var td = Array.prototype.slice.call(tbl.getElementsByTagName('td'));
	for(var i in td){
		if (td[i]==bu && e.ctrlKey) {
			if (bu.style.backgroundColor=='') {
				bu.style.backgroundColor='rgb(135, 206, 235)';
			}else{
				bu.style.backgroundColor='';
			}
		}
		if (td[i]==bu && e.shiftKey) {
			if (bu.style.backgroundColor=='') {
				bu.style.backgroundColor='rgb(255, 163, 163)';
			}else{
				bu.style.backgroundColor='';
			}
		}
		if (td[i].style.backgroundColor=='rgb(135, 206, 235)') {
			SumResult += 1 * parseFloat(td[i].textContent.replace(/[^0-9,]/g,'').replace(/\$|\,/g,'.'));
		}
		if (td[i].style.backgroundColor=='rgb(255, 163, 163)') {
			SumResult -= 1 * parseFloat(td[i].textContent.replace(/[^0-9,]/g,'').replace(/\$|\,/g,'.'));
		}
	}
	SumResultDiv.textContent=parseFloat(SumResult).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
	//.replace(/\d(?=(\d{3})+\.)/g, '$&,'); basamaklamak için
	if (SumResult==0) {SumResultDiv.style.display='none';}else{SumResultDiv.style.display='block';}
  }
}
//-- TdSum --son

//-- TrSec --bas
function addRowHandlers(tableId) {
	var rows = Array.prototype.slice.call(document.getElementById(''+tableId+'').getElementsByTagName('tr'));
	for(var i in rows){
		rows[i].onclick = function(){TrSec(this, 1);};
		rows[i].oncontextmenu = function(){TrSec(this, 2);};
	}
}
function TrSec(bu, x){
	DetectEventCode(event);
    if (e.altKey || e.ctrlKey || e.shiftKey) {return false;}

	var table = document.getElementById(''+bu.parentNode.parentNode.id+'');
	var rows = Array.prototype.slice.call(table.getElementsByTagName('tr'));
	for(var i in rows){
	  if (x==1) {
		if (rows[i].style.backgroundColor=='rgb(255, 255, 224)') {
			rows[i].style.backgroundColor="rgb(255, 250, 250)";
		}
		if (rows[i]==bu) {
			if (rows[i].style.backgroundColor=='') {
			rows[i].style.backgroundColor='rgb(255, 255, 224)';
			}else{
			rows[i].style.backgroundColor='';
			}
		}
	  }
	  if (x==2 && rows[i]==bu) {
		var bckClr = ''+bu.style.backgroundColor+'';
		bu.style.backgroundColor='rgb(223, 223, 255)';
		setTimeout(function(){ bu.style.backgroundColor=bckClr; }, 1500);
	  }
	}

}
//-- TrSec --son
