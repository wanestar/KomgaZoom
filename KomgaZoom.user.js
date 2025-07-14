// ==UserScript==
// @name         Komga Zoom
// @namespace    https://github.com/wanestar/KomgaZoom
// @version      1.1
// @description  Add efficient image resizing buttons to Komga reader view without slowing down large books
// @match        http://192.168.1.X:25600/* 
// @grant        none
// @downloadURL  https://github.com/wanestar/KomgaZoom/releases/latest/download/KomgaZoom.user.js
// ==/UserScript==

//IMPORTANT! Enter the IP ADDRESS of your server above in the @MATCH. Keep the /* !!

(function () {
    'use strict';

    const toolbarSelector = '.v-toolbar__content';
    let zoomLevel = 1.0;

    function createButton(iconClass, className, onClick) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `v-btn v-btn--icon v-btn--round theme--dark v-size--default ${className}`;
        button.innerHTML = `<span class="v-btn__content"><i class="${iconClass} v-icon notranslate theme--dark" aria-hidden="true"></i></span>`;
        button.onclick = onClick;
        return button;
    }

    function appendButtons() {
        const url = window.location.href;
        const toolbar = document.querySelector(toolbarSelector);
        if (!url.includes("read?") || !toolbar) return;

        if (!document.querySelector('.resize-plus-button')) {
            const plusButton = createButton('mdi mdi-plus', 'resize-plus-button', () => updateZoom(1.1));
            toolbar.appendChild(plusButton);
        }

        if (!document.querySelector('.resize-minus-button')) {
            const minusButton = createButton('mdi mdi-minus', 'resize-minus-button', () => updateZoom(0.9));
            toolbar.appendChild(minusButton);
        }
    }

    function updateZoom(factor) {
        zoomLevel *= factor;
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.dataset.originalWidth || !img.dataset.originalHeight) {
                img.dataset.originalWidth = img.naturalWidth || img.width;
                img.dataset.originalHeight = img.naturalHeight || img.height;
            }

            const newWidth = parseFloat(img.dataset.originalWidth) * zoomLevel;
            const newHeight = parseFloat(img.dataset.originalHeight) * zoomLevel;

            img.style.width = `${newWidth}px`;
            img.style.height = `${newHeight}px`;
        });
    }

    // Debounced observer to reduce CPU usage
    let debounceTimer;
    const observer = new MutationObserver(() => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(appendButtons, 200);
    });

    observer.observe(document.body, { childList: true, subtree: true });

    appendButtons(); // Initial run
})();
