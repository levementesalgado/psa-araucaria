import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(data: { name: string; email: string; password: string; cpfCnpj: string }) {
    const user = await this.prisma.producer.create({ data: { name: data.name, email: data.email, cpfCnpj: data.cpfCnpj } });
    const payload = { sub: user.id, email: user.email };
    return {
      accessToken: this.jwt.sign(payload),
      user: { id: user.id, name: user.name, email: user.email },
    };
  }

  async login(email: string, password: string) {
    const user = await this.prisma.producer.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException();

    const payload = { sub: user.id, email: user.email };
    return {
      accessToken: this.jwt.sign(payload),
      refreshToken: this.jwt.sign(payload, { expiresIn: '7d' }),
      user: { id: user.id, name: user.name, email: user.email },
    };
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwt.verify(refreshToken);
      return { accessToken: this.jwt.sign({ sub: payload.sub, email: payload.email }) };
    } catch {
      throw new UnauthorizedException();
    }
  }
}
