importPackage(Packages.de.bassistance.blog.domain);
var blog = new BlogService().getBlog();
Page.header();
Page.categories(blog.getCategories());
Page.posts($("div.entry"), blog.getRecentPosts().toArray());
Page.sidebar(blog.getPosts().toArray());
Page.bottomNavigation(blog);

document.innerHTML
