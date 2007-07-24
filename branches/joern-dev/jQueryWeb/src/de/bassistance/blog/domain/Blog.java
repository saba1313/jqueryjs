package de.bassistance.blog.domain;

import java.util.ArrayList;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.SortedSet;
import java.util.TreeSet;

import de.mxcit.jsf.util.RequestUtil;

public class Blog {
	
	private int pagesize = 3;

	private String name;

	private String description;

	private final Map<String, Post> posts = new LinkedHashMap<String, Post>();

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<Post> getRecentPosts() {
		return getPosts().subList(start(), posts.size() - start() < pagesize ? posts.size() : start() + pagesize);
	}
	
	private int start() {
		int page = page();
		if (page == 0) {
			return 0;
		}
		return (page - 1) * pagesize;
	}
	
	private int page() {
		String page = (String) RequestUtil.get("page");
		if (page == null) {
			return 0;
		}
		return Integer.parseInt(page);
	}
	
	public int previousPage() {
		return page() == 0
			? 2
			: (page() - 1) * pagesize + pagesize > posts.size()
				? -1
				: page() + 1;
	}
	public int nextPage() {
		return page() - 1;
	}

	public List<Post> getPosts() {
		List result = new ArrayList<Post>(posts.values());
		Collections.reverse(result);
		return result;
	}
	
	public Category[] getCategories() {
		SortedSet<Category> categories = new TreeSet<Category>();
		for (Post post : posts.values()) {
			categories.addAll(post.getCategories());
		}
		return categories.toArray(new Category[categories.size()]);
	}

	public void addBlogEntry(Post post) {
		posts.put(post.getId(), post);
	}

	public Post getPost(String id) {
		return posts.get(id);
	}
}
