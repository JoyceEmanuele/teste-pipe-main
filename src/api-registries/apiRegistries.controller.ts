import { Controller, Post, Body, Inject, UseGuards, Req, Patch, Param, ParseIntPipe, Get } from '@nestjs/common';
import { CreateApiRegistryDto } from './dto/createApiRegistry.dto';
import { ApiTags } from '@nestjs/swagger';
import { CreateApiUseCase } from './use-cases/createApi.uc';
import { GetApisUseCase } from './use-cases/getApis.uc';
import { AuthGuard } from '../auth/auth.guard';
import { GetApiRegistryDto } from './dto/getApiRegistry.dto';
import { Request } from 'express';
import { DeleteApiUseCase } from './use-cases/deleteApi.uc';
import { UpdateApiUseCase } from './use-cases/updateApi.uc';
import { ApiRegistryEntity } from './entities/apiRegistry.entity';
import { DeleteApiResponse, GetApiRegistryDtoResponse, GetApisComboOpts } from './gateways/apiRegistryInterface.gateway';
import { GetApisComboOptsUseCase } from './use-cases/getApisComboOpts.uc';

/**
 * Controller de registro de APIs
 *
 * @export
 * @class ApiRegistriesController
 * @typedef {ApiRegistriesController}
 */
@ApiTags('api-registries')
@Controller('api-registries')
export class ApiRegistriesController {
  @Inject(CreateApiUseCase)
  private readonly createApiUseCase: CreateApiUseCase;

  @Inject(GetApisUseCase)
  private readonly getApiUseCase: GetApisUseCase;

  @Inject(DeleteApiUseCase)
  private readonly deleteApiUseCase: DeleteApiUseCase;

  @Inject(UpdateApiUseCase)
  private readonly updateApiUseCase: UpdateApiUseCase;

  @Inject(GetApisComboOptsUseCase)
  private readonly getApisComboOpts: GetApisComboOptsUseCase;

    /**
   * Rota para caso de uso - Criar registro de API
   *
   * @param {CreateApiRegistryDto} createApiRegistryDto
   * @returns {Promise<ApiRegistryEntity>}
   */
  @Post()
  @UseGuards(AuthGuard)
  create(@Body() createApiRegistryDto: CreateApiRegistryDto): Promise<ApiRegistryEntity> {
    return this.createApiUseCase.execute(createApiRegistryDto);
  }

    /**
   * Rota para caso de uso - Visualizar registro de API
   *
   * @param {Request} req
   * @param {GetApiRegistryDto} getApiRegistryDto
   * @returns {Promise<GetApiRegistryDtoResponse>}
   */
  @Post('get-apis')
  @UseGuards(AuthGuard)
  getApis(
    @Req() req: Request,
    @Body() getApiRegistryDto: GetApiRegistryDto,
  ): Promise<GetApiRegistryDtoResponse> {
    return this.getApiUseCase.execute(
      getApiRegistryDto,
      req, 
    );
  }

    /**
   * Rota para caso de uso - Visualizar registro de API
   *
   * @param {Request} req
   * @returns {Promise<any>}
   */
  @Get('get-combo-opts')
  @UseGuards(AuthGuard)
  getApisCombo(): Promise<GetApisComboOpts> {
    return this.getApisComboOpts.execute();
  }

    /**
   * Rota para caso de uso - Deletar registros de APIs
   *
   * @param {Request} req
   * @param {number[]} ids
   * @returns {Promise<ApiRegistryEntity>}
   */
  @Post('delete-apis')
  @UseGuards(AuthGuard)
  deleteApis(
    @Req() req: Request,
    @Body() ids: number[],
  ): Promise<DeleteApiResponse> {
    return this.deleteApiUseCase.execute(
      req, 
      ids,
    );
  }

    /**
   * Rota para caso de uso - Atualizar registro de APIs
   *
   * @param {Request} req
   * @param {number[]} id
   * @param {Partial<CreateApiRegistryDto>} updateApiRegistryDto
   * @returns {Promise<ApiRegistryEntity>}
   */
  @Patch('update-api/:id')
  async updateApiRegistry(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateApiRegistryDto: Partial<CreateApiRegistryDto>,
  ): Promise<ApiRegistryEntity> {
    return this.updateApiUseCase.execute(req, id, updateApiRegistryDto);
  }
}
