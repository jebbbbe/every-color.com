function defaultOnChange(selectedValue){
    console.log(`Selected value: ${selectedValue}`);
}

const sampleOptions = {
    option1: "Option 1",
    option2: "Option 2",
    option3: "Option 3",
};


export class DynamicDropdown {
    constructor(formId, options = sampleOptions, onChangeCallback = defaultOnChange, defaultSelection = null) {
        this.form = document.getElementById(formId);
        if (!this.form) {
            // If form not found, create a new form and append it to the body
            this.form = document.createElement('form');
            this.form.id = formId || `form_${Date.now()}`; // Assign a unique ID if none provided
            document.body.appendChild(this.form);
        }
        this.options = options;
        this.onChangeCallback = onChangeCallback;
        this.defaultSelection = defaultSelection;

        this.createDropdown();
    }

    createDropdown() {
        // Create the select element
        this.select = document.createElement('select');
        this.select.name = 'dynamicOptions';
        this.select.id = 'dynamicOptions';

        // Populate the dropdown with options
        Object.entries(this.options).forEach(([key, value]) => {
            const option = document.createElement('option');
            option.value = key;
            option.textContent = value;
            if (key === this.defaultSelection) {
                option.selected = true;
            }
            this.select.appendChild(option);
        });

        // Attach the onchange event listener
        this.select.addEventListener('change', (event) => {
            if (typeof this.onChangeCallback === 'function') {
                this.onChangeCallback(event.target.value);
            }
        });

        // Append the dropdown to the form
        this.form.appendChild(this.select);
    }
}