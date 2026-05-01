"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorsMiddleware = void 0;
const common_1 = require("@nestjs/common");
let CorsMiddleware = class CorsMiddleware {
    use(req, res, next) {
        const origin = req.headers.origin;
        const isAllowed = this.isOriginAllowed(origin);
        if (isAllowed) {
            res.header('Access-Control-Allow-Origin', origin);
            res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS');
            res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization,x-tenant-id,Accept,Origin');
            res.header('Access-Control-Allow-Credentials', 'true');
            res.header('Access-Control-Expose-Headers', 'x-total-count,x-page-count');
            res.header('Access-Control-Max-Age', '3600');
        }
        if (req.method === 'OPTIONS') {
            return res.sendStatus(200);
        }
        next();
    }
    isOriginAllowed(origin) {
        if (!origin) {
            return true;
        }
        if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
            return true;
        }
        if (origin.includes('dariassoft.com.ar')) {
            return true;
        }
        return false;
    }
};
exports.CorsMiddleware = CorsMiddleware;
exports.CorsMiddleware = CorsMiddleware = __decorate([
    (0, common_1.Injectable)()
], CorsMiddleware);
//# sourceMappingURL=cors.middleware.js.map