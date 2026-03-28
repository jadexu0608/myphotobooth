# Photobooth 项目进度总结

## 项目概述
手绘涂鸦风格的 Photobooth 网页应用，参考 mysketchbooth.com 的交互逻辑。用户可以拍照或上传照片，生成 4 格竖条大头贴照片条，支持下载和分享。

## 技术栈
- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- 字体：Google Fonts "Just Another Hand"（手写体，通过 className="font-hand" 调用）
- 背景色：白色 #FFFFFF
- 项目路径：~/photobooth/（Mac 本地开发）
- 开发工具：Claude Code（终端 AI 编程助手）
- Node.js 版本：v24.14.0（通过 nvm 安装）

## 当前项目结构
```
~/photobooth/
├── app/
│   ├── globals.css         # 白色背景 + font-hand CSS 变量
│   ├── layout.tsx          # Just Another Hand 字体 + bg-white
│   ├── page.tsx            # / 欢迎页（已实现，但使用 AI 生成的占位涂鸦）
│   ├── booth/
│   │   └── page.tsx        # /booth 拍照页（已实现，但使用占位涂鸦）
│   └── result/
│       └── page.tsx        # /result 结果页（已实现，但使用占位涂鸦）
├── public/
│   └── svg/                # 用户手绘 SVG 素材（已全部放入，共 9 个文件）
│       ├── booth-machine.svg   # Photobooth 机器主视觉（373x648，含帘子/招牌/投币口）
│       ├── enter-btn.svg       # Enter 按钮（141x95，双线手绘框 + 手写文字）
│       ├── restart-btn.svg     # Restart 按钮（122x56，手绘框 + 手写文字）
│       ├── shutter.svg         # 快门按钮（48x46，手绘相机轮廓）
│       ├── light-red.svg       # 红色指示灯（20x20，纯色圆形）
│       ├── light-green.svg     # 绿色指示灯（20x20，纯色圆形）
│       ├── countdown.svg       # 倒计时数字 3/2/1（426x184，三个数字并排）
│       ├── photo-strip.svg     # 照片条边框（363x529，黑色边框 + 3 格白色区域 x2 列）
│       └── icons.svg           # 下载/分享/刷新图标（103x24，三个图标并排）
├── next.config.ts
├── tailwind.config.ts
├── package.json
└── tsconfig.json
```

## 已完成的功能

### 欢迎页 (/)
- ✅ 页面居中布局，白色背景
- ✅ 手绘风格 Photobooth 机器涂鸦（AI 生成的占位版本）
- ✅ stroke-dasharray 画线动画（页面加载时逐笔画出）
- ✅ 标题文字，使用 Just Another Hand 手写体
- ✅ Enter 按钮，点击跳转到 /booth
- ✅ 散落装饰涂鸦（星星、爱心等，AI 生成的占位版本）

### 拍照页 (/booth)
- ✅ 调用用户摄像头，显示实时画面
- ✅ 手绘风格取景框边框
- ✅ 红/绿指示灯（摄像头就绪状态）
- ✅ 点击 "Ready!" 按钮后 3-2-1 倒计时（带弹出动画）
- ✅ 倒计时结束显示 "Smile!" 提示
- ✅ 白色闪光 + 抓帧拍照
- ✅ 自动连拍 3 张（注意：设计要求是 4 张，目前实现的是 3 张）
- ✅ 拍摄进度圆点指示
- ✅ 底部缩略图实时显示已拍 + 虚线空槽占位
- ✅ 拍完后显示 "See your photos →" + "retake" 选项
- ✅ 视频预览水平镜像（自拍自然感）
- ✅ 照片数据存入 sessionStorage 供 result 页读取
- ⚠️ 上传照片入口（设计里要求有，但不确定是否已实现）

### 结果页 (/result)
- ✅ 基础页面路由已建立
- ⚠️ 具体功能尚未确认是否完整实现（照片条展示、打印掉落动画、下载、分享）

## 核心待办事项（按优先级排序）

### P0 — 必须完成
1. **替换所有占位涂鸦为用户手绘 SVG 素材**：public/svg/ 目录下的 9 个文件已就位，但页面代码中仍在使用 Claude Code 自动生成的占位 SVG。需要逐页替换：
   - 欢迎页：booth-machine.svg 替换占位机器、enter-btn.svg 替换占位按钮
   - 拍照页：shutter.svg 替换快门按钮、light-red/green.svg 替换指示灯、countdown.svg 替换倒计时数字
   - 结果页：photo-strip.svg 替换照片条、restart-btn.svg 替换重新开始按钮、icons.svg 替换功能图标
2. **连拍数量改为 4 张**：目前是 3 张，设计要求 4 张
3. **结果页完整实现**：
   - 照片条打印掉落动画（CSS translateY 从 -100% 到 0 + 微微左右摇晃）
   - 4 张照片竖排在照片条边框里
   - 底部自动显示当天日期
   - 下载按钮（Canvas 合成高清照片条图片，触发下载）
   - 分享按钮（Web Share API，不支持的浏览器显示复制链接）
   - Restart 按钮回到欢迎页
   - 不需要剪刀/裁切功能

### P1 — 重要优化
4. **彩色/黑白 toggle 开关**：拍照页需要一个切换开关，黑白模式用 CSS `filter: grayscale(1)` 实现
5. **上传照片入口**：拍照页需要一个备选入口，可以从相册选 4 张图（input type="file"）
6. **手机端适配**：
   - 前置摄像头优先
   - 摄像头画面镜像翻转（可能已实现）
   - 所有按钮在手机上够大能点到
   - 下载功能在 iOS Safari 上正常工作
7. **装饰涂鸦**：用户还没画星星、爱心、波浪线等散落装饰，后续补上

### P2 — 锦上添花
8. **音效**：快门咔嚓声、倒计时滴答声、照片打印机械声（可用 Web Audio API 生成）
9. **加载动画**：页面切换时的手绘风 loading 效果
10. **SVG 画线动画优化**：确保用户的手绘 SVG 替换后，stroke-dasharray 动画仍然流畅

## 已知问题
- Claude Code 使用额度已达当日上限（Asia/Shanghai 时区 8pm 重置）
- create-next-app 初始版本为 16.2.1（有 prompt injection 可疑文件），已用 @15 版本重新创建，项目现在是干净的
- 开发服务器运行在 http://localhost:3000

## 部署计划
- 代码推送到 GitHub
- 通过 Vercel 一键部署
- 尚未执行，等功能完成后再部署

## 用户画的 SVG 素材说明
用户在 Figma 中用 Pencil 工具手绘了所有涂鸦，风格为黑色线条涂鸦（类似 mysketchbooth.com）。Stroke 设置：2-3.5px / Round cap / Round join / 黑色 / 无填色。所有素材已通过 Figma "Copy as SVG" 导出并保存到项目中。倒计时 SVG 中 3、2、1 三个数字是并排在一个 SVG 里的（426x184），代码中需要拆分显示或通过 viewBox 裁切分别展示。照片条边框 SVG 是 3 格 x 2 列的布局（363x529），需要根据实际需求调整为 4 格竖排单列。