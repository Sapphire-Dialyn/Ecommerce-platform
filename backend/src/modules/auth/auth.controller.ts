import { 
  Controller, 
  Post, 
  Body, 
  UseGuards, 
  Request, 
  Put,
  HttpCode,
  HttpStatus,
  Get,
  UseInterceptors, // 👈 Mới
  UploadedFiles    // 👈 Mới
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { LoginDto, RegisterDto, ChangePasswordDto } from './dto/auth.dto';
import { Public } from './decorators/public.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express'; // 👈 Quan trọng

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // --- ĐĂNG NHẬP ---
  @Public()
  @ApiOperation({ summary: 'User login' })
  @ApiResponse({
    status: 200,
    description: 'Returns JWT access token and user info',
  })
  @ApiBody({ type: LoginDto })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  // --- ĐĂNG KÝ (Đã cập nhật để nhận File) ---
  @Public()
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({
    status: 201,
    description: 'User has been successfully created.',
  })
  @ApiConsumes('multipart/form-data') // 👈 Khai báo Swagger nhận FormData
  @Post('register')
  // 👇 Interceptor để hứng các file từ Frontend
  @UseInterceptors(FileFieldsInterceptor([
    // Dành cho Enterprise
    { name: 'businessLicense', maxCount: 1 },
    { name: 'brandRegistration', maxCount: 1 },
    { name: 'taxDocument', maxCount: 1 },
    // Dành cho Seller
    { name: 'businessDocument', maxCount: 1 },
    { name: 'identityDocument', maxCount: 1 },
    { name: 'addressDocument', maxCount: 1 },
  ]))
  async register(
    @Body() data: RegisterDto,
    // 👇 Lấy object chứa các file upload
    @UploadedFiles() files: { 
      businessLicense?: Express.Multer.File[],
      brandRegistration?: Express.Multer.File[],
      taxDocument?: Express.Multer.File[],
      businessDocument?: Express.Multer.File[],
      identityDocument?: Express.Multer.File[],
      addressDocument?: Express.Multer.File[],
    },
  ) {
    // Truyền cả data và files xuống service
    return this.authService.register(data, files);
  }

  // --- VERIFY EMAIL ---
  @ApiOperation({ summary: 'Verify email address' })
  @ApiResponse({
    status: 200,
    description: 'Email has been verified successfully',
  })
  @Public()
  @Post('verify-email')
  async verifyEmail(@Body('token') token: string) {
    return this.authService.verifyEmail(token);
  }

  // --- RESEND VERIFICATION ---
  @ApiOperation({ summary: 'Resend verification email' })
  @ApiResponse({
    status: 200,
    description: 'Verification email has been sent',
  })
  @Public()
  @Post('resend-verification')
  async resendVerification(@Body('email') email: string) {
    return this.authService.resendVerificationEmail(email);
  }

  // --- REFRESH TOKEN ---
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({
    status: 200,
    description: 'Returns new JWT access token',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Request() req) {
    return this.authService.refreshToken(req.user.id);
  }

  // --- ĐỔI MẬT KHẨU ---
  @ApiOperation({ summary: 'Change password' })
  @ApiResponse({
    status: 200,
    description: 'Password has been changed successfully',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Put('change-password')
  async changePassword(@Request() req, @Body() data: ChangePasswordDto) {
    return this.authService.changePassword(
      req.user.id,
      data.oldPassword,
      data.newPassword,
    );
  }

  // --- LẤY PROFILE ---
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200, 
    description: 'Returns current user information',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('me') // 👈 Đã đổi thành GET cho đúng chuẩn REST
  @HttpCode(HttpStatus.OK)
  async getCurrentUser(@Request() req) {
    return this.authService.validateJwt(req.user.id);
  }
}