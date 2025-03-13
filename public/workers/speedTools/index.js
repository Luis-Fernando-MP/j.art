var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { EToolsWorker } from './speedTools.types.js';
import { handlePaintBucket, handlePipetteColor } from './utils.js';
const validEverything = (...values) => values.every(i => !!i);
self.onmessage = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const { action, bitmap, startX, startY, fillColor } = event.data;
    try {
        if (!action)
            throw new Error('No action provided');
        if (action === EToolsWorker.BUCKET && validEverything([bitmap, startX, startY, fillColor]))
            yield paintBucketCanvas(bitmap, startX, startY, fillColor);
        if (action === EToolsWorker.PIPETTE && validEverything([bitmap, startX, startY]))
            yield pipetteCanvasColor(bitmap, startX, startY);
    }
    catch (error) {
        self.postMessage({ error: error === null || error === void 0 ? void 0 : error.message });
    }
});
const paintBucketCanvas = (bitmap, startX, startY, fillColor) => __awaiter(void 0, void 0, void 0, function* () {
    const { height, width } = bitmap;
    const offscreen = new OffscreenCanvas(width, height);
    const ctx = offscreen.getContext('2d');
    try {
        if (!ctx)
            throw new Error('Failed to get 2D context');
        ctx.drawImage(bitmap, 0, 0);
        const warning = handlePaintBucket(ctx, startX, startY, fillColor);
        if (warning)
            return self.postMessage({ warning: warning.message });
        const updatedBitmap = yield createImageBitmap(offscreen);
        self.postMessage({ bitmap: updatedBitmap });
    }
    catch (error) {
        throw new Error(error === null || error === void 0 ? void 0 : error.message);
    }
});
const pipetteCanvasColor = (bitmap, startX, startY) => __awaiter(void 0, void 0, void 0, function* () {
    const { height, width } = bitmap;
    const offscreen = new OffscreenCanvas(width, height);
    const ctx = offscreen.getContext('2d');
    try {
        if (!ctx)
            throw new Error('Failed to get 2D context');
        ctx.drawImage(bitmap, 0, 0);
        const rgba = handlePipetteColor(ctx, startX, startY).rgba;
        self.postMessage({ rgba });
    }
    catch (error) {
        throw new Error(error === null || error === void 0 ? void 0 : error.message);
    }
});
//# sourceMappingURL=index.js.map