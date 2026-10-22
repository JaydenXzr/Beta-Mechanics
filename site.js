document.querySelectorAll(".menu-toggle").forEach((toggle) => {
    const menu = document.getElementById(toggle.getAttribute("aria-controls"));

    if (!menu) {
        return;
    }

    const closeMenu = () => {
        toggle.setAttribute("aria-expanded", "false");
        menu.classList.remove("is-open");
    };

    toggle.addEventListener("click", () => {
        const isOpen = toggle.getAttribute("aria-expanded") === "true";
        toggle.setAttribute("aria-expanded", String(!isOpen));
        menu.classList.toggle("is-open", !isOpen);
    });

    menu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", closeMenu);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeMenu();
        }
    });
});

document.querySelectorAll("[data-year]").forEach((element) => {
    element.textContent = new Date().getFullYear();
});

document.querySelectorAll(".favorite-button").forEach((button) => {
    button.addEventListener("click", () => {
        const isSaved = button.getAttribute("aria-pressed") === "true";
        button.setAttribute("aria-pressed", String(!isSaved));
        button.querySelector("span").textContent = isSaved ? "☆" : "★";
        button.lastChild.textContent = isSaved ? " Save the Jesko" : " Jesko saved";
    });
});

const filterButtons = document.querySelectorAll(".filter-button");
const collectionCards = document.querySelectorAll(".collection-card");

if (filterButtons.length && collectionCards.length) {
    const emptyMessage = document.querySelector(".empty-filter");

    filterButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const filter = button.dataset.filter;
            let visibleCount = 0;

            filterButtons.forEach((filterButton) => {
                const isActive = filterButton === button;
                filterButton.classList.toggle("is-active", isActive);
                filterButton.setAttribute("aria-pressed", String(isActive));
            });

            collectionCards.forEach((card) => {
                const isVisible = filter === "all" || card.dataset.category === filter;
                card.hidden = !isVisible;
                visibleCount += Number(isVisible);
            });

            emptyMessage.hidden = visibleCount > 0;
        });
    });
}

const imageDialog = document.querySelector(".image-dialog");

if (imageDialog) {
    document.querySelectorAll(".image-open").forEach((button) => {
        button.addEventListener("click", () => {
            const sourceImage = button.querySelector("img");
            const cardTitle = button.closest(".collection-card").querySelector("h3");
            const dialogImage = imageDialog.querySelector("img");
            const dialogTitle = imageDialog.querySelector("p strong");

            dialogImage.src = sourceImage.src;
            dialogImage.alt = sourceImage.alt;
            dialogTitle.textContent = cardTitle.textContent;
            imageDialog.showModal();
        });
    });

    imageDialog.querySelector(".dialog-close").addEventListener("click", () => {
        imageDialog.close();
    });

    imageDialog.addEventListener("click", (event) => {
        if (event.target === imageDialog) {
            imageDialog.close();
        }
    });
}

const contactForm = document.querySelector("#garage-contact");

if (contactForm) {
    const messageField = contactForm.elements.message;
    const messageCount = document.querySelector("#message-count");
    const feedback = document.querySelector("#form-feedback");
    const copyButton = document.querySelector("#copy-message");
    let preparedMessage = "";

    messageField.addEventListener("input", () => {
        messageCount.textContent = String(messageField.value.length);
    });

    contactForm.addEventListener("submit", (event) => {
        event.preventDefault();

        if (!contactForm.reportValidity()) {
            return;
        }

        const formData = new FormData(contactForm);
        preparedMessage = [
            `Name: ${formData.get("name")}`,
            `Email: ${formData.get("email")}`,
            `Topic: ${formData.get("topic")}`,
            "",
            String(formData.get("message"))
        ].join("\n");

        feedback.dataset.error = "false";
        feedback.textContent = "Your message is prepared below. It has not been sent because this site does not have a message service connected.";

        const preview = document.createElement("pre");
        preview.className = "prepared-message";
        preview.textContent = preparedMessage;
        feedback.append(preview);
        feedback.hidden = false;
        copyButton.hidden = false;
    });

    copyButton.addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(preparedMessage);
            feedback.dataset.error = "false";
            feedback.firstChild.textContent = "Copied to your clipboard. Your message has not been sent.";
        } catch (error) {
            feedback.dataset.error = "true";
            feedback.firstChild.textContent = "Clipboard access was blocked. You can select and copy the prepared message shown below.";
        }
    });
}
