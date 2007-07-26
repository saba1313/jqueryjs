window.document = new DOMDocument(request.realPath + "/" + request.page + ".xml");

importPackage(Packages.de.bassistance.blog.domain);
var blog = new BlogService().getBlog();
Page.feedHeader(blog);
Page.feedPosts(blog.getRecentPosts().toArray());
document.innerHTML
