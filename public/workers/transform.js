var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
export var TransformWorker;
(function (TransformWorker) {
    TransformWorker["CENTER"] = "center";
})(TransformWorker || (TransformWorker = {}));
self.onmessage = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, bitmap, action, pixelSize, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = event.data, bitmap = _a.bitmap, action = _a.action, pixelSize = _a.pixelSize;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 4, , 5]);
                if (!action)
                    throw new Error('No action provided');
                if (!(action === TransformWorker.CENTER && bitmap && pixelSize)) return [3 /*break*/, 3];
                return [4 /*yield*/, handleCenterImage(bitmap, pixelSize)];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3: return [3 /*break*/, 5];
            case 4:
                error_1 = _b.sent();
                self.postMessage({ error: error_1 === null || error_1 === void 0 ? void 0 : error_1.message });
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
var tempOffscreen = new OffscreenCanvas(0, 0);
var tempCtx = tempOffscreen.getContext('2d');
function handleCenterImage(bitmap, pixelSize) {
    return __awaiter(this, void 0, void 0, function () {
        var height, width, offscreen, ctx, imageData, minX, minY, maxX, maxY, hasContent, i, pixelIndex, x, y, drawingWidth, drawingHeight, offsetX, offsetY, croppedImageData, updatedBitmap, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    height = bitmap.height, width = bitmap.width;
                    offscreen = new OffscreenCanvas(width, height);
                    ctx = offscreen.getContext('2d');
                    if (!ctx)
                        throw new Error('Failed to get 2D context');
                    ctx.drawImage(bitmap, 0, 0);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    imageData = ctx.getImageData(0, 0, width, height);
                    minX = width;
                    minY = height;
                    maxX = 0;
                    maxY = 0;
                    hasContent = false;
                    for (i = 3; i < imageData.data.length; i += 4) {
                        if (imageData.data[i] !== 0) {
                            pixelIndex = i / 4 // Índice del píxel en 1D
                            ;
                            x = pixelIndex % width;
                            y = Math.floor(pixelIndex / width);
                            if (!hasContent) {
                                // Si encontramos el primer píxel
                                minX = maxX = x;
                                minY = maxY = y;
                                hasContent = true;
                            }
                            else {
                                minX = Math.min(minX, x);
                                minY = Math.min(minY, y);
                                maxX = Math.max(maxX, x);
                                maxY = Math.max(maxY, y);
                            }
                        }
                    }
                    if (!hasContent)
                        throw new Error('No content provided');
                    drawingWidth = maxX - minX + 1;
                    drawingHeight = maxY - minY + 1;
                    offsetX = Math.round((width - drawingWidth) / 2 / pixelSize) * pixelSize;
                    offsetY = Math.round((height - drawingHeight) / 2 / pixelSize) * pixelSize;
                    tempOffscreen.width = drawingWidth;
                    tempOffscreen.height = drawingHeight;
                    croppedImageData = ctx.getImageData(minX, minY, drawingWidth, drawingHeight);
                    tempCtx.putImageData(croppedImageData, 0, 0);
                    ctx.clearRect(0, 0, width, height);
                    ctx.drawImage(tempOffscreen, offsetX, offsetY);
                    return [4 /*yield*/, createImageBitmap(offscreen)];
                case 2:
                    updatedBitmap = _a.sent();
                    self.postMessage({ bitmap: updatedBitmap });
                    return [3 /*break*/, 4];
                case 3:
                    error_2 = _a.sent();
                    throw new Error(error_2 === null || error_2 === void 0 ? void 0 : error_2.message);
                case 4: return [2 /*return*/];
            }
        });
    });
}
