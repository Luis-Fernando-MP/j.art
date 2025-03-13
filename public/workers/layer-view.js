var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export var EWorkerActions;
(function (EWorkerActions) {
    EWorkerActions["GENERATE_FRAME"] = "generateFrameView";
    EWorkerActions["GENERATE_FULL_VIEW"] = "generateFullView";
    EWorkerActions["CHANGE_OPACITY"] = "changeOpacity";
})(EWorkerActions || (EWorkerActions = {}));
self.onmessage = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const { imageBitmap, action, imagesBitmap, alpha } = event.data;
    try {
        if (!action)
            throw new Error('No action provided');
        if (action === EWorkerActions.GENERATE_FRAME && imageBitmap)
            yield generateImage(imageBitmap);
        if (action === EWorkerActions.GENERATE_FULL_VIEW && imagesBitmap)
            yield generateFullImage(imagesBitmap);
        if (action === EWorkerActions.CHANGE_OPACITY && imageBitmap && alpha)
            yield changeAlpha(imageBitmap, alpha);
    }
    catch (error) {
        self.postMessage({ error: error.message });
    }
});
function changeAlpha(imageBitmap, alpha) {
    return __awaiter(this, void 0, void 0, function* () {
        const { width, height } = imageBitmap;
        const offscreen = new OffscreenCanvas(width, height);
        const ctx = offscreen.getContext('2d');
        if (!ctx)
            throw new Error('Failed to get 2D context');
        ctx.drawImage(imageBitmap, 0, 0);
        const imageData = ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        for (let i = 3; i < data.length; i += 4) {
            data[i] = data[i] * alpha;
        }
        ctx.putImageData(imageData, 0, 0);
        try {
            const updatedBitmap = yield createImageBitmap(offscreen);
            const blob = yield offscreen.convertToBlob({
                quality: 0.05
            });
            const reader = new FileReader();
            reader.onloadend = () => {
                self.postMessage({ base64: reader.result, bitmap: updatedBitmap });
            };
            reader.readAsDataURL(blob);
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    });
}
function generateImage(imageBitmap) {
    return __awaiter(this, void 0, void 0, function* () {
        const offscreen = new OffscreenCanvas(imageBitmap.width, imageBitmap.height);
        const ctx = offscreen.getContext('2d');
        if (!ctx)
            throw new Error('Failed to get 2D context');
        ctx.drawImage(imageBitmap, 0, 0);
        try {
            const blob = yield offscreen.convertToBlob({
                quality: 0.05
            });
            const reader = new FileReader();
            reader.onloadend = () => self.postMessage({ base64: reader.result });
            reader.readAsDataURL(blob);
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    });
}
function generateFullImage(imagesBitmap) {
    return __awaiter(this, void 0, void 0, function* () {
        if (imagesBitmap.length === 0)
            throw new Error('No images provided');
        const maxWidth = Math.max(...imagesBitmap.map(img => img.width));
        const maxHeight = Math.max(...imagesBitmap.map(img => img.height));
        const offscreen = new OffscreenCanvas(maxWidth, maxHeight);
        const ctx = offscreen.getContext('2d');
        if (!ctx)
            throw new Error('Failed to get 2D context');
        imagesBitmap.forEach(image => ctx.drawImage(image, 0, 0));
        try {
            const blob = yield offscreen.convertToBlob({ quality: 0.05 });
            const mergedBitmap = yield createImageBitmap(offscreen);
            const reader = new FileReader();
            reader.onloadend = () => {
                self.postMessage({ base64: reader.result, mergedBitmap });
            };
            reader.readAsDataURL(blob);
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    });
}
//# sourceMappingURL=layer-view.js.map