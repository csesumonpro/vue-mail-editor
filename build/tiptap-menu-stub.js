// Build-only stub. We don't use Tiptap's <BubbleMenu>/<FloatingMenu> (we ship a
// custom, dependency-free bubble toolbar), but @tiptap/vue-3's barrel statically
// references their plugins via `defineComponent(...)`, which rollup can't prove
// pure — so it keeps tippy.js + @popperjs/core (~30 KB gzip) unless we cut the
// import here. These exports are only touched inside the unused components'
// setup() at runtime, so no-op functions are safe.
export const BubbleMenuPlugin = () => ({})
export const FloatingMenuPlugin = () => ({})
export default {}
