

importPackage(Packages.de.bassistance.blog.domain);
var blog = new BlogService().getBlog();
page.header();
page.categories(blog.getCategories());
page.posts($("div.entry"), blog.getRecentPosts().toArray());
page.sidebar(blog.getPosts().toArray());
page.bottomNavigation(blog);

document.innerHTML
