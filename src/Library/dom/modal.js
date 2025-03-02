// Function to open modal
import {elements} from "../constants.js"

function openModal() {
    elements.settingsModal.style.display = "block";
    window.addEventListener("click",closeFromWindow )
}
function closeModal() {
    elements.settingsModal.style.display = "none";
    window.removeEventListener("click",closeFromWindow )
}
function closeFromWindow(e){
    if (e.target === elements.settingsModal) {
        closeModal();
    }
}
export function setupModalEventListeners() {
    elements.iconSettings.addEventListener("click", openModal);
    elements.settingsCloseModal.addEventListener("click", openModal);
}

