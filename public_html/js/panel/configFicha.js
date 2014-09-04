
window._skel_config = {
    prefix: 'css/style',
    preloadStyleSheets: true,
    resetCSS: true,
    boxModel: 'border',
    grid: {gutters: 30},
     breakpoints: {
		wide: { range: '1200-', containers: 1140, grid: { gutters: 50 } },
		narrow: { range: '761-1199', containers: 960 },
		narrower: { range: '761-960', containers: 'fluid' },
		mobile: { range: '-760', containers: 'fluid', lockViewport: true, grid: { collapse: true, gutters: 20 } }
	}
};

window._skel_panels_config = {
    panels: {
        leftPanel: {
            breakpoints: 'narrower,mobile',
            position: 'left',
            size: 250,
            html: '<div data-action="moveCell" data-args="left-sidebar,content"></div>'
        }
    },
    overlays: {
        titleBar: {
            breakpoints: 'mobile',
            position: 'top-center',
            width: '100%',
            height: 50,
            html: '<div data-action="copyHTML" data-args="title"></div>'
        },
       
        contactBar: {
            position: 'bottom-center',
            width: '100%',
            height: 45,
            html: '<a href="javascript:history.back();" class="icon-left"></a>'
        

        },
        leftPanelButton: {
            breakpoints: 'narrower,mobile',
            position: 'top-left',
            width: 80,
            height: 60,
            html: '<div class="toggle" data-action="togglePanel" data-args="leftPanel"></div>'
        }
    }
};