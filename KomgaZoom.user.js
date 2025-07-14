// ==UserScript==
// @name         Komga Zoom
// @namespace    https://github.com/wanestar/KomgaZoom
// @version      1.1.1
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

    // Try to find the currently visible page number label
    const currentPageLabel = document.querySelector('.v-label.theme--dark');
    const currentPageNum = currentPageLabel ? parseInt(currentPageLabel.textContent.trim()) : null;

    // Find the image closest to that page number (Komga loads images in order)
    const images = Array.from(document.querySelectorAll('img'));
    const targetImg = currentPageNum ? images[currentPageNum - 1] : null;

    const offsetBefore = targetImg ? targetImg.getBoundingClientRect().top : 0;

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

    // After resizing, scroll back to the same image position
    if (targetImg) {
        requestAnimationFrame(() => {
            const offsetAfter = targetImg.getBoundingClientRect().top;
            const scrollDiff = offsetAfter - offsetBefore;
            window.scrollBy({ top: scrollDiff });
        });
    }
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
