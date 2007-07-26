package com.jquery.web;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.ImporterTopLevel;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;

import de.bassistance.blog.domain.BlogService;
import de.bassistance.blog.domain.Comment;
import de.bassistance.blog.domain.Post;



public class Servlet extends HttpServlet {
	
	protected void service(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setContentType("text/html; charset=UTF-8");
		postComment(request, response);
		String realPath = realPath();
		Context rhinoContext = Context.enter();
		ScriptableObject scope = new ImporterTopLevel(rhinoContext);
		Globals.init(scope, request.getContextPath(), realPath(), page(request));
		eval(rhinoContext, scope, "blog", realPath);
		Object result = eval(rhinoContext, scope, page(request), realPath);
		response.getWriter().write(result.toString());
		Context.exit();
	}

	private void postComment(HttpServletRequest request, HttpServletResponse response) {
		String id = request.getParameter("postcomment");
		if(id != null) {
			Comment comment = new Comment();
			new RequestMapper().mapTo(comment);
			Post post = new BlogService().getBlog().getPost(id);
			post.addComment(comment);
			try {
				response.sendRedirect("?post=" + id + "#comment-" + (post.getComments().size() - 1));
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	private String realPath() {
		return getServletContext().getRealPath("WEB-INF/");
	}
	
	private String page(HttpServletRequest request) {
		String page = request.getParameter("post");
		if ( page != null)
			return "post";
		page = request.getParameter("category");
		if ( page != null)
			return "category";
		page = request.getParameter("feed");
		if ( page != null)
			return "feed";
		return "index";
	}

	private Object eval(Context context, Scriptable scope, String name, String realPath) {
		try {
			return context.evaluateReader(scope, findFile(realPath + "/" + name), name + ".js", 1, null);
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}

	private Reader findFile(String filename) {
		try {
			return new FileReader(filename + ".js");
		} catch (FileNotFoundException e) {
			throw new IllegalArgumentException(e.getMessage());
		}
	}
	
	
}
