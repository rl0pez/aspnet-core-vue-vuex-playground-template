﻿import Vue, { VNode } from 'vue';
import { Component, Prop } from 'vue-property-decorator';

/**
 * React render function in Vue - using TypeScript (.tsx) - single file
 */
@Component
export default class VDropdown extends Vue {
    public $refs: {
        dropdownMenu: HTMLElement,
        dropdownButton: HTMLElement
    }

    @Prop({ default: () => ([]) })
    options: any[];

    @Prop({ default: false })
    disabled: boolean;    

    @Prop({ default: 'label' })
    labelKey: string;    

    @Prop({ default: '' })
    placeholder: string;

    @Prop({ default: '' })
    wrapperClass: string;

    @Prop({ default: '' })
    buttonClass: string;

    @Prop({ default: '' })
    selectedOptionLabel: string;

    open: boolean = false;

    get isArrayOfObjects(): boolean {
        return this.options && (this.options[0] === Object(this.options[0]));
    }
      
    public render(): VNode {
        return (
            <div class={['dropdown', this.wrapperClass, { 'is-active': this.open }]}>
                <button class={['button', this.buttonClass]}
                        type="button"
                        ref="dropdownButton"
                        aria-haspopup="true"
                        aria-controls="dropdown-menu"
                        disabled={this.disabled}
                        onKeydown={this.keyDownHandler}
                        onClick={this.toggleDropdownMenu}                   
                        v-click-outside={this.hideDropdownMenu}>
                    <span>{this.selectedOptionLabel || this.placeholder}</span>
                    <span class="caret-select"></span>
                </button>
                <div class="dropdown-menu"
                     ref="dropdownMenu"
                     role="menu">
                    <ul class="dropdown-content">
                        { this.options.map((option: any, index: number) => this.renderListOption(option, index)) }
                    </ul>
                </div>
            </div>
        );
    }

    private renderListOption(option: any, index: number): VNode {
        const optionLabel = this.getOptionLabelName(option);
        return (           
            <li key={index}>
                <a role="button"
                   class={['dropdown-item', { 'selected-option': optionLabel === this.selectedOptionLabel }]}
                   onClick={() => this.updateSelectedOption(option)}>
                       { optionLabel }
                </a>
            </li>
        );
    }

    private hideDropdownMenu(): void {
        this.open = false;
    }

    private toggleDropdownMenu(): void {
        this.open = !this.open;
    }

    private updateSelectedOption(option: any): void {
        this.$emit('select', option);
    }

    private getOptionLabelName(option: any): string {
        return this.isArrayOfObjects ? (option[this.labelKey] || option[0]) : option;
    }

    private keyDownHandler(e: KeyboardEvent): void {
        if (e.keyCode === 38 || e.keyCode === 40) { // up and down keys
            this.toggleDropdownMenu();
            e.preventDefault();
        } else if (e.keyCode === 27) { // Esc key
            this.$refs.dropdownButton.focus();
            this.hideDropdownMenu();
        } else if (e.keyCode === 9) { // Tab key
            this.hideDropdownMenu();
        }
    }
}