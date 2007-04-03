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
			firstDayOfWeek      :   1
		}
	}
    
	$.fn.extend({
		/**
		 * Render a calendar table into any matched elements
		 *
		 * @param Object s (optional) Customize your calendars
		 * @option Number month The month to render (NOTE that months are zero based). Default is today's month.
		 * @option Number year The year to render. Default is today's year.
		 * @option Function renderCallback A reference to a function that is called as each cell is rendered and which can add classes and event listeners to the created nodes. Default is no callback.
		 * @option Number showHeader Whether or not to show the header row, possible values are: SHOW_HEADER_NONE (no header), SHOW_HEADER_SHORT (first letter of each day) and SHOW_HEADER_LONG (full name of each day). Default is SHOW_HEADER_SHORT.
		 **/
		renderCalendar  :   function(s)
		{
			s = $.extend(
				{
					month           : null,
					year			: null,
					renderCallback  : null,
					showHeader		: $.datePicker.SHOW_HEADER_SHORT
				}
				, s
			);
			
			var locale = $.datePicker.locale;
			
			if (s.showHeader != $.datePicker.SHOW_HEADER_NONE) {
				var headRow = $('<tr></tr>');
				for (var i=locale.firstDayOfWeek; i<locale.firstDayOfWeek+7; i++) {
					var weekday = i%7;
					var day = Date.dayNames[weekday];
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
			
			var month = s.month == undefined ? today.getMonth() : s.month;
			var year = s.year || today.getFullYear();
			
			var currentDate = new Date(year, month, 1);
			
			
			var firstDayOffset = locale.firstDayOfWeek - currentDate.getDay() + 1;
			if (firstDayOffset > 1) firstDayOffset -= 7;
			currentDate.addDays(firstDayOffset-1);
			
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
					currentDate.addDays(1);
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