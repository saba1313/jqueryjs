load(realPath + "/env.js");
window.document = new DOMDocument(realPath + "/blog.html");
load(realPath + "/jquery.js");

$.fn.contextPath = function(attr, prefix) {
	return this.attr(attr, function() { return request.contextPath + this[attr].replace(prefix, "") });
}

String.format = function(source, params) {
	if ( arguments.length == 1 ) 
		return function() {
			var args = jQuery.makeArray(arguments);
			args.unshift(source)
			return String.format.apply( this, args );
		};
	if ( arguments.length > 2 && params.constructor != Array  ) {
		params = jQuery.makeArray(arguments).slice(1);
	}
	if ( params.constructor != Array ) {
		params = [ params ];
	}
	jQuery.each(params, function(i, n) {
		source = source.replace(new RegExp("\\{" + i + "\\}", "g"), n);
	});
	return source;
};

var page = {
	header: function() {
		$("script[@src],img[@src]").contextPath("src", /^../);
		$("link[@href]").contextPath("href", /^../);
		$("#header h1 a, #navmenu a:first").attr("href", ".");
		$("#navmenu a:not(:first)").remove();
	},
	posts: function(template, posts) {
		template.remove();
		$.each(posts, function(index, post) {
			var dateformat = new java.text.SimpleDateFormat("dd. MMMM yyyy");
			var current = template.clone().appendTo("div.col");
			current.find(".entrymeta").html("" + dateformat.format(post.getDate()));
			current.find(".entrytitle a").html("" + post.getTitle()).attr("href", "?post=" + post.getId());
			current.find(".entrybody").html("" + post.getBody());
		});
	},
	sidebar: function(posts) {
		var recentPosts = $("#navcol ul:first").empty();
		var template = String.format("<li><a href='?post={0}' title='Beitrag {1} ansehen'>{1}</a></li>");
		$.each(posts, function(index, post) {
			$(template(post.getId(), post.getTitle())).appendTo(recentPosts);
		});
	},
	bottomNavigation: function(blog) {
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
	}
}

importPackage(Packages.de.bassistance.blog.domain);
var blog = new BlogService().getBlog();
page.header();
page.posts($("div.entry"), blog.getRecentPosts().toArray());
page.sidebar(blog.getPosts().toArray());
page.bottomNavigation(blog);

document.innerHTML
