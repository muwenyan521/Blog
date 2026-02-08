import * as fs from "node:fs";
import * as path from "node:path";

export interface FavoriteItem {
	id: string;
	src: string;
	alt: string;
	title: string;
	date: string;
	mtime: number;
	birthtime: number;
	meta?: {
		type: string; // 'TRAIN' | 'FLIGHT' | 'MOVIE' | 'COLL'
		code?: string; // 车次号或航班号
	};
}

/**
 * 智能提取文件名中的信息
 * 支持格式：G1724_2025-10-06.png, MU5678_旅行_20251006.jpg
 */
function parseFileInfo(fileName: string, fileMtime: Date) {
	const parts = fileName.split('_');
	let type = 'COLL';
	let code = 'MEMO';
	let extractedDate = '';
	let description = '';

	// 1. 尝试从各分段中提取信息
	for (const part of parts) {
		// 匹配日期 (YYYY-MM-DD 或 YYYYMMDD)
		const dateMatch = part.match(/(\d{4}-\d{2}-\d{2})|(\d{8})/);
		if (dateMatch && !extractedDate) {
			extractedDate = dateMatch[0].includes('-') 
				? dateMatch[0] 
				: `${dateMatch[0].substring(0,4)}-${dateMatch[0].substring(4,6)}-${dateMatch[0].substring(6,8)}`;
			continue;
		}

		// 匹配车次 (G/D/K/T/Z + 数字 或 纯四位数字)
		const trainMatch = part.match(/^([GDKTZ]\d{1,4}|\d{4})$/i);
		if (trainMatch) {
			// 简单过滤：如果是纯数字且在 2000-2099 之间，且后面还有更像日期的部分，则跳过以防误判年份
			// 但由于普速列车确实包含这个区间，我们优先识别日期，剩下的 4 位数才识别为车次
			type = 'TRAIN';
			code = trainMatch[0].toUpperCase();
			continue;
		}

		// 匹配航班 (两个大写字母 + 3到4位数字)
		const flightMatch = part.match(/^[A-Z]{2}\d{3,4}$/i);
		if (flightMatch) {
			type = 'FLIGHT';
			code = flightMatch[0].toUpperCase();
			continue;
		}

		// 如果不是日期也不是代号，则视为描述
		if (part && !description) {
			description = part;
		}
	}

	// 2. 匹配电影关键字
	if (fileName.includes('电影') || fileName.toUpperCase().includes('MOVIE')) {
		type = 'MOVIE';
		code = 'FILM';
	}

	// 3. 确定最终标题 (如果描述为空，则用代号)
	const title = description || code;

	// 4. 确定最终日期 (文件名日期优先级高于文件修改日期)
	const finalDate = extractedDate || fileMtime.toISOString().split('T')[0];

	return {
		title,
		date: finalDate,
		meta: { type, code }
	};
}

export async function scanFavorites(): Promise<FavoriteItem[]> {
	const favoritesDir = path.join(process.cwd(), "public/images/favorites");
	const items: FavoriteItem[] = [];

	if (!fs.existsSync(favoritesDir)) {
		try { fs.mkdirSync(favoritesDir, { recursive: true }); } catch (e) {}
		return [];
	}

	function walkDir(currentPath: string) {
		const files = fs.readdirSync(currentPath, { withFileTypes: true });

		for (const file of files) {
			const filePath = path.join(currentPath, file.name);
			if (file.isDirectory()) {
				walkDir(filePath);
			} else {
				const ext = path.extname(file.name).toLowerCase();
				if ([".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".avif", ".bmp"].includes(ext)) {
					const stats = fs.statSync(filePath);
					const relativePath = path.relative(path.join(process.cwd(), "public"), filePath);
					
					const baseName = path.basename(file.name, ext);
					const info = parseFileInfo(baseName, stats.mtime);

					items.push({
						id: baseName + stats.mtimeMs,
						src: `/${relativePath.replace(/\\/g, "/")}`,
						alt: info.title,
						title: info.title,
						date: info.date,
						mtime: new Date(info.date).getTime(),
						birthtime: stats.birthtimeMs || stats.ctimeMs, // 记录创建时间
						meta: info.meta
					});
				}
			}
		}
	}

	walkDir(favoritesDir);

	// 综合排序逻辑
	return items.sort((a, b) => {
		// 1. 首先按记录日期 (date) 降序排列
		if (b.mtime !== a.mtime) {
			return b.mtime - a.mtime;
		}
		// 2. 如果日期相同，按文件创建日期 (birthtime) 降序排列
		return b.birthtime - a.birthtime;
	});
}