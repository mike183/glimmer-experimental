import { Option, CompileTimeComponent, Dict, } from '@glimmer/interfaces';
import { ResolverDelegate, templateFactory } from '@glimmer/opcode-compiler';
import { TemplateMeta, ComponentConstructor, definitionFor } from '../index';
import RuntimeResolverDelegate from './runtime-resolver';

export default class CompileTimeResolver implements ResolverDelegate {
  constructor(private runtimeResolver: RuntimeResolverDelegate) {}
  registry: Dict<any> = {};

  lookupHelper(_name: string, _referrer: unknown): Option<number> {
    throw new Error("Method not implemented.");
  }

  lookupModifier(_name: string, _referrer: unknown): Option<number> {
    throw new Error("Method not implemented.");
  }

  lookupComponent(name: string, referrer: TemplateMeta): Option<CompileTimeComponent> {
    const scope = referrer.scope();
    const ComponentClass = scope[name] as any as ComponentConstructor;
    const definition = definitionFor(ComponentClass) as any;
    const { state } = definition;
    const { template, handle, capabilities } = state;

    this.runtimeResolver.registry[handle] = definition;

    return {
      handle,
      capabilities,
      compilable: templateFactory(template!)
        .create()
        .asLayout()
    }
  }

  lookupPartial(_name: string, _referrer: unknown): Option<number> {
    throw new Error("Method not implemented.");
  }

  resolve(handle: number): unknown {
    return this.registry[handle];
  }
}