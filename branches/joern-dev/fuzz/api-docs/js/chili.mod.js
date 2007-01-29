/*  
Chili is a code highlighter based on jQuery
Copyright 2006 / Andrea Ercolino
*/
ChiliBook = {
	  version:            "1.4a" // 2006/12/22
	, elementPath:        "code" // elementPath is a jQuery selector for the element to highlight
	, elementClass:       "" // elementClass is the class of the element addressed by elementPath
	, recipeFolder:       "" // it will be used this way: recipeFolder + recipeName + '.js'
	, stylesheetFolder:   "" // it will be used this way: stylesheetFolder + recipeName + '.css'
	, defaultReplacement: '<span class="$0">$$</span>'
	, replaceSpace:       "&#160;"                   // use an empty string for not replacing 
	, replaceTab:         "&#160;&#160;&#160;&#160;" // use an empty string for not replacing
	, replaceNewLine:     "&#160;<br/>"              // use an empty string for not replacing
	, recipes: []
	, recipe: function(name) {
		var aux;
		for (var i = 0; i < this.recipes.length; i++) {
			if (this.recipes[i].name == name) {
				aux = this.recipes[i];
				break;
			}
		}
		return aux;
	}

	, addRecipe: function(name, steps) {
		// name conflict avoidance
		if (!this.recipe( name )) {
			this.recipes.push({
				name: name, 
				steps: steps,
				ignoreCase: arguments[2] || false
			});
		}
	}
};


jQuery( function() {

    if (window.opera) return; // <-- malsup

	function cook( ingredients, recipe ) {

		function prepareStep( stepName, step ) {
			var exp = ( typeof step.exp == "string" ) ? step.exp : step.exp.source;
			steps.push( {
				stepName: stepName
				, exp: "(" + exp + ")"
				, length: 1                         // add 1 to account for the newly added parentheses
					+ (exp                          // count number of submatches in here
						.replace( /\\./g, "%" )     // disable any escaped character
						.replace( /\[.*?\]/g, "%" ) // disable any character class
						.match( /\((?!\?)/g )       // match any open parenthesis, not followed by a ?
					|| []                           // make sure it is an empty array if there are no matches
					).length                        // get the number of matches
				, replacement: (step.replacement) ? step.replacement : ChiliBook.defaultReplacement 
			} );
		}
	
		function knowHow() {
			var prevLength = 0;
			var exps = [];
			for (var i = 0; i < steps.length; i++) {
				var exp = steps[ i ].exp;
				// adjust backreferences
				exp = exp.replace( /\\\\|\\(\d+)/g, function( m, aNum ) {
					return !aNum ? m : "\\" + ( prevLength + 1 + parseInt( aNum ) );
				} );
				exps.push( exp );
				prevLength += steps[ i ].length;
			}
			var source = exps.join( "|" );
			return new RegExp( source, (recipe.ignoreCase) ? "gi" : "g" );
		}

		function escapeHTML( str ) {
			return str.replace( /&/g, "&amp;" ).replace( /</g, "&lt;" );
		}

		function replaceSpaces( str ) {
            return str.replace(/ /g, replaceSpace);
			//return str.replace( / +/g, function( spaces ) {
			//	return spaces.replace( / /g, replaceSpace );
			//} );
		}

		function filter( str ) {
			str = escapeHTML( str );
			if( replaceSpace ) {
				str = replaceSpaces( str );
			}
			return str;
		}

		function chef( matched ) {
			var i = 0;  // iterate steps
			var j = 1;	// iterate chef's arguments
			var step;
			while (step = steps[ i++ ]) {
				var aux = arguments; // this unmasks chef's arguments inside the next function
				if (aux[ j ]) {
					var pattern = /(\\\$)|(?:\$\$)|(?:\$(\d+))/g;
					var replacement = step.replacement
						.replace( pattern, function( m, escaped, K ) {
							var bit = '';
							if( escaped ) {       /* \$ */ 
								return "$";
							}
							else if( !K ) {       /* $$ */ 
								return filter( aux[ j ] );
							}
							else if( K == "0" ) { /* $0 */ 
								return step.stepName;
							}
							else {                /* $K */
								return filter( aux[ j+parseInt(K) ] );
							}
						} );

					var offset = arguments[ arguments.length - 2 ];
					var input = arguments[ arguments.length - 1 ];
					var unmatched = input.substring( lastIndex, offset );
					lastIndex = offset + matched.length; // lastIndex for the next call to chef

					perfect += filter( unmatched ) + replacement; // we use perfect for all the replacing
					return replacement;
				} 
				else {
					j+= step.length;
				}
			}
		}

		var replaceSpace = ChiliBook.replaceSpace;
		var steps = [];
		for (var stepName in recipe.steps) {
			prepareStep( stepName, recipe.steps[ stepName ] );
		}

		var perfect = ""; //replace doesn't provide a handle to the ongoing partially replaced string
		var lastIndex = 0; //regexp.lastIndex is available after a string.match, but not in a string.replace
		ingredients.replace( knowHow(), chef );
		var lastUnmatched = ingredients.substring( lastIndex, ingredients.length );
		perfect += filter( lastUnmatched );

		return perfect;
	}

	function makeDish( el, recipeName ) {
		var recipe = ChiliBook.recipe( recipeName );
		var ingredients = jQuery(el).text();

		// hack for IE: IE uses \r in lieu of \n
		ingredients = ingredients.replace(/\r/g, "\n");

		var dish = cook( ingredients, recipe ); // all happens here
		
		if( ChiliBook.replaceTab ) {
			dish = dish.replace( /\t/g, ChiliBook.replaceTab );
		}
		if( ChiliBook.replaceNewLine ) {
			dish = dish.replace( /\n/g, ChiliBook.replaceNewLine );
		}

		jQuery(el).html( dish );
	}

// initializations
	var reElClass = new RegExp( "\\b" + ChiliBook.elementClass + "\\b", "gi" );

// the coloring starts here
	jQuery( ChiliBook.elementPath ).each( function() {
		var el = this;
        var c = jQuery(el).attr( "class" );
        if (c) { // <-- malsup; allow code elements without class attribute
            var recipeName = c.replace( reElClass, "" );
            if( '' != recipeName ) {
                var recipe = ChiliBook.recipe( recipeName );
                if (!recipe) return;
                makeDish( el, recipeName );
            }
        }
	} );
} );

// preload javascript
ChiliBook.addRecipe("javascript", {
    mlcom: {
        exp: /\/\*[^*]*\*+(?:[^\/][^*]*\*+)*\//
    }
    ,com: {
        exp: /\/\/.*/
    }
    ,regexp: {
        exp: /\/[^\/\\\n]*(?:\\.[^\/\\\n]*)*\/[gim]*/
    }
    ,string: {
        exp: /(?:\'[^\'\\\n]*(?:\\.[^\'\\\n]*)*\')|(?:\"[^\"\\\n]*(?:\\.[^\"\\\n]*)*\")/
    }
    ,numbers: {
        exp: /\b[+-]?(?:\d*\.?\d+|\d+\.?\d*)(?:[eE][+-]?\d+)?\b/
    }
    ,keywords: {
        exp: /\b(arguments|break|case|catch|continue|default|delete|do|else|false|for|function|if|in|instanceof|new|null|return|switch|this|true|try|typeof|var|void|while|with)\b/
    }
    ,global: {
        exp: /\b(toString|valueOf|window|element|prototype|constructor|document|escape|unescape|parseInt|parseFloat|setTimeout|clearTimeout|setInterval|clearInterval|NaN|isNaN|Infinity)\b/
    },
    jquery:   { 
        exp: /(\$|jQuery)/ 
    },
    malsup: {
        exp: /blockUI|unblockUI|ajaxForm|ajaxSubmit|fieldSerialize|formSerialize|fieldValue|resetForm|clearForm|clearFields/
    },
    iehack: {
        exp: /iehack/
    }
});

// preload html
ChiliBook.addRecipe("html", {
	com: {
		exp: /&lt;!\s*(--([^-]|[\r\n]|-[^-])*--\s*)&gt;/
	},
	tag: {
		exp: /(&lt;\/?)([a-zA-Z]+\s?)/, 
		replacement: "$1<span class=\"$0\">$2</span>"
	},
	string: {
		exp  : /'[^']*'|"[^"]*"/
	},
	attribute : {
		exp: /\b([a-zA-Z-:]+)(=)/, 
		replacement: "<span class=\"$0\">$1</span>$2"
	},
	doctype : {
		exp: /&lt;!DOCTYPE([^&]|&[^g]|&g[^t])*&gt;/
	},
    iehack: {
        exp: /iehack/
    }
});
