import {EventListener} from "../../models/EventListener.js";
import {ListElementWithRenameLabel} from "../ListElementWithRenameLabel.js";
import {Events} from "../../Events.js";

export class LibraryItemListElement extends ListElementWithRenameLabel {

	#icon = new Image();
	#mediaFile;

	constructor(mediaFile) {
		super(mediaFile.name);
		this.classList.add("library-item-list-el");
		this.#mediaFile = mediaFile;

		if(mediaFile.type.startsWith("image/")) {
			this.#icon.src = "./assets/image-ico.png";
		}

		this.prepend(this.#icon);

		this.listenEvents(
			new EventListener(this, Events.CLICK, (event) => {
				this.dispatchEvent(new Event(Events.LIBRARY_ITEM_SELECTED, {bubbles: true}));
				this.classList.add("selected");
			}),
			new EventListener(this, Events.LABEL_CHANGED, (event) => {
				mediaFile.name = this.labelText;
			}),

		);
	}


	get mediaFile() {
		return this.#mediaFile;
	}


	remove() {
		//todo: add dispose
		super.remove();
		this.#mediaFile.dispose();
		this.#icon = null;
		this.#mediaFile = null;
	}
}

customElements.define("library-item-list-el", LibraryItemListElement);