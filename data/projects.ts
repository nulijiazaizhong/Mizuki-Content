// 项目数据配置文件
// 用于管理项目展示页面的数据

export interface Project {
	id: string;
	title: string;
	description: string;
	image: string;
	category: "web" | "mobile" | "desktop" | "other";
	techStack: string[];
	status: "completed" | "in-progress" | "planned";
	liveDemo?: string;
	sourceCode?: string;
	startDate: string;
	endDate?: string;
	featured?: boolean;
	tags?: string[];
}

export const projectsData: Project[] = [
	{
		id: "mizuki-blog",
		title: "博客开源地址",
		description:
			"基于Astro框架开发的现代化博客主题，支持多语言、暗黑模式、响应式设计等功能。",
		image: "",
		category: "web",
		techStack: ["Astro", "TypeScript", "Tailwind CSS", "Svelte"],
		status: "completed",
		liveDemo: "https://blog.example.com",
		sourceCode: "https://github.com/nulijiazaizhong/Astro-Mizuki",
		startDate: "2024-01-01",
		endDate: "2024-06-01",
		featured: true,
		tags: ["Blog", "Theme", "Open Source"],
	},
	{
		id: "discord-sync-kook",
		title: "Discord Sync Kook",
		description:
			"将 Discord 的消息同步至 KOOK，支持多种消息格式和媒体同步。",
		image: "",
		category: "web",
		techStack: ["Python", "C#", "Discord.py", "Kook.py"],
		status: "completed",
		sourceCode: "https://github.com/nulijiazaizhong/Discord-Kook-relay",
		startDate: "2026-03-23",
		featured: true,
		tags: ["Bot", "Sync", "Discord", "Kook"],
	},
	{
		id: "astrbot-plugin-komari",
		title: "Astrbot Plugin Komari",
		description:
			"基于 komari 获取服务器信息的 Astrbot 插件，提供便捷的服务器状态查询功能。",
		image: "",
		category: "web",
		techStack: ["Python", "HTML", "Astrbot"],
		status: "completed",
		sourceCode: "https://github.com/nulijiazaizhong/astrbot-plugin-komari",
		startDate: "2026-02-01",
		featured: true,
		tags: ["Bot", "Plugin", "Astrbot"],
	},
	{
		id: "napcat-plugin-komari",
		title: "Napcat Plugin Komari",
		description:
			"基于 komari 获取服务器信息的 napcat 插件，适用于 Napcat 机器人平台。",
		image: "",
		category: "web",
		techStack: ["TypeScript", "Napcat"],
		status: "completed",
		sourceCode: "https://github.com/nulijiazaizhong/napcat-plugin-komari",
		startDate: "2026-03-01",
		featured: true,
		tags: ["Bot", "Plugin", "Napcat"],
	},
	{
		id: "Stellar-homepage",
		title: "Stellar Homepage",
		description:
			"一个简洁高效的 Astro 个人站点模板",
		image: "",
		category: "web",
		techStack: ["Astro", "JavaScript", "Tailwind CSS"],
		status: "in-progress",
		sourceCode: "https://github.com/nulijiazaizhong/Stellar",
		startDate: "2026-06-10",
		featured: false,
		tags: ["homepage", "Template", "Astro"],
	},
	{
		id: "Satisfactory Logistics Platform",
		title: "Satisfactory Logistics Platform",
		description:
			"一个用于 Satisfactory 的生产线计算器和工厂布局规划平台",
		image: "",
		category: "web",
		techStack: ["Vue", "TypeScript", "Tailwind CSS"],
		status: "in-progress",
		sourceCode: "https://github.com/nulijiazaizhong/Satisfactory-Logistics-Platform",
		startDate: "2026-05-30",
		featured: false,
		tags: ["Logistics", "Calculator", "Planning"],
	},
];

// 获取项目统计信息
export const getProjectStats = () => {
	const total = projectsData.length;
	const completed = projectsData.filter(
		(p) => p.status === "completed",
	).length;
	const inProgress = projectsData.filter(
		(p) => p.status === "in-progress",
	).length;
	const planned = projectsData.filter((p) => p.status === "planned").length;

	return {
		total,
		byStatus: {
			completed,
			inProgress,
			planned,
		},
	};
};

// 按分类获取项目
export const getProjectsByCategory = (category?: string) => {
	if (!category || category === "all") {
		return projectsData;
	}
	return projectsData.filter((p) => p.category === category);
};

// 获取特色项目
export const getFeaturedProjects = () => {
	return projectsData.filter((p) => p.featured);
};

// 获取所有技术栈
export const getAllTechStack = () => {
	const techSet = new Set<string>();
	projectsData.forEach((project) => {
		project.techStack.forEach((tech) => techSet.add(tech));
	});
	return Array.from(techSet).sort();
};
