(function(define) {'use strict'
	define("latte_ts/tsc/stringWriters", ["require", "exports", "module", "window"],
 	function(require, exports, module, window) {
 		(function() {
 			this.getDeclarationOfKind = function(symbol, kind) {
		        var declarations = symbol.declarations;
		        if (declarations) {
		            for (var _i = 0, declarations_1 = declarations; _i < declarations_1.length; _i++) {
		                var declaration = declarations_1[_i];
		                if (declaration.kind === kind) {
		                    return declaration;
		                }
		            }
		        }
		        return undefined;
		    }
		    var stringWriters = [];
		    this.getSingleLineStringWriter = function() {
		        if (stringWriters.length === 0) {
		            var str = "";
		            var writeText = function (text) { return str += text; };
		            return {
		                string: function () { return str; },
		                writeKeyword: writeText,
		                writeOperator: writeText,
		                writePunctuation: writeText,
		                writeSpace: writeText,
		                writeStringLiteral: writeText,
		                writeParameter: writeText,
		                writeSymbol: writeText,
		                writeLine: function () { return str += " "; },
		                increaseIndent: function () { },
		                decreaseIndent: function () { },
		                clear: function () { return str = ""; },
		                trackSymbol: function () { },
		                reportInaccessibleThisError: function () { }
		            };
		        }
		        return stringWriters.pop();
		    }
		    this.releaseStringWriter = function(writer) {
		        writer.clear();
		        stringWriters.push(writer);
		    }
		    this.getFullWidth = function(node) {
		    	return node.end - node.pos;
		    }
		    this.arrayIsEqualTo = function(array1, array2, equaler) {
		        if (!array1 || !array2) {
		            return array1 === array2;
		        }
		        if (array1.length !== array2.length) {
		            return false;
		        }
		        for (var i = 0; i < array1.length; i++) {
		            var equals = equaler ? equaler(array1[i], array2[i]) : array1[i] === array2[i];
		            if (!equals) {
		                return false;
		            }
		        }
		        return true;
		    }
		    this.hasResolvedModule = function(sourceFile, moduleNameText) {
		    	return sourceFile.resolvedModules && ts.hasProperty(sourceFile.resolvedModules, moduleNameText);
		    }
		    this.getResolvedModule = function(sourceFile, moduleNameText) {
		    	return hasResolvedModule(sourceFile, moduleNameText) ? sourceFile.resolvedModules[moduleNameText] : undefined;
		    }
		    this.setResolvedModule = function(sourceFile, moduleNameText, resolvedModule) {
		        if (!sourceFile.resolvedModules) {
		            sourceFile.resolvedModules = {};
		        }
		        sourceFile.resolvedModules[moduleNameText] = resolvedModule;
		    }
		    	function aggregateChildData(node) {
			        if (!(node.parserContextFlags & 128)) {
			            var thisNodeOrAnySubNodesHasError = ((node.parserContextFlags & 16) !== 0) ||
			                ts.forEachChild(node, containsParseError);
			            if (thisNodeOrAnySubNodesHasError) {
			                node.parserContextFlags |= 64;
			            }
			            node.parserContextFlags |= 128;
			        }
			    }
		    this.containsParseError = function(node) {
		        aggregateChildData(node);
		        return (node.parserContextFlags & 64) !== 0;
		    }
		    this.getSourceFileOfNode = function(node) {
		    	while(node && node.kind !== 251) {
		    		node = node.parent;
		    	}
		    	return node;
		    }
		    this.getStartPositionOfLine = function(line, sourceFile) {
		        ts.Debug.assert(line >= 0);
		        return ts.getLineStarts(sourceFile)[line];
		    }
		    this.nodePosToString = function(node) {
		        var file = getSourceFileOfNode(node);
		        var loc = ts.getLineAndCharacterOfPosition(file, node.pos);
		        return file.fileName + "(" + (loc.line + 1) + "," + (loc.character + 1) + ")";
		    }
		    this.getStartPosOfNode = function(node) {
		        return node.pos;
		    }
		    this.nodeIsMissing = function(node) {
		    	if (!node) {
		            return true;
		        }
		        return node.pos === node.end && node.pos >= 0 && node.kind !== 1;
		    }
		    this.nodeIsPresent = function(node) {
		    	 return !nodeIsMissing(node);
		    }
		    this.getTokenPosOfNode = function(node, sourceFile) {
		        if (nodeIsMissing(node)) {
		            return node.pos;
		        }
		        return ts.skipTrivia((sourceFile || getSourceFileOfNode(node)).text, node.pos);
		    }
		    this.getNonDecoratorTokenPosOfNode = function(node, sourceFile) {
		        if (nodeIsMissing(node) || !node.decorators) {
		            return getTokenPosOfNode(node, sourceFile);
		        }
		        return ts.skipTrivia((sourceFile || getSourceFileOfNode(node)).text, node.decorators.end);
		    }
		    this.getSourceTextOfNodeFromSourceFile = function(sourceFile, node, includeTrivia) {
		        if (includeTrivia === void 0) { includeTrivia = false; }
		        if (nodeIsMissing(node)) {
		            return "";
		        }
		        var text = sourceFile.text;
		        return text.substring(includeTrivia ? node.pos : ts.skipTrivia(text, node.pos), node.end);
		    }
		    this.getTextOfNodeFromSourceText = function(sourceText, node) {
		        if (nodeIsMissing(node)) {
		            return "";
		        }
		        return sourceText.substring(ts.skipTrivia(sourceText, node.pos), node.end);
		    }
		    this.getTextOfNode = function(node, includeTrivia) {
		        if (includeTrivia === void 0) { includeTrivia = false; }
		        return getSourceTextOfNodeFromSourceFile(getSourceFileOfNode(node), node, includeTrivia);
		    }
		    this.escapeIdentifier = function(identifier) {
		        return identifier.length >= 2 && identifier.charCodeAt(0) === 95 && identifier.charCodeAt(1) === 95 ? "_" + identifier : identifier;
		    }
		    this.unescapeIdentifier = function(identifier) {
		        return identifier.length >= 3 && identifier.charCodeAt(0) === 95 && identifier.charCodeAt(1) === 95 && identifier.charCodeAt(2) === 95 ? identifier.substr(1) : identifier;
		    }
		    this.makeIdentifierFromModuleName = function(moduleName) {
		        return ts.getBaseFileName(moduleName).replace(/^(\d)/, "_$1").replace(/\W/g, "_");
		    }
		    this.isBlockOrCatchScoped = function(declaration) {
		        return (getCombinedNodeFlags(declaration) & 24576) !== 0 ||
		            isCatchClauseVariableDeclaration(declaration);
		    }
		    this.isAmbientModule = function(node) {
		        return node && node.kind === 221 &&
		            (node.name.kind === 9 || isGlobalScopeAugmentation(node));
		    }
		    this.isGlobalScopeAugmentation = function(module) {
		        return !!(module.flags & 2097152);
		    }

		    this.isExternalModuleAugmentation = function(node) {
		        if (!node || !isAmbientModule(node)) {
		            return false;
		        }
		        switch (node.parent.kind) {
		            case 251:
		                return isExternalModule(node.parent);
		            case 222:
		                return isAmbientModule(node.parent.parent) && !isExternalModule(node.parent.parent.parent);
		        }
		        return false;
		    }
		    this.getEnclosingBlockScopeContainer = function(node) {
		        var current = node.parent;
		        while (current) {
		            if (isFunctionLike(current)) {
		                return current;
		            }
		            switch (current.kind) {
		                case 251:
		                case 223:
		                case 247:
		                case 221:
		                case 202:
		                case 203:
		                case 204:
		                    return current;
		                case 195:
		                    if (!isFunctionLike(current.parent)) {
		                        return current;
		                    }
		            }
		            current = current.parent;
		        }
		    }

		    this.isCatchClauseVariableDeclaration = function(declaration) {
		        return declaration &&
		            declaration.kind === 214 &&
		            declaration.parent &&
		            declaration.parent.kind === 247;
		    }
		    this.declarationNameToString = function(name) {
		        return getFullWidth(name) === 0 ? "(Missing)" : getTextOfNode(name);
		    }
		    this.createDiagnosticForNode = function(node, message, arg0, arg1, arg2) {
		        var sourceFile = getSourceFileOfNode(node);
		        var span = getErrorSpanForNode(sourceFile, node);
		        return ts.createFileDiagnostic(sourceFile, span.start, span.length, message, arg0, arg1, arg2);
		    }
		    this.createDiagnosticForNodeFromMessageChain = function(node, messageChain) {
		        var sourceFile = getSourceFileOfNode(node);
		        var span = getErrorSpanForNode(sourceFile, node);
		        return {
		            file: sourceFile,
		            start: span.start,
		            length: span.length,
		            code: messageChain.code,
		            category: messageChain.category,
		            messageText: messageChain.next ? messageChain : messageChain.messageText
		        };
		    }

		    this.getSpanOfTokenAtPosition = function(sourceFile, pos) {
		        var scanner = ts.createScanner(sourceFile.languageVersion, true, sourceFile.languageVariant, sourceFile.text, undefined, pos);
		        scanner.scan();
		        var start = scanner.getTokenPos();
		        return ts.createTextSpanFromBounds(start, scanner.getTextPos());
		    }

		    this.getErrorSpanForNode = function(sourceFile, node) {
		        var errorNode = node;
		        switch (node.kind) {
		            case 251:
		                var pos_1 = ts.skipTrivia(sourceFile.text, 0, false);
		                if (pos_1 === sourceFile.text.length) {
		                    return ts.createTextSpan(0, 0);
		                }
		                return getSpanOfTokenAtPosition(sourceFile, pos_1);
		            case 214:
		            case 166:
		            case 217:
		            case 189:
		            case 218:
		            case 221:
		            case 220:
		            case 250:
		            case 216:
		            case 176:
		            case 144:
		            case 219:
		                errorNode = node.name;
		                break;
		        }
		        if (errorNode === undefined) {
		            return getSpanOfTokenAtPosition(sourceFile, node.pos);
		        }
		        var pos = nodeIsMissing(errorNode)
		            ? errorNode.pos
		            : ts.skipTrivia(sourceFile.text, errorNode.pos);
		        return ts.createTextSpanFromBounds(pos, errorNode.end);
		    }
		    this.isExternalModule = function(file) {
		        return file.externalModuleIndicator !== undefined;
		    }

		    this.isExternalOrCommonJsModule = function(file) {
		        return (file.externalModuleIndicator || file.commonJsModuleIndicator) !== undefined;
		    }

		    this.isDeclarationFile = function(file) {
		        return (file.flags & 4096) !== 0;
		    }

		    this.isConstEnumDeclaration = function(node) {
		        return node.kind === 220 && isConst(node);
		    }

		    this.walkUpBindingElementsAndPatterns = function(node) {
		        while (node && (node.kind === 166 || isBindingPattern(node))) {
		            node = node.parent;
		        }
		        return node;
		    }
		    this.getCombinedNodeFlags = function(node) {
		        node = walkUpBindingElementsAndPatterns(node);
		        var flags = node.flags;
		        if (node.kind === 214) {
		            node = node.parent;
		        }
		        if (node && node.kind === 215) {
		            flags |= node.flags;
		            node = node.parent;
		        }
		        if (node && node.kind === 196) {
		            flags |= node.flags;
		        }
		        return flags;
		    }
		    this.isConst = function(node) {
		        return !!(getCombinedNodeFlags(node) & 16384);
		    }
		    this.isLet = function(node) {
		        return !!(getCombinedNodeFlags(node) & 8192);
		    }
		    this.isPrologueDirective = function(node) {
		        return node.kind === 198 && node.expression.kind === 9;
		    }
		    this.getLeadingCommentRangesOfNode = function(node, sourceFileOfNode) {
		        return ts.getLeadingCommentRanges(sourceFileOfNode.text, node.pos);
		    }
		    this.getLeadingCommentRangesOfNodeFromText = function(node, text) {
		        return ts.getLeadingCommentRanges(text, node.pos);
		    }
		    this.getJsDocComments = function(node, sourceFileOfNode) {
		        return getJsDocCommentsFromText(node, sourceFileOfNode.text);
		    }
		    this.getJsDocCommentsFromText = function(node, text) {
		        var commentRanges = (node.kind === 139 || node.kind === 138) ?
		            ts.concatenate(ts.getTrailingCommentRanges(text, node.pos), ts.getLeadingCommentRanges(text, node.pos)) :
		            getLeadingCommentRangesOfNodeFromText(node, text);
		        return ts.filter(commentRanges, isJsDocComment);
		        function isJsDocComment(comment) {
		            return text.charCodeAt(comment.pos + 1) === 42 &&
		                text.charCodeAt(comment.pos + 2) === 42 &&
		                text.charCodeAt(comment.pos + 3) !== 47;
		        }
		    }
		    this.fullTripleSlashReferencePathRegEx = /^(\/\/\/\s*<reference\s+path\s*=\s*)('|")(.+?)\2.*?\/>/;
    		this.fullTripleSlashAMDReferencePathRegEx = /^(\/\/\/\s*<amd-dependency\s+path\s*=\s*)('|")(.+?)\2.*?\/>/);
			this.isTypeNode = function(node) {
		        if (151 <= node.kind && node.kind <= 163) {
		            return true;
		        }
		        switch (node.kind) {
		            case 117:
		            case 128:
		            case 130:
		            case 120:
		            case 131:
		                return true;
		            case 103:
		                return node.parent.kind !== 180;
		            case 191:
		                return !isExpressionWithTypeArgumentsInClassExtendsClause(node);
		            case 69:
		                if (node.parent.kind === 136 && node.parent.right === node) {
		                    node = node.parent;
		                }
		                else if (node.parent.kind === 169 && node.parent.name === node) {
		                    node = node.parent;
		                }
		                ts.Debug.assert(node.kind === 69 || node.kind === 136 || node.kind === 169, "'node' was expected to be a qualified name, identifier or property access in 'isTypeNode'.");
		            case 136:
		            case 169:
		            case 97:
		                var parent_1 = node.parent;
		                if (parent_1.kind === 155) {
		                    return false;
		                }
		                if (151 <= parent_1.kind && parent_1.kind <= 163) {
		                    return true;
		                }
		                switch (parent_1.kind) {
		                    case 191:
		                        return !isExpressionWithTypeArgumentsInClassExtendsClause(parent_1);
		                    case 138:
		                        return node === parent_1.constraint;
		                    case 142:
		                    case 141:
		                    case 139:
		                    case 214:
		                        return node === parent_1.type;
		                    case 216:
		                    case 176:
		                    case 177:
		                    case 145:
		                    case 144:
		                    case 143:
		                    case 146:
		                    case 147:
		                        return node === parent_1.type;
		                    case 148:
		                    case 149:
		                    case 150:
		                        return node === parent_1.type;
		                    case 174:
		                        return node === parent_1.type;
		                    case 171:
		                    case 172:
		                        return parent_1.typeArguments && ts.indexOf(parent_1.typeArguments, node) >= 0;
		                    case 173:
		                        return false;
		                }
		        }
		        return false;
		    }
		    this.forEachReturnStatement = function(body, visitor) {
		        return traverse(body);
		        function traverse(node) {
		            switch (node.kind) {
		                case 207:
		                    return visitor(node);
		                case 223:
		                case 195:
		                case 199:
		                case 200:
		                case 201:
		                case 202:
		                case 203:
		                case 204:
		                case 208:
		                case 209:
		                case 244:
		                case 245:
		                case 210:
		                case 212:
		                case 247:
		                    return ts.forEachChild(node, traverse);
		            }
		        }
		    }
		    this.forEachYieldExpression = function(body, visitor) {
		        return traverse(body);
		        function traverse(node) {
		            switch (node.kind) {
		                case 187:
		                    visitor(node);
		                    var operand = node.expression;
		                    if (operand) {
		                        traverse(operand);
		                    }
		                case 220:
		                case 218:
		                case 221:
		                case 219:
		                case 217:
		                case 189:
		                    return;
		                default:
		                    if (isFunctionLike(node)) {
		                        var name_5 = node.name;
		                        if (name_5 && name_5.kind === 137) {
		                            traverse(name_5.expression);
		                            return;
		                        }
		                    }
		                    else if (!isTypeNode(node)) {
		                        ts.forEachChild(node, traverse);
		                    }
		            }
		        }
		    }
		    this.isVariableLike = function(node) {
		        if (node) {
		            switch (node.kind) {
		                case 166:
		                case 250:
		                case 139:
		                case 248:
		                case 142:
		                case 141:
		                case 249:
		                case 214:
		                    return true;
		            }
		        }
		        return false;
		    }
		    this.isAccessor = function(node) {
		    	return node && (node.kind === 146 || node.kind === 147);
		    }
		    this.isClassLike = function(node) {
		        return node && (node.kind === 217 || node.kind === 189);
		    }
		    this.isFunctionLike = function(node) {
		        return node && isFunctionLikeKind(node.kind);
		    }
		    this.isFunctionLikeKind = function(kind) {
		        switch (kind) {
		            case 145:
		            case 176:
		            case 216:
		            case 177:
		            case 144:
		            case 143:
		            case 146:
		            case 147:
		            case 148:
		            case 149:
		            case 150:
		            case 153:
		            case 154:
		                return true;
		        }
		    }
		    this.introducesArgumentsExoticObject = function(node) {
		        switch (node.kind) {
		            case 144:
		            case 143:
		            case 145:
		            case 146:
		            case 147:
		            case 216:
		            case 176:
		                return true;
		        }
		        return false;
		    }
		    this.isIterationStatement = function(node, lookInLabeledStatements) {
		        switch (node.kind) {
		            case 202:
		            case 203:
		            case 204:
		            case 200:
		            case 201:
		                return true;
		            case 210:
		                return lookInLabeledStatements && isIterationStatement(node.statement, lookInLabeledStatements);
		        }
		        return false;
		    }

		    this.isFunctionBlock = function(node) {
		        return node && node.kind === 195 && isFunctionLike(node.parent);
		    }
		    this.isObjectLiteralMethod = function(node) {
		        return node && node.kind === 144 && node.parent.kind === 168;
		    } 
		    this.isIdentifierTypePredicate = function(predicate) {
		        return predicate && predicate.kind === 1;
		    }
		    this.getContainingFunction = function(node) {
		        while (true) {
		            node = node.parent;
		            if (!node || isFunctionLike(node)) {
		                return node;
		            }
		        }
		    }
		    this.getContainingClass = function(node) {
		        while (true) {
		            node = node.parent;
		            if (!node || isClassLike(node)) {
		                return node;
		            }
		        }
		    }
		    this.getThisContainer = function(node, includeArrowFunctions) {
		        while (true) {
		            node = node.parent;
		            if (!node) {
		                return undefined;
		            }
		            switch (node.kind) {
		                case 137:
		                    if (isClassLike(node.parent.parent)) {
		                        return node;
		                    }
		                    node = node.parent;
		                    break;
		                case 140:
		                    if (node.parent.kind === 139 && isClassElement(node.parent.parent)) {
		                        node = node.parent.parent;
		                    }
		                    else if (isClassElement(node.parent)) {
		                        node = node.parent;
		                    }
		                    break;
		                case 177:
		                    if (!includeArrowFunctions) {
		                        continue;
		                    }
		                case 216:
		                case 176:
		                case 221:
		                case 142:
		                case 141:
		                case 144:
		                case 143:
		                case 145:
		                case 146:
		                case 147:
		                case 148:
		                case 149:
		                case 150:
		                case 220:
		                case 251:
		                    return node;
		            }
		        }
		    }
		    this.getSuperContainer = function(node, stopOnFunctions) {
		        while (true) {
		            node = node.parent;
		            if (!node) {
		                return node;
		            }
		            switch (node.kind) {
		                case 137:
		                    node = node.parent;
		                    break;
		                case 216:
		                case 176:
		                case 177:
		                    if (!stopOnFunctions) {
		                        continue;
		                    }
		                case 142:
		                case 141:
		                case 144:
		                case 143:
		                case 145:
		                case 146:
		                case 147:
		                    return node;
		                case 140:
		                    if (node.parent.kind === 139 && isClassElement(node.parent.parent)) {
		                        node = node.parent.parent;
		                    }
		                    else if (isClassElement(node.parent)) {
		                        node = node.parent;
		                    }
		                    break;
		            }
		        }
		    }
		    this.getEntityNameFromTypeNode = function(node) {
		        if (node) {
		            switch (node.kind) {
		                case 152:
		                    return node.typeName;
		                case 191:
		                    return node.expression;
		                case 69:
		                case 136:
		                    return node;
		            }
		        }
		        return undefined;
		    }
		    this.getInvokedExpression = function(node) {
		        if (node.kind === 173) {
		            return node.tag;
		        }
		        return node.expression;
		    }
		    this.nodeCanBeDecorated = function(node) {
		        switch (node.kind) {
		            case 217:
		                return true;
		            case 142:
		                return node.parent.kind === 217;
		            case 146:
		            case 147:
		            case 144:
		                return node.body !== undefined
		                    && node.parent.kind === 217;
		            case 139:
		                return node.parent.body !== undefined
		                    && (node.parent.kind === 145
		                        || node.parent.kind === 144
		                        || node.parent.kind === 147)
		                    && node.parent.parent.kind === 217;
		        }
		        return false;
		    }
		    this.nodeIsDecorated = function(node) {
		        return node.decorators !== undefined
		            && nodeCanBeDecorated(node);
		    }
		    this.isPropertyAccessExpression = function(node) {
		        return node.kind === 169;
		    }
		    this.isElementAccessExpression = function(node) {
		        return node.kind === 170;
		    }
		    this.isExpression = function(node) {
		        switch (node.kind) {
		            case 95:
		            case 93:
		            case 99:
		            case 84:
		            case 10:
		            case 167:
		            case 168:
		            case 169:
		            case 170:
		            case 171:
		            case 172:
		            case 173:
		            case 192:
		            case 174:
		            case 175:
		            case 176:
		            case 189:
		            case 177:
		            case 180:
		            case 178:
		            case 179:
		            case 182:
		            case 183:
		            case 184:
		            case 185:
		            case 188:
		            case 186:
		            case 11:
		            case 190:
		            case 236:
		            case 237:
		            case 187:
		            case 181:
		                return true;
		            case 136:
		                while (node.parent.kind === 136) {
		                    node = node.parent;
		                }
		                return node.parent.kind === 155;
		            case 69:
		                if (node.parent.kind === 155) {
		                    return true;
		                }
		            case 8:
		            case 9:
		            case 97:
		                var parent_2 = node.parent;
		                switch (parent_2.kind) {
		                    case 214:
		                    case 139:
		                    case 142:
		                    case 141:
		                    case 250:
		                    case 248:
		                    case 166:
		                        return parent_2.initializer === node;
		                    case 198:
		                    case 199:
		                    case 200:
		                    case 201:
		                    case 207:
		                    case 208:
		                    case 209:
		                    case 244:
		                    case 211:
		                    case 209:
		                        return parent_2.expression === node;
		                    case 202:
		                        var forStatement = parent_2;
		                        return (forStatement.initializer === node && forStatement.initializer.kind !== 215) ||
		                            forStatement.condition === node ||
		                            forStatement.incrementor === node;
		                    case 203:
		                    case 204:
		                        var forInStatement = parent_2;
		                        return (forInStatement.initializer === node && forInStatement.initializer.kind !== 215) ||
		                            forInStatement.expression === node;
		                    case 174:
		                    case 192:
		                        return node === parent_2.expression;
		                    case 193:
		                        return node === parent_2.expression;
		                    case 137:
		                        return node === parent_2.expression;
		                    case 140:
		                    case 243:
		                    case 242:
		                        return true;
		                    case 191:
		                        return parent_2.expression === node && isExpressionWithTypeArgumentsInClassExtendsClause(parent_2);
		                    default:
		                        if (isExpression(parent_2)) {
		                            return true;
		                        }
		                }
		        }
		        return false;
		    }
		    this.isExternalModuleNameRelative = function(moduleName) {
		        return moduleName.substr(0, 2) === "./" || moduleName.substr(0, 3) === "../" || moduleName.substr(0, 2) === ".\\" || moduleName.substr(0, 3) === "..\\";
		    }
		    this.isInstantiatedModule = function(node, preserveConstEnums) {
		        var moduleState = ts.getModuleInstanceState(node);
		        return moduleState === 1 ||
		            (preserveConstEnums && moduleState === 2);
    		}
    		this.isExternalModuleImportEqualsDeclaration = function(node) {
		        return node.kind === 224 && node.moduleReference.kind === 235;
		    }
		    this.getExternalModuleImportEqualsDeclarationExpression = function(node) {
		        ts.Debug.assert(isExternalModuleImportEqualsDeclaration(node));
		        return node.moduleReference.expression;
		    }
		    this.isInternalModuleImportEqualsDeclaration = function(node) {
		        return node.kind === 224 && node.moduleReference.kind !== 235;
		    }
		    this.isSourceFileJavaScript = function(file) {
		        return isInJavaScriptFile(file);
		    }
		    this.isInJavaScriptFile = function(node) {
		        return node && !!(node.parserContextFlags & 32);
		    }
		    this.isRequireCall = function(expression) {
		        return expression.kind === 171 &&
		            expression.expression.kind === 69 &&
		            expression.expression.text === "require" &&
		            expression.arguments.length === 1 &&
		            expression.arguments[0].kind === 9;
		    }
		    this.getSpecialPropertyAssignmentKind = function(expression) {
		        if (expression.kind !== 184) {
		            return 0;
		        }
		        var expr = expression;
		        if (expr.operatorToken.kind !== 56 || expr.left.kind !== 169) {
		            return 0;
		        }
		        var lhs = expr.left;
		        if (lhs.expression.kind === 69) {
		            var lhsId = lhs.expression;
		            if (lhsId.text === "exports") {
		                return 1;
		            }
		            else if (lhsId.text === "module" && lhs.name.text === "exports") {
		                return 2;
		            }
		        }
		        else if (lhs.expression.kind === 97) {
		            return 4;
		        }
		        else if (lhs.expression.kind === 169) {
		            var innerPropertyAccess = lhs.expression;
		            if (innerPropertyAccess.expression.kind === 69 && innerPropertyAccess.name.text === "prototype") {
		                return 3;
		            }
		        }
		        return 0;
		    }
		    this.getExternalModuleName = function(node) {
		        if (node.kind === 225) {
		            return node.moduleSpecifier;
		        }
		        if (node.kind === 224) {
		            var reference = node.moduleReference;
		            if (reference.kind === 235) {
		                return reference.expression;
		            }
		        }
		        if (node.kind === 231) {
		            return node.moduleSpecifier;
		        }
		        if (node.kind === 221 && node.name.kind === 9) {
		            return node.name;
		        }
		    }
		    this.hasQuestionToken = function(node) {
		        if (node) {
		            switch (node.kind) {
		                case 139:
		                case 144:
		                case 143:
		                case 249:
		                case 248:
		                case 142:
		                case 141:
		                    return node.questionToken !== undefined;
		            }
		        }
		        return false;
		    }
		    this.isJSDocConstructSignature = function(node) {
		        return node.kind === 264 &&
		            node.parameters.length > 0 &&
		            node.parameters[0].type.kind === 266;
		    }
		    this.getJSDocTag = function(node, kind) {
		        if (node && node.jsDocComment) {
		            for (var _i = 0, _a = node.jsDocComment.tags; _i < _a.length; _i++) {
		                var tag = _a[_i];
		                if (tag.kind === kind) {
		                    return tag;
		                }
		            }
		        }
		    }
		    this.getJSDocTypeTag = function(node) {
		        return getJSDocTag(node, 272);
		    }
		    this.getJSDocReturnTag = function(node) {
		        return getJSDocTag(node, 271);
		    }
		    this.getJSDocTemplateTag = function(node) {
		        return getJSDocTag(node, 273);
		    }
		    this.getCorrespondingJSDocParameterTag = function(parameter) {
		        if (parameter.name && parameter.name.kind === 69) {
		            var parameterName = parameter.name.text;
		            var docComment = parameter.parent.jsDocComment;
		            if (docComment) {
		                return ts.forEach(docComment.tags, function (t) {
		                    if (t.kind === 270) {
		                        var parameterTag = t;
		                        var name_6 = parameterTag.preParameterName || parameterTag.postParameterName;
		                        if (name_6.text === parameterName) {
		                            return t;
		                        }
		                    }
		                });
		            }
		        }
		    }
		    this.hasRestParameter = function(s) {
		        return isRestParameter(ts.lastOrUndefined(s.parameters));
		    }

		    this.isRestParameter = function(node) {
		        if (node) {
		            if (node.parserContextFlags & 32) {
		                if (node.type && node.type.kind === 265) {
		                    return true;
		                }
		                var paramTag = getCorrespondingJSDocParameterTag(node);
		                if (paramTag && paramTag.typeExpression) {
		                    return paramTag.typeExpression.type.kind === 265;
		                }
		            }
		            return node.dotDotDotToken !== undefined;
		        }
		        return false;
		    }

		    this.isLiteralKind = function(kind) {
		        return 8 <= kind && kind <= 11;
		    }

		    this.isTextualLiteralKind = function(kind) {
		        return kind === 9 || kind === 11;
		    }

		    this.isTemplateLiteralKind = function(kind) {
		        return 11 <= kind && kind <= 14;
		    }

		    this.isBindingPattern = function(node) {
		        return !!node && (node.kind === 165 || node.kind === 164);
		    }

		    this.isNodeDescendentOf = function(node, ancestor) {
		        while (node) {
		            if (node === ancestor)
		                return true;
		            node = node.parent;
		        }
		        return false;
		    }

		    this.isInAmbientContext = function(node) {
		        while (node) {
		            if (node.flags & (4 | 4096)) {
		                return true;
		            }
		            node = node.parent;
		        }
		        return false;
		    }

		    this.isDeclaration = function(node) {
		        switch (node.kind) {
		            case 177:
		            case 166:
		            case 217:
		            case 189:
		            case 145:
		            case 220:
		            case 250:
		            case 233:
		            case 216:
		            case 176:
		            case 146:
		            case 226:
		            case 224:
		            case 229:
		            case 218:
		            case 144:
		            case 143:
		            case 221:
		            case 227:
		            case 139:
		            case 248:
		            case 142:
		            case 141:
		            case 147:
		            case 249:
		            case 219:
		            case 138:
		            case 214:
		                return true;
		        }
		        return false;
		    }

		    this.isStatement = function(n) {
		        switch (n.kind) {
		            case 206:
		            case 205:
		            case 213:
		            case 200:
		            case 198:
		            case 197:
		            case 203:
		            case 204:
		            case 202:
		            case 199:
		            case 210:
		            case 207:
		            case 209:
		            case 211:
		            case 212:
		            case 196:
		            case 201:
		            case 208:
		            case 230:
		                return true;
		            default:
		                return false;
		        }
		    }

		    this.isClassElement = function(n) {
		        switch (n.kind) {
		            case 145:
		            case 142:
		            case 144:
		            case 146:
		            case 147:
		            case 143:
		            case 150:
		                return true;
		            default:
		                return false;
		        }
		    }
		    this.isDeclarationName = function(name) {
		        if (name.kind !== 69 && name.kind !== 9 && name.kind !== 8) {
		            return false;
		        }
		        var parent = name.parent;
		        if (parent.kind === 229 || parent.kind === 233) {
		            if (parent.propertyName) {
		                return true;
		            }
		        }
		        if (isDeclaration(parent)) {
		            return parent.name === name;
		        }
		        return false;
		    }
		    this.isIdentifierName = function(node) {
		        var parent = node.parent;
		        switch (parent.kind) {
		            case 142:
		            case 141:
		            case 144:
		            case 143:
		            case 146:
		            case 147:
		            case 250:
		            case 248:
		            case 169:
		                return parent.name === node;
		            case 136:
		                if (parent.right === node) {
		                    while (parent.kind === 136) {
		                        parent = parent.parent;
		                    }
		                    return parent.kind === 155;
		                }
		                return false;
		            case 166:
		            case 229:
		                return parent.propertyName === node;
		            case 233:
		                return true;
		        }
		        return false;
		    }

		    this.isAliasSymbolDeclaration = function(node) {
		    	return node.kind === 224 ||
		            node.kind === 226 && !!node.name ||
		            node.kind === 227 ||
		            node.kind === 229 ||
		            node.kind === 233 ||
		            node.kind === 230 && node.expression.kind === 69;
		    }

		    this.getClassExtendsHeritageClauseElement = function(node) {
		        var heritageClause = getHeritageClause(node.heritageClauses, 83);
		        return heritageClause && heritageClause.types.length > 0 ? heritageClause.types[0] : undefined;
		    }

		    this.getClassImplementsHeritageClauseElements = function(node) {
		        var heritageClause = getHeritageClause(node.heritageClauses, 106);
		        return heritageClause ? heritageClause.types : undefined;
		    }

		    this.getInterfaceBaseTypeNodes = function(node) {
		        var heritageClause = getHeritageClause(node.heritageClauses, 83);
		        return heritageClause ? heritageClause.types : undefined;
		    }

		    this.getHeritageClause = function(clauses, kind) {
		        if (clauses) {
		            for (var _i = 0, clauses_1 = clauses; _i < clauses_1.length; _i++) {
		                var clause = clauses_1[_i];
		                if (clause.token === kind) {
		                    return clause;
		                }
		            }
		        }
		        return undefined;
		    }

		    this.tryResolveScriptReference = function(host, sourceFile, reference) {
		        if (!host.getCompilerOptions().noResolve) {
		            var referenceFileName = ts.isRootedDiskPath(reference.fileName) ? reference.fileName : ts.combinePaths(ts.getDirectoryPath(sourceFile.fileName), reference.fileName);
		            return host.getSourceFile(referenceFileName);
		        }
		    }

		    this.getAncestor = function(node, kind) {
		        while (node) {
		            if (node.kind === kind) {
		                return node;
		            }
		            node = node.parent;
		        }
		        return undefined;
		    }

		    this.getFileReferenceFromReferencePath = function(comment, commentRange) {
		        var simpleReferenceRegEx = /^\/\/\/\s*<reference\s+/gim;
		        var isNoDefaultLibRegEx = /^(\/\/\/\s*<reference\s+no-default-lib\s*=\s*)('|")(.+?)\2\s*\/>/gim;
		        if (simpleReferenceRegEx.test(comment)) {
		            if (isNoDefaultLibRegEx.test(comment)) {
		                return {
		                    isNoDefaultLib: true
		                };
		            }
		            else {
		                var matchResult = ts.fullTripleSlashReferencePathRegEx.exec(comment);
		                if (matchResult) {
		                    var start = commentRange.pos;
		                    var end = commentRange.end;
		                    return {
		                        fileReference: {
		                            pos: start,
		                            end: end,
		                            fileName: matchResult[3]
		                        },
		                        isNoDefaultLib: false
		                    };
		                }
		                else {
		                    return {
		                        diagnosticMessage: ts.Diagnostics.Invalid_reference_directive_syntax,
		                        isNoDefaultLib: false
		                    };
		                }
		            }
		        }
		        return undefined;
		    }

		    this.isKeyword = function(token) {
		        return 70 <= token && token <= 135;
		    }

		    this.isTrivia = function(token) {
		        return 2 <= token && token <= 7;
		    }

		    this.isAsyncFunctionLike = function(node) {
		        return isFunctionLike(node) && (node.flags & 256) !== 0 && !isAccessor(node);
		    }

		    this.isStringOrNumericLiteral = function(kind) {
		        return kind === 9 || kind === 8;
		    }

		    this.hasDynamicName = function(declaration) {
		        return declaration.name && isDynamicName(declaration.name);
		    }

		    this.isDynamicName = function(name) {
		        return name.kind === 137 &&
		            !isStringOrNumericLiteral(name.expression.kind) &&
		            !isWellKnownSymbolSyntactically(name.expression);
		    }

		    this.isWellKnownSymbolSyntactically = function(node) {
		        return isPropertyAccessExpression(node) && isESSymbolIdentifier(node.expression);
		    }

		    this.getPropertyNameForPropertyNameNode = function(name) {
		        if (name.kind === 69 || name.kind === 9 || name.kind === 8) {
		            return name.text;
		        }
		        if (name.kind === 137) {
		            var nameExpression = name.expression;
		            if (isWellKnownSymbolSyntactically(nameExpression)) {
		                var rightHandSideName = nameExpression.name.text;
		                return getPropertyNameForKnownSymbolName(rightHandSideName);
		            }
		        }
		        return undefined;
		    }

		    this.getPropertyNameForKnownSymbolName = function(symbolName) {
		        return "__@" + symbolName;
		    }

		    this.isESSymbolIdentifier = function(node) {
		        return node.kind === 69 && node.text === "Symbol";
		    }

		    this.isModifierKind = function(token) {
		        switch (token) {
		            case 115:
		            case 118:
		            case 74:
		            case 122:
		            case 77:
		            case 82:
		            case 112:
		            case 110:
		            case 111:
		            case 113:
		                return true;
		        }
		        return false;
		    }

		    this.isParameterDeclaration = function(node) {
		        var root = getRootDeclaration(node);
		        return root.kind === 139;
		    }

		    this.getRootDeclaration = function(node) {
		        while (node.kind === 166) {
		            node = node.parent.parent;
		        }
		        return node;
		    }

		    this.nodeStartsNewLexicalEnvironment = function(n) {
		        return isFunctionLike(n) || n.kind === 221 || n.kind === 251;
		    }

		    this.cloneNode = function(node, location, flags, parent) {
		        var clone = location !== undefined
		            ? ts.createNode(node.kind, location.pos, location.end)
		            : createSynthesizedNode(node.kind);
		        for (var key in node) {
		            if (clone.hasOwnProperty(key) || !node.hasOwnProperty(key)) {
		                continue;
		            }
		            clone[key] = node[key];
		        }
		        if (flags !== undefined) {
		            clone.flags = flags;
		        }
		        if (parent !== undefined) {
		            clone.parent = parent;
		        }
		        return clone;
		    }

		    this.cloneEntityName = function(node, parent) {
		        var clone = cloneNode(node, node, node.flags, parent);
		        if (isQualifiedName(clone)) {
		            var left = clone.left, right = clone.right;
		            clone.left = cloneEntityName(left, clone);
		            clone.right = cloneNode(right, right, right.flags, parent);
		        }
		        return clone;
		    }

		    this.isQualifiedName = function(node) {
		        return node.kind === 136;
		    }

		    this.nodeIsSynthesized = function(node) {
		        return node.pos === -1;
		    }

		    this.createSynthesizedNode = function(kind, startsOnNewLine) {
		        var node = ts.createNode(kind, -1, -1);
		        node.startsOnNewLine = startsOnNewLine;
		        return node;
		    }

		    this.createSynthesizedNodeArray = function() {
		        var array = [];
		        array.pos = -1;
		        array.end = -1;
		        return array;
		    }

		    this.createDiagnosticCollection = function() {
		        var nonFileDiagnostics = [];
		        var fileDiagnostics = {};
		        var diagnosticsModified = false;
		        var modificationCount = 0;
		        return {
		            add: add,
		            getGlobalDiagnostics: getGlobalDiagnostics,
		            getDiagnostics: getDiagnostics,
		            getModificationCount: getModificationCount,
		            reattachFileDiagnostics: reattachFileDiagnostics
		        };
		        function getModificationCount() {
		            return modificationCount;
		        }
		        function reattachFileDiagnostics(newFile) {
		            if (!ts.hasProperty(fileDiagnostics, newFile.fileName)) {
		                return;
		            }
		            for (var _i = 0, _a = fileDiagnostics[newFile.fileName]; _i < _a.length; _i++) {
		                var diagnostic = _a[_i];
		                diagnostic.file = newFile;
		            }
		        }
		        function add(diagnostic) {
		            var diagnostics;
		            if (diagnostic.file) {
		                diagnostics = fileDiagnostics[diagnostic.file.fileName];
		                if (!diagnostics) {
		                    diagnostics = [];
		                    fileDiagnostics[diagnostic.file.fileName] = diagnostics;
		                }
		            }
		            else {
		                diagnostics = nonFileDiagnostics;
		            }
		            diagnostics.push(diagnostic);
		            diagnosticsModified = true;
		            modificationCount++;
		        }
		        function getGlobalDiagnostics() {
		            sortAndDeduplicate();
		            return nonFileDiagnostics;
		        }
		        function getDiagnostics(fileName) {
		            sortAndDeduplicate();
		            if (fileName) {
		                return fileDiagnostics[fileName] || [];
		            }
		            var allDiagnostics = [];
		            function pushDiagnostic(d) {
		                allDiagnostics.push(d);
		            }
		            ts.forEach(nonFileDiagnostics, pushDiagnostic);
		            for (var key in fileDiagnostics) {
		                if (ts.hasProperty(fileDiagnostics, key)) {
		                    ts.forEach(fileDiagnostics[key], pushDiagnostic);
		                }
		            }
		            return ts.sortAndDeduplicateDiagnostics(allDiagnostics);
		        }
		        function sortAndDeduplicate() {
		            if (!diagnosticsModified) {
		                return;
		            }
		            diagnosticsModified = false;
		            nonFileDiagnostics = ts.sortAndDeduplicateDiagnostics(nonFileDiagnostics);
		            for (var key in fileDiagnostics) {
		                if (ts.hasProperty(fileDiagnostics, key)) {
		                    fileDiagnostics[key] = ts.sortAndDeduplicateDiagnostics(fileDiagnostics[key]);
		                }
		            }
		        }
		    }

		    var escapedCharsRegExp = /[\\\"\u0000-\u001f\t\v\f\b\r\n\u2028\u2029\u0085]/g;
		    var escapedCharsMap = {
		        "\0": "\\0",
		        "\t": "\\t",
		        "\v": "\\v",
		        "\f": "\\f",
		        "\b": "\\b",
		        "\r": "\\r",
		        "\n": "\\n",
		        "\\": "\\\\",
		        "\"": "\\\"",
		        "\u2028": "\\u2028",
		        "\u2029": "\\u2029",
		        "\u0085": "\\u0085"
		    };

		    this.escapeString = function(s) {
		        s = escapedCharsRegExp.test(s) ? s.replace(escapedCharsRegExp, getReplacement) : s;
		        return s;
		        function getReplacement(c) {
		            return escapedCharsMap[c] || get16BitUnicodeEscapeSequence(c.charCodeAt(0));
		        }
		    }
		    this.isIntrinsicJsxName = function(name) {
		        var ch = name.substr(0, 1);
		        return ch.toLowerCase() === ch;
		    }

		    this.get16BitUnicodeEscapeSequence = function(charCode) {
		        var hexCharCode = charCode.toString(16).toUpperCase();
		        var paddedHexCode = ("0000" + hexCharCode).slice(-4);
		        return "\\u" + paddedHexCode;
		    }

		    var nonAsciiCharacters = /[^\u0000-\u007F]/g;
		    function escapeNonAsciiCharacters(s) {
		        return nonAsciiCharacters.test(s) ?
		            s.replace(nonAsciiCharacters, function (c) { return get16BitUnicodeEscapeSequence(c.charCodeAt(0)); }) :
		            s;
		    }
 		}).call(module.exports);
 		
 	});
})(typeof define === "function"? define: function(name, reqs, factory) {factory(require, exports, module); });
