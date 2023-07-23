class KeyFrame {
    constructor(instant, translations, rotations, scales) {
        this.instant = instant*1000;
        this.translations = translations;
        this.rotations = rotations;
        this.scales = scales;
    }
}