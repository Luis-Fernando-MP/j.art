var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export var EDowImageWk;
(function (EDowImageWk) {
    EDowImageWk["TO_PNG"] = "generateFrameView";
})(EDowImageWk || (EDowImageWk = {}));
self.onmessage = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const { imagesBitmap, action } = event.data;
    try {
        if (!action)
            throw new Error('No action provided');
        if (action === EDowImageWk.TO_PNG && imagesBitmap)
            yield generateImage(imagesBitmap);
    }
    catch (error) {
        self.postMessage({ error: error.message });
    }
});
function generateImage(imagesBitmap) {
    return __awaiter(this, void 0, void 0, function* () {
        if (imagesBitmap.length === 0)
            throw new Error('No images provided');
        const maxWidth = Math.max(...imagesBitmap.map(img => img.width));
        const maxHeight = Math.max(...imagesBitmap.map(img => img.height));
        const offscreen = new OffscreenCanvas(maxWidth, maxHeight);
        const ctx = offscreen.getContext('2d');
        try {
            if (!ctx)
                throw new Error('Failed to get 2D context');
            ctx.imageSmoothingEnabled = false;
            imagesBitmap.forEach(image => ctx.drawImage(image, 0, 0));
            const blob = yield offscreen.convertToBlob({ quality: 1 });
            self.postMessage({ blob });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    });
}
//# sourceMappingURL=downloadImage.js.map