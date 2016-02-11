(function(define) {'use strict'
	define("latte_ts/tsc/typeReferenceSerializationKind", ["require", "exports", "module", "window"],
 	function(require, exports, module, window) {
 		(function() {
 			var all = {
 				"Unknown": 0,
 				"TypeWithConstructSignatureAndValue": 1,
 				"VoidType": 2,
 				"NumberLikeType": 3,
 				"StringLikeType": 4,
 				"BooleanType": 5,
 				"ArrayLikeType": 6,
 				"ESSymbolType": 7,
 				"TypeWithCallSignature": 8,
 				"ObjectType": 9
 			}
 			for(var i in all) {
 				this[i] = all[i];
 				this[all[i]] = i;
 			}

 		}).call(module.exports);
 		//ts.executeCommandLine(ts.sys.args);
 	});
})(typeof define === "function"? define: function(name, reqs, factory) {factory(require, exports, module); });
