var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export var TransformWorker;
(function (TransformWorker) {
    TransformWorker["CENTER"] = "center";
})(TransformWorker || (TransformWorker = {}));
self.onmessage = (event) => __awaiter(void 0, void 0, void 0, function* () {
    const { bitmap, action, pixelSize } = event.data;
    try {
        if (!action)
            throw new Error('No action provided');
        if (action === TransformWorker.CENTER && bitmap && pixelSize)
            yield handleCenterImage(bitmap, pixelSize);
    }
    catch (error) {
        self.postMessage({ error: error === null || error === void 0 ? void 0 : error.message });
    }
});
const tempOffscreen = new OffscreenCanvas(0, 0);
const tempCtx = tempOffscreen.getContext('2d');
function handleCenterImage(bitmap, pixelSize) {
    return __awaiter(this, void 0, void 0, function* () {
        const { height, width } = bitmap;
        const offscreen = new OffscreenCanvas(width, height);
        const ctx = offscreen.getContext('2d');
        if (!ctx)
            throw new Error('Failed to get 2D context');
        ctx.drawImage(bitmap, 0, 0);
        try {
            const imageData = ctx.getImageData(0, 0, width, height);
            let minX = width;
            let minY = height;
            let maxX = 0;
            let maxY = 0;
            let hasContent = false;
            for (let i = 3; i < imageData.data.length; i += 4) {
                if (imageData.data[i] !== 0) {
                    // Canal alfa > 0 significa que hay contenido
                    const pixelIndex = i / 4; // Índice del píxel en 1D
                    const x = pixelIndex % width;
                    const y = Math.floor(pixelIndex / width);
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
            const drawingWidth = maxX - minX + 1;
            const drawingHeight = maxY - minY + 1;
            const offsetX = Math.round((width - drawingWidth) / 2 / pixelSize) * pixelSize;
            const offsetY = Math.round((height - drawingHeight) / 2 / pixelSize) * pixelSize;
            tempOffscreen.width = drawingWidth;
            tempOffscreen.height = drawingHeight;
            const croppedImageData = ctx.getImageData(minX, minY, drawingWidth, drawingHeight);
            tempCtx.putImageData(croppedImageData, 0, 0);
            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(tempOffscreen, offsetX, offsetY);
            const updatedBitmap = yield createImageBitmap(offscreen);
            self.postMessage({ bitmap: updatedBitmap });
        }
        catch (error) {
            throw new Error(error === null || error === void 0 ? void 0 : error.message);
        }
    });
}
//# sourceMappingURL=transform.js.map