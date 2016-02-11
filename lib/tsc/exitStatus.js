(function(define) {'use strict'
	define("latte_ts/tsc/exitStatus", ["require", "exports", "module", "window"],
 	function(require, exports, module, window) {
 		(function() {
 			var all = {
 				"Success": 0,
 				"DiagnosticsPresent_OutputsSkipped": 1,
 				"DiagnosticsPresent_OutputsGenerated": 2
 			};
 			for(var i in all) {
 				this[i] = all[i];
 				this[all[i]] = i;
 			}

 		}).call(module.exports);
 		//ts.executeCommandLine(ts.sys.args);
 	});
})(typeof define === "function"? define: function(name, reqs, factory) {factory(require, exports, module); });
