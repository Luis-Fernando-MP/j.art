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
export var EWorkerActions;
(function (EWorkerActions) {
    EWorkerActions["GENERATE_FRAME"] = "generateFrameView";
    EWorkerActions["GENERATE_FULL_VIEW"] = "generateFullView";
    EWorkerActions["CHANGE_OPACITY"] = "changeOpacity";
})(EWorkerActions || (EWorkerActions = {}));
self.onmessage = function (event) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, imageBitmap, action, imagesBitmap, alpha, error_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = event.data, imageBitmap = _a.imageBitmap, action = _a.action, imagesBitmap = _a.imagesBitmap, alpha = _a.alpha;
                if (!action)
                    return [2 /*return*/, self.postMessage({ error: 'No action' })];
                _b.label = 1;
            case 1:
                _b.trys.push([1, 8, , 9]);
                if (!(action === EWorkerActions.GENERATE_FRAME && imageBitmap)) return [3 /*break*/, 3];
                return [4 /*yield*/, generateImage(imageBitmap)];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3:
                if (!(action === EWorkerActions.GENERATE_FULL_VIEW && imagesBitmap)) return [3 /*break*/, 5];
                return [4 /*yield*/, generateFullImage(imagesBitmap)];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5:
                if (!(action === EWorkerActions.CHANGE_OPACITY && imageBitmap && alpha)) return [3 /*break*/, 7];
                return [4 /*yield*/, changeAlpha(imageBitmap, alpha)];
            case 6:
                _b.sent();
                _b.label = 7;
            case 7: return [3 /*break*/, 9];
            case 8:
                error_1 = _b.sent();
                self.postMessage({ error: error_1.message });
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
function changeAlpha(imageBitmap, alpha) {
    return __awaiter(this, void 0, void 0, function () {
        var width, height, offscreen, ctx, imageData, data, i, updatedBitmap_1, blob, reader_1, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    width = imageBitmap.width, height = imageBitmap.height;
                    offscreen = new OffscreenCanvas(width, height);
                    ctx = offscreen.getContext('2d');
                    if (!ctx)
                        return [2 /*return*/, self.postMessage({ error: 'Failed to get 2D context' })];
                    ctx.imageSmoothingEnabled = false;
                    ctx.drawImage(imageBitmap, 0, 0);
                    imageData = ctx.getImageData(0, 0, width, height);
                    data = imageData.data;
                    for (i = 3; i < data.length; i += 4) {
                        data[i] = data[i] * alpha;
                    }
                    ctx.putImageData(imageData, 0, 0);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, createImageBitmap(offscreen)];
                case 2:
                    updatedBitmap_1 = _a.sent();
                    return [4 /*yield*/, offscreen.convertToBlob({
                            quality: 0.2
                        })];
                case 3:
                    blob = _a.sent();
                    reader_1 = new FileReader();
                    reader_1.onloadend = function () {
                        self.postMessage({ base64: reader_1.result, bitmap: updatedBitmap_1 });
                    };
                    reader_1.readAsDataURL(blob);
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _a.sent();
                    self.postMessage({ error: error_2.message });
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
function generateImage(imageBitmap) {
    return __awaiter(this, void 0, void 0, function () {
        var offscreen, ctx, blob, reader_2, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    offscreen = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
                    ctx = offscreen.getContext('2d');
                    if (!ctx)
                        return [2 /*return*/, self.postMessage({ error: 'Failed to get 2D context' })];
                    ctx.imageSmoothingEnabled = false;
                    ctx.drawImage(imageBitmap, 0, 0);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, offscreen.convertToBlob({
                            quality: 0.2
                        })];
                case 2:
                    blob = _a.sent();
                    reader_2 = new FileReader();
                    reader_2.onloadend = function () { return self.postMessage({ base64: reader_2.result }); };
                    reader_2.readAsDataURL(blob);
                    return [3 /*break*/, 4];
                case 3:
                    error_3 = _a.sent();
                    self.postMessage({ error: error_3.message });
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
function generateFullImage(imagesBitmap) {
    return __awaiter(this, void 0, void 0, function () {
        var maxWidth, maxHeight, offscreen, ctx, blob, mergedBitmap_1, reader_3, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (imagesBitmap.length === 0)
                        return [2 /*return*/, self.postMessage({ error: 'No images provided' })];
                    maxWidth = Math.max.apply(Math, imagesBitmap.map(function (img) { return img.width; }));
                    maxHeight = Math.max.apply(Math, imagesBitmap.map(function (img) { return img.height; }));
                    offscreen = new OffscreenCanvas(maxWidth, maxHeight);
                    ctx = offscreen.getContext('2d');
                    if (!ctx)
                        return [2 /*return*/, self.postMessage({ error: 'Failed to get 2D context' })];
                    ctx.imageSmoothingEnabled = false;
                    imagesBitmap.forEach(function (image) {
                        ctx.drawImage(image, 0, 0);
                    });
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, offscreen.convertToBlob({ quality: 0.2 })];
                case 2:
                    blob = _a.sent();
                    return [4 /*yield*/, createImageBitmap(offscreen)];
                case 3:
                    mergedBitmap_1 = _a.sent();
                    reader_3 = new FileReader();
                    reader_3.onloadend = function () {
                        self.postMessage({ base64: reader_3.result, mergedBitmap: mergedBitmap_1 });
                    };
                    reader_3.readAsDataURL(blob);
                    return [3 /*break*/, 5];
                case 4:
                    error_4 = _a.sent();
                    self.postMessage({ error: error_4.message });
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    });
}
