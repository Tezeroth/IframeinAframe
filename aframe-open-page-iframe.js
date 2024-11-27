AFRAME.registerComponent('open-page-iframe', {
    schema: {
        event: { type: "string", default: "click" },
        url: { type: "string", default: "" }
    },
    init() {
        let data = this.data;
        let el = this.el;
    
        if (data.event && data.url) {
            el.addEventListener(data.event, this.openIframe.bind(this));
            console.log(`Event '${data.event}' bound to ${data.url}`);
        } else {
            console.error("Event or URL not defined in component schema.");
        }

        this.mountStyles();
    },

    mountStyles() {
        let styles = document.querySelector(this.modalStyleSelector);

        if (styles === null) {
            let template = `<style id="${this.modalStyleSelector}">
            ${this.modalSelector}.page__modal {
                position: fixed;
                left: 50%;
                top: 50%;
                transform: translate(-50%, -50%);
                width: 90vw;
                height: 70vh;
            }
            ${this.modalSelector}.page__modal .page__modal-header {
                width: 100%;
                display: flex;
                flex-direction: row-reverse;
            }
            ${this.modalSelector}.page__modal iframe {
                width: 100%;
                height: 100%;
            }
            </style>`;
            document.body.insertAdjacentHTML('beforeend', template);
        }
    },
    getSceneEl() {
        return this.el.sceneEl;
    },
    /*openIframe() {
        this.usingVRMode = this.getSceneEl().is('vr-mode');

        this.getSceneEl().exitVR();
        let modal = this.mountHTML();
        modal.focus();
    } below is the newer debug code*/

    openIframe() {
        const data = this.data;
    
        if (this.getSceneEl().is('vr-mode') || this.getSceneEl().is('ar-mode')) {
            console.log("Opening external browser in XR mode.");
            window.open(data.url, '_blank');
        } else {
            console.log("Opening modal iframe in 2D mode.");
            let modal = this.mountHTML();
            modal.focus();
        }
    },
    
    closeIframe() {
        this.clearGarbage();

        if (this.usingVRMode) {
            this.getSceneEl().enterVR();
        }

        this.getSceneEl().focus();
    },
    get modalSelector() {
        return '#a_open_page_iframe';
    },
    get modalStyleSelector() {
        return '#a_open_page_css';
    },
    clearGarbage() {
        document.querySelectorAll(this.modalSelector).forEach(item => item.remove());
    },
    mountHTML() {
        this.clearGarbage();

        let template = `<div id="a_open_page_iframe" class="page__modal">
        <div class="page__modal-header">
            <button class="close">back to VR</button>
        </div>
        <iframe src="${this.data.url}" frameborder="0" frameborder="0"
                
                allow="xr-spatial-tracking; gyroscope; accelerometer" 
                 sandbox="allow-scripts allow-same-origin"
                width="100%" height="100%">
                
                </iframe>
        </div>`;

        document.body.insertAdjacentHTML('beforeend', template);
        let modal = document.querySelector(this.modalSelector);
        modal.querySelector('.close').addEventListener('click', this.closeIframe.bind(this));

        return modal;
    },
});