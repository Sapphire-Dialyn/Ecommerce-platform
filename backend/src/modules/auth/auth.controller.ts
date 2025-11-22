import { 
  Controller, 
  Post, 
  Body, 
  UseGuards, 
  Request, 
  Put,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { LoginDto, RegisterDto, ChangePasswordDto } from './dto';
import { Public } from './decorators/public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

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

  @Public()
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({
    status: 201,
    description: 'User has been successfully created. Check email for verification if required.',
  })
  @ApiBody({ type: RegisterDto })
  @Public()
  @Post('register')
  async register(@Body() data: RegisterDto) {
    return this.authService.register(data);
  }

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

  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({
    status: 200,  
    description: 'Returns current user information',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('me')
  @HttpCode(HttpStatus.OK)
  async getCurrentUser(@Request() req) {
    return this.authService.validateJwt(req.user.id);
  }
}