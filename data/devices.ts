// 设备数据配置文件

export interface Device {
	name: string;
	image: string;
	specs: string;
	description: string;
	link: string;
}

// 设备类别类型，支持品牌和自定义类别
export type DeviceCategory = Record<string, Device[]> & {
	自定义?: Device[];
};

export const devicesData: DeviceCategory = {
	HUAWEI: [
		{
			name: "HUAWEI Mate 40 Pro",
			image: "/images/device/Mate40Pro.webp",
			specs: "White / 8G + 256GB",
			description:
				"搭载麒麟9000 5G SoC旗舰芯片，配备5000万像素超感知徕卡主摄，是影像与性能的巅峰之作。",
			link: "",
		},
		{
			name: "HUAWEI MatePad Pro 2025",
			image: "/images/device/MatePadPro.webp",
			specs: "Black / 12G + 512GB / 13.2",
			description:
				"13.2英寸柔性OLED极边屏，支持星闪技术，机身轻薄至5.5mm，提供桌面级办公体验。",
			link: "https://www.vmall.com/product/comdetail/index.html?prdId=10086120212240&sbomCode=2701010110408",
		},
		{
			name: "HUAWEI 智能磁吸键盘-星闪版",
			image: "/images/device/SmartKeyboardStarFlash.webp",
			specs: "Black / 星闪 / MatePad Pro 2025 / 13.2",
			description:
				"采用星闪无线连接技术，低时延、高可靠，支持分体式形态，提供PC级按键敲击感。",
			link: "https://www.vmall.com/product/comdetail/index.html?prdId=10086221409407&sbomCode=3105010007702",
		},
		{
			name: "HUAWEI 星跃鼠标 GT",
			image: "/images/device/MouseGT.webp",
			specs: "Black / 柔光版 / HarmonyOS Next / 13.2",
			description:
				"首款星闪连接鼠标，支持8000Hz回报率，轻量化设计，疾速响应，专为高效办公打造。",
			link: "https://www.vmall.com/product/comdetail/index.html?prdId=10086545147949&sbomCode=3104020007604",
		},
		{
			name: "HUAWEI  M-Pencil 3",
			image: "/images/device/M-Pencil3.webp",
			specs: "Black / 星闪 / MatePad Pro 2025 / 13.2",
			description:
				"全球首款星闪压感手写笔，支持万级压感，超低时延，还原真实纸笔书写体验。",
			link: "https://www.vmall.com/product/comdetail/index.html?prdId=10086453278222&sbomCode=3105030002903",
		},
		{
			name: "HUAWEI WATCH GT 5 Pro",
			image: "/images/device/WATCHGT5Pro.webp",
			specs: "Black / 穿戴设备",
			description:
				"采用玄玑感知系统，支持专业级运动监测，兼顾专业运动性与高阶时尚设计。",
			link: "https://www.vmall.com/product/comdetail/index.html?prdId=10086407090731&sbomCode=2901010103301",
		},
		{
			name: "HUAWEI FreeBuds Pro 4",
			image: "/images/device/FreeBudsPro4.webp",
			specs: "Black / 星闪",
			description:
				"搭载星闪音频技术，支持无损音质与智慧动态降噪4.0，带来极致的静谧听感。",
			link: "https://consumer.huawei.com/cn/audio/",
		},
		{
			name: "HUAWEI 路由 Q6",
			image: "/images/device/Q6.webp",
			specs: "White / Wi-Fi 6+ / 1000Mbps",
			description:
				"全屋Wi-Fi 6+覆盖方案，子母路由架构，子路由即插即用，轻松解决大户型覆盖难题。",
			link: "https://www.vmall.com/product/comdetail/index.html?prdId=10086762283123&sbomCode=3001010048301",
		},
		{
			name: "HUAWEI 路由 AX2 Pro",
			image: "/images/device/AX2Pro.webp",
			specs: "White / Wi-Fi 6 / 1000Mbps",
			description:
				"入门级Wi-Fi 6路由器，支持5GHz Wi-Fi 6，信号穿墙能力强，性价比出色。",
			link: "https://www.vmall.com/product/comdetail/index.html?prdId=10086131745276&sbomCode=3001010032701",
		},
	],
	ASUS: [
		{
			name: "ROG 魔霸新锐 2024",
			image: "/images/device/ROG2024.webp",
			specs: "i9-13980HX / 4060",
			description:
				"搭载i9-13980HX处理器与RTX 4060显卡，配备2.5K 240Hz电竞屏，性能释放强劲。",
			link: "https://www.asus.com.cn/supportonly/g614jv/helpdesk_download/",
		},
	],
	Moza: [
		{
			name: "Moza R5 2",
			image: "/images/device/MozaR52.webp",
			specs: "5N·m",
			description:
				"入门级直驱模拟赛车基座，提供5N·m恒定扭矩，还原真实路面反馈。",
			link: "https://www.asus.com.cn/supportonly/g614jv/helpdesk_download/",
		},
	],
};
