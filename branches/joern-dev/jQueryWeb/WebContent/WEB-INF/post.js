window.document = new DOMDocument(request.realPath + "/" + request.page + ".html");
importPackage(Packages.de.bassistance.blog.domain);
importPackage(Packages.com.jquery.web);
var blog = new BlogService().getBlog();

function process() {
	if(request.method == "post") {
		jQuery.isReady = true;
		load(request.realPath + "/../scripts/jquery.validate.js");
		load(request.realPath + "/../scripts/validate.js");
		$("#commentform :input").each(function(index, element) {
			element.value = "" + Request.get(element.name);
		});
		var result = $("#commentform").validate($.validator.forms["#commentform"]).form();
		if(result) {
			blog.postComment();
			return;
		}
	}
	Page.header();
	Page.categories(blog.getCategories());
	Page.post(blog.getCurrentPost());
	Page.comments(blog.getCurrentPost(), blog.getCurrentPost().getComments().toArray());
	Page.sidebar(blog.getPosts().toArray());
	Page.topNavigation(blog);
	return $().print();
}
process();