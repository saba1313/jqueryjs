package com.jquery.web;

import org.mozilla.javascript.Context;
import org.mozilla.javascript.Function;
import org.mozilla.javascript.Scriptable;
import org.mozilla.javascript.ScriptableObject;
import org.mozilla.javascript.tools.shell.Main;

public class Globals {

	public static void load(Context cx, Scriptable thisObj, Object[] args,
			Function funObj) {
		for (int i = 0; i < args.length; i++) {
			Main.processFile(cx, thisObj, Context.toString(args[i]));
//			return cx.compileString(scriptSource, path, lineno,
//                    securityDomain);
		}
	}

	public static void init(ScriptableObject scope) {
		scope.defineFunctionProperties(new String[]{"load"}, Globals.class, ScriptableObject.DONTENUM);
	}

}
