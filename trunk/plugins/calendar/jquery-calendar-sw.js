/* Swedish initialisation for the jQuery calendar extension. */
/* Written by Anders Ekdahl ( anders@nomadiz.se). */
$(document).ready(function(){
    popUpCal.regional['sv'] = {clearText: 'Rensa', closeText: 'St�ng',
        prevText: '&laquo;F�rra', nextText: 'N�sta&raquo;', currentText: 'Idag', 
        dayNames: ['S�','M�','Ti','On','To','Fr','L�'],
        monthNames: ['Januari','Februari','Mars','April','Maj','Juni', 
        'Juli','Augusti','September','Oktober','November','December'],
        dateFormat: 'YMD-'};
    popUpCal.setDefaults(popUpCal.regional['sv']); 
});
