export {};

declare global {
	interface SearchResult {
		url: string;
		meta: {
			title: string;
		};
		excerpt: string;
		content?: string;
		word_count?: number;
		filters?: Record<string, unknown>;
		anchors?: Array<{
			element: string;
			id: string;
			text: string;
			location: number;
		}>;
		weighted_locations?: Array<{
			weight: number;
			balanced_score: number;
			location: number;
		}>;
		locations?: number[];
		raw_content?: string;
		raw_url?: string;
		sub_results?: SearchResult[];
	}

	interface HTMLElementTagNameMap {
		"table-of-contents": HTMLElement & {
			init?: () => void;
		};
	}

	interface Window {
		// Swup 实例
		swup: any;

		// 页面组件函数
		closeAnnouncement: () => void;
		mobileTOCInit?: () => void; // 可选，因为初始化前可能未挂载
		initSemifullScrollDetection?: () => void;

		// 状态标识
		sakuraInitialized?: boolean; // 修复 sakuraInitialized 报错
		iconifyLoaded?: boolean;

		// 核心管理对象
		panelManager?: any; // 修复 panelManager 报错
		siteConfig: any;

		// Pagefind 搜索
		pagefind: {
			search: (query: string) => Promise<{
				results: Array<{
					data: () => Promise<SearchResult>;
				}>;
			}>;
		};

		// 资源加载器
		__iconifyLoader?: {
			load: () => Promise<void>;
			addToPreloadQueue: (icons: string[]) => void;
			onLoad: (callback: () => void) => void;
			isLoaded: boolean;
		};
	}
}
