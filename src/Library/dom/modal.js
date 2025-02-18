// Function to open modal
export function openModal() {
    document.getElementById("settingsModal").style.display = "block";
}

// Function to close modal
export function closeModal() {
    document.getElementById("settingsModal").style.display = "none";
}

// Function to close modal when clicking outside
export function setupModalEventListeners() {
    const modal = document.getElementById("settingsModal");
    const openBtn = document.getElementById("openSettings");
    const closeBtn = document.getElementById("closeModal");

    openBtn.addEventListener("click", openModal);
    closeBtn.addEventListener("click", closeModal);

    window.addEventListener("click", (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
}

