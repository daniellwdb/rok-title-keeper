<div align="center">
  <h1>roka</h1>
  <h4>
    Rise of Kingdoms bot to manage titles and DKP and through Discord.
  </h4>
</div>

<div align="center">
  <a href="https://discord.gg/dAa4axurq7"
    ><img
      src="https://img.shields.io/discord/1136027658757603449.svg?color=7289DA&label=SUPPORT&style=for-the-badge"
      alt="Discord"
  /></a>
  <img
    src="https://img.shields.io/github/languages/top/daniellwdb/roka?style=for-the-badge"
    alt="Language"
  />
  <img
    src="https://img.shields.io/github/license/daniellwdb/roka?style=for-the-badge"
    alt="License"
  />
</div>

<p align="center">
  <a href="#-about">About</a> • 
  <a href="#features">Features</a> •
  <a href="#license">License</a> •
  <a href="#development">Development</a> •
  <a href="#production">Production</a>
</p>

## 🤖 About

Rise of Kingdoms bot to manage titles and DKP and through Discord.

> [!IMPORTANT]  
> This project is deprecated due to the game having their own system to manage titles. DKP tracking still works but is no longer maintained.

**Disclaimer:** This bot is an independent project and is not affiliated, endorsed, or associated with Rise of Kingdoms, its developers, or any official entities related to the game. By using this bot, you acknowledge and agree that you do so at your own risk. The developer of this bot assumes no responsibility or liability for any consequences, penalties, or actions that may result from its usage.

## Features

![screenshot](./docs/images/features.png)

## License

This project is licensed under the MPL-2.0 License - see the [LICENSE](LICENSE) file for details.

## Development

Start by installing the necessary dependencies.

- [BlueStacks](<https://cloud.bluestacks.com/api/getdownloadnow?platform=win&win_version=10&mac_version=&client_uuid=adf6151c-2587-42f7-9b75-b702738c3545&app_pkg=nxt_n64&platform_cloud=%7B%22description%22%3A%22Firefox%20130.0%20on%20Windows%2010%2064-bit%22%2C%22layout%22%3A%22Gecko%22%2C%22manufacturer%22%3Anull%2C%22name%22%3A%22Firefox%22%2C%22prerelease%22%3Anull%2C%22product%22%3Anull%2C%22ua%22%3A%22Mozilla%2F5.0%20(Windows%20NT%2010.0%3B%20Win64%3B%20x64%3B%20rv%3A130.0)%20Gecko%2F20100101%20Firefox%2F130.0%22%2C%22version%22%3A%22130.0%22%2C%22os%22%3A%7B%22architecture%22%3A64%2C%22family%22%3A%22Windows%22%2C%22version%22%3A%2210%22%7D%7D&preferred_lang=en&utm_source=&utm_medium=&gaCookie=&gclid=&clickid=&msclkid=&affiliateId=&offerId=&transaction_id=&aff_sub=&first_landing_page=&referrer=&download_page_referrer=https%3A%2F%2Fwww.bluestacks.com%2Fdownload.html&utm_campaign=download-en&user_id=experiment_variant&exit_utm_campaign=nxt-bs5-n64_button_download_page-en&incompatible=false&bluestacks_version=bs5&device_memory=undefined&device_cpu_cores=12>)
- [Node.js](https://nodejs.org/en)
- [OpenCV](https://sourceforge.net/projects/opencvlibrary/files/4.6.0/opencv-4.6.0-vc14_vc15.exe/download) (extract in C:/tools)
- [Microsoft Visual C++ Redistributable](https://aka.ms/vs/17/release/vc_redist.x64.exe)

Configure BlueStacks as below:

**Performance**

- _CPU allocation_ -> Medium (2 Cores)
- _Memory allocation_ -> Medium (2GB)

**Display**

- _Display resolution_ -> 1027x567
- _Pixel density_ -> Custom (450 DPI)

**Advanced**

- _Android debug bridge_ -> ON

You might have to restart your PC afterwards.

Then clone the repository.

```bash
git clone https://github.com/daniellwdb/roka.git
```

Install dependencies.

```bash
cd roka && npm install
```

Copy the config file and add your own values.

```bash
cp config.yml.example config.yml
```

Run BlueStacks and run the bot after.

```bash
npm start
```

## Production

Install [NSIS](https://nsis.sourceforge.io/Main_Page) and create a folder `prerequisites` containing:

- Node.js msi
- OpenCV executable
- Microsoft Visual C++ Redistributable executable

Create an executable and zip containing source code update:

```bash
npm run release
```
