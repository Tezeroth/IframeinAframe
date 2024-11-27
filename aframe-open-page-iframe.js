AFRAME.registerComponent('open-page-iframe', {
    schema: {
        event: { type: "string", default: "click" },
        url: { type: "string", default: "" }
    },

    init: function () {
        const data = this.data;
        const el = this.el;

        this.isARMode = false; // Track XR mode type

        console.log("openIframe exists:", this.openIframe);
        this.openIframe = this.openIframe.bind(this); // Bind the method to the correct context

        if (data.event && data.url) {
            el.addEventListener(data.event, (e) => {
                console.log(`Event '${data.event}' triggered.`);
                this.openIframe();
            });
            console.log(`Event '${data.event}' bound to URL: ${data.url}`);
        } else {
            console.error("Event or URL not defined in component schema.");
        }

        this.mountStyles();
    },

    openIframe: function () {
        console.log("Context of 'this':", this);
        const data = this.data;
        const sceneEl = this.el.sceneEl;

        const isVRMode = sceneEl.is('vr-mode');
        const isARMode = sceneEl.is('ar-mode');
        const isXRMode = isVRMode || isARMode;

        if (isXRMode) {
            console.log("Exiting XR mode to open modal.");
            const handleExitXR = () => {
                console.log("XR session ended. Opening modal.");
                sceneEl.removeEventListener('exit-vr', handleExitXR);
                let modal = this.mountHTML();
                modal.focus();
            };

            if (isARMode) {
                this.isARMode = true;
                sceneEl.addEventListener('exit-vr', handleExitXR);
                sceneEl.exitVR();
            } else if (isVRMode) {
                this.isARMode = false;
                sceneEl.addEventListener('exit-vr', handleExitXR);
                sceneEl.exitVR();
            }
        } else {
            console.log("Opening modal in desktop mode.");
            let modal = this.mountHTML();
            modal.focus();
        }
    },

    mountStyles: function () {
        const styles = document.querySelector(this.modalStyleSelector);

        if (!styles) {
            const template = `<style id="${this.modalStyleSelector}">
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

    closeIframe: function () {
        this.clearGarbage();

        const sceneEl = this.el.sceneEl;
        if (this.isARMode) {
            sceneEl.enterVR();
            console.log("Returning to AR mode.");
        } else {
            sceneEl.enterVR();
            console.log("Returning to VR mode.");
        }

        sceneEl.focus();
    },

    get modalSelector() {
        return '#a_open_page_iframe';
    },

    get modalStyleSelector() {
        return '#a_open_page_css';
    },

    clearGarbage: function () {
        document.querySelectorAll(this.modalSelector).forEach((item) => item.remove());
    },

    mountHTML: function () {
        this.clearGarbage();

        const template = `<div id="a_open_page_iframe" class="page__modal">
            <div class="page__modal-header">
                <button class="close">back to XR</button>
            </div>
            <iframe src="${this.data.url}" frameborder="0"
                    allow="xr-spatial-tracking; gyroscope; accelerometer"
                    sandbox="allow-same-origin allow-scripts "
                    width="100%" height="100%">
                    
            </iframe>
        </div>`;
                document.body.insertAdjacentHTML('beforeend', template);

        const modal = document.querySelector('#a_open_page_iframe');
        if (modal) {
            console.log("Modal created successfully.");
        } else {
            console.error("Failed to create modal.");
        }

        modal.querySelector('.close').addEventListener('click', this.closeIframe.bind(this));
        return modal;
    }
});
//working code