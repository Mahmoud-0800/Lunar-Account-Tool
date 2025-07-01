import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { Validate } from './Validate.js';

export class AccountManager {
    static json = null;
    static userFolder = os.homedir();
    static lunarAccountsPath = path.join(this.userFolder, '.lunarclient', 'settings', 'game', 'accounts.json');

    static createAccount(username, uuid) {
        // The account data to be added
        const newAccount = {
            accessToken: uuid,
            accessTokenExpiresAt: "2050-07-02T10:56:30.717167800Z",
            eligibleForMigration: false,
            hasMultipleProfiles: false,
            legacy: true,
            persistent: true,
            userProperites: [],
            localId: uuid,
            minecraftProfile: {
                id: uuid,
                name: username
            },
            remoteId: uuid,
            type: "Xbox",
            username: username
        };

        // Add the new account to the existing accounts
        if (!this.json.accounts) {
            this.json.accounts = {};
        }
        this.json.accounts[uuid] = newAccount;
    }

    static removeAllAccounts() {
        this.json.accounts = {};
    }

    static removeCrackedAccounts() {
        const accountsToRemove = [];
        const accounts = this.json.accounts;

        for (const [key, account] of Object.entries(accounts)) {
            if (!Validate.isValidUUID(account.accessToken)) {
                accountsToRemove.push(key);
            }
        }

        for (const key of accountsToRemove) {
            delete accounts[key];
        }
    }

    static removePremiumAccounts() {
        const accountsToRemove = [];
        const accounts = this.json.accounts;

        for (const [key, account] of Object.entries(accounts)) {
            if (Validate.isValidUUID(account.accessToken)) {
                accountsToRemove.push(key);
            }
        }

        for (const key of accountsToRemove) {
            delete accounts[key];
        }
    }

    static viewInstalledAccounts() {
        const accounts = this.json.accounts;
        return Object.entries(accounts).map(([key, account]) => ({
            id: key,
            username: account.username,
            isPremium: Validate.isValidUUID(account.accessToken)
        }));
    }

    static loadJson() {
        try {
            if (fs.existsSync(this.lunarAccountsPath)) {
                const fileContent = fs.readFileSync(this.lunarAccountsPath, 'utf8');
                this.json = JSON.parse(fileContent);
            } else {
                this.json = { accounts: {} };
            }
        } catch (error) {
            throw new Error(`Failed to load accounts file: ${error.message}`);
        }
    }

    static saveJson() {
        try {
            // Ensure the directory exists
            fs.ensureDirSync(path.dirname(this.lunarAccountsPath));
            fs.writeFileSync(this.lunarAccountsPath, JSON.stringify(this.json, null, 2));
        } catch (error) {
            throw new Error(`Failed to save accounts file: ${error.message}`);
        }
    }
}
