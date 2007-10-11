function testData(index,data) {
	//var data = jQuery.metadata.get(this);
	switch(index) {
	case 0:
		ok( data.foo == "bar", "Check foo property" );
		ok( data.bar == "baz", "Check baz property" );
		ok( data.arr[0] == 1, "Check array[0]" );
		ok( data.arr[1] == 2, "Check array[0]" );
		break;
	case 1:
		ok( data.test == "bar", "Check test property" );
		ok( data.bar == "baz", "Check bar property" );
		break;
	case 2:
		ok( data.zoooo == "bar", "Check zoooo property" );
		ok( data.bar.test == "baz", "Check bar.test property" );
		break;
	case 3:
		ok( data.number );
		ok( data.stuff[0] == 2 );
		ok( data.stuff[1] == 8 );
		break;
	default:
		ok( false, ["Assertion failed on index ", index, ", with data ", data].join('') );
	}
}

// check if set can be intercepted without breaking metadata plugin
var oldSet = jQuery.fn.set;
jQuery.fn.set = function() {
	ok( true, "set was interecepted" );
	oldSet.apply(this, arguments);
};

//jQuery.meta.single = "";

test("meta: type attr - from data attribute", function() {
	expect(11);
	jQuery.metadata.setType("attr", "data");
	jQuery("#one li").each(function(i){
		testData(i,jQuery.metadata.get(this));
	});
});

test("meta: type class - from className", function() {
	expect(11);
	jQuery.metadata.setType( "class" );
	jQuery("#two li").each(function(i){
		testData(i,jQuery.metadata.get(this));
	});
});

test("meta: children script element - get data from child script element", function() {
	expect(11);
	jQuery.metadata.setType( "elem", "script" );
	jQuery("#three li").each(function(i){
		testData(i,jQuery.metadata.get(this));
	});
});

test("check if window doesn't break anything", function() {
	jQuery(window).get();
});

test("meta: default with single data object", function() {
	expect(11);
	jQuery.metadata.setType("attr","data");
	jQuery.metadata.defaults.single = "data";
	jQuery("#four li").each(function(i){
		testData(i,jQuery.metadata.get(this));
	});
});

test("meta with select and class", function() {
	expect(2);
	jQuery.metadata.setType("class");
	jQuery.metadata.single = "stuff";
	var e = $('#meal').metadata();
	ok( e, "data property" );
	ok( e.required, "property on data property" );
});

test("try to add and remove classes on metadata elements", function() {
	$("#two li").addClass("foobar").addClass("foo bar").removeClass("foobar");
	ok( $("#two li").is(".foo"), 'Check class foo was added.' );
	ok( $("#two li").is(".bar"), 'Check class bar was added.' );
});

test("try to collect all data in a single call", function(){
	expect(11);
	var data = jQuery("#two li").metadata({type:'class'},true);
	for(var i=0;i<data.length;i++)
		testData(i,data[i]);
});