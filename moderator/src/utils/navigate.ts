export class Navigate {
	private static instance: Navigate;	// Singleton
	private readonly root = "__root__";
	private pages: Record<string, () => void>;
	private currentPage: string;

	private constructor(homePage: () => void, pages: Record<string, () => void> = {}) {
		this.pages = pages;
		this.addPage({ page: this.root, callback: homePage });
		this.currentPage = this.root;
		history.pushState({ page: 1 }, "");
		window.addEventListener("popstate", (event) => {
			console.log("popstate", event.state);
			event.preventDefault();
			console.log("popstate", event.state);
			if(this.currentPage !== this.root) this.toHomePage();
			else history.back();
		});
	}

	public static getInstance(homePage?: () => void, pages?: Record<string, () => void>): Navigate {
		if(!Navigate.instance) {
			if(!homePage) throw new Error("You must provide a home page");
			Navigate.instance = new Navigate(homePage, pages);
		}
		return Navigate.instance;
	}

	public addPage({ page, callback }: { page: string; callback: () => void }) {
		this.pages[page] = callback;
	}

	public toHomePage(): void {
		this.currentPage = this.root;
		this.pages[this.root]();
	}

	public to(page: string): void {
		if(this.currentPage === page) return;
		if(!this.pages[page]) throw new Error(`Page ${page} not found`);
		this.currentPage = page;
		this.pages[page]();
	}
}
