export const getBitmapFromCanvasList = async (elementId: string) => {
  const container = document.getElementById(elementId)
  if (!container) return null
  const listOfCanvas = container.querySelectorAll('canvas')
  return Promise.all(Array.from(listOfCanvas).map(canvas => createImageBitmap(canvas)))
}
