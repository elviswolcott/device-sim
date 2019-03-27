const device_max = 5;
var model = new Vue({
  el: '#app',
  data: {
    devices: 0,
    selected: 0,
    currentWidth: 0,
    currentHeight: 0,
    currentScale: 1,
    currentPage: '',
    presets: [{
      name: "iPhone 6/6S/7/8",
      height: 667,
      width: 375,
      scale: 1
    },
    {
      name: "iPhone XR/XS Max",
      height: 896,
      width: 414,
      scale: 1
    },
    {
      name: "iPhone X/XS",
      height: 812,
      width: 375,
      scale: 1
    },
    {
      name: "iPhone 6+/6S+/7+8+",
      height: 736,
      width: 414,
      scale: 1
    },
    {
      name: "iPhone 5",
      height: 568,
      width: 320,
      scale: 1
    },
    {
      name: "iPad Pro",
      height: 1366,
      width: 1024,
      scale: 1
    }],
    selectedPreset: '',
    added: []
  },
  methods: {
    newDevice: async function() {
      console.log('creating new device');
      // limit to device_max
      if (this.$data.devices > device_max) {
        return;
      }

      // add a new device
      this.$data.devices++;
      this.$data.added.push({
        width:0, height:0, scale:1, page: '',
      });
      // spawn the window
      await restore(`device_${this.$data.devices}`);
      // select it
      this.$data.selected = this.$data.devices;
      this.$data.currentHeight = 0;
      this.$data.currentWidth = 0;
      this.$data.currentScale = 1;
      this.$data.currentPage = '';
      this.$data.selectedPreset = '';
      // set the number in the window
      const window = (await getOpenWindows())[`device_${this.$data.selected}`];
      console.log(window);
      window.DEVICE_NUMBER = this.$data.selected;
    },
    applyPreset: function(p) {
      console.log("applying preset: ", p);
      this.$data.currentWidth = p.width;
      this.$data.currentHeight = p.height;
      this.$data.currentScale = p.scale;
      this.$data.selectedPreset = '';
    },
    navigate: async function() {
      const window = (await getOpenWindows())[`device_${this.$data.selected}`];
      const frame = window.document.getElementById('site');
      frame.src = this.$data.currentPage;
      this.$data.added[this.$data.selected-1].page = this.$data.currentPage;
    },
    doHide: async function() {
      await minimize(`device_${this.$data.selected}`);
    },
  },
  watch: {
    selectedPreset: function(selected) {
      if(this.$data.presets[selected] === undefined) {
        return;
      }
      this.applyPreset(this.$data.presets[selected]);
    },
    currentWidth: async function(w) {
      w=parseInt(w);
      console.log(this.$data.currentWidth, this.$data.currentHeight);
      overwolf.windows.changeSize(`device_${this.$data.selected}`, w, this.$data.currentHeight, console.log);
      const window = (await getOpenWindows())[`device_${this.$data.selected}`];
      const frame = window.document.getElementById('site');
      frame.style.width = `${w}px`;
      this.$data.added[this.$data.selected-1].width = w;
    },
    currentHeight: async function(h) {
      h=parseInt(h);
      console.log(this.$data.currentWidth, this.$data.currentHeight);
      overwolf.windows.changeSize(`device_${this.$data.selected}`, this.$data.currentWidth, h, console.log);
      const window = (await getOpenWindows())[`device_${this.$data.selected}`];
      const frame = window.document.getElementById('site');
      frame.style.height = `${h}px`;
      this.$data.added[this.$data.selected-1].height = h;
    },
    currentScale: async function(s) {
      s=parseInt(s);
      const window = (await getOpenWindows())[`device_${this.$data.selected}`];
      const frame = window.document.getElementById('site');
      frame.style.zoom = this.$data.currentScale;
      this.$data.added[this.$data.selected-1].scale = s;
    },
    selected: function(s) {
      const item = this.$data.added[s-1];
      this.$data.currentWidth = item.width;
      this.$data.currentHeight = item.height;
      this.$data.currentScale = item.scale;
      this.$data.currentPage = item.page;
    }
  }
});