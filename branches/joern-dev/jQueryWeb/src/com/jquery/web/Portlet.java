package com.jquery.web;

import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.Reader;

import javax.portlet.ActionRequest;
import javax.portlet.ActionResponse;
import javax.portlet.GenericPortlet;
import javax.portlet.PortletException;
import javax.portlet.PortletRequest;
import javax.portlet.RenderRequest;
import javax.portlet.RenderResponse;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.ImporterTopLevel;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;
import org.mozilla.javascript.tools.ToolErrorReporter;
import org.springframework.context.ApplicationContext;
import org.springframework.web.portlet.context.PortletApplicationContextUtils;

public class Portlet extends GenericPortlet {
	
	public void processAction(ActionRequest request, ActionResponse response) throws PortletException, IOException {
		Request.set(request);
		Response.set(response);
		ScriptableObject scope = new ImporterTopLevel(Context.enter());
		Context.getCurrentContext().setErrorReporter(new ToolErrorReporter(true, System.err));
		PortletGlobals.init(scope, request.getContextPath(), realPath(), page(request), context());
		eval(scope, page(request) + "-action.js");
		Context.exit();
	}

	public void render(RenderRequest request, RenderResponse response) throws PortletException, IOException {
		Request.set(request);
		Response.set(response);
		response.setContentType("text/html; charset=UTF-8");
		ScriptableObject scope = new ImporterTopLevel(Context.enter());
		Context.getCurrentContext().setErrorReporter(new ToolErrorReporter(true, System.err));
		PortletGlobals.init(scope, request.getContextPath(), realPath(), page(request), context());
		Object result = eval(scope, page(request) + ".js");
		response.getWriter().write(result.toString());
		Context.exit();
	}
	
	private ApplicationContext context() {
		return PortletApplicationContextUtils.getRequiredWebApplicationContext(getPortletContext());
	}

	private String realPath() {
		return getPortletContext().getRealPath(getInitParameter("views"));
	}
	
	private String page(PortletRequest request) {
		return request.getPortletMode().toString().toLowerCase();
	}

	private Object eval(Scriptable scope, String name) {
		try {
			return Context.getCurrentContext().evaluateReader(scope, findFile(realPath() + "/" + name), name, 1, null);
		} catch (IOException e) {
			throw new RuntimeException(e);
		}
	}

	private Reader findFile(String filename) {
		try {
			return new FileReader(filename);
		} catch (FileNotFoundException e) {
			throw new IllegalArgumentException(e.getMessage());
		}
	}

}
