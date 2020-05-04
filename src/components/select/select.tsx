import {
  Component,
  ComponentInterface,
  Element,
  Event,
  EventEmitter,
  h,
  Host,
  Listen,
  Prop,
  State,
  Watch,
} from '@stencil/core'

@Component({
  tag: 'mrb-select',
  styleUrl: 'select.scss',
  shadow: true,
})
export class SelectComponent implements ComponentInterface {
  @Element() el: HTMLElement

  @Prop() label!: string
  @Prop({ attribute: 'id', reflect: true }) idOption?: string = 'combobox'

  @State() value: string
  @State() icon: string = 'caret-down-outline'

  @Event() changeVisibilityOption: EventEmitter<boolean>

  input!: HTMLInputElement
  div!: HTMLDivElement
  isExpanded: boolean = false
  options: any[]

  @Listen('clickOption')
  async onChange({ detail }) {
    this.value = detail
    this.isShowList()
  }

  @Watch('value')
  hasMatchOption() {
    this.options.forEach((x) => {
      if (!x.textContent.toLowerCase().includes(this.value.toLowerCase())) {
        x.style.display = 'none'
      } else {
        this.icon = 'caret-up-outline'
        x.style.display = 'flex'
        this.isExpanded = true
      }
    })
  }

  componentWillLoad() {
    this.options = Array.from(this.el.querySelectorAll('mrb-select-option'))
  }

  render() {
    return (
      <Host>
        <div
          class={{ combobox: true }}
          ref={(el: HTMLDivElement) => (this.div = el)}
          role="combobox"
        >
          <label>{this.label}</label>
          <input
            type="text"
            id={this.idOption}
            value={this.value}
            ref={(el: HTMLInputElement) => (this.input = el)}
            onInput={() => (this.value = this.input.value)}
          />
          <ion-icon
            class="icon"
            name={this.icon}
            onClick={this.isShowList.bind(this)}
          />
        </div>
        <div class={{ 'options-list': true, 'is-expanded': this.isExpanded }}>
          <slot></slot>
        </div>
      </Host>
    )
  }

  private isShowList() {
    if (!this.isExpanded) {
      this.openList()
    } else {
      this.closeList()
    }
    this.isExpanded = !this.isExpanded
  }

  private closeList() {
    this.icon = 'caret-down-outline'
    this.changeVisibilityOption.emit(false)
  }

  private openList() {
    this.icon = 'caret-up-outline'
    this.changeVisibilityOption.emit(true)
  }
}