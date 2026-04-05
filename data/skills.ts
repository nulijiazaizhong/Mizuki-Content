// 技能数据配置文件
// 用于管理技能展示页面的数据

export interface Skill {
	id: string;
	name: string;
	description: string;
	icon: string; // Iconify icon name
	category: "frontend" | "backend" | "database" | "tools" | "other";
	level: "beginner" | "intermediate" | "advanced" | "expert";
	experience: {
		years: number;
		months: number;
	};
	projects?: string[]; // 相关项目ID
	certifications?: string[];
	color?: string; // 技能卡片主题色
}

export const skillsData: Skill[] = [
	// Frontend Skills
	{
		id: "javascript",
		name: "JavaScript",
		description:
			"现代JavaScript开发，包括ES6+语法、异步编程、模块化开发等。",
		icon: "logos:javascript",
		category: "frontend",
		level: "advanced",
		experience: { years: 3, months: 6 },
		projects: ["Astro-Mizuki", "napcat-plugin-komari"],
		color: "#F7DF1E",
	},
	{
		id: "typescript",
		name: "TypeScript",
		description:
			"在机器人插件开发和 Web 项目中广泛使用类型安全开发，具备复杂类型推导和大型项目重构经验。",
		icon: "logos:typescript-icon",
		category: "frontend",
		level: "advanced",
		experience: { years: 2, months: 8 },
		projects: ["napcat-plugin-komari", "Astro-Mizuki"],
		color: "#3178C6",
	},
	{
		id: "astro",
		name: "Astro",
		description:
			"精通 Astro 框架及其岛屿架构，能够高效构建极速响应的现代化内容驱动型网站。",
		icon: "logos:astro-icon",
		category: "frontend",
		level: "advanced",
		experience: { years: 1, months: 2 },
		projects: ["Astro-Mizuki"],
		color: "#FF5D01",
	},
	{
		id: "tailwindcss",
		name: "Tailwind CSS",
		description: "实用优先的CSS框架，快速构建现代化用户界面。",
		icon: "logos:tailwindcss-icon",
		category: "frontend",
		level: "advanced",
		experience: { years: 2, months: 0 },
		projects: ["Astro-Mizuki"],
		color: "#06B6D4",
	},

	// Backend Skills
	{
		id: "python",
		name: "Python",
		description:
			"深入掌握 Python 异步编程 (asyncio)，广泛应用于 Discord 和 Kook 机器人的开发，具备处理高并发消息同步的实战经验。",
		icon: "logos:python",
		category: "backend",
		level: "advanced",
		experience: { years: 3, months: 0 },
		projects: ["discord-sync-kook", "astrbot-plugin-komari"],
		color: "#3776AB",
	},
	{
		id: "csharp",
		name: "C#",
		description:
			"熟练使用 .NET 开发跨平台应用，在 Discord-Kook 消息同步系统中负责高性能的服务端逻辑实现。",
		icon: "devicon:csharp",
		category: "backend",
		level: "advanced",
		experience: { years: 2, months: 4 },
		projects: ["discord-sync-kook"],
		color: "#239120",
	},
	{
		id: "cpp",
		name: "C++",
		description:
			"精通现代 C++ (C++17/20) 标准，擅长开发高性能模板库和系统级优化，具备大型项目模板维护经验。",
		icon: "logos:c-plusplus",
		category: "backend",
		level: "advanced",
		experience: { years: 5, months: 4 },
		projects: ["modern-cpp-template"],
		color: "#00599C",
	},

	// Tools
	{
		id: "git",
		name: "Git",
		description:
			"深入理解 Git 工作流，具备处理大规模代码库和复杂分支管理的实战能力，年均贡献 800+ 提交。",
		icon: "logos:git-icon",
		category: "tools",
		level: "expert",
		experience: { years: 4, months: 0 },
		color: "#F05032",
	},
	{
		id: "vscode",
		name: "VS Code",
		description:
			"精通 IDE 深度配置与插件开发，通过自动化工作流极大地提升开发效率。",
		icon: "logos:visual-studio-code",
		category: "tools",
		level: "expert",
		experience: { years: 4, months: 0 },
		color: "#007ACC",
	},
	{
		id: "cmake",
		name: "CMake",
		description:
			"熟练编写复杂的 CMake 构建脚本，支持跨平台 C++ 项目的编译、打包与依赖管理。",
		icon: "skill-icons:cmake-dark",
		category: "tools",
		level: "advanced",
		experience: { years: 2, months: 0 },
		projects: ["modern-cpp-template"],
		color: "#064F8C",
	},

	// Other Skills
	{
		id: "bot-dev",
		name: "Bot Development",
		description:
			"资深 Bot 开发专家，精通各平台 Bot API 及其 SDK，在跨平台消息同步、自动化运维插件开发方面有深厚造诣。",
		icon: "logos:robot-framework",
		category: "other",
		level: "expert",
		experience: { years: 2, months: 6 },
		projects: [
			"astrbot-plugin-komari",
			"napcat-plugin-komari",
			"discord-sync-kook",
		],
		color: "#7289DA",
	},

	// 3D & Game Engine Skills
	{
		id: "blender",
		name: "Blender",
		description:
			"资深 Blender 用户，精通建模、雕刻、节点材质以及动画制作，能够独立完成高质量的 3D 资产创作。",
		icon: "logos:blender",
		category: "other",
		level: "expert",
		experience: { years: 5, months: 9 },
		color: "#F5792A",
	},
	{
		id: "3dsmax",
		name: "3ds Max",
		description:
			"具备深厚的 3ds Max 建模与渲染经验，擅长硬表面建模与室内外场景表现。",
		icon: "devicon:3dsmax",
		category: "other",
		level: "expert",
		experience: { years: 5, months: 3 },
		color: "#1E2021",
	},
	{
		id: "unreal",
		name: "Unreal Engine",
		description:
			"熟练使用虚幻引擎进行场景搭建、蓝图开发及材质调节，具备开发高质量实时渲染项目的能力。",
		icon: "streamline-logos:unreal-engine-logo-block",
		category: "other",
		level: "expert",
		experience: { years: 4, months: 8 },
		projects: ["modern-cpp-template"],
		color: "#0E1128",
	},
	{
		id: "substance",
		name: "Substance 3D Painter",
		description:
			"精通 PBR 材质工作流，能够通过 Substance 3D Painter 制作极具真实感的资产纹理。",
		icon: "simple-icons:adobe",
		category: "other",
		level: "advanced",
		experience: { years: 3, months: 6 },
		color: "#FF0000",
	},
	{
		id: "maya",
		name: "Maya",
		description:
			"掌握 Maya 的核心建模与绑定工作流，能够配合项目需求进行高效的 3D 生产协作。",
		icon: "devicon:maya",
		category: "other",
		level: "intermediate",
		experience: { years: 2, months: 4 },
		color: "#37A5CC",
	},

	// Media & Post-Production Skills
	{
		id: "photoshop",
		name: "Photoshop",
		description:
			"熟练使用 Photoshop 进行图像处理、UI 设计及贴图绘制，具备深厚的视觉设计功底。",
		icon: "logos:adobe-photoshop",
		category: "other",
		level: "advanced",
		experience: { years: 3, months: 8 },
		color: "#31A8FF",
	},
	{
		id: "premiere",
		name: "Premiere Pro",
		description:
			"具备丰富的视频剪辑经验，熟练掌握剪辑节奏、调色及音频处理，能够独立完成高质量视频产出。",
		icon: "logos:adobe-premiere",
		category: "other",
		level: "advanced",
		experience: { years: 3, months: 4 },
		color: "#9999FF",
	},
	{
		id: "davinci",
		name: "DaVinci Resolve",
		description:
			"掌握达芬奇的基础剪辑与调色工作流，能够进行专业的视频后期色彩校正。",
		icon: "simple-icons:davinciresolve",
		category: "other",
		level: "intermediate",
		experience: { years: 1, months: 2 },
		color: "#000000",
	},
];

// 获取技能统计信息
export const getSkillStats = () => {
	const total = skillsData.length;
	const byLevel = {
		beginner: skillsData.filter((s) => s.level === "beginner").length,
		intermediate: skillsData.filter((s) => s.level === "intermediate")
			.length,
		advanced: skillsData.filter((s) => s.level === "advanced").length,
		expert: skillsData.filter((s) => s.level === "expert").length,
	};
	const byCategory = {
		frontend: skillsData.filter((s) => s.category === "frontend").length,
		backend: skillsData.filter((s) => s.category === "backend").length,
		database: skillsData.filter((s) => s.category === "database").length,
		tools: skillsData.filter((s) => s.category === "tools").length,
		other: skillsData.filter((s) => s.category === "other").length,
	};

	return { total, byLevel, byCategory };
};

// 按分类获取技能
export const getSkillsByCategory = (category?: string) => {
	if (!category || category === "all") {
		return skillsData;
	}
	return skillsData.filter((s) => s.category === category);
};

// 获取高级技能
export const getAdvancedSkills = () => {
	return skillsData.filter(
		(s) => s.level === "advanced" || s.level === "expert",
	);
};

// 计算总经验年数
export const getTotalExperience = () => {
	const totalMonths = skillsData.reduce((total, skill) => {
		return total + skill.experience.years * 12 + skill.experience.months;
	}, 0);
	return {
		years: Math.floor(totalMonths / 12),
		months: totalMonths % 12,
	};
};
