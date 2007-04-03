/**
 * Copyright (c) 2007 Kelvin Luck (http://www.kelvinluck.com/)
 * Dual licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) 
 * and GPL (http://www.opensource.org/licenses/gpl-license.php) licenses.
 *
 * $Id$
 **/

(function($){

	$.datePicker = {
		/* constants */
		SHOW_HEADER_NONE	:	0,
		SHOW_HEADER_SHORT	:	1,
		SHOW_HEADER_LONG	:	2,
		/* locale */
		locale      :   {
			firstDayOfWeek      :   1,
			/*
			* TODO:
			* it makes sense to store the month and day names here so people can
			* localise by simply providing a new $.datePicker.locale but I don't want
			* to duplicate the names that already appear in date.js. What's the best
			* approach?
			**/
			days				:	['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
		}
	}
    
	$.fn.extend({
		renderCalendar  :   function(s)
		{
			s = $.extend(
				{
					month           : null,								// the month to render, null == today's month
																		// NOTE: Months are zero based as in JS generally
					year			: null,								// the year to render, null == today's year
					renderCallback  : null,								// a function that is called as each cell is
																		// rendered and which can add classes and event
																		// listeners to the created nodes,
																		// null == no callback
					showHeader		: $.datePicker.SHOW_HEADER_SHORT	// Whether or not to show the header row.
																		// Possible values: SHOW_HEADER_NONE (no header)
																		// SHOW_HEADER_SHORT (first letter of each day),
																		// SHOW_HEADER_LONG (full name of each day).
																		// default SHOW_HEADER_SHORT
				}
				, s
			);
			
			var locale = $.datePicker.locale;
			
			if (s.showHeader != $.datePicker.SHOW_HEADER_NONE) {
				var headRow = $('<tr></tr>');
				for (var i=locale.firstDayOfWeek; i<locale.firstDayOfWeek+7; i++) {
					var weekday = i%7;
					var day = locale.days[weekday];
					headRow.append(
						jQuery("<th></th>").attr({'scope':'col', 'abbr':day, 'title':day, 'class':(weekday == 0 || weekday == 6 ? 'weekend' : 'weekday')}).html(s.showHeader == $.datePicker.SHOW_HEADER_SHORT ? day.substr(0, 1) : day)
					);
				}
			}
			
			var calendarTable = $("<table></table>")
									.attr(
										{
											'cellspacing':2,
											'className':'jCalendar'
										}
									)
									.append(
										(s.showHeader != $.datePicker.SHOW_HEADER_NONE ? 
											$("<thead></thead>")
												.append(headRow)
											:
											'<thead></thead>'
										)
									);
			var tbody = $('<tbody></tbody>');
			
			var today = new Date();
			today.setHours(0);
			today.setMinutes(0);
			today.setSeconds(0);
			today.setMilliseconds(0);
			
			var month = s.month || today.getMonth();
			var year = s.year || today.getFullYear();
			
			var currentDate = new Date(year, month, 1);
			
			
			var firstDayOffset = locale.firstDayOfWeek - currentDate.getDay() + 1;
			if (firstDayOffset > 1) firstDayOffset -= 7;
			currentDate.setDate(firstDayOffset);
			
			var w = 0;
			while (w++<6) {
				var r = jQuery("<tr></tr>");
				for (var i=0; i<7; i++) {
					var thisMonth = currentDate.getMonth() == month;
					var d = $('<td>' + currentDate.getDate() + '</td>')
								.attr('className', (thisMonth ? 'current-month ' : 'other-month ') +
													(currentDate.isWeekend() ? 'weekend ' : 'weekday ') +
													(thisMonth && currentDate.getTime() == today.getTime() ? 'today ' : '')
								)
							;
					if (s.renderCallback) {
						s.renderCallback(d, currentDate, month, year);
					}
					r.append(d);
					currentDate.setDate(currentDate.getDate()+1);
				}
				tbody.append(r);
			}
			calendarTable.append(tbody);
			
			return this.each(
				function()
				{
					$(this).empty().append(calendarTable);
				}
			);
		}
	});

})(jQuery);