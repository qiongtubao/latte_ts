(function(define) {'use strict'
	define("latte_ts/tsc/diagnosticCategory", ["require", "exports", "module", "window"],
 	function(require, exports, module, window) {
 		(function() {
 			var all = {
 				"Warning": 0,
 				"Error": 1,
 				"Message": 2
 			};
 			for(var i in all) {
 				this[i] = all[i];
 				this[all[i]] = i;
 			}

 		}).call(module.exports);
 		//ts.executeCommandLine(ts.sys.args);
 	});
})(typeof define === "function"? define: function(name, reqs, factory) {factory(require, exports, module); });
