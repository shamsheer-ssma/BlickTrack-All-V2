"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrimStringsPipe = exports.SanitizeStringPipe = exports.ParseEmailPipe = exports.ParseUUIDPipe = void 0;
const common_1 = require("@nestjs/common");
const utils_1 = require("../utils");
let ParseUUIDPipe = class ParseUUIDPipe {
    transform(value, metadata) {
        if (!utils_1.ValidationUtils.isValidUUID(value)) {
            throw new common_1.BadRequestException(`Invalid UUID format: ${value}`);
        }
        return value;
    }
};
exports.ParseUUIDPipe = ParseUUIDPipe;
exports.ParseUUIDPipe = ParseUUIDPipe = __decorate([
    (0, common_1.Injectable)()
], ParseUUIDPipe);
let ParseEmailPipe = class ParseEmailPipe {
    transform(value, metadata) {
        if (!utils_1.ValidationUtils.isValidEmail(value)) {
            throw new common_1.BadRequestException(`Invalid email format: ${value}`);
        }
        return value.toLowerCase().trim();
    }
};
exports.ParseEmailPipe = ParseEmailPipe;
exports.ParseEmailPipe = ParseEmailPipe = __decorate([
    (0, common_1.Injectable)()
], ParseEmailPipe);
let SanitizeStringPipe = class SanitizeStringPipe {
    transform(value, metadata) {
        if (typeof value !== 'string') {
            return value;
        }
        return utils_1.ValidationUtils.sanitizeString(value);
    }
};
exports.SanitizeStringPipe = SanitizeStringPipe;
exports.SanitizeStringPipe = SanitizeStringPipe = __decorate([
    (0, common_1.Injectable)()
], SanitizeStringPipe);
let TrimStringsPipe = class TrimStringsPipe {
    transform(value, metadata) {
        if (typeof value === 'string') {
            return value.trim();
        }
        if (typeof value === 'object' && value !== null) {
            const trimmed = {};
            for (const [key, val] of Object.entries(value)) {
                trimmed[key] = typeof val === 'string' ? val.trim() : val;
            }
            return trimmed;
        }
        return value;
    }
};
exports.TrimStringsPipe = TrimStringsPipe;
exports.TrimStringsPipe = TrimStringsPipe = __decorate([
    (0, common_1.Injectable)()
], TrimStringsPipe);
//# sourceMappingURL=validation.pipes.js.map