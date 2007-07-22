load(realPath + "/env.js");
window.document = new DOMDocument(realPath + "/blog.html");
load(realPath + "/jquery.js");

$("script[@src],img[@src]").attr("src", function() { return contextPath + this.src.replace(/^../, "") });
$("link[@href]").attr("href", function() { return contextPath + this.href.replace(/^../, "") });

var dateformat = new java.text.SimpleDateFormat("dd. MMMM yyyy");
var entry = $("div.entry").remove();
importPackage(Packages.de.bassistance.blog.domain);
var posts = new BlogService().getBlog().getRecentPosts().toArray();
jQuery.each(posts, function(index, post) {
	var current = entry.clone().appendTo("div.col");
	current.find(".entrymeta").html("" + dateformat.format(post.getDate()));
	current.find(".entrytitle a").html("" + post.getTitle());
	current.find(".entrybody").html("" + post.getBody());
});

document.innerHTML
