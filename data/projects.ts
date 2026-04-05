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
		title: "Mizuki Blog Theme",
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
		category: "other",
		techStack: ["Python", "C#", "Discord.py", "Kook.py"],
		status: "completed",
		sourceCode: "https://github.com/nulijiazaizhong/discord-sync-kook",
		startDate: "2023-11-01",
		featured: true,
		tags: ["Bot", "Sync", "Discord", "Kook"],
	},
	{
		id: "astrbot-plugin-komari",
		title: "Astrbot Plugin Komari",
		description:
			"基于 komari 获取服务器信息的 Astrbot 插件，提供便捷的服务器状态查询功能。",
		image: "",
		category: "other",
		techStack: ["Python", "HTML", "Astrbot"],
		status: "completed",
		sourceCode: "https://github.com/nulijiazaizhong/astrbot-plugin-komari",
		startDate: "2024-02-01",
		featured: true,
		tags: ["Bot", "Plugin", "Astrbot"],
	},
	{
		id: "napcat-plugin-komari",
		title: "Napcat Plugin Komari",
		description:
			"基于 komari 获取服务器信息的 napcat 插件，适用于 Napcat 机器人平台。",
		image: "",
		category: "other",
		techStack: ["TypeScript", "Napcat"],
		status: "completed",
		sourceCode: "https://github.com/nulijiazaizhong/napcat-plugin-komari",
		startDate: "2024-03-01",
		featured: true,
		tags: ["Bot", "Plugin", "Napcat"],
	},
	{
		id: "modern-cpp-template",
		title: "Modern C++ Template",
		description:
			"现代 C++ 项目模板，集成了常用的构建和测试工具，方便快速启动新项目。",
		image: "",
		category: "other",
		techStack: ["C++", "CMake"],
		status: "completed",
		sourceCode: "https://github.com/nulijiazaizhong/modern-cpp-template",
		startDate: "2023-08-01",
		featured: false,
		tags: ["C++", "Template", "CMake"],
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
