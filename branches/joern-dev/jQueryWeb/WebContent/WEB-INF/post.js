window.document = new DOMDocument(request.realPath + "/" + request.page + ".html");

importPackage(Packages.de.bassistance.blog.domain);
var blog = new BlogService().getBlog();
Page.header();
Page.categories(blog.getCategories());
Page.post(blog.getCurrentPost());
Page.comments(blog.getCurrentPost(), blog.getCurrentPost().getComments().toArray());
Page.sidebar(blog.getPosts().toArray());
Page.topNavigation(blog);

$().print();
