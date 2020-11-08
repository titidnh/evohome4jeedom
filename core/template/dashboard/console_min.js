function fHnwConsole(pIsAdmin,pArgLocId,pArgCodeMode,pSetModeConfirm,pSetModeInfoList){this.genConsoleId=[];this.lastFileId=[];this.isCurrent=[];this.cmdSetModeId=[];this.cmdSaveId=[];this.isAdmin=pIsAdmin;this.argLocId=pArgLocId;this.argCodeMode=pArgCodeMode;this.setModeConfirm=pSetModeConfirm;this.setModeInfoList=pSetModeInfoList;}
function initVarsConsole(_locId,pArgLocId,_id,pIsAdmin,pScheduleFileId,pScheduleType,pCanRestoreCurrent,taskIsRunning,pTitleSetMode,pCodesAllowed,pModesArray,pSchedulesList,pEtatCode,pDisplaySetModeConsole,pCmdSetModeId,pArgCodeMode,pSetModeConfirm,pSetModeInfoList,pCmdSaveId,pSaveAs,pSaveInfoListMessage,pSaveReplace,pSaveName,pSaveRemark,pArgFileName,pArgFileRem,pCmdRestoreId,pRestoreConfirm,pRestoreInfoList,pCmdDeleteId,pDeleteConfirm,pDeleteInfoList){if(typeof hnwConsole=='undefined'){window.hnwConsole=new fHnwConsole(pIsAdmin,pArgLocId,pArgCodeMode,pSetModeConfirm,pSetModeInfoList);}
hnwConsole.genConsoleId[_locId]=_id;hnwConsole.lastFileId[_id]=-1;hnwConsole.isCurrent[_id]=false;hnwConsole.cmdSetModeId[_id]=pCmdSetModeId;hnwConsole.cmdSaveId[_id]=pCmdSaveId;$('#md_modal').on('dialogclose',function(){hnwConsole.lastFileId[_id]=-1;});$('#scheduleList'+_id).on('change',function(){checkConsole(_id,pScheduleFileId,pCanRestoreCurrent,taskIsRunning);});checkConsole(_id,pScheduleFileId,pCanRestoreCurrent,taskIsRunning);$('.statScope'+_id).on('change',function(){var _data={action:'setStatScope',statScope:$('.statScope'+_id).value()};_data[hnwConsole.argLocId]=_locId;$.ajax({type:'POST',url:'plugins/'+hnwCommon.pluginName+'/core/ajax/honeywell.ajax.php',dataType:'json',data:_data,error:function(request,status,error){handleAjaxError(request,status,error);}});});$('.showCurrentSchedule'+_id).off().on('click',function(){if(hnwConsole.lastFileId[_id]!=0)showScheduleCO(_id,pScheduleType,hnwCommon.ScheduleCurrent,0);else $('#md_modal').dialog('close');});$('.showSavedSchedule'+_id).off().on('click',function(){var fileId=$('#scheduleList'+_id).value();if(fileId!=0){if(hnwConsole.lastFileId[_id]!=fileId)showScheduleCO(_id,pScheduleType,hnwCommon.ScheduleSaved,fileId);else $('#md_modal').dialog('close');}});if(pDisplaySetModeConsole=='1'&&pSchedulesList==null){$('.setMode'+_id).replaceWith(getModesTable(_id,1,pModesArray,pCodesAllowed,pEtatCode));}else{$('.setMode'+_id).show();$('.setMode'+_id).on('click',function(){if(!checkApiAvailable())return;var dialog=bootbox.prompt({title:pTitleSetMode,value:'',callback:function(value){console.log("value="+value);if(value!=null){value=JSON.parse(value);waitingMessage(getMsg(hnwConsole.setModeInfoList,value.name));var _value={};_value[hnwConsole.argCodeMode]=value.mode+'§'+(value.noFile?'0':$('#schList'+_id).value());jeedom.cmd.execute({id:hnwConsole.cmdSetModeId[_id],notify:true,value:_value});}}});dialog.init(function(){$('.bootbox-input-text').hide();$('.bootbox-input-text').after(getModesTable(_id,2,pModesArray,pCodesAllowed,pEtatCode,pSchedulesList)+'<br/>');if(pSchedulesList==null)$('.btn-primary').replaceWith('');else $('#cm'+_id+pEtatCode).click();});});if(!hnwCommon.apiAvailable)setBgColor('.setMode'+_id,'gray');}
$('.saveSchedule'+_id).on('click',function(){if(!hnwConsole.isAdmin)return;var selectedFileId=$('#scheduleList'+_id).value();var dialog=bootbox.prompt({title:pSaveAs,value:selectedFileId==0?'':$('#scheduleList'+_id+' option:selected').text(),callback:function(fileName){if(fileName!=null&&fileName!=''){var updateFileId=0;$('#scheduleList'+_id+' option').each(function(){if(this.text==fileName)updateFileId=this.value;});var comm=$('#idComment').value();if(updateFileId!=0){bootbox.confirm(getMsg(pSaveReplace,fileName),function(ret2){if(ret2)save(_id,pSaveInfoListMessage,pArgFileName,fileName,pArgFileRem,comm,updateFileId);});}else{save(_id,pSaveInfoListMessage,pArgFileName,fileName,pArgFileRem,comm,0);}}}});dialog.init(function(){if($(".bootbox-input-text")[0].previousSibling!='<span>'+pSaveName+'</span>'){$('<span>'+pSaveName+'</span>').insertBefore(".bootbox-input-text");$('<br/><br/><span>'+pSaveRemark+'</span><br/><textarea style="height:80px;width:100%;" id="idComment" />').insertAfter(".bootbox-input-text");}
if(selectedFileId>0)loadCommentary(_locId,selectedFileId);});$('.bootbox-input-text').on('input',function(){var newFileName=this.value;$('#scheduleList'+_id+' option').each(function(){if(this.text==newFileName)loadCommentary(_locId,this.value);});});});$('.restoreSchedule'+_id).on('click',function(){if((!hnwConsole.isCurrent[_id]||pCanRestoreCurrent=='1')&&hnwConsole.isAdmin){if(!hnwCommon.apiAvailable){myAlert("Fonction indisponible");return;}
var sl=document.getElementById('scheduleList'+_id);bootbox.confirm(getMsg(pRestoreConfirm,sl.options[sl.selectedIndex].text),function(result){if(result){waitingMessage(getMsg(pRestoreInfoList,sl.options[sl.selectedIndex].text));var _value={};_value[hnwCommon.argFileId]=$('#scheduleList'+_id).value();jeedom.cmd.execute({id:pCmdRestoreId,notify:true,value:_value});}});}});$('.removeSchedule'+_id).on('click',function(){if(!hnwConsole.isCurrent[_id]&&hnwConsole.isAdmin){var sl=document.getElementById('scheduleList'+_id);bootbox.confirm(getMsg(pDeleteConfirm,sl.options[sl.selectedIndex].text),function(result){if(result){waitingMessage(getMsg(pDeleteInfoList,sl.options[sl.selectedIndex].text));var _value={};_value[hnwCommon.argFileId]=sl.options[sl.selectedIndex].value;jeedom.cmd.execute({id:pCmdDeleteId,notify:true,value:_value});}});}});$('#refresh'+_id).on('click',function(){var _data={action:'refresh'};_data[hnwConsole.argLocId]=_locId;$.ajax({type:'POST',url:'plugins/'+hnwCommon.pluginName+'/core/ajax/honeywell.ajax.php',dataType:'json',data:_data,error:function(request,status,error){handleAjaxError(request,status,error);}});});if(!taskIsRunning)$('#jqueryLoadingDiv').hide();else $('#jqueryLoadingDiv').show();$('.modal-backdrop').remove();$('.bootbox').remove();}
function checkConsole(id,pScheduleFileId,canRestoreCurrent,taskIsRunning){var fileIdSelected=$('#scheduleList'+id).value();hnwConsole.isCurrent[id]=pScheduleFileId==fileIdSelected;if(fileIdSelected==0)$('#scheduleList'+id).prop('disabled','disabled');setColor('.showSavedScheduleCaption'+id,fileIdSelected==0?'gray':'white');if(!hnwConsole.isAdmin)setColor('.saveCaption'+id,'gray');setColor('.restaureCaption'+id,(hnwConsole.isCurrent[id]&&canRestoreCurrent=='0')||!hnwConsole.isAdmin||!hnwCommon.apiAvailable?'gray':'white');setColor('.deleteCaption'+id,hnwConsole.isCurrent[id]||!hnwConsole.isAdmin?'gray':'white');}
function loadCommentary(locId,pFileId){var _data={action:'getCommentary'};_data[hnwConsole.argLocId]=locId;_data[hnwCommon.argFileId]=pFileId;$.ajax({type:'POST',url:'plugins/'+hnwCommon.pluginName+'/core/ajax/honeywell.ajax.php',data:_data,dataType:'json',error:function(request,status,error){handleAjaxError(request,status,error);},success:function(data){if(data.state!='ok'){$('#div_alert').showAlert({message:data.result,level:'danger'});}else if(data.result.comment!=null){$('#idComment').value(decodeURIComponent(data.result.comment));}else{$('#idComment').value('');}}});}
function showScheduleCO(id,scheduleType,scheduleSource,fileId,mode,displayMode){var view;if(scheduleType=='T'){hnwCommon.generalLastMode=(mode==null?hnwCommon.generalLastMode:mode);view=hnwCommon.generalLastMode;}else{view='S';}
$('#md_modal').dialog('close');$('#md_modal').dialog({title:""});var cmd='index.php?v=d&plugin='+hnwCommon.pluginName+'&modal=schedule'+view+'&id='+id+'&'+hnwCommon.argZoneId+'=0'+'&'+hnwCommon.argFileId+'='+fileId+'&scheduleType='+scheduleType+'&scheduleSource='+scheduleSource;if(displayMode!=null)cmd+='&displayMode='+displayMode;$('#md_modal').load(cmd).dialog('open');setBgColor((fileId==0?'.showCurrentSchedule':'.showSavedSchedule')+id,"rgb(16, 208, 16)");hnwConsole.lastFileId[id]=fileId;}
function getModesTable(id,showType,evoModes,codesAllowed,etatCode,schedulesList){var buttons='<div style="height:4px;"></div><div style="text-align:-webkit-center;"><table width="100%"';if(showType==1)buttons+=' style="background-color:'+(hnwCommon.apiAvailable?hnwCommon.evoBackgroundColor:'gray'+hnwCommon.imp2)+';"';buttons+='><tr>';var _size=showType==1?24:36;var bgc='';for(var i=0;i<evoModes.length;i++){if(codesAllowed.indexOf(evoModes[i][0])!=-1){buttons+='<td align="center" width="'+(100/6)+'%"';var onClick='onclick="changeSchedulesList('+id+','+evoModes[i][0]+',\''+evoModes[i][2]+'\''+','+(evoModes[i][3]==null?'null':'\''+encodeURI(JSON.stringify(schedulesList[evoModes[i][3]]))+'\'')+');"';if(etatCode!=evoModes[i][0]){if(schedulesList==null){buttons+='style="cursor:pointer;" onclick="setMode('+id+','+showType+','+evoModes[i][0]+',\''+evoModes[i][2]+'\');"';}else{if(evoModes[i][4]){buttons+='><input style="cursor:pointer;" type="radio" id="cm'+id+evoModes[i][0]+'" name="chooseMode'+id+'" '+onClick;}else{buttons+='title="non sélectionnable"';}}}else if(schedulesList!=null&&evoModes[i][4]){buttons+='><input style="cursor:pointer;" type="radio" id="cm'+id+evoModes[i][0]+'" '+onClick+' name="chooseMode'+id+'" checked="checked"';}
bgc=etatCode==evoModes[i][0]?'green':showType==1?(hnwCommon.apiAvailable?hnwCommon.evoBackgroundColor:'gray'):'lightgray';bgc+=hnwCommon.imp2;if(evoModes[i][4])bgc+=';cursor:pointer';buttons+='><br/><label for="cm'+id+evoModes[i][0]+'"><img style="height:'+_size+'px;width:'+_size+'px;background-color:'+bgc+';" src="plugins/'+hnwCommon.pluginName+'/img/'+evoModes[i][1]+'"/>';if(showType==2){buttons+='<br/><span style="font-weight:400;';if(evoModes[i][4])buttons+='cursor:pointer;';if(etatCode==evoModes[i][0])buttons+='background-color:green'+hnwCommon.imp2+';color:white'+hnwCommon.imp2+';';buttons+='">&nbsp;'+evoModes[i][2]+'&nbsp;</span>';}
buttons+='</label></td>';}}
buttons+='</tr></table></div>';if(showType==2&&schedulesList!=null){buttons+='<div id="showSchList'+id+'" style="padding-left:16px;padding-top:30px;">Programme sélectionné&nbsp;&nbsp;&nbsp;<select id="schList'+id+'" style="color:var(--txt-color);width:146px;font-size:11px;padding:4px !important;">';buttons+='</select></div>';}
buttons+='<div style="height:2px;"></div>';return buttons;}
function changeSchedulesList(id,mode,name,sList){$('.bootbox-input-text').value(JSON.stringify({"mode":mode,"name":name,"noFile":sList==null}));if(sList==null){$('#showSchList'+id).hide();}else{var currentSchedule=$('#scheduleList'+id).value();var options='';sList=JSON.parse(decodeURI(sList));for(var i=0;i<sList.length;i++){options+='<option value="'+sList[i][0]+'"';if(currentSchedule==sList[i][0]){options+='selected="" style="background-color:green !important;color:white !important;"';}else{options+='style="background-color:#efefef !important;color:black !important;"';}
options+='>'+sList[i][1]+'</option>';}
$('#schList'+id)[0].innerHTML=options;$('#showSchList'+id).show();}}
function setMode(id,showType,mode,name){if(!hnwCommon.apiAvailable){myAlert("Fonction indisponible");return;}
bootbox.confirm(getMsg(hnwConsole.setModeConfirm,name),function(result){if(result){if(showType==2)$('.btn-default[data-bb-handler="cancel"]').click();waitingMessage(getMsg(hnwConsole.setModeInfoList,name));var _value={};_value[hnwConsole.argCodeMode]=mode;jeedom.cmd.execute({id:hnwConsole.cmdSetModeId[id],notify:true,value:_value});}});}
function save(id,message,pArgFileName,fileName,pArgFileRem,comm,fileId){waitingMessage(getMsg(message,fileName));var _value={};_value[hnwCommon.argFileId]=fileId;_value[pArgFileName]=fileName;_value[pArgFileRem]=encodeURIComponent(comm);jeedom.cmd.execute({id:hnwConsole.cmdSaveId[id],notify:false,value:_value});}