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
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.portlet.context.PortletRequestAttributes;

/**
 * Maps a servlet or portlet request to beans via {@link #mapTo(Object)}.
 * 
 * Depends on Apache Commons Beanutils, servlet-api and portlet-api.
 */
public class RequestMapper {

	private final static Log log = LogFactory.getLog(RequestMapper.class);

	private final Map<String, Object> request = new HashMap();

	public RequestMapper(HttpServletRequest servletRequest) {
		from(servletRequest);
	}

	public RequestMapper(PortletRequest portletRequest) {
		from(portletRequest);
	}

	public RequestMapper() {
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

	private static HttpServletRequest servletRequest() {
		return ((ServletRequestAttributes) RequestContextHolder
				.currentRequestAttributes()).getRequest();
	}

	private static boolean isPortletRequest() {
		return RequestContextHolder.currentRequestAttributes() instanceof PortletRequestAttributes;
	}

	private static PortletRequest portletRequest() {
		return ((PortletRequestAttributes) RequestContextHolder
				.currentRequestAttributes()).getRequest();
	}

	public void mapTo(Object target) {
		try {
			BeanUtils.populate(target, request);
		} catch (IllegalAccessException e) {
			log.warn("couldn't map " + request + " to " + target, e);
		} catch (InvocationTargetException e) {
			log.warn("couldn't map " + request + " to " + target, e);
		}
	}

}
