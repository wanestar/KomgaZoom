// ==UserScript==
// @name         Komga Zoom
// @namespace    https://github.com/wanestar/KomgaZoom
// @author       wanestar
// @version      1.0
// @description  Add image resizing buttons to a specific toolbar, responsive to dynamic content changes and show only if URL contains "read?"
// @match        http://192.168.1.9:25600/*
// @grant        none

// @downloadURL  https://github.com/wanestar/KomgaZoom/releases/latest/download/KomgaZoom.user.js
// ==/UserScript==

(function() {
    'use strict';

    const toolbarSelector = '.v-toolbar__content'; // Selector for the main toolbar

    function createButton(iconClass, action) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'v-btn v-btn--icon v-btn--round theme--dark v-size--default';
        button.innerHTML = `<span class="v-btn__content"><i aria-hidden="true" class="${iconClass} v-icon notranslate theme--dark"></i></span>`;
        button.onclick = action;
        return button;
    }

    function appendButtons() {
        const url = window.location.href;

        // Check if the URL contains "read?"
        if (url.includes("read?")) {
            const toolbar = document.querySelector(toolbarSelector);
            if (!toolbar) return;

            // Check if the toolbar is part of the settings section
            if (toolbar.closest('.settings')) {
                // Check if buttons already exist to prevent duplicates
                if (!document.querySelector('.resize-plus-button')) {
                    const plusButton = createButton('mdi mdi-plus resize-plus-button', () => resizeImages(1.1));
                    toolbar.appendChild(plusButton);
                }

                if (!document.querySelector('.resize-minus-button')) {
                    const minusButton = createButton('mdi mdi-minus resize-minus-button', () => resizeImages(0.9));
                    toolbar.appendChild(minusButton);
                }
            }
        } else {
            // Remove the buttons if they exist
            const plusButton = document.querySelector('.resize-plus-button');
            const minusButton = document.querySelector('.resize-minus-button');
            if (plusButton) plusButton.remove();
            if (minusButton) minusButton.remove();
        }
    }

    function resizeImages(factor) {
        const images = document.getElementsByTagName('img');
        for (let img of images) {
            let rect = img.getBoundingClientRect();
            let targetWidth = rect.width * factor;
            let targetHeight = rect.height * factor;
            img.style.width = targetWidth + 'px';
            img.style.height = targetHeight + 'px';
        }
    }

    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length || mutation.removedNodes.length) {
                appendButtons();
            }
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    appendButtons(); // Initial append
})();
