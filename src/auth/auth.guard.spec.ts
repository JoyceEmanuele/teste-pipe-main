import { TestBed } from '@automock/jest';
import { AuthGuard } from './auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { createMock } from '@golevelup/ts-jest';
import { HttpService } from '@nestjs/axios';
import { of } from 'rxjs';
import { AxiosRequestHeaders, AxiosResponse } from 'axios';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let httpService: jest.Mocked<HttpService>;

  beforeAll(() => {
    const { unit, unitRef } = TestBed.create(AuthGuard).compile();
    authGuard = unit;
    httpService = unitRef.get(HttpService);
  });

  it('should be defined', () => {
    expect(new AuthGuard(httpService)).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true when user is authenticated', async () => {
      const mockContext = createMock<ExecutionContext>();

      mockContext.switchToHttp().getRequest.mockReturnValue({
        headers: {
          authorization: 'Bearer 123456789',
        },
      });

      const headers = {
        'Content-Type': 'application/json',
        crossDomain: true,
      } as unknown as AxiosRequestHeaders;

      const response: AxiosResponse<any> = {
        data: {
          session: '',
        },
        headers: {},
        config: {
          url: '',
          headers: headers,
        },
        status: 200,
        statusText: 'OK',
      };

      jest.spyOn(httpService, 'post').mockReturnValueOnce(of(response));

      const canActivate = await authGuard.canActivate(mockContext);
      expect(canActivate).toBe(true);
    });

    it('should return UnauthorizedException when there is no Bearer token', async () => {
      const mockContext = createMock<ExecutionContext>();

      try {
        await authGuard.canActivate(mockContext);
      } catch (error) {
        expect(error.message).toBe('Unauthorized');
        expect(error.name).toBe('UnauthorizedException');
        expect(error.status).toBe(401);
      }
    });

    it('should return UnauthorizedException when /diel-internal/auth/get-user-session request fail', async () => {
      const mockContext = createMock<ExecutionContext>();

      mockContext.switchToHttp().getRequest.mockReturnValue({
        headers: {
          authorization: 'Bearer 123456789',
        },
      });

      const headers = {
        'Content-Type': 'application/json',
        crossDomain: true,
      } as unknown as AxiosRequestHeaders;

      const response: AxiosResponse<any> = {
        data: {
          session: '',
        },
        headers: {},
        config: {
          url: '',
          headers: headers,
        },
        status: 401,
        statusText: 'Unauthorized',
      };

      jest
        .spyOn(httpService, 'post')
        .mockImplementationOnce(() => of(response));

      try {
        await authGuard.canActivate(mockContext);
      } catch (error) {
        expect(error.message).toBe('Unauthorized');
        expect(error.name).toBe('UnauthorizedException');
        expect(error.status).toBe(401);
      }
    });
  });
});
