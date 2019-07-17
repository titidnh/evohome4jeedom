function EvoSchedule(consoleId){this.zones=new Array();this.days=new Array();this.C2BG=[[25,'#f21f1f'],[22,'#ff5b1a'],[19,'#fa9e2d'],[16,'#2e9985'],[0,'#247eb2']];this.typeSchedule=null;this.currentPoint=null;this.editAvailable=null;this.edit=null;this.zoneId=null;this.scheduleOpenCmd=null;this.skipNextGoWith=false;this.currentDay=null;this.minTemp=5.0;this.medTemp=15.0;this.maxTemp=25.0;this.lblEdit=null;this.lblCopyTo=null;this.lblCopyToTitle=null;this.lblOpenAfterCopy=null;this.lblValidate=null;this.lblInheritTitle=null;this.lblCantRemoveLastPoint=null;this.lblFileNameEmpty=null;this.lblRemovePoint=null;this.lblRemovePoint2=null;this.lblCopyDay=null;this.lblCreate=null;this.lblReplaceSave=null;this.lblConfirmSave=null;this.sl='#scheduleList'+consoleId;this.isEditAvailable=function(){return!this.edit&&this.editAvailable&&$(this.sl).length>0;};this.scheduleSelectedId=$(this.sl+' option:selected').value();this.scheduleSelectedName=this.scheduleSelectedId==0?"":$(this.sl+' option:selected').text();this.openEdit=function(zoneId){$('#md_modal').dialog('close');$('.showCurrentSchedule'+this.typeSchedule+zoneId).css('background-color','rgb(16, 208, 16)');$('#md_modal').dialog({height:'auto',position:{my:'center top',at:'center top+50',of:window}});$('#md_modal').load(this.scheduleOpenCmd.replace('_zoneId_',zoneId)).dialog('open');};this.buildDailySchedules=function(content){this.DailySchedules=content;}
this.Zone=function(zoneId,name,eqName,schedules){this.zoneId=zoneId;this.name=name;this.eqName=eqName;this.schedules=schedules;this.schedulesToString=function(s){return JSON.stringify(s,function(k,v){if(k==="pointsORG")return undefined;return v;});};this.schedulesORG=this.schedulesToString(schedules);this.check=function(){return this.schedulesORG===this.schedulesToString(this.schedules);};};this._S=function(day,points){return new this.S(day,points);}
this.S=function(day,points){this.day=day;this.points=points;this.pointsORG=JSON.stringify(points);this.check=function(){return this.pointsORG===JSON.stringify(this.points);};};this._P=function(temp,hour){return new this.P(temp,hour,false);}
this.P=function(temp,hour,virtual){this.temp=temp;this.hour=hour;this.virtual=virtual;};this.buildPoint=function(zn,ds,ip,day,hm,hmNext,temp,virtual){return{zn:zn,ds:ds,ip:ip,day:day,hm:hm,hmNext:hmNext,temp:temp,virtual:virtual};};this.getBackColorForTemp=function(consigne){for(var p=0;p<5;p++)if(consigne>=this.C2BG[p][0])return this.C2BG[p][1];return this.C2BG[4][1];};this.getEvoCurrentDay=function(){var jsd=new Date().getDay();return jsd==0?6:--jsd;};this.displayHTable=function(){if(this.currentDay==null){this.currentDay=this.getEvoCurrentDay();}
var sortedZones=new Array();this.zones.forEach(function(zone){sortedZones[sortedZones.length]={eqName:zone.eqName,id:zone.zoneId,checked:zone.check()};});sortedZones.sort(function(a,b){a=a.eqName.toLowerCase();b=b.eqName.toLowerCase();return a<b?-1:a>b?1:0;});var currentTime=new Date().toLocaleString();currentTime=currentTime.substring(currentTime.lastIndexOf(' ')+1);var _table="";var inherited=null;for(var zn=0;zn<this.zones.length;zn++){myZone=this.zones[zn];if(this.zoneId==0||this.zoneId==myZone.zoneId){_table+="<table class='_t1'>";_table+="<tr><td colspan=2 class='_t2'><table width=100% class='_t3'><tr><td nowrap>&nbsp;&nbsp;";if(this.edit){_table+="<select id='srcZone' onchange='_evs.showZone(parseInt(this.value));'>";sortedZones.forEach(function(zone){_table+="<option value='"+zone.id+"'";if(_evs.zoneId==zone.id)_table+=" selected";_table+=">"+zone.eqName;if(!zone.checked)_table+=" *";_table+="</option>";});_table+="</select>";}else{_table+=myZone.eqName;}
if(this.zoneId==0&&this.isEditAvailable()&&!this.edit){_table+="<a id='btnEdit"+myZone.zoneId+"' class='btn btn-success btn-sm _edit' onclick='_evs.openEdit("+myZone.zoneId+");'>";_table+=this.lblEdit+'</a>';}else if(this.zoneId>0&&this.edit){_table+='</td><td width="100%" align="right">';_table+='<a class="btn btn-primary btn-sm" onclick="_evs.copyZone();">'+this.lblCopyTo+'</a>&nbsp;';_table+='</td><td nowrap>';_table+='<select id="dstZone">';sortedZones.forEach(function(zone){if(_evs.zoneId!=zone.id)_table+='<option value="'+zone.id+'">'+zone.eqName+(zone.checked?"":" *")+'</option>';});_table+='</select>&nbsp;&nbsp;';}
_table+="</td>";_table+="</tr></table></td></tr>";for(var ids=0;ids<myZone.schedules.length;ids++){ds=myZone.schedules[ids];_table+="<tr>";_table+="<td id='row"+ids+"' nowrap='nowrap' class='";if(ids==6)_table+="_rowTdA";var actifDay=(this.currentPoint==null&&ds.day==this.currentDay)||(this.currentPoint!=null&&ds.day==this.currentPoint.day);if(actifDay&&!this.edit)_table+="_rowTdB";_table+="'>";if(this.edit){_table+="<input name='cday' type='checkbox' value='"+ds.day+"'";if(actifDay)_table+=" disabled";_table+="/>&nbsp;<input id='rday"+ds.day+"' name='rday' type='radio' value='"+ds.day+"'";if(actifDay)_table+=" checked='checked'";_table+="/>";}
_table+="&nbsp;<label for='rday"+ds.day+"'>"+this.days[ds.day]+"</label>&nbsp;&nbsp;";_table+="</td><td width=100%>";_table+="<table border=1 width=100% class='";_table+=!this.edit?"_t4":"_t4e";_table+="'><tr>";var mark=0;var hmNext;for(var ip=1;ip<=ds.points.length;ip++){var sp=ds.points[ip-1];if(ds.day==this.currentDay){if(ip==ds.points.length){mark++;}else if(ds.points[ip].hour.substr(0,5)>currentTime){mark++;}}
var te=2400;if(ip<ds.points.length){hmNext=ds.points[ip].hour.substr(0,5);te=parseInt(hmNext.substr(0,2)+hmNext.substr(3,2));}else{hmNext="-";}
var hm=sp.hour.substr(0,5);_table+="<td ";var oPoint=this.buildPoint(zn,ids,ip-1,ds.day,hm,hmNext,sp.temp,sp.virtual);if(this.edit){_table+="onclick='_evs.gowith("+JSON.stringify(oPoint)+",1);'";}
var td=parseInt(hm.substr(0,2)+hm.substr(3,2));var _w=(te-td)/2400.0*100.0;_table+=" style='width:"+_w+"%;'><table border=0 width=100%>";_table+="<tr><td id=slice"+ids+"_"+(ip-1);if((((this.edit&&this.currentPoint==null)||!this.edit)&&mark==1)||(this.edit&&this.currentPoint!=null&&this.currentPoint.ds==ids&&this.currentPoint.ip==ip-1)){if(!this.edit)_table+=" class='_slice1'";if(this.currentPoint==null){this.currentPoint=oPoint;}
mark++;}else if(sp.virtual){_table+=" class='_slice2'";}
_table+=">"+hm+"</td></tr>";var bgc=sp.virtual?"background-color:#F0F0F0;":("background-color:"+this.getBackColorForTemp(sp.temp)+";");_table+="<tr><td style='color:white;"+bgc+"'"
if(this.edit||sp.virtual)_table+=" nowrap='nowrap'";var sTemp=(sp.virtual?"<span class='glyphicon glyphicon-arrow-left _virtual' title='"+this.lblInheritTitle+"'/>":sp.temp.toFixed(1));_table+=">"+sTemp;if(this.edit&&!sp.virtual){_table+="&nbsp;<span class='glyphicon glyphicon-remove' onclick='_evs.removePoint("+zn+","+ids+","+(ip-1)+")'/>";}
_table+="</td></tr></table>";}
_table+="</tr></table></td>";if(this.edit){_table+="<td nowrap style='width:20px;'";_table+=ds.check()?">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;":" class='_nocheck1' onclick='_evs.revert("+zn+","+ids+");'>&nbsp;<img class='_nocheck2' src='plugins/evohome/img/reverse.png'/>";_table+="</td>";}
_table+="</tr>";}
_table+="</table>";if(this.zoneId==0&&zn<this.zones.length)_table+="<br/>";}}
document.getElementById('scheduleTable').innerHTML=_table;if(this.edit){$('input[name="cday"]').on('click',function(event){$('#copyBtn').attr('disabled',!_evs.checkCopy());});$('input[name="rday"]').on('click',function(event){_evs.currentDay=parseInt(this.value);_evs.currentPoint=null;_evs.displayHTable();});if(this.currentPoint!=null){this.gowith(this.currentPoint,0);}}};this.gowith=function(op,mode){if(mode==1&&this.skipNextGoWith){this.skipNextGoWith=false;return;}
var atd=op.hm.split(":");$('input[name="rday"][value="'+op.day+'"]').prop('checked',true);$('input[name="cday"]').attr('disabled',false);$('input[name=cday][value='+op.day+']').attr('disabled',true);$('input[name=cday][value='+op.day+']').prop('checked',false);$("#row"+this.currentPoint.ds).css({'background-color':'','color':''});$("#slice"+this.currentPoint.ds+"_"+this.currentPoint.ip).css({'background-color':(this.currentPoint.virtual?'#F0F0F0':''),'color':(this.currentPoint.virtual?'gray':'')});$("#row"+op.ds).css({'background-color':'lightgreen','color':'black'});$("#slice"+op.ds+"_"+op.ip).css({'background-color':'lightgreen','color':'black'});this.currentPoint=op;this.currentDay=op.day;$('#setpoint').val("");$('#hours').val("");$('#minutes').val("");setTimeout(function(){$('#setpoint').val(op.temp.toFixed(1));$('#hours').val(atd[0]);$('#minutes').val(atd[1]);_evs.checkAppendAndValid();},250);this.checkGoSlice();};this._VP=function(){return new this.P(this.medTemp,"00:00:00",true);};this.showZone=function(idz){this.zoneId=idz;this.currentPoint=null;this.displayHTable();restoreCmdBgdColor();$('.showCurrentSchedule'+this.typeSchedule+idz).css('background-color','rgb(16, 208, 16)');};this.removePoint=function(zn,ds,ip){this.skipNextGoWith=true;var points=this.zones[zn].schedules[ds].points;var pr=points[ip];if(myConfirm(ip<points.length-1?getMsg(this.lblRemovePoint,[pr.temp,pr.hour.substr(0,5),points[ip+1].hour.substr(0,5)]):getMsg(this.lblRemovePoint2,[pr.temp,pr.hour.substr(0,5)]))){points.splice(ip,1);if(points.length==0||(points.length>0&&points[0].hour!='00:00:00')){points.splice(0,0,this._VP());}
if(ip>0)ip--;this.gowith(this.buildPoint(zn,ds,ip,this.zones[zn].schedules[ds].day,points[ip].hour,null,points[ip].temp,points[ip].virtual));this.displayHTable();}};this.revert=function(zn,ds){this.zones[zn].schedules[ds].points=JSON.parse(this.zones[zn].schedules[ds].pointsORG);if(this.currentPoint.zn==zn&&this.currentPoint.ds==ds){this.currentPoint=null;}
this.displayHTable();};this.adjustSetpoint=function(step){var oldValue=parseFloat($('#setpoint').val().trim());var newVal=step==-1&&oldValue>this.minTemp?oldValue-0.5:step==1&&oldValue<this.maxTemp?oldValue+0.5:oldValue;$('#setpoint').val(newVal.toFixed(1));};this.adjustHours=function(step){var oldValue=parseInt($('#hours').val().trim());var newVal=step==-1&&oldValue>0?oldValue-1:step==1&&oldValue<23?oldValue+1:oldValue;$('#hours').val(newVal<10?"0"+newVal:newVal);this.checkAppendAndValid();};this.adjustMinutes=function(step){var hours=parseInt($('#hours').val().trim());var oldValue=parseInt($('#minutes').val().trim());var newVal=oldValue;if(step==-1){if(oldValue>0)newVal=oldValue-10;else if(hours>0){newVal=50;hours--;}}else
if(oldValue<50)newVal=oldValue+10;else if(hours<23){newVal=0;hours++;}
if(oldValue!=newVal){$('#hours').val(hours<10?"0"+hours:hours);$('#minutes').val(newVal==0?"00":newVal);}
this.checkAppendAndValid();};this.getInputTime=function(){return $('#hours').val()+":"+$('#minutes').val()+":00";};this.getInputTemp=function(){return parseFloat($('#setpoint').val());};this.checkAppendAndValid=function(){var points=this.zones[this.currentPoint.zn].schedules[this.currentPoint.ds].points;var p=points[this.currentPoint.ip];var nbPointsDefined=points.length-(points[0].virtual?1:0);var appActivate=nbPointsDefined<6;var valActivate=!p.virtual||nbPointsDefined<6;for(var i=0;i<points.length;i++){if(points[i].hour==this.getInputTime()){appActivate=false;if(i!=this.currentPoint.ip)valActivate=false;}}
$('#btnAppend').attr('disabled',!appActivate);$('#btnValid').attr('disabled',!valActivate);return{appActivate:appActivate,valActivate:valActivate};};this.append=function(){if(!this.checkAppendAndValid().appActivate)return;var points=this.zones[this.currentPoint.zn].schedules[this.currentPoint.ds].points;var hm=this.getInputTime();var ip=points.length;for(var p=0;p<points.length;p++){if(points[p].hour>hm){ip=p;break;}}
var temp=this.getInputTemp();points.splice(ip,0,this._P(temp,hm));this.currentPoint.ip=ip;this.currentPoint.temp=temp;this.currentPoint.hm=hm;this.checkAppendAndValid();this.displayHTable();};this.validate=function(){if(!this.checkAppendAndValid().valActivate)return;var points=this.zones[this.currentPoint.zn].schedules[this.currentPoint.ds].points;var p=points[this.currentPoint.ip];p.temp=this.getInputTemp();var it=this.getInputTime();p.hour=it;p.virtual=false;if(this.currentPoint.ip==0&&p.hour!='00:00:00'){points.splice(0,0,this._VP());this.currentPoint.ip++;}else{points.sort(function(a,b){return parseInt(a.hour.replace(/:/g,""))-parseInt(b.hour.replace(/:/g,""));});for(var i=0;i<points.length;i++){if(points[i].hour==it){this.currentPoint.ip=i;break;}}}
this.currentPoint.temp=p.temp;this.currentPoint.hm=it;this.checkAppendAndValid();this.displayHTable();};this.checkCopy=function(){var cdays=$('input[name="cday"]');for(var i=0;i<cdays.length;i++){if(cdays[i].checked)return true;}
return false;};this.clonePoints=function(pSrc){var pDst=[];pSrc.forEach(function(ps){pDst[pDst.length]=new _evs.P(ps.temp,ps.hour,ps.virtual);});return pDst;};this.copyDays=function(){if(!this.checkCopy())return;var val=parseInt($('input[name="rday"]:checked')[0].value);var dayName=$('label[for="rday'+val+'"]')[0].innerHTML;var daysChecked=$('input[name="cday"]:checked');var valChecked=[];for(var c=0;c<daysChecked.length;c++){valChecked[c]=_evs.days[daysChecked[c].value];}
if(myConfirm(getMsg(this.lblCopyDay,[dayName,valChecked]))){var pSrc=this.zones[this.currentPoint.zn].schedules[val].points;for(var c=0;c<daysChecked.length;c++){this.zones[this.currentPoint.zn].schedules[parseInt(daysChecked[c].value)].points=this.clonePoints(pSrc);}
this.currentDay=val;this.currentPoint=null;this.displayHTable();}};this.checkGoSlice=function(){var canPrevious=this.currentPoint.ip!=0;$('#prevSlice').attr('disabled',!canPrevious);var points=this.zones[this.currentPoint.zn].schedules[this.currentPoint.ds].points;var canNext=this.currentPoint.ip!=points.length-1;$('#nextSlice').attr('disabled',!canNext);return{canPrevious:canPrevious,canNext:canNext};};this.goSlice=function(step){var canPN=this.checkGoSlice();if((step==-1&&!canPN.canPrevious)||(step==1&&!canPN.canNext))return;var newIp=this.currentPoint.ip+step;var ep=this.zones[this.currentPoint.zn].schedules[this.currentPoint.ds].points[newIp];var newPoint=this.buildPoint(this.currentPoint.zn,this.currentPoint.ds,newIp,this.currentPoint.day,ep.hour,null,ep.temp,ep.virtual);this.gowith(newPoint,0);};this.copyZone=function(){var srcName=$('#srcZone option:selected').text();var dstName=$('#dstZone option:selected').text();var selDaysText=[_evs.days[_evs.currentDay]];var options=[{text:'  '+selDaysText,value:1},{text:'  Semaine complète',value:3}];var daysToReplace=[[_evs.currentDay],null,[0,1,2,3,4,5,6]];var daysChecked=$('input[name="cday"]:checked');if(daysChecked.length>0){selDaysText+=' + ';var selDaysValues=[_evs.currentDay];for(var c=0;c<daysChecked.length;c++){selDaysText+=_evs.days[daysChecked[c].value];if(c+1<daysChecked.length)selDaysText+=", ";selDaysValues[selDaysValues.length]=daysChecked[c].value;}
options.splice(1,0,{text:'  '+selDaysText,value:2});daysToReplace[1]=selDaysValues;}
var dialog=bootbox.prompt({title:_evs.getMsg(_evs.lblCopyToTitle,[srcName,dstName]),inputType:'checkbox',inputOptions:options,buttons:{confirm:{label:_evs.lblValidate}},callback:function(choice){if(choice==null)return;var srcZone=null;var dstZone=null;for(var zn=0;zn<_evs.zones.length;zn++){var xZone=_evs.zones[zn];if(xZone.zoneId==$('#srcZone').value()){srcZone=xZone;}else if(xZone.zoneId==$('#dstZone').value()){dstZone=xZone;}}
var dtr=daysToReplace[parseInt(choice)-1];for(var i=0;i<dtr.length;i++){dstZone.schedules[dtr[i]].points=_evs.clonePoints(srcZone.schedules[dtr[i]].points);}
if($('#idCheckOpenAfter').prop('checked')){$('#srcZone').value($('#dstZone').value());}else{_evs.displayHTable();}}});dialog.init(function(){$('.bootbox-input-checkbox').attr('type','radio');$('.bootbox-input-checkbox').attr('name','idChoice');$('input[name="idChoice"]:first').prop('checked',true);$('.bootbox-form').append('<br/><label><input type="checkbox" id="idCheckOpenAfter" checked value="1"/>'+_evs.getMsg(_evs.lblOpenAfterCopy,dstName)+'</label>');});};this.saveSchedule=function(){var fileName=$('#saveName').val().trim();if(fileName.length===0){myAlert(this.lblFileNameEmpty);return;}
var fileId=0;if(!(this.scheduleSelectedName===fileName)){$(this.sl+' option').each(function(){if(this.text===fileName){fileId=myConfirm(_evs.getMsg(_evs.lblReplaceSave,fileName))?this.value:-1;}});if(fileId==0&&!myConfirm(getMsg(this.lblCreate,fileName)))fileId=-1;}else{fileId=myConfirm(getMsg(this.lblConfirmSave,fileName))?this.scheduleSelectedId:-1;}
if(fileId==-1)return;var scheduleToSave=JSON.stringify(_evs.zones,function(k,v){if(k==="schedules")return new _evs.buildDailySchedules(v);if(k==="points"){var noVirtual=new Array();for(var i=0;i<v.length;i++)if(!v[i].virtual)noVirtual[noVirtual.length]=v[i];return noVirtual;}
if(k==='eqName'||k==="virtual"||k==="schedulesORG"||k==="pointsORG")return undefined;return v;}).replace(/id/g,"zoneId").replace(/schedules/g,"schedule").replace(/day/g,"DayOfWeek").replace(/points/g,"Switchpoints").replace(/temp/g,"heatSetpoint").replace(/hour/g,"TimeOfDay");evohomeSave(fileId,fileName,encodeURIComponent($('#idComment').val()),scheduleToSave);};}