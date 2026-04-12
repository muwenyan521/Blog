---
title: '基于 Astro 框架 & Mizuki 主题的博客构建教程'
published: 2026-04-12
description: '从零开始，搭建类似本站风格的专属博客'
tags: [开发, 教程]
category: 教程
draft: false
---

### 开始前请准备好以下工具：

1. **[Git](https://git-scm.com/downloads)**：版本控制的基础工具，也是与 GitHub 交互的必需品。如果不习惯命令行，也可以尝试带图形界面的 [GitHub Desktop](https://github.com/apps/desktop)。
2. **[Node.js](https://nodejs.org/en)**：博客项目的本地运行环境。
3. **[GitHub](https://github.com) 账号**：用于托管你的博客项目代码。
4. **[Cloudflare](https://cloudflare.com) 账号**：用于创建 Pages 项目，实现免费且自动化的持续部署。
5. **[Obsidian](/posts/obsidian/) 或其他 Markdown 编辑器**：博客文章均以 Markdown (`.md`) 格式保存，一款顺手的编辑器能极大提升写作体验。

---

### Let's Start!!!

#### 第一步：Fork 仓库并在本地运行

从零开始配置主题可能会非常繁琐，所以我们直接站在巨人的肩膀上~~其实就是我~~，通过 Fork 现成的博客模板来进行个性化改造。

1. **访问模板仓库**：前往 [muwenyan521/Blog](https://github.com/muwenyan521/Blog)。
2. **Fork 仓库**：点击页面右上角的 **Fork** 按钮，一路确认，将该仓库复制到你自己的 GitHub 账号下。
3. **克隆到本地**：打开终端，将你 Fork 后的仓库拉取到本地环境（请注意替换为你自己的 GitHub 用户名）。
   ```bash
   git clone [https://github.com/](https://github.com/)<你的用户名>/Blog.git
   ```
   *(如果你已经配置了 SSH 密钥，推荐使用 `git clone git@github.com:<你的用户名>/Blog.git`，后续推送代码会更方便。)*
4. **安装包管理器**：如果你尚未安装 `pnpm`，请先全局安装（国内网络环境建议配合镜像源使用 `pnpm config set registry https://registry.npmmirror.com`）：
   ```bash
   npm install -g pnpm
   ```
5. **安装依赖并运行**：进入项目根目录，安装项目依赖：
   ```bash
   cd Blog
   pnpm install
   ```
   至此，这个基于 Astro 和 Mizuki 主题的博客就已经成功就绪了。

---

#### 第二步：“大扫除”与个性化配置

> 因为我们 Fork 的是一个已经高度成型的博客，里面必定包含了原作者的文章、图片、名称和个人社交链接。我们需要进行一次“大扫除”，把这套框架重新“精装修”成你自己的。

1. **清理历史数据**：
   - 进入 `src/content/posts/` 目录。
   - 删除里面原有的 `.md` 文章（建议留下一篇作为 Frontmatter 格式的书写参考，其余统统删掉）。
   - 检查 `public/` 或 `src/assets/` 目录，将原作者的头像、网站 LOGO、Banner 等图片替换为你自己的。**注意**：尽量保持原有文件名一致以防报错，或者在替换后去配置文件中重新指定新路径。

2. **修改核心配置文件 (`config.ts`)**：
   - 在 `src` 文件夹中找到 `config.ts`。这是站点的“核心大脑”。
   - 逐行检查并修改以下关键信息：
     - `title` / `siteName`：你的博客名称。
     - `description`：站点的简介，这不仅会显示在首页，也关乎 SEO 优化。
     - `author`：你的名字或 ID（例如 `wxm`）。
     - `avatar`：你的头像路径（例如 `/images/avatar.webp`）。
     - `links` / `socials`：将原作者的 GitHub、推特等社交链接替换成你自己的。
     - `nav` / `menu`：顶部导航栏配置，可按需增删“首页”、“归档”、“关于”等板块。

3. **修改基础 URL (`astro.config.mjs`)**：
   - 打开根目录下的 `astro.config.mjs`，找到类似 `site:` 的配置项。
   - 将其改为你未来准备绑定的正式域名，例如：`site: "https://wangxianming.top",`。

---

#### 第三步：Let's Start Writing！

> 强烈推荐使用 Obsidian 或 MarkText 等编辑器，搭配本地图床或相对路径进行沉浸式写作。

1. **创建新文章**：在文章目录（如 `src/content/posts/`）下新建一个 `.md` 文件，例如 `my-first-post.md`。
2. **编写 Frontmatter (元数据)**：在文件的最顶部，填入 Astro 博客通用的元数据，格式如下：
   ```markdown
   ---
   title: '这是我的第一篇文章'
   description: '文章的简短描述，会展示在文章列表中'
   published: 2026-04-12
   heroImage: '/images/cover.jpg' # 封面图路径
   tags: ['生活', '折腾']
   draft: false
   ---
   
   这里开始写你的正文内容...
   ```
3. **关于图片管理**：
   - 如果使用 MarkText 等编辑器，可以通过配置直接实现复制粘贴图片：依次点击菜单栏 `File` -> `Preferences` -> 左侧 `Image` 分类。
   - 设置将图片自动复制到项目的 `public/images/` 目录下，并使用相对或绝对路径引用。这样你在写作时，图片会自动归档到项目中，发布时也不会出现死链。

---

#### 第四步：本地预览与云端同步

1. **本地预览**：在项目根目录终端执行以下命令启动本地服务：
   ```bash
   pnpm dev
   ```
   终端会输出一个本地预览地址（通常是 `http://localhost:4321`）。在浏览器中打开它，就能实时预览你的博客效果了！

2. **推送到 GitHub**：确认一切正常后，将这些改动推送到你的远程仓库。
   ```bash
   # 如果是首次使用 Git，需先配置身份信息
   # git config --global user.name "你的用户名"
   # git config --global user.email "你的邮箱"
   
   git add .
   git commit -m "初始化博客配置并清理原数据"
   git push
   ```
   推送完成后，你的 GitHub 仓库里就是完全属于你自己的专属代码了。

---

#### 第五步：使用 Cloudflare Pages 免费部署

> 感谢 Cloudflare 大善人，为个人开发者提供了慷慨且完全免费的 Pages 托管服务！

1. 登录 [Cloudflare 控制台](https://dash.cloudflare.com/)，前往左侧导航栏的 **Workers 和 Pages**，点击 **创建** -> **Pages** -> **连接到 Git**。
2. 授权连接你的 GitHub 账号，并在列表中选中你刚才 Fork 并改造完成的 `Blog` 仓库。
3. **设置构建配置**：
   - **构建命令 (Build command)**：填写 `pnpm build`（或者你可以使用我修改过、更加严谨的 `pnpm safe-build`）。
   - 点击 **保存并部署**。
4. 稍等片刻，Cloudflare 就会完成自动构建。在项目设置的“自定义域”选项卡中，你可以绑定自己购买的域名。
5. **大功告成！** 未来，你只需要在本地用 Markdown 写好新文章，执行 `git push` 推送到 GitHub，Cloudflare 就会在后台自动触发构建。几秒钟后，你的网站就会无缝更新。

---

### 进阶技巧：自定义路由与优选加速

为了获得更好的访问速度，可以参考[二叉树树的博客](https://2x.nz/posts/cf-fastip)进行进阶优化：

1. **配置 Worker 路由**：在 Cloudflare 控制台对应域名的 `设置` -> `域和路由` -> `添加路由` 中，直接填写 `你的域名/*`（例如 `blog.wangxianming.top/*`）。
2. **配置 DNS 解析**：
   - **类型**：`CNAME`
   - **名称**：填写你的二级域名（如 `blog`）
   - **目标**：填入任意优选域名（推荐使用 `cf.090227.xyz`）
   - **代理状态**（如果在 CF 管理 DNS）：设为 **仅 DNS** (灰云)
   - **TTL**：自动 / 10分钟
