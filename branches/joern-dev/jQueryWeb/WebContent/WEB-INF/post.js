window.document = new DOMDocument(request.realPath + "/" + request.page + ".html");
load(request.realPath + "/jquery.js");

importPackage(Packages.de.bassistance.blog.domain);
var blog = new BlogService().getBlog();
Page.header();
Page.categories(blog.getCategories());
Page.post(blog.getCurrentPost());
Page.comments(blog.getCurrentPost(), blog.getCurrentPost().getComments().toArray());
Page.sidebar(blog.getPosts().toArray());
Page.topNavigation(blog);

document.innerHTML
