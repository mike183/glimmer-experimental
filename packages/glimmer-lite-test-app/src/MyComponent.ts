import { Component } from 'glimmer-lite-core';
import { tracked } from '@glimmer/component';

import OtherComponent from './OtherComponent';

function hbs(_strings: TemplateStringsArray) {
}

class MyComponent extends Component {
  static template = hbs`
    <h1>Hello {{this.message}}</h1> <OtherComponent @count={{this.count}} />
  `

  message = 'hello world';
  @tracked count = 55;

  constructor(owner: unknown, args: object) {
    super(owner, args);
    setInterval(() => {
      this.count++;
    }, 16);
  }
}

export default MyComponent;