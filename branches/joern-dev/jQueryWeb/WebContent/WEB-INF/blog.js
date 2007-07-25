load(request.realPath + "/env.js");
window.document = new DOMDocument(request.realPath + "/" + request.page + ".html");
load(request.realPath + "/jquery.js");

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
		$("#navcol ul:gt(1)").remove();
	},
	categories: function(categories) {
		var container = $("#navcol ul:eq(1)").empty();
		var template = String.format("<li><a href='?category={0}' title='{1}'>{2}</a></li>");
		$.each(categories, function(index, category) {
			$(template(category.getId(), category.getTitle(), category.getName())).appendTo(container);
		});
	},
	posts: function(template, posts) {
		template.remove();
		var dateformat = new java.text.SimpleDateFormat("dd. MMMM yyyy");
		$.each(posts, function(index, post) {
			var current = template.clone().insertBefore("div.bottommeta");
			current.find(".entrymeta").html("" + dateformat.format(post.getDate()));
			current.find(".entrytitle a").html("" + post.getTitle()).attr("href", "?post=" + post.getId()).attr("title", "Link zu " + post.getTitle());
			current.find(".entrybody").html("" + post.getBody());
		});
	},
	post: function(current, post) {
		var dateformat = new java.text.SimpleDateFormat("dd. MMMM yyyy");
		var timeformat = new java.text.SimpleDateFormat("hh:mm");
		var date = String.format("{0} um {1}",
			dateformat.format(post.getDate()),
			timeformat.format(post.getDate()));
		current.find("#leftmeta").html(date);
		var template = String.format("<a href='?category={0}' title='{1}'>{2}</a>");
		var categories = [];
		$.each(post.getCategories().toArray(), function(index, category) {
			categories.push(template(category.getId(), category.getTitle(), category.getName()));
		});
		$("#rightmeta").html(categories.join(", "));
		current.find(".single-title").html("" + post.getTitle());
		current.find(".entrybody").html("" + post.getBody());
	},
	sidebar: function(posts) {
		var container = $("#navcol ul:first").empty();
		var template = String.format("<li><a href='?post={0}' title='Beitrag {1} ansehen'>{1}</a></li>");
		$.each(posts, function(index, post) {
			$(template(post.getId(), post.getTitle())).appendTo(container);
		});
	},
	topNavigation: function(blog) {
		var meta = $("div.nextprev");
		var prev = meta.find("a:first");
		var prevPost = blog.previousPost();
		var nextPost = blog.nextPost();
		if (prevPost) {
			meta.find(".prev").html(String.format("&#171; <a href='?post={0}'>{1}</a>&#160;", prevPost.getId(), prevPost.getTitle()));
		} else {
			meta.find(".prev").html("&#160;");
		}
		if (nextPost) {
			meta.find(".next").html(String.format("&#160;<a href='?post={0}'>{1}</a> &#187; ", nextPost.getId(), nextPost.getTitle()));
		} else {
			meta.find(".next").html("&#160;");
		}
	},
	bottomNavigation: function(blog) {
		var meta = $("div.bottommeta");
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