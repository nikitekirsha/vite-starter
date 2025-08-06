
export abstract class AbstractComponent<
	Refs extends { $root: HTMLElement },
	Options extends Record<string, any> = {}
> {
	protected refs: Refs
	protected options: Options

	protected constructor(
		refs: Refs,
		options: Options = {} as Options
	) {
		this.refs = refs
		this.options = options
	}

	protected abstract init(): void
}
