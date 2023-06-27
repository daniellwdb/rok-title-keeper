<div align="center">
  <h1>rok-title-keeper</h1>
  <h4>
    Rise of Kingdoms bot to manage titles through Discord.
  </h4>
  <img src="./docs/images/demo.gif" alt="Rise of Kingdoms screenshot" />
</div>

<div align="center">
  <img
    src="https://img.shields.io/github/languages/top/daniellwdb/rok-title-keeper?style=for-the-badge"
    alt="Language"
  />
  <img
    src="https://img.shields.io/github/license/daniellwdb/rok-title-keeper?style=for-the-badge"
    alt="License"
  />
</div>

<p align="center">
  <a href="#-about">About</a> •
  <a href="#-key-features">Key Features</a> •
  <a href="#-setup">Setup</a> •
  <a href="#license">License</a>
</p>

## 🤖 About

Rise of Kingdoms bot to manage titles through Discord.

**Disclaimer:** This bot is an independent project and is not affiliated, endorsed, or associated with Rise of Kingdoms, its developers, or any official entities related to the game.

## 🔑 Key Features

WIP

## 💻 Setup

### Prerequisites

- [BlueStacks 5](https://cdn3.bluestacks.com/downloads/windows/nxt/5.4.100.1026/0129e8eb74f84fc396a1500329365a09/BlueStacksMicroInstaller_5.4.100.1026_native.exe?filename=BlueStacksMicroInstaller_5.4.100.1026_native_5ffb0694218e1b99e7000bed6dcbe547_0.exe).
- [Android SDK Platform-Tools](https://dl.google.com/android/repository/platform-tools_r31.0.3-windows.zip).
- [Node.js](https://nodejs.org/en).
- [Discord bot + token](https://discordjs.guide/preparations/setting-up-a-bot-application.html#setting-up-a-bot-application).

### Getting started

1. Clone the repository:

```bash
git clone https://github.com/daniellwdb/rok-title-keeper.git
```

2. Install dependencies:

```bash
cd rok-title-keeper
npm install
```

3. Configure environment variables in `.env`:

```bash
cp .env.example .env
```

4. Extract the platform-tools zip so that you end up with a `platform-tools` folder in the root of this project.

5. In BlueStacks, set the following settings:

**Performance**

_CPU allocation_ -> Medium (2 Cores)

_Memory allocation_ -> Medium(2 GB)

**Display**

_Display resolution_ -> 1600x900

_Pixel density_ -> Custom (450 DPI)

**Advanced**

_Android debug bridge_ -> ON

6. Open Rise of Kingdoms and **make sure your character is not in the "Your City" view so it can enter coordinates**.

### Scripts

**Development**

You only need to run this command once:

```bash
npx prisma migrate dev
```

Start the bot in watch mode:

```bash
npm start
```

**Production**

You only need to run this command once:

```bash
npx prisma migrate deploy
```

Start the bot:

```bash
npx tsx .
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
