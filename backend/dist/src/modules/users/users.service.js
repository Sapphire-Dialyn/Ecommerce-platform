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
var UsersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const bcrypt = require("bcrypt");
const client_1 = require("@prisma/client");
const cloudinary_1 = require("cloudinary");
const stream_1 = require("stream");
const config_1 = require("@nestjs/config");
let UsersService = UsersService_1 = class UsersService {
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
        this.logger = new common_1.Logger(UsersService_1.name);
        const cloudName = this.configService.get('CLOUDINARY_CLOUD_NAME');
        const apiKey = this.configService.get('CLOUDINARY_API_KEY');
        const apiSecret = this.configService.get('CLOUDINARY_API_SECRET');
        if (!cloudName || !apiKey || !apiSecret) {
            this.logger.error('❌ Cloudinary Config MISSING in .env file!');
        }
        cloudinary_1.v2.config({
            cloud_name: cloudName,
            api_key: apiKey,
            api_secret: apiSecret,
        });
    }
    async uploadToCloudinary(file, folder) {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary_1.v2.uploader.upload_stream({ folder: folder, resource_type: 'auto' }, (error, result) => {
                if (error) {
                    this.logger.error(`❌ Cloudinary Error: ${JSON.stringify(error)}`);
                    return reject(new common_1.BadRequestException('Failed to upload image to Cloudinary'));
                }
                resolve((result === null || result === void 0 ? void 0 : result.secure_url) || '');
            });
            stream_1.Readable.from(file.buffer).pipe(uploadStream);
        });
    }
    async getProfile(userId) {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            include: {
                seller: true,
                enterprise: true,
                addresses: true,
            },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const { password } = user, result = __rest(user, ["password"]);
        return result;
    }
    async updateProfile(userId, role, dto, files) {
        var _a, _b;
        let avatarUrl;
        let logoUrl;
        if ((_a = files === null || files === void 0 ? void 0 : files.avatar) === null || _a === void 0 ? void 0 : _a[0]) {
            avatarUrl = await this.uploadToCloudinary(files.avatar[0], 'avatars');
        }
        if ((_b = files === null || files === void 0 ? void 0 : files.logo) === null || _b === void 0 ? void 0 : _b[0]) {
            logoUrl = await this.uploadToCloudinary(files.logo[0], 'logos');
        }
        const userDataToUpdate = {};
        if (dto.name)
            userDataToUpdate.name = dto.name;
        if (dto.phone)
            userDataToUpdate.phone = dto.phone;
        if (avatarUrl)
            userDataToUpdate.avatar = avatarUrl;
        const updatedUser = await this.prisma.user.update({
            where: { id: userId },
            data: userDataToUpdate,
            include: { seller: true, enterprise: true }
        });
        if (role === client_1.Role.SELLER && updatedUser.seller) {
            const sellerDataToUpdate = {};
            if (dto.storeName)
                sellerDataToUpdate.storeName = dto.storeName;
            if (logoUrl)
                sellerDataToUpdate.logoUrl = logoUrl;
            if (Object.keys(sellerDataToUpdate).length > 0) {
                await this.prisma.seller.update({
                    where: { id: updatedUser.seller.id },
                    data: sellerDataToUpdate,
                });
            }
        }
        else if (role === client_1.Role.ENTERPRISE && updatedUser.enterprise) {
            const enterpriseDataToUpdate = {};
            if (dto.companyName)
                enterpriseDataToUpdate.companyName = dto.companyName;
            if (dto.taxCode)
                enterpriseDataToUpdate.taxCode = dto.taxCode;
            if (logoUrl)
                enterpriseDataToUpdate.logoUrl = logoUrl;
            if (Object.keys(enterpriseDataToUpdate).length > 0) {
                await this.prisma.enterprise.update({
                    where: { id: updatedUser.enterprise.id },
                    data: enterpriseDataToUpdate,
                });
            }
        }
        return this.getProfile(userId);
    }
    async findAll() {
        return this.prisma.user.findMany({
            include: {
                seller: true,
                enterprise: true,
                logistics: true,
                shipper: true,
                addresses: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: {
                seller: true,
                enterprise: true,
                addresses: true,
            }
        });
        if (!user) {
            throw new common_1.NotFoundException(`User with id ${id} not found`);
        }
        const { password } = user, result = __rest(user, ["password"]);
        return result;
    }
    async findByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }
    async create(createUserDto) {
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        return this.prisma.user.create({
            data: Object.assign(Object.assign({}, createUserDto), { password: hashedPassword }),
            include: {
                seller: true,
                enterprise: true
            }
        });
    }
    async update(id, updateUserDto) {
        const data = Object.assign({}, updateUserDto);
        if (updateUserDto.password) {
            data.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        return this.prisma.user.update({
            where: { id },
            data,
            include: {
                seller: true,
                enterprise: true
            }
        });
    }
    async addAddress(userId, addressDto) {
        const addressCount = await this.prisma.address.count({
            where: { userId },
        });
        const isDefault = addressDto.isDefault || addressCount === 0;
        if (isDefault) {
            await this.prisma.address.updateMany({
                where: { userId, isDefault: true },
                data: { isDefault: false },
            });
        }
        return this.prisma.address.create({
            data: Object.assign(Object.assign({}, addressDto), { isDefault,
                userId }),
        });
    }
    async deleteAddress(userId, addressId) {
        const address = await this.prisma.address.findUnique({
            where: { id: addressId },
        });
        if (!address || address.userId !== userId) {
            throw new common_1.NotFoundException('Address not found');
        }
        await this.prisma.address.delete({
            where: { id: addressId },
        });
        if (address.isDefault) {
            const lastAddress = await this.prisma.address.findFirst({
                where: { userId },
                orderBy: { createdAt: 'desc' },
            });
            if (lastAddress) {
                await this.prisma.address.update({
                    where: { id: lastAddress.id },
                    data: { isDefault: true },
                });
            }
        }
        return { message: 'Address deleted successfully' };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = UsersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_1.ConfigService])
], UsersService);
//# sourceMappingURL=users.service.js.map