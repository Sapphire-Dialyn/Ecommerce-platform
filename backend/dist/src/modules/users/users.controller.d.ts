import { UsersService } from './users.service';
import { UpdateUserDto, AddAddressDto } from './dto/users.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    findAll(): Promise<{
        id: string;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        addresses: {
            id: string;
            phone: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            fullName: string;
            province: string;
            district: string;
            ward: string;
            street: string;
            label: string | null;
            isDefault: boolean;
        }[];
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        name: string;
        email: string;
        avatar: string;
        phone: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
        seller: {
            id: string;
            verified: boolean;
            rating: number | null;
            logoUrl: string | null;
            userId: string;
            storeName: string;
            businessDocumentUrl: string | null;
            identityDocumentUrl: string | null;
            addressDocumentUrl: string | null;
        };
        enterprise: {
            id: string;
            companyName: string;
            taxCode: string | null;
            verified: boolean;
            officialBrand: boolean;
            rating: number | null;
            logoUrl: string | null;
            businessLicenseUrl: string | null;
            brandRegistrationUrl: string | null;
            taxDocumentUrl: string | null;
            userId: string;
        };
        addresses: {
            id: string;
            phone: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            fullName: string;
            province: string;
            district: string;
            ward: string;
            street: string;
            label: string | null;
            isDefault: boolean;
        }[];
    }>;
    update(id: string, updateUserDto: UpdateUserDto, req: any): Promise<{
        id: string;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.Role;
        createdAt: Date;
    }>;
    addAddress(id: string, addressDto: AddAddressDto, req: any): Promise<{
        id: string;
        phone: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        fullName: string;
        province: string;
        district: string;
        ward: string;
        street: string;
        label: string | null;
        isDefault: boolean;
    }>;
    deleteAddress(id: string, addressId: string, req: any): Promise<{
        message: string;
    }>;
}
