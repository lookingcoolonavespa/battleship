const helpers = (() => ({
  hide(el) {
    el.classList.add('hidden');
  },
  show(el) {
    el.classList.remove('hidden');
  },
}))();

export default helpers;
