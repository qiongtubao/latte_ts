(function(define) {'use strict'
	define("latte_ts/tsc/utils", ["require", "exports", "module", "window"],
 	function(require, exports, module, window) {
 		(function() {

 			/**
 			this.forEach = function(array, callback) {
 				if(array) {
 					for(var i = 0, len = array.length; i < len; i++) {
 						var result = callback(array[i], i);
 						if(result) {
 							return result;
 						}
 					}
 				}
 				return undefined;
 			}
 			this.contains = function(array, value) {
 				if(array) {
 					for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
		                var v = array_1[_i];
		                if (v === value) {
		                    return true;
		                }
		            }
 				}
 				return false;
 			}
 			this.indexOf = function(array, value) {
				if (array) {
		            for (var i = 0, len = array.length; i < len; i++) {
		                if (array[i] === value) {
		                    return i;
		                }
		            }
		        }
		        return -1;
 			}
 			*/
 			this.countWhere = function(array, predicate) {
 				var count = 0;
 				if(array) {
 					array.forEach(function(o) {
 						if(predicate(o)) {
 							count++;
 						}
 					});
 				}
 				return count;
 			}
 			/**
 			this.filter = function(array, f) {
 				var result;
		        if (array) {
		            result = [];
		            for (var _i = 0, array_3 = array; _i < array_3.length; _i++) {
		                var item = array_3[_i];
		                if (f(item)) {
		                    result.push(item);
		                }
		            }
		        }
		        return result;
 			}
 			function map(array, f) {
		        var result;
		        if (array) {
		            result = [];
		            for (var _i = 0, array_4 = array; _i < array_4.length; _i++) {
		                var v = array_4[_i];
		                result.push(f(v));
		            }
		        }
		        return result;
		    }
 			*/
 			var concatenate = this.concatenate = function(array1, array2) {
 				if (!array2 || !array2.length)
		            return array1;
		        if (!array1 || !array1.length)
		            return array2;
		        return array1.concat(array2);
 			}

 			this.deduplicate = function(array) {
 				var result;
 				if(array) {
 					result = [];
 					array.forEach(function(item) {
 						if(!contains(result,item)) {
 							result.push(item);
 						}
 					});
 				}
 				return result;
 			}

 			this.sum = function(array, prop) {
 				var result = 0;
 				var result = 0;
 				array.forEach(function(v) {
 					result += v[prop];
 				});
 				return result;
 			}

 			this.addRange = function(to, from) {
 				if(to && from) {
 					for (var _i = 0, from_1 = from; _i < from_1.length; _i++) {
		                var v = from_1[_i];
		                to.push(v);
		            }
 				}
 			}

 			this.rangeEquals = function(array1, array2, pos, end) {
 				while(pos < end) {
 					if(array1[pos] !== array2[pos]) {
 						return false;
 					}
 					pos++;
 				}
 				return true;
 			}
 			this.lastOrUndefined = function(array) {
 				if(array.length === 0) {
 					return undefined;
 				}
 				return array[array.length - 1];
 			}
 			this.binarySearch = function(array, value) {
 				var low = 0;
 				var high = array.length - 1;
 				while(low <= high) {
 					var middle = low + ((high - low) >> 1);
 					var midValue = array[middle];
 					if(midValue === value) {
 						return middle;
 					}else if(midValue > value) {
 						high = middle -1;
 					}else{
 						low = middle + 1;
 					}
 				}
 				return -low;
 			}
 			this.reduceLeft = function(array, f, initial) {
 				if(array) {
 					var count = array.length;
 					if(count > 0) {
 						var pos = 0;
 						var result = arguments.length <= 2? array[pos]: initial;
 						pos++;
 						while(pos < count) {
 							result = f(result, array[pos]);
 							pos++;
 						}
 						return result;
 					}
 				}
 				return initial;
 			}
 			this.reduceRight = function(array, f, initial) {
 				if(array) {
 					var pos = array.length - 1;
 					if(pos >= 0) {
 						var result = arguments.length <= 2? array[pos]: initial;
 						pos--;
 						while(pos >= 0) {
 							result = f(result, array[pos]);
 							pos--;
 						}
 						return result;
 					}
 				}
 				return initial;
 			}
			var hasOwnProperty = Object.prototype.hasOwnProperty;
 			this.hasOwnPropety = function(map, key) {
 				return hasOwnProperty.call(map, key);
 			}
 			this.getProperty = function(map, key) {
 				return hasOwnProperty.call(map, key)? map[key]: undefined;
 			}
 			this.isEmpty = function() {
 				for(var id in map) {
 					if(hasProperty(map, id)) {
 						return false;
 					}
 				}
 				return true;
 			}
 			this.clone = function(object) {
 				var result = {};
 				for(var id in object) {
 					result[id] = object[id];
 				}
 				return result;
 			}
 			this.extend = function(first, second) {
 				var result = {};
		        for (var id in first) {
		            result[id] = first[id];
		        }
		        for (var id in second) {
		            if (!hasProperty(result, id)) {
		                result[id] = second[id];
		            }
		        }
		        return result;
 			}
 			this.forEachValue = function(map, callback) {
 				var result;
		        for (var id in map) {
		            if (result = callback(map[id]))
		                break;
		        }
		        return result;
 			}
 			this.forEachKey = function(map, callback) {
 				var result;
		        for (var id in map) {
		            if (result = callback(id))
		                break;
		        }
		        return result;
 			}
 			this.lookUp = function(map, key) {
 				return hasProperty(map, key)? map[key]: undefined;
 			}
 			this.copyMap = function(source, target) {
 				for(var p in source) {
 					target[p] = source[p];
 				}
 			}
 			this.arrayToMap = function(array, makeKey) {
 				var result = {};
 				forEach(array, function(value) {
 					result[makeKey(value)] = value;
 				});
 				return result;
 			}
 			this.reduceProperties = function(map, callback, initial) {
 				var result = initial;
		        if (map) {
		            for (var key in map) {
		                if (hasProperty(map, key)) {
		                    result = callback(result, map[key], String(key));
		                }
		            }
		        }
		        return result;
 			}
 			this.isArray = function(value) {
 				 return Array.isArray ? Array.isArray(value) : value instanceof Array;
 			}
 			this.memoize = function(callback) {
 				var value;
 				return function() {
 					if(callback) {
 						value = callback();
 						callback = undefined;
 					}
 					return value;
 				}
 			}
 			this.formatStringFromArgs = function(text, args, baseIndex) {
 				baseIndex = baseIndex || 0;
 				return text.replace(/{(\d+)}/g, function (match, index) { return args[+index + baseIndex]; });
 			}
 			this.getLocaleSpecificMessage = function(message) {
 				return ts.localizedDiagnosticMessage && ts.localizedDiagnosticMessages[message.key]
		            ? ts.localizedDiagnosticMessages[message.key]
		            : message.message;
 			}
 			this.createFileDiagnostic = function(file, start, length, message) {
 				var end = start + length;
 				Debug.assert(start >= 0, "start must be non-negative, is " + start);
		        Debug.assert(length >= 0, "length must be non-negative, is " + length);
		        if (file) {
		            Debug.assert(start <= file.text.length, "start must be within the bounds of the file. " + start + " > " + file.text.length);
		            Debug.assert(end <= file.text.length, "end must be the bounds of the file. " + end + " > " + file.text.length);
		        }
		        var text = getLocaleSpecificMessage(message);
		        if (arguments.length > 4) {
		            text = formatStringFromArgs(text, arguments, 4);
		        }
		        return {
		            file: file,
		            start: start,
		            length: length,
		            messageText: text,
		            category: message.category,
		            code: message.code
		        };
 			}
 			this.createFileDiagnostic = function(message) {
 				var text = getLocaleSpecificMessage(message);
 				if(arguments.length > 1) {
 					text = formatStringFromArgs(text, arguments, 1);
 				}
 				return {
 					file: undefined,
 					start: undefined,
 					length: undefined,
 					messageText: text,
 					category: message.category,
 					code: message.code
 				};
 			}
 			this.chainDiagnosticMessages = function(details, message) {
 				var text = getLocaleSpecificMessage(message);
 				if(arguments.length > 2) {
 					text = formatStringFromArgs(text, arguments, 2);
 				}
 				return {
 					messageText: text, 
 					category: message.category,
 					code: message.code,
 					next: details
 				};
 			}
 			this.concatenateDiagnosticMessageChains = function(headChain, tailChain) {
 				var lastChain = headChain;
		        while (lastChain.next) {
		            lastChain = lastChain.next;
		        }
		        lastChain.next = tailChain;
		        return headChain;
 			}
 			this.compareValues = function(a , b) {
 				if( a === b) {
 					return 0;
 				}
 				if(a === undefined) {
 					return -1;
 				}
 				if(b === undefined) {
 					return 1;
 				}
 				return a < b ? -1: 1;
 			}

 			this.getDiagnosticFileName = function(diagnostic) {
 				return diagnostic.file ? diagnostic.file.fileName : undefined;
 			}
 			this.compareDiagnostices = function(d1, d2) {
 				return compareValues(getDiagnosticFileName(d1), getDiagnosticFileName(d2)) ||
		            compareValues(d1.start, d2.start) ||
		            compareValues(d1.length, d2.length) ||
		            compareValues(d1.code, d2.code) ||
		            compareMessageText(d1.messageText, d2.messageText) ||
		            0;
 			}
 			this.compareMessageText = function(text1, text2) {
 				while (text1 && text2) {
		            var string1 = typeof text1 === "string" ? text1 : text1.messageText;
		            var string2 = typeof text2 === "string" ? text2 : text2.messageText;
		            var res = compareValues(string1, string2);
		            if (res) {
		                return res;
		            }
		            text1 = typeof text1 === "string" ? undefined : text1.next;
		            text2 = typeof text2 === "string" ? undefined : text2.next;
		        }
		        if (!text1 && !text2) {
		            return 0;
		        }
		        return text1 ? 1 : -1;
 			}
 			this.sortAndDeduplicateDiagnostics = function(diagnostics) {
 				return deduplicateSortedDiagnostics(diagnostics.sort(compareDiagnostics));
 			}
 			this.deduplicateSortedDiagnostics = function(diagnostics) {
 				if(diagnostics.length < 2) {
 					return diagnostics;
 				}
 				var newDiagnostics = [diagnostics[0]];
 				var previousDiagnostic = diagnostics[0];
 				for(var i = 1; i < diagnostics.length; i++) {
 					var currentDiagnostic = diagnostics[i];
		            var isDupe = compareDiagnostics(currentDiagnostic, previousDiagnostic) === 0;
		            if (!isDupe) {
		                newDiagnostics.push(currentDiagnostic);
		                previousDiagnostic = currentDiagnostic;
		            }
 				}
 				return newDiagnostics;
 			}
 			this.normalizeSlashes = function(path) {
		        return path.replace(/\\/g, "/");
		    }
		    this.getRootLength = function(path) {
		    	if (path.charCodeAt(0) === 47) {
	            if (path.charCodeAt(1) !== 47)
	                return 1;
		            var p1 = path.indexOf("/", 2);
		            if (p1 < 0)
		                return 2;
		            var p2 = path.indexOf("/", p1 + 1);
		            if (p2 < 0)
		                return p1 + 1;
		            return p2 + 1;
		        }
		        if (path.charCodeAt(1) === 58) {
		            if (path.charCodeAt(2) === 47)
		                return 3;
		            return 2;
		        }
		        if (path.lastIndexOf("file:///", 0) === 0) {
		            return "file:///".length;
		        }
		        var idx = path.indexOf("://");
		        if (idx !== -1) {
		            return idx + "://".length;
		        }
		        return 0;
		    }
		    this.getNormalizedParts = function(normalizedSlashedPath, rootLength) {
		        var parts = normalizedSlashedPath.substr(rootLength).split(ts.directorySeparator);
		        var normalized = [];
		        for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
		            var part = parts_1[_i];
		            if (part !== ".") {
		                if (part === ".." && normalized.length > 0 && lastOrUndefined(normalized) !== "..") {
		                    normalized.pop();
		                }
		                else {
		                    if (part) {
		                        normalized.push(part);
		                    }
		                }
		            }
		        }
		        return normalized;
		    }
		    this.directorySeparator = "/";
		    this.normalizePath = function(path) {
		    	path = normalizeSlashes(path);
		    	var rootLength = getRootLength(path);
		    	var normalized = getNormalizedParts(path, rootLength);
		    	return path.substr(0, rootLength) + normalized.join(ts.directorySeparator);
		    }
		    this.getDirectoryPath = function(path) {
				return path.substr(0, Math.max(getRootLength(path), path.lastIndexOf(ts.directorySeparator)));
		 	}
		 	this.isUrl = function(path) {
		 		return path && !isRootedDiskPath(path) && path.indexOf("://") !== -1;
		 	}
		 	this.isRootedDiskPath = function(path) {
		 		return getRootLength(path) !== 0;
		 	}
		 	this.normalizedPathComponents = function(path, rootLength) {
		 		var normalizedParts = getNormalizedParts(path, rootLength);
		 		return [path.substr(0, rootLength)].concat(normalizedParts);
		 	}
		 	this.getNormalizedPathComponents = function(path, rootLength) {
		 		if(pathComponents && pathComponents.length) {
		 			return pathComponents[0] + pathComponents.slice(1).join(ts.directorySeparator);
		 		}
		 	}
		 	this.getNormalizedAbsolutePath = function(fileName, currentDirectory) {
        		return getNormalizedPathFromPathComponents(getNormalizedPathComponents(fileName, currentDirectory));
    		}
    		this.getNormalizedPathFromPathComponents = function(pathComponents) {
		        if (pathComponents && pathComponents.length) {
		            return pathComponents[0] + pathComponents.slice(1).join(ts.directorySeparator);
		        }
		    }

		    this.getNormalizedPathComponentsOfUrl = function(url) {
		        var urlLength = url.length;
		        var rootLength = url.indexOf("://") + "://".length;
		        while (rootLength < urlLength) {
		            if (url.charCodeAt(rootLength) === 47) {
		                rootLength++;
		            }
		            else {
		                break;
		            }
		        }
		        if (rootLength === urlLength) {
		            return [url];
		        }
		        var indexOfNextSlash = url.indexOf(ts.directorySeparator, rootLength);
		        if (indexOfNextSlash !== -1) {
		            rootLength = indexOfNextSlash + 1;
		            return normalizedPathComponents(url, rootLength);
		        }
		        else {
		            return [url + ts.directorySeparator];
		        }
		    }

			    function getNormalizedPathOrUrlComponents(pathOrUrl, currentDirectory) {
			        if (isUrl(pathOrUrl)) {
			            return getNormalizedPathComponentsOfUrl(pathOrUrl);
			        }
			        else {
			            return getNormalizedPathComponents(pathOrUrl, currentDirectory);
			        }
			    }
		    this.getRelativePathToDirectoryOrUrl = function(directoryPathOrUrl, relativeOrAbsolutePath, currentDirectory, getCanonicalFileName, isAbsolutePathAnUrl) {
		        var pathComponents = getNormalizedPathOrUrlComponents(relativeOrAbsolutePath, currentDirectory);
		        var directoryComponents = getNormalizedPathOrUrlComponents(directoryPathOrUrl, currentDirectory);
		        if (directoryComponents.length > 1 && lastOrUndefined(directoryComponents) === "") {
		            directoryComponents.length--;
		        }
		        var joinStartIndex;
		        for (joinStartIndex = 0; joinStartIndex < pathComponents.length && joinStartIndex < directoryComponents.length; joinStartIndex++) {
		            if (getCanonicalFileName(directoryComponents[joinStartIndex]) !== getCanonicalFileName(pathComponents[joinStartIndex])) {
		                break;
		            }
		        }
		        if (joinStartIndex) {
		            var relativePath = "";
		            var relativePathComponents = pathComponents.slice(joinStartIndex, pathComponents.length);
		            for (; joinStartIndex < directoryComponents.length; joinStartIndex++) {
		                if (directoryComponents[joinStartIndex] !== "") {
		                    relativePath = relativePath + ".." + ts.directorySeparator;
		                }
		            }
		            return relativePath + relativePathComponents.join(ts.directorySeparator);
		        }
		        var absolutePath = getNormalizedPathFromPathComponents(pathComponents);
		        if (isAbsolutePathAnUrl && isRootedDiskPath(absolutePath)) {
		            absolutePath = "file:///" + absolutePath;
		        }
		        return absolutePath;
		    }

		    this.getBaseFileName = function(path) {
		        if (path === undefined) {
		            return undefined;
		        }
		        var i = path.lastIndexOf(ts.directorySeparator);
		        return i < 0 ? path : path.substring(i + 1);
		    }

		    this.combinePaths = function(path1, path2) {
		        if (!(path1 && path1.length))
		            return path2;
		        if (!(path2 && path2.length))
		            return path1;
		        if (getRootLength(path2) !== 0)
		            return path2;
		        if (path1.charAt(path1.length - 1) === ts.directorySeparator)
		            return path1 + path2;
		        return path1 + ts.directorySeparator + path2;
		    }

		    this.fileExtensionIs = function(path, extension) {
		    	var pathLen = path.length;
		        var extLen = extension.length;
		        return pathLen > extLen && path.substr(pathLen - extLen, extLen) === extension;
		    }

		    this.supportedTypeScriptExtensions = [".ts", ".tsx", ".d.ts"];
		    this.supportedJavascriptExtensions = [".js", ".jsx"];
		    var allSupportedExtensions = ts.supportedTypeScriptExtensions.concat(ts.supportedJavascriptExtensions);
		    this.getSupportedExtensions = function(options) {
		    	return options && options.allowJs ? allSupportedExtensions : ts.supportedTypeScriptExtensions;
		    }
		    this.isSupportedSourceFileName = function(fileName, compilerOptions) {
		        if (!fileName) {
		            return false;
		        }
		        for (var _i = 0, _a = getSupportedExtensions(compilerOptions); _i < _a.length; _i++) {
		            var extension = _a[_i];
		            if (fileExtensionIs(fileName, extension)) {
		                return true;
		            }
		        }
		        return false;
		    }
		    var extensionsToRemove = [".d.ts", ".ts", ".js", ".tsx", ".jsx"];
		    this.removeFileExtension = function(path) {
		        for (var _i = 0, extensionsToRemove_1 = extensionsToRemove; _i < extensionsToRemove_1.length; _i++) {
		            var ext = extensionsToRemove_1[_i];
		            if (fileExtensionIs(path, ext)) {
		                return path.substr(0, path.length - ext.length);
		            }
		        }
		        return path;
		    }
		    

		    this.copyListRemovingItem = function(item, list) {
		        var copiedList = [];
		        for (var _i = 0, list_1 = list; _i < list_1.length; _i++) {
		            var e = list_1[_i];
		            if (e !== item) {
		                copiedList.push(e);
		            }
		        }
		        return copiedList;
		    }

		    this.createGetCanonicalFileName = function(useCaseSensitivefileNames) {
		        return useCaseSensitivefileNames
		            ? (function (fileName) { return fileName; })
		            : (function (fileName) { return fileName.toLowerCase(); });
		    }

 		}).call(module.exports);




 		});
})(typeof define === "function"? define: function(name, reqs, factory) {factory(require, exports, module); });
