var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { handlePaintBucket } from './scriptTools';
export var EToolsWorker;
(function (EToolsWorker) {
    EToolsWorker["BUCKET"] = "bucket";
})(EToolsWorker || (EToolsWorker = {}));
const validEverything = (...values) => values.every(i => !!i);
self.onmessage = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const { action, bitmap, startX, startY, fillColor } = event.data;
    self.postMessage({ action, bitmap, startX, startY, fillColor });
});
self.onerror = function (event) {
    console.error('Error en el worker:', event);
};
const handlePaintCanvas = (bitmap, startX, startY, fillColor) => __awaiter(void 0, void 0, void 0, function* () {
    const { height, width } = bitmap;
    const offscreen = new OffscreenCanvas(width, height);
    const ctx = offscreen.getContext('2d');
    if (!ctx)
        throw new Error('Failed to get 2D context');
    ctx.drawImage(bitmap, 0, 0);
    try {
        handlePaintBucket(ctx, startX, startY, fillColor);
        const updatedBitmap = yield createImageBitmap(offscreen);
        self.postMessage({ bitmap: updatedBitmap });
    }
    catch (error) {
        throw new Error(error === null || error === void 0 ? void 0 : error.message);
    }
});
