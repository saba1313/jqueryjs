package com.jquery.web;

import java.lang.reflect.InvocationTargetException;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Map;

import javax.portlet.PortletRequest;
import javax.servlet.http.HttpServletRequest;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.web.portlet.context.PortletRequestAttributes;

/**
 * Maps a servlet or portlet request to beans via {@link #mapTo(Object)}.
 * 
 * Depends on Apache Commons Beanutils, servlet-api and portlet-api.
 */
public class Request {

	private final static Log log = LogFactory.getLog(Request.class);

	private final Map<String, Object> request = new HashMap();
	
	private static final ThreadLocal requestHolder = new ThreadLocal();
	
	static void set(HttpServletRequest servletRequest) {
		requestHolder.set(servletRequest);
	}
	
	static void set(PortletRequest portletRequest) {
		requestHolder.set(portletRequest);
	}
	
	public Request(HttpServletRequest servletRequest) {
		from(servletRequest);
	}

	public Request(PortletRequest portletRequest) {
		from(portletRequest);
	}

	public Request() {
		if(isPortletRequest())
			from(portletRequest());
		else
			from(servletRequest());
	}

	private void from(HttpServletRequest servletRequest) {
		Enumeration names = servletRequest.getParameterNames();
		while (names.hasMoreElements()) {
			String name = (String) names.nextElement();
			request.put(name, servletRequest.getParameterValues(name));
		}
	}

	private void from(PortletRequest portletRequest) {
		Enumeration names = portletRequest.getParameterNames();
		while (names.hasMoreElements()) {
			String name = (String) names.nextElement();
			request.put(name, portletRequest.getParameterValues(name));
		}
	}
	
	private static boolean isPortletRequest() {
		return requestHolder.get() instanceof PortletRequestAttributes;
	}

	private static HttpServletRequest servletRequest() {
		return (HttpServletRequest) requestHolder.get();
	}

	private static PortletRequest portletRequest() {
		return (PortletRequest) requestHolder.get();
	}
	
	public static <T> T map(T target) {
		return new Request().mapTo(target);
	}
	
	public static <T> T map(Class<T> clazz) {
		try {
			return map(clazz.newInstance());
		} catch (InstantiationException e) {
			throw new RuntimeException(e);
		} catch (IllegalAccessException e) {
			throw new RuntimeException(e);
		}
	}
	
	public <T> T mapTo(T target) {
		try {
			BeanUtils.populate(target, request);
		} catch (IllegalAccessException e) {
			log.warn("couldn't map " + request + " to " + target, e);
		} catch (InvocationTargetException e) {
			log.warn("couldn't map " + request + " to " + target, e);
		}
		return target;
	}
	
	public static String get(String name) {
		return isPortletRequest()
			? portletRequest().getParameter(name)
			: servletRequest().getParameter(name);
	}

}
