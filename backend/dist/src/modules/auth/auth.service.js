"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const bcrypt = require("bcrypt");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
let AuthService = class AuthService {
    constructor(usersService, jwtService, prisma) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.prisma = prisma;
    }
    async login(user) {
        const payload = { username: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                avatar: user.avatar,
            },
        };
    }
    async validateUser(email, pass) {
        const user = await this.usersService.findByEmail(email);
        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password } = user, result = __rest(user, ["password"]);
            return result;
        }
        return null;
    }
    async register(dto, files) {
        const existingUser = await this.usersService.findByEmail(dto.email);
        if (existingUser) {
            throw new common_1.BadRequestException('User already exists');
        }
        const hashedPassword = await bcrypt.hash(dto.password, 10);
        const result = await this.prisma.$transaction(async (prisma) => {
            var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
            const newUser = await prisma.user.create({
                data: {
                    email: dto.email,
                    password: hashedPassword,
                    name: dto.name,
                    role: dto.role,
                    isActive: true,
                    isVerified: false,
                }
            });
            if (dto.role === client_1.Role.SELLER) {
                if (!dto.storeName)
                    throw new common_1.BadRequestException('Store Name is required for Seller');
                await prisma.seller.create({
                    data: {
                        userId: newUser.id,
                        storeName: dto.storeName,
                        businessDocumentUrl: ((_b = (_a = files === null || files === void 0 ? void 0 : files.businessDocument) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.originalname) || null,
                        identityDocumentUrl: ((_d = (_c = files === null || files === void 0 ? void 0 : files.identityDocument) === null || _c === void 0 ? void 0 : _c[0]) === null || _d === void 0 ? void 0 : _d.originalname) || null,
                        addressDocumentUrl: ((_f = (_e = files === null || files === void 0 ? void 0 : files.addressDocument) === null || _e === void 0 ? void 0 : _e[0]) === null || _f === void 0 ? void 0 : _f.originalname) || null,
                    }
                });
            }
            if (dto.role === client_1.Role.ENTERPRISE) {
                if (!dto.companyName || !dto.taxCode) {
                    throw new common_1.BadRequestException('Company Name and Tax Code are required');
                }
                await prisma.enterprise.create({
                    data: {
                        userId: newUser.id,
                        companyName: dto.companyName,
                        taxCode: dto.taxCode,
                        officialBrand: (_g = dto.officialBrand) !== null && _g !== void 0 ? _g : true,
                        verified: false,
                        businessLicenseUrl: ((_j = (_h = files === null || files === void 0 ? void 0 : files.businessLicense) === null || _h === void 0 ? void 0 : _h[0]) === null || _j === void 0 ? void 0 : _j.originalname) || null,
                        brandRegistrationUrl: ((_l = (_k = files === null || files === void 0 ? void 0 : files.brandRegistration) === null || _k === void 0 ? void 0 : _k[0]) === null || _l === void 0 ? void 0 : _l.originalname) || null,
                        taxDocumentUrl: ((_o = (_m = files === null || files === void 0 ? void 0 : files.taxDocument) === null || _m === void 0 ? void 0 : _m[0]) === null || _o === void 0 ? void 0 : _o.originalname) || null,
                    }
                });
            }
            return newUser;
        });
        return {
            message: 'User registered successfully',
            userId: result.id,
            role: result.role
        };
    }
    async validateJwt(userId) {
        const user = await this.usersService.findOne(userId);
        if (!user)
            throw new common_1.UnauthorizedException();
        return user;
    }
    async refreshToken(userId) {
        const user = await this.usersService.findOne(userId);
        if (!user)
            throw new common_1.UnauthorizedException();
        const payload = { username: user.email, sub: user.id, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    async verifyEmail(token) {
        return { message: 'Email verified' };
    }
    async resendVerificationEmail(email) {
        return { message: 'Verification email sent' };
    }
    async changePassword(userId, oldPass, newPass) {
        const user = await this.usersService.findOne(userId);
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const userWithPass = user;
        const isMatch = await bcrypt.compare(oldPass, userWithPass.password);
        if (!isMatch)
            throw new common_1.BadRequestException('Old password incorrect');
        const hashedNewPass = await bcrypt.hash(newPass, 10);
        await this.usersService.update(userId, { password: hashedNewPass });
        return { message: 'Password changed successfully' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map