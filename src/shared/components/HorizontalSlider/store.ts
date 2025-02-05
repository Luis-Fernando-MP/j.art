import { StateCreator, create } from 'zustand'

interface IStoreHorizontalSlider {
  moveToChild: (index: number) => void
  setMoveToChild: (fn: IStoreHorizontalSlider['moveToChild']) => void
}

const state: StateCreator<IStoreHorizontalSlider> = set => ({
  moveToChild: () => {},
  setMoveToChild: moveToChild => set({ moveToChild })
})

const StoreHorizontalSlider = create(state)

export default StoreHorizontalSlider
