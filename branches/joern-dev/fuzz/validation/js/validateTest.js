test("rule: digit", function() {
	var rule = $.validator.methods.digits;
	ok( rule("123"), "Valid digits" );
	ok(!rule("123.000"), "Invalid digits" );
	ok(!rule("123.000,00"), "Invalid digits" );
	ok(!rule("123.0.0,0"), "Invalid digits" );
	ok(!rule("x123"), "Invalid digits" );
	ok(!rule("100.100,0,0"), "Invalid digits" );
});

test("rule: url", function() {
	var rule = $.validator.methods.url;
	ok( rule("http://bassistance.de/jquery/plugin.php?bla=blu"), "Valid url" );
	ok( rule("https://bassistance.de/jquery/plugin.php?bla=blu"), "Valid url" );
	ok( rule("ftp://bassistance.de/jquery/plugin.php?bla=blu"), "Valid url" );
	ok( rule("http://bassistance"), "Valid url" );
	ok(!rule("http://bassistance."), "Invalid url" );
	ok(!rule("bassistance.de"), "Invalid url" );
});

test("rule: email", function() {
	var rule = $.validator.methods.email;
	ok( rule("name@domain.tld"), "Valid email" );
	ok( rule("name@domain.tl"), "Valid email" );
	ok( rule("n@d.tld"), "Valid email" );
	ok(!rule("name"), "Invalid email" );
	ok(!rule("name@"), "Invalid email" );
	ok(!rule("name@domain"), "Invalid email" );
	ok(!rule("name@domain.t"), "Invalid email" );
	ok(!rule("name@domain.tldef"), "Invalid email" );
});

test("rule: number", function() {
	var rule = $.validator.methods.number;
	ok( rule("123"), "Valid number" );
	ok( rule("-123"), "Valid number" );
	ok( rule("123,000"), "Valid number" );
	ok( rule("-123,000"), "Valid number" );
	ok( rule("123,000.00"), "Valid number" );
	ok( rule("-123,000.00"), "Valid number" );
	ok(!rule("123.000,00"), "Invalid number" );
	ok(!rule("123.0.0,0"), "Invalid number" );
	ok(!rule("x123"), "Invalid number" );
	ok(!rule("100.100,0,0"), "Invalid number" );
});

test("rule: numberDE", function() {
	var rule = $.validator.methods.numberDE;
	ok( rule("123"), "Valid numberDE" );
	ok( rule("-123"), "Valid numberDE" );
	ok( rule("123.000"), "Valid numberDE" );
	ok( rule("-123.000"), "Valid numberDE" );
	ok( rule("123.000,00"), "Valid numberDE" );
	ok( rule("-123.000,00"), "Valid numberDE" );
	ok(!rule("123,000.00"), "Invalid numberDE" );
	ok(!rule("123,0,0.0"), "Invalid numberDE" );
	ok(!rule("x123"), "Invalid numberDE" );
	ok(!rule("100,100.0.0"), "Invalid numberDE" );
});

test("rule: date", function() {
	var rule = $.validator.methods.date;
	ok( rule("06/06/1990"), "Valid date" );
	ok( rule("6/6/06"), "Valid date" );
	ok(!rule("1990x-06-06"), "Invalid date" );
});

test("rule: dateISO", function() {
	var rule = $.validator.methods.dateISO;
	ok( rule("1990-06-06"), "Valid date" );
	ok( rule("1990/06/06"), "Valid date" );
	ok( rule("1990-6-6"), "Valid date" );
	ok( rule("1990/6/6"), "Valid date" );
	ok(!rule("1990-106-06"), "Invalid date" );
	ok(!rule("190-06-06"), "Invalid date" );
});

test("rule: dateDE", function() {
	var rule = $.validator.methods.dateDE;
	ok( rule("03.06.1984"), "Valid dateDE" );
	ok( rule("3.6.84"), "Valid dateDE" );
	ok(!rule("6-6-06"), "Invalid dateDE" );
	ok(!rule("1990-06-06"), "Invalid dateDE" );
	ok(!rule("06/06/1990"), "Invalid dateDE" );
	ok(!rule("6/6/06"), "Invalid dateDE" );
});

test("rule: required", function() {
	var rule = $.validator.methods.required;
		e = $('#text1, #hidden2, #select1, #select2');
	ok( rule(e[0].value, e[0]), "Valid text input" );
	ok(!rule(e[1].value, e[1]), "Invalid text input" );
	ok(!rule(e[2].value, e[2]), "Invalid select" );
	ok( rule(e[3].value, e[3]), "Valid select" );
	
	e = $('#area1, #area2, #pw1, #pw2');
	ok( rule(e[0].value, e[0]), "Valid textarea" );
	ok(!rule(e[1].value, e[1]), "Invalid textarea" );
	ok( rule(e[2].value, e[2]), "Valid password input" );
	ok(!rule(e[3].value, e[3]), "Invalid password input" );
	
	e = $('#radio1, #radio2, #radio3');
	ok(!rule(e[0].value, e[0]), "Invalid radio" );
	ok( rule(e[1].value, e[1]), "Valid radio" );
	ok( rule(e[2].value, e[2]), "Valid radio" );
	
	e = $('#check1, #check2');
	ok( rule(e[0].value, e[0]), "Valid checkbox" );
	ok(!rule(e[1].value, e[1]), "Invalid checkbox" );
});

test("rule: min", function() {
	var rule = $.validator.methods.min,
		param = 2,
		e = $('#text1, #text2, #text3');
	ok( rule(e[0].value, e[0], param), "Valid text input" );
	ok(!rule(e[1].value, e[1], param), "Invalid text input" );
	ok( rule(e[2].value, e[2], param), "Valid text input" );
	
	e = $('#check1, #check2, #check3');
	ok( rule(e[0].value, e[0], param), "Valid checkbox" );
	ok(!rule(e[1].value, e[1], param), "Invalid checkbox" );
	ok( rule(e[2].value, e[2], param), "Invalid checkbox" );
	
	e = $('#select1, #select2, #select3, #select4');
	ok(!rule(e[0].value, e[0], param), "Invalid select" );
	ok(!rule(e[1].value, e[1], param), "Invalid select" );
	ok( rule(e[2].value, e[2], param), "Valid select" );
	ok( rule(e[3].value, e[3], param), "Invalid select" );
});

test("rule: max", function() {
	var rule = $.validator.methods.max,
		param = 4,
		e = $('#text1, #text2, #text3');
	ok( rule(e[0].value, e[0], param), "Valid text input" );
	ok( rule(e[1].value, e[1], param), "Valid text input" );
	ok(!rule(e[2].value, e[2], param), "Invalid text input" );
	
	e = $('#check1, #check2, #check3');
	ok( rule(e[0].value, e[0], param), "Valid checkbox" );
	ok( rule(e[1].value, e[1], param), "Invalid checkbox" );
	ok(!rule(e[2].value, e[2], param), "Invalid checkbox" );
	
	e = $('#select1, #select2, #select3, #select4');
	ok( rule(e[0].value, e[0], param), "Invalid select" );
	ok( rule(e[1].value, e[1], param), "Invalid select" );
	ok( rule(e[2].value, e[2], param), "Valid select" );
	ok(!rule(e[3].value, e[3], param), "Invalid select" );
});

test("rule: equalTo", function() {
	var rule = $.validator.methods.equalTo,
		e = $('#text1, #text2');
	ok( rule("Test", e[0], "#text1"), "Text input" );
	ok( rule("T", e[1], "#text2"), "Another one" );
});


test("method default messages", function() {
	var m = $.validator.methods;
	$.each(m, function(key) {
		ok( m[key].message, key + " has a default message." );
	});
});

test("$.validator.addMethod", function() {
	$.validator.addMethod("hi", function(value) {
		return value == "hi";
	}, "hi me too");
	var rule = $.validator.methods.hi;
		e = $('#text1')[0];
	ok( !rule(e.value, e), "Invalid" );
	e.value = "hi";
	ok( rule(e.value, e), "Invalid" );
	ok( rule.message == "hi me too", "Check custom message" );
});

test("validator.validateForm(): simple", function() {
	var form = $('#testForm1')[0];
	var v = $(form).validate();
	ok( !v.validateForm(), 'Invalid form' );
	$('#firstname').val("hi");
	$('#lastname').val("hi");
	ok( v.validateForm(), 'Valid form' );
});

test("validator.validateForm(): with equalTo", function() {
	var form = $('#testForm5')[0];
	var v = $(form).validate();
	ok( !v.validateForm(), 'Invalid form' );
	$('#x1, #x2').val("hi");
	ok( v.validateForm(), 'Valid form' );
});

test("validator.validateElement(): simple", function() {
	var element = $('#firstname')[0];
	var v = $('#testForm1').validate();
	ok( !v.errorList["firstname"], 'No errors yet' );
	v.validateElement(element);
	ok( v.errorList["firstname"], 'error exists' );
	v.errorList = {};
	$('#firstname').val("hi");
	v.validateElement(element);
	ok( !v.errorList["firstname"], 'No more errors' );
});

test("validator.hideElementErrors(): input", function() {
	var errorLabel = $('#errorFirstname');
	var element = $('#firstname')[0];
	var v = $('#testForm1').validate();
	errorLabel.show();
	ok( errorLabel.is(":visible"), "Error label visible after validation" );
	v.hideElementErrors(element);
	ok( errorLabel.is(":hidden"), "Error label not visible after hiding it" );
});

test("validator.hideElementErrors(): radio", function() {
	var errorLabel = $('#agreeLabel');
	var element = $('#agb')[0];
	var v = $('#testForm2').validate({ errorClass: "xerror" });
	errorLabel.show();
	ok( errorLabel.is(":visible"), "Error label visible after validation" );
	v.hideElementErrors(element);
	ok( errorLabel.is(":hidden"), "Error label not visible after hiding it" );
});

test("validator.hideElementErrors(): errorWrapper", function() {
	expect(2);
	var errorLabel = $('#errorWrapper');
	var element = $('#meal')[0];
	
	errorLabel.show();
	ok( errorLabel.is(":visible"), "Error label visible after validation" );
	var v = $('#testForm3').validate({ errorWrapper: "li", errorContainer: $("#errorContainer") });
	v.hideElementErrors(element);
	ok( errorLabel.is(":hidden"), "Error label not visible after hiding it" );
});

test("validator.hideElementErrors(): container", function() {
	expect(3);
	var errorLabel = $('#errorContainer');
	var element = $('#testForm3')[0];
	ok( errorLabel.is(":hidden"), "Error label not visible at start" );
	var v = $('#testForm3').validate({ errorWrapper: "li", errorContainer: $("#errorContainer") });
	v.validateForm();
	ok( errorLabel.is(":visible"), "Error label visible after validation" );
	$('#meal')[0].selectedIndex = 1;
	v.validateForm();
	ok( errorLabel.is(":hidden"), "Error label not visible after hiding it" );
});

test("validator.isFormValid()", function() {
	expect(5);
	var v = $('#testForm3').validate();
	ok( v.isFormValid(), "No errors, must be valid" );
	v.errorList = { meal: {required: true} };
	ok( !v.isFormValid(), "One error, must be invalid" );
	v = $('#testForm3').validate({ submitHandler: function() {
		ok( true, "Submit handler was called" );
	}});
	ok( !v.isFormValid(), "No errors, must be valid but returning false and calling the submit handler" );
	v.errorList = { meal: {required: true} };
	ok( !v.isFormValid(), "One error, must be invalid, no call to submit handler" );
});

test("validator.showErrors()", function() {
	var errorLabel = $('#errorFirstname').hide();
	var element = $('#firstname')[0];
	var v = $('#testForm1').validate();
	ok( errorLabel.is(":hidden") );
	ok( $("label.error[@for=lastname]").size() == 0 );
	v.errorList = { lastname: {required: true}, firstname: {required: true}};
	v.showErrors();
	ok( errorLabel.is(":visible") );
	ok( $("label.error[@for=lastname]").is(":visible") );
});

test("validator.showErrors() - external messages", function() {
	$.validator.addMethod("foo", function() { return false; });
	$.validator.addMethod("bar", function() { return false; });
	ok( $("#testForm4 label.error[@for=f1]").size() == 0 );
	ok( $("#testForm4 label.error[@for=f2]").size() == 0 );
	var form = $('#testForm4')[0];
	var v = $(form).validate({
		messages: {
			f1: "Please!",
			f2: "Wohoo!"
		}
	});
	v.validateForm();
	ok( $("#testForm4 label.error[@for=f1]").text() == "Please!" );
	ok( $("#testForm4 label.error[@for=f2]").text() == "Wohoo!" );
});


test("validator.findRules() - internal - input", function() {
	expect(4);
	var element = $('#firstname')[0];
	var v = $('#testForm1').validate();
	var rule = v.findRules(element);
	ok( rule[0].name == "required" );
	ok( rule[0].parameters == true );
	ok( rule[1].name == "min" );
	ok( rule[1].parameters == 2 );
});

test("validator.findRules() - internal - select", function() {
	expect(2);
	var element = $('#meal')[0];
	var v = $('#testForm3').validate();
	var rule = v.findRules(element);
	// fails in opera, bug is reported
	ok( rule[0].name == "required" );
	ok( rule[0].parameters );
});

test("validator.findRules() - external", function() {
	var element = $('#firstname')[0];
	var v = $('#testForm1').validate({
		rules: {
			firstname: {date: true, min: 5}
		}
	});
	var rule = v.findRules(element);
	ok( rule[0].name == "date" );
	ok( rule[0].parameters );
	ok( rule[1].name == "min" );
	ok( rule[1].parameters == 5 );
});

test("validator.findRules() - external - complete form", function() {
	expect(1);
	$.validator.addMethod("verifyTest", function() {
		ok( true, "method executed" );
		return true;
	});
	var element = $('#firstname')[0];
	var v = $('#testForm1').validate({
		rules: {
			firstname: {verifyTest: true}
		}
	});
	v.validateForm();
});