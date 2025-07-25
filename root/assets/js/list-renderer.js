class ListRenderer {
    constructor({
        containerId,
        dataSets = {},
        defaultKey = null,
        buttonMap = {},
        activeClass = 'active',
        emptyMessage = 'No Data Found',
        emptyClass = 'list-empty'
    }) {
        this.container = document.getElementById(containerId);
        if (!this.container) {
            console.error(`ListRenderer error: No container found with ID "${containerId}"`);
            return;
        }

        this.dataSets = dataSets;
        this.defaultKey = defaultKey;
        this.buttonMap = buttonMap;
        this.activeClass = activeClass;
        this.emptyMessage = emptyMessage;
        this.emptyClass = emptyClass;

        this.init();
    }

    init() {
        if (this.defaultKey && this.dataSets[this.defaultKey]) {
            this.renderList(this.dataSets[this.defaultKey]);
            this.setActiveButton(this.getButtonIdByKey(this.defaultKey));
        }

        for (const [key, buttonId] of Object.entries(this.buttonMap)) {
            const button = document.getElementById(buttonId);
            if (button) {
                button.addEventListener('click', () => {
                    this.renderList(this.dataSets[key]);
                    this.setActiveButton(buttonId);
                });
            }
        }
    }

    renderList(items) {
        this.container.innerHTML = '';

        if (!Array.isArray(items) || items.length === 0) {
            const emptyDiv = document.createElement('div');
            emptyDiv.className = this.emptyClass;
            emptyDiv.textContent = this.emptyMessage;
            this.container.appendChild(emptyDiv);
            return;
        }

        items.forEach(item => {
            const li = document.createElement('li');
            li.className = 'list-group-item';
            li.textContent = item;
            this.container.appendChild(li);
        });
    }

    setActiveButton(activeId) {
        if (!this.activeClass) return;
        Object.values(this.buttonMap).forEach(buttonId => {
            const btn = document.getElementById(buttonId);
            if (btn) btn.classList.remove(this.activeClass);
        });
        const activeBtn = document.getElementById(activeId);
        if (activeBtn) activeBtn.classList.add(this.activeClass);
    }

    getButtonIdByKey(key) {
        return this.buttonMap[key] || null;
    }
}
