load(realPath + "/env.js");
window.document = new DOMDocument(realPath + "/blog.html");
load(realPath + "/jquery.js");

$.fn.contextPath = function(attr, prefix) {
	return this.attr(attr, function() { return request.contextPath + this[attr].replace(prefix, "") });
}

$("script[@src],img[@src]").contextPath("src", /^../);
$("link[@href]").contextPath("href", /^../);

var dateformat = new java.text.SimpleDateFormat("dd. MMMM yyyy");
var entry = $("div.entry").remove();
importPackage(Packages.de.bassistance.blog.domain);
var blog = new BlogService().getBlog();
$.each(blog.getRecentPosts().toArray(), function(index, post) {
	var current = entry.clone().appendTo("div.col");
	current.find(".entrymeta").html("" + dateformat.format(post.getDate()));
	current.find(".entrytitle a").html("" + post.getTitle()).attr("href", "?post=" + post.getId());
	current.find(".entrybody").html("" + post.getBody());
});
var meta = $("div.bottommeta").appendTo("div.col");
var prev = meta.find("a:first");
if ( blog.previousPage() == -1 )
	prev.remove();
else
	prev.attr("href", "?page=" + blog.previousPage());
	
var next = meta.find("a:last")
switch(blog.nextPage()) {
	case -1:
	case 0: next.remove(); break;
	case 1: next.attr("href", "."); break;
	default: next.attr("href", "?page=" + blog.nextPage())
}

document.innerHTML
