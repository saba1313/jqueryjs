package de.bassistance.blog;

import com.jquery.web.Request;
import com.jquery.web.Response;

import de.bassistance.blog.domain.BlogService;
import de.bassistance.blog.domain.Comment;
import de.bassistance.blog.domain.Post;

public class Application {
	
	public void postComment() {
		String id = Request.get("postcomment");
		if(id != null) {
			Comment comment = Request.map(Comment.class);
			Post post = new BlogService().getBlog().getPost(id);
			post.addComment(comment);
			Response.redirect("?post=" + id + "#comment-" + (post.getComments().size() - 1));
		}
	}

}
