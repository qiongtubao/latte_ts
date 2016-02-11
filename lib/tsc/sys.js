(function(define) {'use strict'
	define("latte_ts/tsc/sys", ["require", "exports", "module", "window"],
 	function(require, exports, module, window) {
 		
 		var sys = (function(){
 			function getWScriptSystem() {
	            var fso = new ActiveXObject("Scripting.FileSystemObject");
	            var fileStream = new ActiveXObject("ADODB.Stream");
	            fileStream.Type = 2;
	            var binaryStream = new ActiveXObject("ADODB.Stream");
	            binaryStream.Type = 1;
	            var args = [];
	            for (var i = 0; i < WScript.Arguments.length; i++) {
	                args[i] = WScript.Arguments.Item(i);
	            }
	            function readFile(fileName, encoding) {
	                if (!fso.FileExists(fileName)) {
	                    return undefined;
	                }
	                fileStream.Open();
	                try {
	                    if (encoding) {
	                        fileStream.Charset = encoding;
	                        fileStream.LoadFromFile(fileName);
	                    }
	                    else {
	                        fileStream.Charset = "x-ansi";
	                        fileStream.LoadFromFile(fileName);
	                        var bom = fileStream.ReadText(2) || "";
	                        fileStream.Position = 0;
	                        fileStream.Charset = bom.length >= 2 && (bom.charCodeAt(0) === 0xFF && bom.charCodeAt(1) === 0xFE || bom.charCodeAt(0) === 0xFE && bom.charCodeAt(1) === 0xFF) ? "unicode" : "utf-8";
	                    }
	                    return fileStream.ReadText();
	                }
	                catch (e) {
	                    throw e;
	                }
	                finally {
	                    fileStream.Close();
	                }
	            }
	            function writeFile(fileName, data, writeByteOrderMark) {
	                fileStream.Open();
	                binaryStream.Open();
	                try {
	                    fileStream.Charset = "utf-8";
	                    fileStream.WriteText(data);
	                    if (writeByteOrderMark) {
	                        fileStream.Position = 0;
	                    }
	                    else {
	                        fileStream.Position = 3;
	                    }
	                    fileStream.CopyTo(binaryStream);
	                    binaryStream.SaveToFile(fileName, 2);
	                }
	                finally {
	                    binaryStream.Close();
	                    fileStream.Close();
	                }
	            }
	            function getCanonicalPath(path) {
	                return path.toLowerCase();
	            }
	            function getNames(collection) {
	                var result = [];
	                for (var e = new Enumerator(collection); !e.atEnd(); e.moveNext()) {
	                    result.push(e.item().Name);
	                }
	                return result.sort();
	            }
	            function readDirectory(path, extension, exclude) {
	                var result = [];
	                exclude = ts.map(exclude, function (s) { return getCanonicalPath(ts.combinePaths(path, s)); });
	                visitDirectory(path);
	                return result;
	                function visitDirectory(path) {
	                    var folder = fso.GetFolder(path || ".");
	                    var files = getNames(folder.files);
	                    for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
	                        var current = files_1[_i];
	                        var name_1 = ts.combinePaths(path, current);
	                        if ((!extension || ts.fileExtensionIs(name_1, extension)) && !ts.contains(exclude, getCanonicalPath(name_1))) {
	                            result.push(name_1);
	                        }
	                    }
	                    var subfolders = getNames(folder.subfolders);
	                    for (var _a = 0, subfolders_1 = subfolders; _a < subfolders_1.length; _a++) {
	                        var current = subfolders_1[_a];
	                        var name_2 = ts.combinePaths(path, current);
	                        if (!ts.contains(exclude, getCanonicalPath(name_2))) {
	                            visitDirectory(name_2);
	                        }
	                    }
	                }
	            }
	            return {
	                args: args,
	                newLine: "\r\n",
	                useCaseSensitiveFileNames: false,
	                write: function (s) {
	                    WScript.StdOut.Write(s);
	                },
	                readFile: readFile,
	                writeFile: writeFile,
	                resolvePath: function (path) {
	                    return fso.GetAbsolutePathName(path);
	                },
	                fileExists: function (path) {
	                    return fso.FileExists(path);
	                },
	                directoryExists: function (path) {
	                    return fso.FolderExists(path);
	                },
	                createDirectory: function (directoryName) {
	                    if (!this.directoryExists(directoryName)) {
	                        fso.CreateFolder(directoryName);
	                    }
	                },
	                getExecutingFilePath: function () {
	                    return WScript.ScriptFullName;
	                },
	                getCurrentDirectory: function () {
	                    return new ActiveXObject("WScript.Shell").CurrentDirectory;
	                },
	                readDirectory: readDirectory,
	                exit: function (exitCode) {
	                    try {
	                        WScript.Quit(exitCode);
	                    }
	                    catch (e) {
	                    }
	                }
	            };
	        }


	        function getNodeSystem() {
	            var _fs = require("fs");
	            var _path = require("path");
	            var _os = require("os");
	            function createPollingWatchedFileSet(interval, chunkSize) {
	                if (interval === void 0) { interval = 2500; }
	                if (chunkSize === void 0) { chunkSize = 30; }
	                var watchedFiles = [];
	                var nextFileToCheck = 0;
	                var watchTimer;
	                function getModifiedTime(fileName) {
	                    return _fs.statSync(fileName).mtime;
	                }
	                function poll(checkedIndex) {
	                    var watchedFile = watchedFiles[checkedIndex];
	                    if (!watchedFile) {
	                        return;
	                    }
	                    _fs.stat(watchedFile.filePath, function (err, stats) {
	                        if (err) {
	                            watchedFile.callback(watchedFile.filePath);
	                        }
	                        else if (watchedFile.mtime.getTime() !== stats.mtime.getTime()) {
	                            watchedFile.mtime = getModifiedTime(watchedFile.filePath);
	                            watchedFile.callback(watchedFile.filePath, watchedFile.mtime.getTime() === 0);
	                        }
	                    });
	                }
	                function startWatchTimer() {
	                    watchTimer = setInterval(function () {
	                        var count = 0;
	                        var nextToCheck = nextFileToCheck;
	                        var firstCheck = -1;
	                        while ((count < chunkSize) && (nextToCheck !== firstCheck)) {
	                            poll(nextToCheck);
	                            if (firstCheck < 0) {
	                                firstCheck = nextToCheck;
	                            }
	                            nextToCheck++;
	                            if (nextToCheck === watchedFiles.length) {
	                                nextToCheck = 0;
	                            }
	                            count++;
	                        }
	                        nextFileToCheck = nextToCheck;
	                    }, interval);
	                }
	                function addFile(filePath, callback) {
	                    var file = {
	                        filePath: filePath,
	                        callback: callback,
	                        mtime: getModifiedTime(filePath)
	                    };
	                    watchedFiles.push(file);
	                    if (watchedFiles.length === 1) {
	                        startWatchTimer();
	                    }
	                    return file;
	                }
	                function removeFile(file) {
	                    watchedFiles = ts.copyListRemovingItem(file, watchedFiles);
	                }
	                return {
	                    getModifiedTime: getModifiedTime,
	                    poll: poll,
	                    startWatchTimer: startWatchTimer,
	                    addFile: addFile,
	                    removeFile: removeFile
	                };
	            }
	            function createWatchedFileSet() {
	                var dirWatchers = ts.createFileMap();
	                var fileWatcherCallbacks = ts.createFileMap();
	                return { addFile: addFile, removeFile: removeFile };
	                function reduceDirWatcherRefCountForFile(filePath) {
	                    var dirPath = ts.getDirectoryPath(filePath);
	                    if (dirWatchers.contains(dirPath)) {
	                        var watcher = dirWatchers.get(dirPath);
	                        watcher.referenceCount -= 1;
	                        if (watcher.referenceCount <= 0) {
	                            watcher.close();
	                            dirWatchers.remove(dirPath);
	                        }
	                    }
	                }
	                function addDirWatcher(dirPath) {
	                    if (dirWatchers.contains(dirPath)) {
	                        var watcher_1 = dirWatchers.get(dirPath);
	                        watcher_1.referenceCount += 1;
	                        return;
	                    }
	                    var watcher = _fs.watch(dirPath, { persistent: true }, function (eventName, relativeFileName) { return fileEventHandler(eventName, relativeFileName, dirPath); });
	                    watcher.referenceCount = 1;
	                    dirWatchers.set(dirPath, watcher);
	                    return;
	                }
	                function addFileWatcherCallback(filePath, callback) {
	                    if (fileWatcherCallbacks.contains(filePath)) {
	                        fileWatcherCallbacks.get(filePath).push(callback);
	                    }
	                    else {
	                        fileWatcherCallbacks.set(filePath, [callback]);
	                    }
	                }
	                function addFile(filePath, callback) {
	                    addFileWatcherCallback(filePath, callback);
	                    addDirWatcher(ts.getDirectoryPath(filePath));
	                    return { filePath: filePath, callback: callback };
	                }
	                function removeFile(watchedFile) {
	                    removeFileWatcherCallback(watchedFile.filePath, watchedFile.callback);
	                    reduceDirWatcherRefCountForFile(watchedFile.filePath);
	                }
	                function removeFileWatcherCallback(filePath, callback) {
	                    if (fileWatcherCallbacks.contains(filePath)) {
	                        var newCallbacks = ts.copyListRemovingItem(callback, fileWatcherCallbacks.get(filePath));
	                        if (newCallbacks.length === 0) {
	                            fileWatcherCallbacks.remove(filePath);
	                        }
	                        else {
	                            fileWatcherCallbacks.set(filePath, newCallbacks);
	                        }
	                    }
	                }
	                function fileEventHandler(eventName, relativeFileName, baseDirPath) {
	                    var filePath = typeof relativeFileName !== "string"
	                        ? undefined
	                        : ts.toPath(relativeFileName, baseDirPath, ts.createGetCanonicalFileName(ts.sys.useCaseSensitiveFileNames));
	                    if (eventName === "change" && fileWatcherCallbacks.contains(filePath)) {
	                        for (var _i = 0, _a = fileWatcherCallbacks.get(filePath); _i < _a.length; _i++) {
	                            var fileCallback = _a[_i];
	                            fileCallback(filePath);
	                        }
	                    }
	                }
	            }
	            var pollingWatchedFileSet = createPollingWatchedFileSet();
	            var watchedFileSet = createWatchedFileSet();
	            function isNode4OrLater() {
	                return parseInt(process.version.charAt(1)) >= 4;
	            }
	            var platform = _os.platform();
	            var useCaseSensitiveFileNames = platform !== "win32" && platform !== "win64" && platform !== "darwin";
	            function readFile(fileName, encoding) {
	                if (!_fs.existsSync(fileName)) {
	                    return undefined;
	                }
	                var buffer = _fs.readFileSync(fileName);
	                var len = buffer.length;
	                if (len >= 2 && buffer[0] === 0xFE && buffer[1] === 0xFF) {
	                    len &= ~1;
	                    for (var i = 0; i < len; i += 2) {
	                        var temp = buffer[i];
	                        buffer[i] = buffer[i + 1];
	                        buffer[i + 1] = temp;
	                    }
	                    return buffer.toString("utf16le", 2);
	                }
	                if (len >= 2 && buffer[0] === 0xFF && buffer[1] === 0xFE) {
	                    return buffer.toString("utf16le", 2);
	                }
	                if (len >= 3 && buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) {
	                    return buffer.toString("utf8", 3);
	                }
	                return buffer.toString("utf8");
	            }
	            function writeFile(fileName, data, writeByteOrderMark) {
	                if (writeByteOrderMark) {
	                    data = "\uFEFF" + data;
	                }
	                var fd;
	                try {
	                    fd = _fs.openSync(fileName, "w");
	                    _fs.writeSync(fd, data, undefined, "utf8");
	                }
	                finally {
	                    if (fd !== undefined) {
	                        _fs.closeSync(fd);
	                    }
	                }
	            }
	            function getCanonicalPath(path) {
	                return useCaseSensitiveFileNames ? path : path.toLowerCase();
	            }
	            function readDirectory(path, extension, exclude) {
	                var result = [];
	                exclude = ts.map(exclude, function (s) { return getCanonicalPath(ts.combinePaths(path, s)); });
	                visitDirectory(path);
	                return result;
	                function visitDirectory(path) {
	                    var files = _fs.readdirSync(path || ".").sort();
	                    var directories = [];
	                    for (var _i = 0, files_2 = files; _i < files_2.length; _i++) {
	                        var current = files_2[_i];
	                        var name_3 = ts.combinePaths(path, current);
	                        if (!ts.contains(exclude, getCanonicalPath(name_3))) {
	                            var stat = _fs.statSync(name_3);
	                            if (stat.isFile()) {
	                                if (!extension || ts.fileExtensionIs(name_3, extension)) {
	                                    result.push(name_3);
	                                }
	                            }
	                            else if (stat.isDirectory()) {
	                                directories.push(name_3);
	                            }
	                        }
	                    }
	                    for (var _a = 0, directories_1 = directories; _a < directories_1.length; _a++) {
	                        var current = directories_1[_a];
	                        visitDirectory(current);
	                    }
	                }
	            }
	            return {
	                args: process.argv.slice(2),
	                newLine: _os.EOL,
	                useCaseSensitiveFileNames: useCaseSensitiveFileNames,
	                write: function (s) {
	                    process.stdout.write(s);
	                },
	                readFile: readFile,
	                writeFile: writeFile,
	                watchFile: function (filePath, callback) {
	                    var watchSet = isNode4OrLater() ? watchedFileSet : pollingWatchedFileSet;
	                    var watchedFile = watchSet.addFile(filePath, callback);
	                    return {
	                        close: function () { return watchSet.removeFile(watchedFile); }
	                    };
	                },
	                watchDirectory: function (path, callback, recursive) {
	                    var options;
	                    if (isNode4OrLater() && (process.platform === "win32" || process.platform === "darwin")) {
	                        options = { persistent: true, recursive: !!recursive };
	                    }
	                    else {
	                        options = { persistent: true };
	                    }
	                    return _fs.watch(path, options, function (eventName, relativeFileName) {
	                        if (eventName === "rename") {
	                            callback(!relativeFileName ? relativeFileName : ts.normalizePath(ts.combinePaths(path, relativeFileName)));
	                        }
	                        ;
	                    });
	                },
	                resolvePath: function (path) {
	                    return _path.resolve(path);
	                },
	                fileExists: function (path) {
	                    return _fs.existsSync(path);
	                },
	                directoryExists: function (path) {
	                    return _fs.existsSync(path) && _fs.statSync(path).isDirectory();
	                },
	                createDirectory: function (directoryName) {
	                    if (!this.directoryExists(directoryName)) {
	                        _fs.mkdirSync(directoryName);
	                    }
	                },
	                getExecutingFilePath: function () {
	                    return __filename;
	                },
	                getCurrentDirectory: function () {
	                    return process.cwd();
	                },
	                readDirectory: readDirectory,
	                getMemoryUsage: function () {
	                    if (global.gc) {
	                        global.gc();
	                    }
	                    return process.memoryUsage().heapUsed;
	                },
	                exit: function (exitCode) {
	                    process.exit(exitCode);
	                }
	            };
	        }

	        function getChakraSystem() {
	            return {
	                newLine: ChakraHost.newLine || "\r\n",
	                args: ChakraHost.args,
	                useCaseSensitiveFileNames: !!ChakraHost.useCaseSensitiveFileNames,
	                write: ChakraHost.echo,
	                readFile: function (path, encoding) {
	                    return ChakraHost.readFile(path);
	                },
	                writeFile: function (path, data, writeByteOrderMark) {
	                    if (writeByteOrderMark) {
	                        data = "\uFEFF" + data;
	                    }
	                    ChakraHost.writeFile(path, data);
	                },
	                resolvePath: ChakraHost.resolvePath,
	                fileExists: ChakraHost.fileExists,
	                directoryExists: ChakraHost.directoryExists,
	                createDirectory: ChakraHost.createDirectory,
	                getExecutingFilePath: function () { return ChakraHost.executingFile; },
	                getCurrentDirectory: function () { return ChakraHost.currentDirectory; },
	                readDirectory: ChakraHost.readDirectory,
	                exit: ChakraHost.quit
	            };
	        }
	        if(typeof WScript !== "undefined" && typeof ActiveXObject === "function") {
	        	return getWScriptSystem();
	        }else if(typeof process !== "undefined" && process.nextTick && !process.browser && typeof require !== "undefined") {
	        	return getNodeSystem();
	        }else if(typeof ChakraHost !== "undefined") {
	        	return getChakraSystem();
	        }else{
	        	return undefined;
	        }

 		})();
 		module.exports = sys;
 	});
})(typeof define === "function"? define: function(name, reqs, factory) {factory(require, exports, module); });
