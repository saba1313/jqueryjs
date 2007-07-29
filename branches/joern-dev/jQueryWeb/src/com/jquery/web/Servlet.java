package com.jquery.web;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.ImporterTopLevel;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;

import de.bassistance.blog.domain.BlogService;



public class Servlet extends HttpServlet {
	
	protected void service(HttpServletRequest request, HttpServletResponse response) throws IOException {
		Request.set(request);
		Response.set(response);
		// TODO allow other content types, eg. xml for rss feed
		response.setContentType("text/html; charset=UTF-8");
		// TODO implement url-to-action mapping
		new BlogService().getBlog().postComment();
		ScriptableObject scope = new ImporterTopLevel(Context.enter());
		Globals.init(scope, request.getContextPath(), realPath(), page(request));
		eval(scope, "blog");
		Object result = eval(scope, page(request));
		response.getWriter().write(result.toString());
		Context.exit();
	}

	private String realPath() {
		return getServletContext().getRealPath("WEB-INF/");
	}
	
	// TODO move to application
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

	private Object eval(Scriptable scope, String name) {
		try {
			return Context.getCurrentContext().evaluateReader(scope, findFile(realPath() + "/" + name), name + ".js", 1, null);
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
