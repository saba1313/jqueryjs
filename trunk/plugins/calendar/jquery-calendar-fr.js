/* French initialisation for the jQuery calendar extension. */
/* Written by Keith Wood (kbwood@iprimus.com.au). */
$(document).ready(function(){
	popUpCal.regional['fr'] = {clearText: 'Enlevez', closeText: 'Fermez', 
		prevText: '&lt;Pr�c', nextText: 'Proch&gt;', currentText: 'En cours',
		dayNames: ['Di','Lu','Ma','Me','Je','Ve','Sa'],
		monthNames: ['Janvier','F�vrier','Mars','Avril','Mai','Juin',
		'Juillet','Ao�t','Septembre','Octobre','Novembre','D�cembre']};
	popUpCal.setDefaults(popUpCal.regional['fr']);
});