package de.bassistance.blog.domain;

import java.util.Date;

public class Post {

	private String id;

	private String title;

	private String body;

	private Date date;
	
//	private final List<Comment> comments = new ArrayList<Comment>();

	public Post(String id, String title, String body, Date date) {
		this.id = id;
		this.title = title;
		this.body = body;
		this.date = date;
	}

	public String getId() {
		return id;
	}

	public String getTitle() {
		return title;
	}

	public String getBody() {
		return body;
	}

	public Date getDate() {
		return date;
	}

}
