/* Czech initialisation for the jQuery calendar extension. */
/* Written by Tomas Muller (tomas@tomas-muller.net). */
$(document).ready(function(){
	popUpCal.regional['cs'] = {clearText: 'Smazat', closeText: 'Zav��t', 
		prevText: '&lt;D��ve', nextText: 'Pozd�ji&gt;;', currentText: 'Nyn�',
		dayNames: ['Ne','Po','�t','St','�t','P�','So'],
		monthNames: ['Leden','�nor','B�ezen','Duben','Kv�ten','�erven',
		'�ervenec','Srpen','Z���','��jen','Listopad','Prosinec'],
		dateFormat: 'DMY.'};
	popUpCal.setDefaults(popUpCal.regional['cs']);
});