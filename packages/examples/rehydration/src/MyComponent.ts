import Component, { hbs, tracked } from '@glimmerx/component';
import { on, action } from '@glimmerx/modifier';

interface Args {
  count?: number;
}

export default class HelloWorld extends Component<Args> {
  @tracked count;

  constructor(owner: unknown, args: Args) {
    super(owner, args);
    this.count = this.args.count || 1;
  }

  @action increment() {
    this.count++;
  }

  static template = hbs`
    <p>You have clicked the button {{this.count}} times.</p>

    <button {{on "click" this.increment}}>Click</button>
  `;
}
