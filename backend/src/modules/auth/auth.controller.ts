import { 
  Controller, 
  Post, 
  Body, 
  UseGuards, 
  Put,
  HttpCode,
  HttpStatus,
  Get,
  UseInterceptors,
  UploadedFiles,
  Res,
  Req // 👈 Chỉ dùng @Req để tránh trùng tên với Request type của express
} from '@nestjs/common';
import { Request } from 'express'; // 👈 Import Type Request của Express
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { LoginDto, RegisterDto, ChangePasswordDto } from './dto/auth.dto';
import { Public } from './decorators/public.decorator';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // ============================================================================
  // 🔥 CHỨC NĂNG GOOGLE OAUTH2 (CHỈ DÀNH CHO CUSTOMER)
  // ============================================================================
  
  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Bắt đầu đăng nhập bằng Google (Dành cho Khách hàng)' })
  async googleAuth(@Req() req: Request) {
    // AuthGuard('google') sẽ tự động chuyển hướng sang Google
  }

  @Public()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  @ApiOperation({ summary: 'Xử lý kết quả trả về từ Google' })
  async googleAuthRedirect(@Req() req: any, @Res() res: any) {
    try {
      // 1. Lấy IP gốc từ Request (y hệt login bằng email)
      const clientIp = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown IP') as string;

      // 2. Gọi service để kiểm tra/tạo user và thực hiện Login (kèm IP)
      const loginData = await this.authService.validateGoogleUser(req.user, clientIp);
      
      // 3. Redirect về Frontend kèm token thành công
      return res.redirect(
        `${process.env.FRONTEND_URL}/login-success?token=${loginData.access_token}`
      );
    } catch (error: any) {
      // Nếu có lỗi (ví dụ: bị ban, sai role), đá về trang login kèm message lỗi
      const errorMessage = encodeURIComponent(
        error?.message || 'Đăng nhập Google thất bại'
      );
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=${errorMessage}`);
    }
  }

  // ============================================================================
  // --- ĐĂNG NHẬP LOCAL ---
  // ============================================================================
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
  async login(@Req() req: Request) { 
    // 👈 1. Lấy IP của người dùng (kể cả khi qua proxy)
    const clientIp = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown IP') as string;
    
    // 👈 2. Truyền IP vào service.
    // Lưu ý: req.user ở đây có được là nhờ LocalAuthGuard đã chạy thành công
    return this.authService.login(req.user, clientIp); 
  }

  // --- ĐĂNG KÝ (Hỗ trợ File cho Seller/Enterprise) ---
  @Public()
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({
    status: 201,
    description: 'User has been successfully created.',
  })
  @ApiConsumes('multipart/form-data')
  @Post('register')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'businessLicense', maxCount: 1 },
    { name: 'brandRegistration', maxCount: 1 },
    { name: 'taxDocument', maxCount: 1 },
    { name: 'businessDocument', maxCount: 1 },
    { name: 'identityDocument', maxCount: 1 },
    { name: 'addressDocument', maxCount: 1 },
  ]))
  async register(
    @Body() data: RegisterDto,
    @UploadedFiles() files: { 
      businessLicense?: Express.Multer.File[],
      brandRegistration?: Express.Multer.File[],
      taxDocument?: Express.Multer.File[],
      businessDocument?: Express.Multer.File[],
      identityDocument?: Express.Multer.File[],
      addressDocument?: Express.Multer.File[],
    },
  ) {
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
  async refresh(@Req() req: any) {
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
  async changePassword(@Req() req: any, @Body() data: ChangePasswordDto) {
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
  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getCurrentUser(@Req() req: any) {
    return this.authService.validateJwt(req.user.id);
  }
}