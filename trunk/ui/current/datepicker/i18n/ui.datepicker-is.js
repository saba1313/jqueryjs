/* Icelandic initialisation for the jQuery UI date picker plugin. */
/* Written by Haukur H. Thorsson (haukur@eskill.is). */
jQuery(function($){
	$.datepicker.regional['is'] = {clearText: 'Hreinsa', clearStatus: '',
		closeText: 'Loka', closeStatus: '',
		prevText: '< Fyrri', prevStatus: '',
		nextText: 'N�sti >', nextStatus: '',
		currentText: '� dag', currentStatus: '',
		monthNames: ['Jan�ar','Febr�ar','Mars','Apr�l','Ma�','J�n�',
		'J�l�','�g�st','September','Okt�ber','N�vember','Desember'],
		monthNamesShort: ['Jan','Feb','Mar','Apr','Ma�','J�n',
		'J�l','�g�','Sep','Okt','N�v','Des'],
		monthStatus: '', yearStatus: '',
		weekHeader: 'Vika', weekStatus: '',
		dayNames: ['Sunnudagur','M�nudagur','�ri�judagur','Mi�vikudagur','Fimmtudagur','F�studagur','Laugardagur'],
		dayNamesShort: ['Sun','M�n','�ri','Mi�','Fim','F�s','Lau'],
		dayNamesMin: ['Su','M�','�r','Mi','Fi','F�','La'],
		dayStatus: 'DD', dateStatus: 'D, M d',
		dateFormat: 'dd/mm/yy', firstDay: 0, 
		initStatus: '', isRTL: false};
	$.datepicker.setDefaults($.datepicker.regional['is']);
});