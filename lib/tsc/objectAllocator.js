(function(define) {'use strict'
	define("latte_ts/tsc/objectAllocator", ["require", "exports", "module", "window"],
 	function(require, exports, module, window) {
 		(function() {
	 			function Node(kind, pos, end) {
	 				this.kind = kind;
	 				this.pos = pos;
	 				this.end = end;
	 				this.flags = 0;
	 				this.parent = undefined;
	 			}
 			this.getNodeConstructor = function () { 
 				return Node; 
 			}
	        this.getSourceFileConstructor = function () { 
	        	return Node; 
	        }
	        	function Symbol(flags, name) {
	        		this.flags = flags;
	        		this.name = name;
	        		this.declarations = undefined;
	        	}
        	this.getSymbolConstructor = function () { 
        		return Symbol; 
        	}
        		function Type(checker, flags) {
        			this.flags = flags;
        		}
        	this.getTypeConstructor = function () { 
        		return Type;
        	}
        		function Signature(checker) {

        		}
        	this.getSignatureConstructor = function () { 
        		return Signature; 
        	}
 		}).call(module.exports);
 	});
})(typeof define === "function"? define: function(name, reqs, factory) {factory(require, exports, module); });
