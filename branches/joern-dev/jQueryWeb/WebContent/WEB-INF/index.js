window.document = new DOMDocument(request.realPath + "/" + request.page + ".html");

importPackage(Packages.de.bassistance.blog.domain);
var blog = new BlogService().getBlog();
Page.header();
Page.categories(blog.getCategories());
Page.posts(blog.getRecentPosts().toArray());
Page.sidebar(blog.getPosts().toArray());
Page.bottomNavigation(blog);

document.innerHTML
