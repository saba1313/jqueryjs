/* Chinese initialisation for the jQuery calendar extension. */
/* Written by Cloudream (cloudream@gmail.com). */
$(document).ready(function(){
	popUpCal.regional['zh-cn'] = {clearText: '���', closeText: '�ر�',
		prevText: '&lt;����', nextText: '����&gt;', currentText: '����',
		dayNames: ['��','һ','��','��','��','��','��'],
		monthNames: ['һ��','����','����','����','����','����',
		'����','����','����','ʮ��','ʮһ��','ʮ����'],
		dateFormat: 'YMD-'};
	popUpCal.setDefaults(popUpCal.regional['zh-cn']);
});
