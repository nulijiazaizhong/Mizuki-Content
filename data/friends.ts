// 友情链接数据配置
// 用于管理友情链接页面的数据

export interface FriendItem {
	id: number;
	title: string;
	imgurl: string;
	desc: string;
	siteurl: string;
	tags: string[];
}

// 友情链接数据
export const friendsData: FriendItem[] = [
	{
		id: 0,
		title: "Srlily",
		imgurl: "https://avatars.githubusercontent.com/u/61527043?v=4&size=64",
		desc: "只会一点点的萌新",
		siteurl: "https://github.com/Srlily",
		tags: ["朋友"],
	},
	{
		id: 1,
		title: "BGYdook",
		imgurl: "https://gitlab.com/BGYdook/BGYdook/-/raw/main/image/touxiang-github.jpg?ref_type=heads",
		desc: "抑郁9年，没事请勿打扰",
		siteurl: "https://bgydook.top",
		tags: ["朋友"],
	},
	{
		id: 2,
		title: "ETS2LA",
		imgurl: "https://ets2la.com/assets/favicon.ico",
		desc: "一个旨在将自动驾驶技术应用于SCS Software卡车游戏的项目",
		siteurl: "https://github.com/ETS2LA/Euro-Truck-Simulator-2-Lane-Assist",
		tags: ["项目"],
	},
	{
		id: 3,
		title: "超量战纪",
		imgurl: "https://tuchuang.goodnightan.com/PicGo/HYPER-EXCESS.jpg",
		desc: "一支00后创业团队，坚守游戏创作初心，以热爱与专业打造精品；以技术创新为核心、艺术表达为追求，创造触动心灵的体验。秉持诚信、专注、创新、共赢，立足中国、面向全球，构建属于中国人的原创游戏IP宇宙。",
		siteurl: "https://www.ngamesart.com.cn",
		tags: ["游戏工作室"],
	},
	{
		id: 4,
		title: "Astro",
		imgurl: "https://avatars.githubusercontent.com/u/44914786?v=4&s=640",
		desc: "The web framework for content-driven websites",
		siteurl: "https://github.com/withastro/astro",
		tags: ["框架"],
	},
	{
		id: 5,
		title: "Mizuki Docs",
		imgurl: "https://q.qlogo.cn/headimg_dl?dst_uin=3231515355&spec=640&img_type=jpg",
		desc: "Mizuki User Manual",
		siteurl: "https://docs.mizuki.mysqil.com",
		tags: ["文档"],
	},
	{
		id: 6,
		title: "LsAng",
		imgurl: "https://llds.cloud/_nuxt/avatar.DCJjbfvc.gif",
		desc: "学习、探索中",
		siteurl: "https://llds.cloud",
		tags: ["友情链接"],
	},
	{
		id: 7,
		title: "Liseezn'blog",
		imgurl: "https://blog.liseezn.top/logo.webp",
		desc: "分享个人学习，项目，及一些教程",
		siteurl: "https://blog.liseezn.top",
		tags: ["友情链接"],
	},
];

// 获取所有友情链接数据
export function getFriendsList(): FriendItem[] {
	return friendsData;
}

// 获取随机排序的友情链接数据
export function getShuffledFriendsList(): FriendItem[] {
	const shuffled = [...friendsData];
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}
