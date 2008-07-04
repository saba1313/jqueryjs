/*
 * jQuery UI Datepicker
 *
 * Copyright (c) 2006, 2007, 2008 Marc Grabanski
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 * 
 * http://docs.jquery.com/UI/Datepicker
 *
 * Depends:
 *	ui.core.js
 *
 * Authors:
 *   Marc Grabanski	(m@marcgrabanski.com) - http://marcgrabanski.com
 *   Keith Wood (kbwood@virginbroadband.com.au) - http://keith-wood.name
 */
(function($) {
	
$.ui.datepicker.regional[''] = { // Default regional settings
	clearText: 		'Clear', // Display text for clear link
	clearStatus: 	'Erase the current date', // Status text for clear link
	closeText: 		'Close', // Display text for close link
	closeStatus: 	'Close without change', // Status text for close link
	currentText: 	'Today', // Display text for current month link
	currentStatus: 	'Show the current month', // Status text for current month link
	dayNames: 		['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	dayNamesShort: 	['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], // For formatting
	dayNamesMin: 	['Su','Mo','Tu','We','Th','Fr','Sa'], // Column headings for days starting at Sunday
	dayStatus: 		'Set DD as first week day', // Status text for the day of the week selection
	dateStatus: 	'Select DD, M d', // Status text for the date selection
	dateFormat: 	'mm/dd/yy', // See format options on parseDate
	firstDay: 		0, // The first day of the week, Sun = 0, Mon = 1, ...
	initStatus: 	'Select a date', // Initial Status text on opening
	isRTL: 			false // True if right-to-left language, false if left-to-right
	nextText: 		'Next&#x3e;', // Display text for next month link
	nextStatus: 	'Show the next month', // Status text for next month link
	prevText: 		'&#x3c;Prev', // Display text for previous month link
	prevStatus: 	'Show the previous month', // Status text for previous month link
	monthNames: 	['January','February','March','April','May','June',
		'July','August','September','October','November','December'], // month names for drop-down list
	monthNamesShort:['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
	monthStatus: 	'Show a different month', // Status text for selecting a month
	weekHeader: 	'Wk', // Header for the week of the year column
	weekStatus: 	'Week of the year', // Status text for the week of the year column
	yearStatus: 	'Show a different year', // Status text for selecting a year
}

$.ui.datepicker.defaults = {
	altField: 		'', 	// Selector for an alternate field to store selected dates into
	altFormat: 		'', 	// The date format to use for the alternate field
	appendText: 	'', 	// Display text following the input box, e.g. showing the format
	buttonText: 	'...', 	// Text for trigger button
	buttonImage: 	'', 	// URL for trigger button image
	buttonImageOnly:false, 	// True if the image appears alone, false if it appears on a button
	calculateWeek: 	this.iso8601Week, 
							/* How to calculate the week of the year,
								takes a Date and returns the number of the week for it */
	changeFirstDay: true, 	// True to click on day name to change, false to remain as set
	changeMonth: 	true, 	// True if month can be selected directly, false if only prev/next
	changeYear: 	true, 	// True if year can be selected directly, false if only prev/next
	defaultDate: 	null, 	/* Used when field is blank: actual date,
							 	+/-number for offset from today, null for today */
	highlightWeek: 	false, 	// True to highlight the selected week
	layout: 		["control","links","header","calendar"],
	maxDate: 		null, 	// The latest selectable date, or null for no limit
	minDate: 		null, 	// The earliest selectable date, or null for no limit
	navigationAsDateFormat: false, // True if date formatting applied to prev/today/next links
	numberOfMonths: 1, 		// Number of months to show at a time
	rangeSelect: 	false, 	// Allows for selecting a date range on one date picker
	rangeSeparator: ' - ', 	// Text between two dates in a range
	shortYearCutoff:'+10', 	/* Short year values < this are in the current century,
								> this are in the previous century, 
								string value starting with '+' for current year + value */
	showOtherMonths:false, 	// True to show dates in other months, false to leave blank
	showWeeks: 		false, 	// True to show week of the year, false to omit
	showStatus: 	false, 	// True to show status bar at bottom, false to not show it
	showOn: 		'focus', /* 'focus' for popup on focus,
							// 'button' for trigger button, or 'both' for either */
	showAnim: 		'show', // Name of jQuery animation for popup
	speed: 			'normal', // Speed of display/closure
	statusForDate: 	this.dateStatus, // Function to provide status text for a date -
							// takes date and instance as parameters, returns display text
	stepMonths: 	1, 		// Number of months to step back/forward
	yearRange: 		'-10:+10' // Range of years to display in drop-down,
							// either relative to current year (-nn:+nn) or absolute (nnnn:nnnn)
};

var pre = 'ui-datepicker-';

var classes = {
	marker: 		pre + 'has',
	append: 		pre + 'append', // name of append marker class
	wrap: 			pre + 'wrap',
	trigger: 		pre + 'trigger',
	dialoog: 		pre + 'dialog',
	prompt: 		pre + 'prompt',
	unselectable: 	pre + 'unselectable', 
	current: 		pre + 'current-day'
}
	
var layout = {
	main: '<div id="' + id.main + '" />',
	control: {
		wrap: '<div class="' + pre + 'control" />',
		clear: '<div class="' + pre + 'clear"><a>Clear</a></div>',
		close: '<div class="' + pre + 'close"><a>Close</a></div>'
	},
	links: {
		wrap: '<div class="' + pre + 'links" />',
		prev: '<div class="' + pre + 'prev"><a>Prev</a></div>',
		today: '<div class="' + pre + 'current"><a>Today</a></div>',
		next: '<div class="' + pre + 'next"><a>Next</a></div>'
	},
	header: {
		wrap: '<div class="' + pre + 'header" />',
		month: '<select class="' + pre + 'new-month" />', // holds options of months
		year: '<select class="' + pre + 'new-year" />' // holds options of years
	},
	calendar: {
		wrap: '<table cellspacing="0" cellpadding="0" class="ui-datepicker" />',
		title: '<thead><tr class="' + pre + 'title-row"></tr></thead>', // holds weekday titles
		days: '<tbody><tr class="' + pre + 'days-row"></tr></tbody>'
	}
}

var dp = $(layout.main);

$.widget("ui.datepicker", {
	plugins: {},
	init: function() {
		if ($("#"+id.main).length === 0) 
			this.div = $(document.body).append(dp);
		this.element.bind("focus", clickHandler);
	},
	formatDate: function(day, month, year) {
		if (!day) {
			this._currentDay = this._selectedDay;
			this._currentMonth = this._selectedMonth;
			this._currentYear = this._selectedYear;
		}
		var date = (day ? (typeof day == 'object' ? day : new Date(year, month, day)) :
			new Date(this._currentYear, this._currentMonth, this._currentDay));
		return formatDate(this._get('dateFormat'), date, this._getFormatConfig());
	},
	beforeShowDay: function(e){}, /* Function that takes a date and returns an array:
			[0] = true if selectable, false if not 
			[1] = custom CSS class name(s) or ''
			[2] = cell title (optional), e.g. $.datepicker.noWeekends */
	beforeShow: function(e){}, // Function that takes an input field and
		// returns a set of custom settings for the date picker
	onSelect: function(e){}, // Define a callback function when a date is selected
	onChangeMonthYear: function(e){},// Define a callback function when the month or year is changed
	onClose: function(e){} // Define a callback function when the datepicker is closed
});

function clickHandler(event) {
	var o = $.data(this, "datepicker").options;
	if (o.disabled) {
		return false;
	}
	
	var el = event.target;
	var offset = $(el).offset();
	
	dp.css({ position:'absolute', left:offset.left, top:offset.top + el.offsetHeight })
		.css({height:100}) //tesing
	;
}

formatDate: function (format, date, settings) {
	if (!date)
		return '';
	var dayNamesShort = (settings ? settings.dayNamesShort : null) || this._defaults.dayNamesShort;
	var dayNames = (settings ? settings.dayNames : null) || this._defaults.dayNames;
	var monthNamesShort = (settings ? settings.monthNamesShort : null) || this._defaults.monthNamesShort;
	var monthNames = (settings ? settings.monthNames : null) || this._defaults.monthNames;
	// Check whether a format character is doubled
	var lookAhead = function(match) {
		var matches = (iFormat + 1 < format.length && format.charAt(iFormat + 1) == match);
		if (matches)
			iFormat++;
		return matches;	
	};
	// Format a number, with leading zero if necessary
	var formatNumber = function(match, value) {
		return (lookAhead(match) && value < 10 ? '0' : '') + value;
	};
	// Format a name, short or long as requested
	var formatName = function(match, value, shortNames, longNames) {
		return (lookAhead(match) ? longNames[value] : shortNames[value]);
	};
	var output = '';
	var literal = false;
	if (date)
		for (var iFormat = 0; iFormat < format.length; iFormat++) {
			if (literal)
				if (format.charAt(iFormat) == "'" && !lookAhead("'"))
					literal = false;
				else
					output += format.charAt(iFormat);
			else
				switch (format.charAt(iFormat)) {
					case 'd':
						output += formatNumber('d', date.getDate()); 
						break;
					case 'D': 
						output += formatName('D', date.getDay(), dayNamesShort, dayNames);
						break;
					case 'm': 
						output += formatNumber('m', date.getMonth() + 1); 
						break;
					case 'M':
						output += formatName('M', date.getMonth(), monthNamesShort, monthNames); 
						break;
					case 'y':
						output += (lookAhead('y') ? date.getFullYear() : 
							(date.getYear() % 100 < 10 ? '0' : '') + date.getYear() % 100);
						break;
					case "'":
						if (lookAhead("'"))
							output += "'";
						else
							literal = true;
						break;
					default:
						output += format.charAt(iFormat);
				}
		}
	return output;
}

$.ui.datepicker.getter = "value";

})(jQuery);