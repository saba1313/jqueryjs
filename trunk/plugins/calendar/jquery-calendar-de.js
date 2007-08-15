/* German initialisation for the jQuery calendar extension. */
/* Written by Milian Wolff (mail@milianw.de). */
$(document).ready(function(){
	popUpCal.regional['de'] = {clearText: 'L�schen', closeText: 'Schlie�en',
		prevText: '&lt;Zur�ck', nextText: 'Vor&gt;', currentText: 'Heute',
		dayNames: ['So','Mo','Di','Mi','Do','Fr','Sa'],
		monthNames: ['Januar','Februar','M�rz','April','Mai','Juni',
		'Juli','August','September','Oktober','November','Dezember'],
		dateFormat: 'DMY.'};
	popUpCal.setDefaults(popUpCal.regional['de']);
});