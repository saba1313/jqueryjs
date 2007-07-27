package com.jquery.web;

import java.io.IOException;

import javax.servlet.http.HttpServletResponse;

public class Response {
	
	private static final ThreadLocal responseHolder = new ThreadLocal();
	
	static void set(HttpServletResponse response) {
		responseHolder.set(response);
	}
	
	private static HttpServletResponse servletResponse() {
		return (HttpServletResponse) responseHolder.get();
	}

	public static void redirect(String location) {
		try {
			servletResponse().sendRedirect(location);
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

}
