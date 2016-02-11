(function(define) {'use strict'
	define("latte_ts/tsc/index", ["require", "exports", "module", "window"],
 	function(require, exports, module, window) {
 		(function() {
 			var tsc = this;
 			this.OperationCanceledException = function() {}
 			this.ExitStatus = require("./exitStatus");

 			this.createFileMap = function(keyMapper) {
 				var files = {};
 				var toKey = function(path) {
 					return keyMapper? keyMapper(path): path;
 				}
 				return {
 					get: function(path) {
 						return files[toKey(path)];
 					},
 					set: function(path, value) {
 						files[toKey(path)] = value;
 					},
 					contains: function(path) {
 						return hasProperty(files, toKey(path));
 					},
 					remove: function(path) {
 						var key = toKey(path);
 						delete files[key];
 					},
 					forEachValue: function(f) {
 						for(var key in files) {
 							f(key, files[key]);
 						}
 					},
 					clear: function() {
 						files = {};
 					}
 				};
 			}
 			this.toPath = function(fileName, basePath, getCanonicalFileName) {
 				var nonCanonicalizedPath = isRootedDiskPath(fileName)
		            ? normalizePath(fileName)
		            : getNormalizedAbsolutePath(fileName, basePath);
		        return getCanonicalFileName(nonCanonicalizedPath);
 			}
 			

 		}).call(module.exports);
 		//ts.executeCommandLine(ts.sys.args);
 	});
})(typeof define === "function"? define: function(name, reqs, factory) {factory(require, exports, module); });
