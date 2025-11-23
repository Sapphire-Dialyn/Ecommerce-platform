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
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const email_service_1 = require("../email/email.service");
let AuthService = class AuthService {
    constructor(prisma, jwtService, emailService) {
        this.prisma = prisma;
        this.jwtService = jwtService;
        this.emailService = emailService;
    }
    generateVerificationToken() {
        return crypto.randomBytes(32).toString('hex');
    }
    async validateUser(email, password) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            return null;
        if (!user.isActive) {
            throw new common_1.ForbiddenException('Tài khoản của bạn đã bị ban. Liên hệ admin để mở lại.');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid)
            return null;
        const { password: pwd } = user, result = __rest(user, ["password"]);
        return result;
    }
    async login(user) {
        if (!user.isActive) {
            throw new common_1.ForbiddenException('Tài khoản của bạn đã bị ban. Liên hệ admin để mở lại.');
        }
        const payload = { sub: user.id, email: user.email, role: user.role };
        let userDetails = {
            id: user.id,
            email: user.email,
            name: user.name,
            phone: user.phone,
            avatar: user.avatar,
            role: user.role,
        };
        switch (user.role) {
            case 'SELLER':
                const sellerProfile = await this.prisma.seller.findUnique({
                    where: { userId: user.id },
                    include: { products: { select: { id: true, name: true } } },
                });
                userDetails.seller = sellerProfile;
                break;
            case 'ENTERPRISE':
                const enterpriseProfile = await this.prisma.enterprise.findUnique({
                    where: { userId: user.id },
                    include: { products: { select: { id: true, name: true } } },
                });
                userDetails.enterprise = enterpriseProfile;
                break;
            case 'LOGISTICS':
                const logisticsProfile = await this.prisma.logisticsPartner.findUnique({
                    where: { userId: user.id },
                });
                userDetails.logistics = logisticsProfile;
                break;
        }
        return {
            access_token: this.jwtService.sign(payload),
            user: userDetails,
        };
    }
    async register(data) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: data.email },
        });
        if (existingUser) {
            throw new common_1.ConflictException('Email already exists');
        }
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const verificationToken = this.generateVerificationToken();
        const result = await this.prisma.$transaction(async (prisma) => {
            const user = await prisma.user.create({
                data: {
                    email: data.email,
                    password: hashedPassword,
                    name: data.name,
                    phone: data.phone,
                    avatar: data.avatar,
                    role: data.role || 'CUSTOMER',
                    verificationToken: data.role === 'CUSTOMER' ? null : verificationToken,
                    isVerified: data.role === 'CUSTOMER',
                },
            });
            if (data.role === 'SELLER') {
                await prisma.seller.create({
                    data: {
                        userId: user.id,
                        storeName: data.name,
                        verified: false,
                    },
                });
                await this.emailService.sendVerificationEmail(data.email, verificationToken);
            }
            else if (data.role === 'LOGISTICS') {
                await prisma.logisticsPartner.create({
                    data: {
                        userId: user.id,
                        name: data.name,
                        baseRate: 0,
                    },
                });
                await this.emailService.sendVerificationEmail(data.email, verificationToken);
            }
            else if (data.role === 'ADMIN') {
                await this.emailService.sendVerificationEmail(data.email, verificationToken);
            }
            return user;
        });
        const { password, verificationToken: token } = result, userWithoutPassword = __rest(result, ["password", "verificationToken"]);
        return userWithoutPassword;
    }
    async refreshToken(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
    async changePassword(userId, oldPassword, newPassword) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid old password');
        }
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashedNewPassword },
        });
        return { message: 'Password changed successfully' };
    }
    async validateJwt(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                isVerified: true,
            },
        });
        if (!user) {
            throw new common_1.UnauthorizedException();
        }
        return user;
    }
    async verifyEmail(token) {
        const user = await this.prisma.user.findFirst({
            where: { verificationToken: token },
        });
        if (!user) {
            throw new common_1.NotFoundException('Invalid verification token');
        }
        if (user.isVerified) {
            throw new common_1.BadRequestException('Email already verified');
        }
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                isVerified: true,
                verificationToken: null,
            },
        });
        if (user.role === 'SELLER' || user.role === 'LOGISTICS' || user.role === 'ADMIN') {
            await this.emailService.sendRoleApprovalEmail(user.email, user.role);
        }
        return { message: 'Email verified successfully' };
    }
    async resendVerificationEmail(email) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        if (user.isVerified) {
            throw new common_1.BadRequestException('Email already verified');
        }
        const verificationToken = this.generateVerificationToken();
        await this.prisma.user.update({
            where: { id: user.id },
            data: { verificationToken },
        });
        await this.emailService.sendVerificationEmail(email, verificationToken);
        return { message: 'Verification email sent' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        jwt_1.JwtService,
        email_service_1.EmailService])
], AuthService);
//# sourceMappingURL=auth.service.js.map