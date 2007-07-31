package com.jquery.web;

import javax.portlet.PortletRequest;
import javax.portlet.PortletResponse;

import org.springframework.web.portlet.handler.HandlerInterceptorAdapter;

public class PortletInterceptor extends HandlerInterceptorAdapter {
	
	protected boolean preHandle(PortletRequest request, PortletResponse response, Object handler) {
		Request.set(request);
		Response.set(response);
		return true;
	}

}
