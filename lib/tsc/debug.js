(function(define) {'use strict'
	define("latte_ts/tsc/debug", ["require", "exports", "module", "window"],
 	function(require, exports, module, window) {
 		(function() {
 			var currentAassertionLevel = 0;
 			this.shouldAssert = function(level) {
 				return currentAassertionLevel >= level;
 			}
 			this.assert = function(expression, message, verboseDebugInfo) {
	            if (!expression) {
	                var verboseDebugString = "";
	                if (verboseDebugInfo) {
	                    verboseDebugString = "\r\nVerbose Debug Information: " + verboseDebugInfo();
	                }
	                debugger;
	                throw new Error("Debug Failure. False expression: " + (message || "") + verboseDebugString);
	            }
	        }
	        var debug = this;
	        this.fail = function(message) {
	        	debug.assert(false, message);
	        }
   		}).call(module.exports);
 		//ts.executeCommandLine(ts.sys.args);
 	});
})(typeof define === "function"? define: function(name, reqs, factory) {factory(require, exports, module); });
