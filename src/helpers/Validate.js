export class Validate {
    static isValidMinecraftUsername(username) {
        if (username.length < 3 || username.length > 16) {
            return false;
        }

        const pattern = /^[a-zA-Z0-9_]+$/;
        return pattern.test(username);
    }

    static isValidUUID(uuid) {
        const pattern = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
        return pattern.test(uuid);
    }
}
