import {
  Controller,
  Post,
  Body,
  Inject,
  Req,
  Query,
  Get,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';
import { CreateNotificationEnergyDto } from './dto/createNotificationEnergy.dto';
import { CreateNotificationWaterDto } from './dto/createNotificationWater.dto';
import { CreateNotificationMachineHealthDto } from './dto/createNotificationMachineHealth.dto';
import { ViewNotificationDto } from './dto/viewNotification.dto';
import { GetNotificationsDto } from './dto/getNotifications.dto';
import { CreateNotificationEnergyUseCase } from './use-cases/createNotificationEnergy.uc';
import { CreateNotificationWaterUseCase } from './use-cases/createNotificationWater.uc';
import { CreateNotificationMachineHealthUseCase } from './use-cases/createNotificationMachineHealth.uc';
import { ViewNotificationUseCase } from './use-cases/viewNotification.uc';
import { ViewAllNotificationsUseCase } from './use-cases/viewAllNotifications.uc';
import { GetNotificationsUseCase } from './use-cases/getNotifications.uc';
import { GetCountNotificationsUseCase } from './use-cases/getCountNotifications.uc';
import { NotificationEnergyEntity as NotificationEnergy } from './entities/notificationEnergy.entity';
import { NotificationWaterEntity as NotificationWater } from './entities/notificationWater.entity';
import { NotificationMachineHealthEntity as NotificationMachineHealth } from './entities/notificationMachineHealth.entity';
import { AuthGuard } from '../auth/auth.guard';

/**
 * Controller de notificações
 * @date 12/04/2024 - 15:13:40
 *
 * @export
 * @class NotificationsController
 * @typedef {NotificationsController}
 */
@ApiTags('notifications')
@Controller('notifications')
export class NotificationsController {
  @Inject(CreateNotificationEnergyUseCase)
  private readonly createNotificationEnergyUseCase: CreateNotificationEnergyUseCase;

  @Inject(CreateNotificationWaterUseCase)
  private readonly createNotificationWaterUseCase: CreateNotificationWaterUseCase;

  @Inject(CreateNotificationMachineHealthUseCase)
  private readonly createNotificationMachineHealthUseCase: CreateNotificationMachineHealthUseCase;

  @Inject(ViewNotificationUseCase)
  private readonly viewNotificationUseCase: ViewNotificationUseCase;

  @Inject(ViewAllNotificationsUseCase)
  private readonly viewAllNotificationsUseCase: ViewAllNotificationsUseCase;

  @Inject(GetNotificationsUseCase)
  private readonly getNotificationsUseCase: GetNotificationsUseCase;

  @Inject(GetCountNotificationsUseCase)
  private readonly getCountNotificationsUseCase: GetCountNotificationsUseCase;

  /**
   * Rota para caso de uso - Criar notificação de energia
   * @date 12/04/2024 - 15:11:44
   *
   * @param {CreateNotificationEnergyDto} createNotificationEnergyDto
   * @returns {Promise<NotificationEnergy>}
   */
  @ApiCreatedResponse({
    type: NotificationEnergy,
  })
  @Post('create-notification-energy')
  createNotificationEnergy(
    @Body() createNotificationEnergyDto: CreateNotificationEnergyDto,
  ): Promise<NotificationEnergy> {
    return this.createNotificationEnergyUseCase.execute(
      createNotificationEnergyDto,
    );
  }

  /**
   * Rota para caso de uso - Criar notificação de água
   * @date 12/04/2024 - 15:12:43
   *
   * @param {CreateNotificationWaterDto} createNotificationWaterDto
   * @returns {Promise<NotificationWater>}
   */
  @ApiCreatedResponse({
    type: NotificationWater,
  })
  @Post('create-notification-water')
  createNotificationWater(
    @Body() createNotificationWaterDto: CreateNotificationWaterDto,
  ): Promise<NotificationWater> {
    return this.createNotificationWaterUseCase.execute(
      createNotificationWaterDto,
    );
  }

  /**
   * Rota para caso de uso - Criar notificação de índice de saúde da máquina
   *
   * @param {CreateNotificationMachineHealthDto} createNotificationMachineHealthDto
   * @returns {Promise<NotificationMachineHealth>}
   */
  @ApiCreatedResponse({
    type: NotificationMachineHealth,
  })
  @Post('create-notification-machine-health-index')
  createNotificationMachineHealth(
    @Body() createNotificationMachineHealthDto: CreateNotificationMachineHealthDto,
  ): Promise<NotificationMachineHealth> {
    return this.createNotificationMachineHealthUseCase.execute(
      createNotificationMachineHealthDto,
    );
  }

  /**
   * Rota para o caso de uso - Visualizar notificação
   * @date 12/04/2024 - 15:13:12
   *
   * @param {ViewNotificationDto} viewNotificationDto
   * @param {*} req
   * @returns {*}
   */
  @ApiCreatedResponse({
    type: String,
  })
  @Patch('view-notification')
  @UseGuards(AuthGuard)
  view(@Query() viewNotificationDto: ViewNotificationDto, @Req() req) {
    return this.viewNotificationUseCase.execute(viewNotificationDto, req);
  }

  /**
   * Rota para o caso de uso -  Visualizar todas notificações não visualizadas
   * @date 12/04/2024 - 15:14:02
   *
   * @param {*} req
   * @returns {*}
   */
  @ApiCreatedResponse({
    type: String,
  })
  @Post('view-all-notifications')
  @UseGuards(AuthGuard)
  viewAll(@Req() req) {
    return this.viewAllNotificationsUseCase.execute(req);
  }

  /**
   * Rota para o caso de uso - Listar notificações
   * @date 12/04/2024 - 15:14:36
   *
   * @param {*} req
   * @param {GetNotificationsDto} getNotificationsDto
   * @returns {*}
   */
  @Get('get-notifications')
  @UseGuards(AuthGuard)
  getNotifications(
    @Req() req,
    @Query() getNotificationsDto: GetNotificationsDto,
  ) {
    return this.getNotificationsUseCase.execute(getNotificationsDto, req);
  }

  /**
   * Rotas para o caso de uso - Retornar quantidade de notificações não visualizadas
   * @date 12/04/2024 - 15:14:55
   *
   * @param {*} req
   * @returns {*}
   */
  @Get('get-count-notifications')
  @UseGuards(AuthGuard)
  getCountNotifications(@Req() req) {
    return this.getCountNotificationsUseCase.execute(req);
  }
}
