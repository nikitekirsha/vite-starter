export type HeaderTag = HTMLElementTagNameMap['header']

export type HeaderRefs = {
	$root: HeaderTag,
	$message: HTMLSpanElement | null
}

export type HeaderOptions = {
	text: string | null
}

export type HeaderState = {
	isMessageAdded: boolean
}
