importPackage(Packages.de.bassistance.blog.domain);
var blog = new BlogService().getBlog();
page.header();
page.categories(blog.getCategories());
page.post($("div.entry"), blog.getCurrentPost());
page.sidebar(blog.getPosts().toArray());
page.topNavigation(blog);

document.innerHTML
