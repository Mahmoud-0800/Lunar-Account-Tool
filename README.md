# 🌙 Lunar Account Tool

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Electron](https://img.shields.io/badge/Electron-28.0.0-blue)](https://electronjs.org/)

A modern, cross-platform desktop application built with Electron for managing Lunar Client accounts. Features a sleek, dark-themed UI with support for creating, managing, and organizing both cracked and premium Minecraft accounts.

![App Screenshot](https://cdn.discordapp.com/attachments/1389596858212683871/1389618935623585873/image.png?ex=686546fc&is=6863f57c&hm=f5d16d6a3258b8b9b8a32b55e80718b148ea53234fc4a49acd8c7fc87efa8376&)
*Modern dark-themed interface with intuitive account management*

## ✨ Features

### 🎮 Account Management
- **Create Accounts**: Add new Minecraft accounts with username and UUID
- **Account Validation**: Real-time validation of usernames and UUIDs
- **Bulk Operations**: Remove all accounts, cracked accounts, or premium accounts at once
- **Account Persistence**: Automatically saves accounts to Lunar Client's configuration

### 🎨 Modern UI/UX
- **Dark Theme**: Sleek, modern dark interface
- **Custom Title Bar**: Frameless window with custom controls
- **Responsive Design**: Scales beautifully across different screen sizes
- **Smooth Animations**: Polished transitions and interactions
- **Cross-Platform Icons**: Platform-specific app icons for Windows, macOS, and Linux

### 🔧 Technical Features
- **Cross-Platform**: Supports Windows, macOS, and Linux
- **ES6 Modules**: Modern JavaScript module system
- **IPC Communication**: Secure communication between main and renderer processes
- **Error Handling**: Comprehensive error handling with user-friendly dialogs
- **Development Mode**: Built-in development tools and debugging support

## 🚀 Quick Start

### Prerequisites
- **Node.js**: Version 18.0.0 or higher
- **npm**: Comes with Node.js installation

### Installation

1. **Clone the repository**
   ```bash
   git clone [https://github.com/yourusername/CrackedLunarAccountTool-Electron](https://github.com/Mahmoud-0800/Lunar-Account-Tool).git
   cd Lunar-Account-Tool
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the application**
   ```bash
   # Development mode (with DevTools)
   npm run dev
   
   # Production mode
   npm start
   ```

## 📦 Building

### Build for Current Platform
```bash
npm run build
```

### Build for Specific Platforms
```bash
# Windows
npm run build:win

# All platforms (Windows, macOS, Linux)
npm run build:all
```

Built applications will be available in the `dist/` directory.

## 🏗️ Project Structure

```
├── src/
│   ├── main.js                 # Main Electron process
│   ├── preload.js              # Preload script for secure IPC
│   ├── helpers/
│   │   ├── AccountManager.js   # Account management logic
│   │   └── Validate.js         # Input validation utilities
│   └── renderer/
│       ├── index.html          # Main application UI
│       ├── renderer.js         # Renderer process logic
│       ├── styles.css          # Application styling
│       ├── icon-win.ico        # Windows icon
│       ├── icon-mac.icns       # macOS icon
│       └── icon-deb.png        # Linux icon
├── assets/
│   └── icon.svg                # Source icon file
├── package.json                # Project configuration
└── README.md                   # This file
```

## 🔌 IPC API

The application uses Electron's IPC (Inter-Process Communication) for secure communication between the main and renderer processes:

### Window Controls
- `window-minimize` - Minimize the application window
- `window-maximize` - Toggle window maximize/restore
- `window-close` - Close the application

### Account Management
- `load-accounts` - Load accounts from Lunar Client configuration
- `save-accounts` - Save current accounts to configuration
- `create-account` - Create a new account with username and UUID
- `remove-all-accounts` - Remove all accounts
- `remove-cracked-accounts` - Remove only cracked accounts
- `remove-premium-accounts` - Remove only premium accounts

### Validation
- `validate-username` - Validate Minecraft username format
- `validate-uuid` - Validate UUID format

### Dialogs
- `show-error-dialog` - Display error message to user
- `show-info-dialog` - Display information message to user
- `open-external-url` - Open URL in system browser

## 🛠️ Development

### Development Mode
Run the application in development mode with DevTools enabled:
```bash
npm run dev
```

### Code Structure
- **ES6 Modules**: The project uses modern ES6 module syntax
- **Security**: Context isolation enabled, node integration disabled
- **Validation**: Input validation for usernames and UUIDs
- **Error Handling**: Comprehensive error handling throughout the application

### Adding New Features
1. Add IPC handlers in `src/main.js`
2. Implement UI in `src/renderer/index.html`
3. Add event listeners in `src/renderer/renderer.js`
4. Style with CSS in `src/renderer/styles.css`

## 🔒 Security

This application follows Electron security best practices:
- **Context Isolation**: Enabled for secure IPC communication
- **Node Integration**: Disabled in renderer process
- **Preload Script**: Used for exposing limited APIs to renderer
- **CSP Ready**: Content Security Policy compatible

## 📋 Requirements

### System Requirements
- **Operating System**: Windows 10/11, macOS 10.14+, or Linux (Ubuntu 18.04+)
- **RAM**: Runs on a Potato 🥔
- **Storage**: 100MB free space
- **Lunar Client**: Must be installed for account management features

### Development Requirements
- **Node.js**: 18.0.0 or higher
- **npm**: Latest version
- **Git**: For version control

## 🎯 Usage Guide

### Adding Accounts
1. Click the **"Add Account"** button
2. Enter a valid Minecraft username (3-16 characters, alphanumeric and underscores)
3. Enter a valid UUID (36-character format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)
4. Click **"Create Account"** to add it to your Lunar Client

### Managing Accounts
- **View All Accounts**: All accounts are displayed with their type (Premium/Cracked)
- **Remove All**: Clears all accounts from Lunar Client
- **Remove Cracked**: Removes only accounts with non-UUID access tokens
- **Remove Premium**: Removes only accounts with valid UUID access tokens

### Account Types
- **Premium Accounts**: Have valid UUID access tokens and represent legitimate Minecraft accounts
- **Cracked Accounts**: Have non-UUID access tokens for offline/cracked servers

## 📁 File Location

The application manages accounts in the standard Lunar Client location:
```
Windows: %USERPROFILE%\.lunarclient\settings\game\accounts.json
macOS: ~/.lunarclient/settings/game/accounts.json
Linux: ~/.lunarclient/settings/game/accounts.json
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Setup
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style
- Use ES6+ features
- Follow existing code formatting
- Add comments for complex logic
- Ensure cross-platform compatibility

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Disclaimer

This tool is for educational purposes only. Users are responsible for complying with Minecraft's Terms of Service and End User License Agreement. The developers are not responsible for any consequences of using this software.

## 🙏 Acknowledgments

- [Electron](https://electronjs.org/) - For the excellent cross-platform framework
- [Lunar Client](https://lunarclient.com/) - For the amazing Minecraft client
- [Inter Font](https://rsms.me/inter/) - For the beautiful typography

## 📞 Support

If you encounter any issues or have questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Read the documentation thoroughly

---

**Made with ❤️ by Mahmoud for the Minecraft community**
