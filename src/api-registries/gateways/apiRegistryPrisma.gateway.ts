import { HttpException, HttpStatus, Injectable, Logger } from "@nestjs/common";
import { ApiRegistryGatewayInterface, DeleteApiResponse, GetApiRegistryDtoResponse, GetApisComboOpts } from "./apiRegistryInterface.gateway";
import { Request } from "express";
import { GetApiRegistryDto } from "../dto/getApiRegistry.dto";
import { ApiRegistryEntity } from "../entities/apiRegistry.entity";
import { PrismaService } from "../../prisma/prisma.service";
import { CreateApiRegistryDto } from "../dto/createApiRegistry.dto";

interface FilterData {
    CLIENTS: { CLIENT_ID: number; CLIENT_NAME: string }[];
    ApiUnitRelations: { UNIT_ID: number; UNIT_NAME: string }[];
    TITLES: string[];
    TRIGGER_IDS: string[];
}

/**
 * Apdator do prisma para a porta de api registry
 *
 * @export
 * @class ApiRegistryGatewayPrisma
 * @typedef {ApiRegistryGatewayPrisma}
 * @implements {ApiRegistryGatewayPrisma}
 */
@Injectable()
export class ApiRegistryGatewayPrisma implements ApiRegistryGatewayInterface {
    private readonly logger = new Logger(ApiRegistryGatewayPrisma.name);
    constructor(private prisma: PrismaService) {}

    async checkExistingApiConflicts(api: ApiRegistryEntity) {
        const matchingApis = await this.prisma.apiRegistry.findMany({
            where: {
                OR: [
                    { CLIENT_ID: api.clientId },
                    { TRIGGER_ID: api.triggerId },
                    { TITLE: api.title },
                ],
                AND: {
                    IS_ACTIVE: true,
                }
            },
        });
    
        matchingApis.forEach(existingApi => {
            if (existingApi.CLIENT_ID === api.clientId && existingApi.STATUS === true && existingApi.IS_TEST === api.isTest) {
                throw new HttpException(`Já existe uma API ativa para o cliente no modo ${api.isTest ? 'teste' : 'produção'}`, HttpStatus.CONFLICT);
            }
    
            if (existingApi.TRIGGER_ID === api.triggerId && existingApi.CLIENT_ID !== api.clientId) {
                throw new HttpException('O Trigger Id já está sendo utilizado por outro cliente', HttpStatus.CONFLICT);
            }
    
            if (existingApi.TITLE === api.title) {
                throw new HttpException('O nome da API já está sendo utilizado', HttpStatus.CONFLICT);
            }
        });
    }

    /**
   * Criar registro de APIs
   *
   * @async
   * @param {ApiRegistryEntity} api
   * @returns {Promise<ApiRegistryEntity>}
   */
    async createApiRegistry(api: ApiRegistryEntity): Promise<ApiRegistryEntity> {
        try {
            await this.checkExistingApiConflicts(api);

            if (!api.isTest) {
                // Se a api não está em teste, todas as unidades são selecionadas
                api.unitRelations = [];
            }

            await this.prisma.$transaction(async (prisma) => {
                await prisma.apiRegistry.create({
                data: {
                    CLIENT_ID: api.clientId,
                    CLIENT_NAME: api.clientName,
                    TITLE: api.title,
                    ApiUnitRelations: {
                        create: api.unitRelations?.map((unitRelation) => ({
                            UNIT_NAME: unitRelation.unitName,
                            UNIT_ID: unitRelation.unitId,
                        })),
                    },
                    NOTIFY_CONDITION: api.notifyCondition,
                    HEALTH_STATUS: api.healthStatus,
                    INTEGRATION_TYPE: api.integrationType,
                    TRIGGER_ID: api.triggerId,
                    STATUS: api.status,
                    IS_TEST: api.isTest
                },
                });
            });
        } catch (error) {
            this.logger.error({
            msg: `Error creating api register: ${error}`,
            params: api,
            error,
            });
            throw new HttpException(error.message || 'An unexpected error occurred', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return api;
    }

    /**
   * Deletar registro de APIs
   * Não remove os dados apenas desativa e impede a visualização
   *
   * @async
   * @param {Request} req
   * @param {number[]} ids
   * @returns {Promise<DeleteApiResponse>}
   */
    async deleteApi(req: Request, ids: number[]): Promise<DeleteApiResponse> {
        try {
            if (!ids || ids.length === 0) {
                throw new Error("Nenhum ID fornecido para deletar");
            }
    
            const existingApis = await this.prisma.apiRegistry.findMany({
                where: { ID: { in: ids } },
                select: { ID: true }
            });
    
            const existingIds = existingApis.map(api => api.ID);

            if (existingIds.length === 0) {
                throw new Error("Nenhuma API encontrada para os IDs fornecidos");
            }

            const deleteResult = await this.prisma.apiRegistry.updateMany({
                data: {
                    STATUS: false,
                    IS_ACTIVE: false,
                },
                where: { ID: { in: existingIds } }
            });
    
            return {
                message: `${deleteResult.count} APIs deletadas com sucesso.`,
                deletedIds: existingIds
            };
        } catch (e) {
            throw new Error(`Erro ao deletar as APIs: ${e.message}, ${typeof(ids)}, ${JSON.stringify(ids)}`);
        }
    }


    /**
   * Visualizar registro de APIs
   *
   * @async
   * @param {Request} req
   * @param {GetApiRegistryDto} api
   * @returns {Promise<GetApiRegistryDtoResponse>}
   */
    async getApiRegistry(
        req: Request,
        api: GetApiRegistryDto, 
    ): Promise<GetApiRegistryDtoResponse> {
        const {
            clientName,
            unitIds,
            unitNames,
            title,
            healthStatus,
            notifyCondition,
            integrationType,
            triggerId,
            isTest,
            status,
            page,
            limit,
            orderBy,
            orderDirection,
        } = this.handleFilters(api);
        
        let skip: number | undefined = undefined;
        let take: number | undefined = undefined;


        if (page && limit) {
            skip = (page - 1) * limit;
            take = limit;
        }

        try {
            const where: any = {};

            if (api.clientIds && api.clientIds.length > 0) {
                api.clientIds = api.clientIds.map(Number);
                where.CLIENT_ID = { in: api.clientIds };
            }
            if (clientName) {
                where.CLIENT_NAME = { in: clientName };
            }
            if (title) {
                where.TITLE = { in: title };
            }
            if (healthStatus) {
                where.HEALTH_STATUS = { in: healthStatus };
            }
            if (notifyCondition) {
                where.NOTIFY_CONDITION = {in: notifyCondition};
            }
            if (integrationType) {
                where.INTEGRATION_TYPE = {in: integrationType};
            }
            if (unitNames) {
                where.ApiUnitRelations = { some: { UNIT_NAME: { in: unitNames } } };
            }
            if (unitIds) {
                where.ApiUnitRelations = { some: { UNIT_ID: { in: unitIds } } };
            }
            if (triggerId) {
                where.TRIGGER_ID = { in: triggerId };
            }
            if (isTest != null) {
                where.IS_TEST = { equals: isTest };
            }
            if (status != null) {
                where.STATUS = { equals: status };
            }
            
            const order = {};
            if (orderBy && orderBy !== 'UNIT_NAME' && orderBy !== 'UNIT_ID') {
                order[orderBy] = orderDirection;
            } else {
                order['UPDATED_AT'] = 'desc';
            }

            where.IS_ACTIVE = { equals: true };

            const apis = await this.prisma.apiRegistry.findMany({
                select: {
                    ID: true,
                    CLIENT_ID: true,
                    CLIENT_NAME: true,
                    HEALTH_STATUS: true,
                    INTEGRATION_TYPE: true,
                    ApiUnitRelations: {
                        select: {
                            UNIT_NAME: true,
                            UNIT_ID: true,
                            CREATED_AT: true,
                            UPDATED_AT: true,
                        },
                    },
                    NOTIFY_CONDITION: true,
                    IS_TEST: true,
                    STATUS: true,
                    TITLE: true,
                    TRIGGER_ID: true,
                    CREATED_AT: true,
                    UPDATED_AT: true,
                },
                where,
                skip,
                take: take,
                orderBy: order,
            });

            if (orderBy === 'UNIT_NAME' || orderBy === 'UNIT_ID') {
                apis.sort((a, b) => {
                    const unitA = a.ApiUnitRelations[0]?.[orderBy];
                    const unitB = b.ApiUnitRelations[0]?.[orderBy];
                    if (unitA < unitB) return orderDirection === 'asc' ? -1 : 1;
                    if (unitA > unitB) return orderDirection === 'asc' ? 1 : -1;
                    return 0;
                });
            }
    
            const totalItems = await this.prisma.apiRegistry.count({ where });
    
            return { apis, totalItems };
        } catch (error) {
            this.logger.error({
                msg: `Error findMany api registry: ${error}`,
                params: api,
                error,
            });
            throw Error(`Error findMany api registry, ${error}`);
        }
    }

    private getClientName(clientName: string | undefined): string | undefined {
        return clientName;
    }

    private getArrayFromString(value: string[] | undefined): string[] | undefined {
        return value && value.length > 0 ? value : undefined;
    }

    private getNumberArrayFromString(value: number[] | undefined): number[] | undefined {
        return value && value.length > 0 ? value.map(Number) : undefined;
    }

    handleFilters(api: GetApiRegistryDto) {
        const clientName = this.getClientName(api.clientName);
        const title = this.getArrayFromString(api.title);
        const unitNames = this.getArrayFromString(api.unitNames);
        const unitIds = this.getNumberArrayFromString(api.unitIds);
        const notifyCondition = this.getArrayFromString(api.notifyCondition);
        const healthStatus = this.getArrayFromString(api.healthStatus);
        const integrationType = this.getArrayFromString(api.integrationType);
        const triggerId = this.getArrayFromString(api.triggerId);
        const isTest = api.isTest;
        const status = api.status;
        const page = api.page;
        const limit = api.limit;
        const orderBy = api.orderBy;
        const orderDirection = api.orderDirection;

        return {
            clientName,
            title,
            unitNames,
            unitIds,
            notifyCondition,
            healthStatus,
            integrationType,
            triggerId,
            isTest,
            status,
            page,
            limit,
            orderBy,
            orderDirection
        };
    }

    private async getExistingApiRegistry(id: number, status?: boolean) {
        const existingApiRegistry = await this.prisma.apiRegistry.findUnique({
            where: { 
                ID: id,
                IS_ACTIVE: true,
            },
            include: {
                ApiUnitRelations: {
                    select: {
                        UNIT_ID: true,
                    }
                }
            },
        });

        if (!existingApiRegistry) {
            throw new Error(`API registry with ID ${id} not found.`);
        }

        const findActiveByClientId = await this.prisma.apiRegistry.findFirst({
            where: {
                CLIENT_ID: existingApiRegistry.CLIENT_ID,
                STATUS: true,
                IS_TEST: existingApiRegistry.IS_TEST,
                IS_ACTIVE: true,
                ID: { not: id }
            }
        });
        
        if (findActiveByClientId && existingApiRegistry.STATUS !== status && status === true) {
            throw new HttpException(
                `Já existe uma API ativa para o cliente no modo ${existingApiRegistry.IS_TEST ? 'teste' : 'produção'}`,
                HttpStatus.CONFLICT
            );
        }

        return existingApiRegistry;
    }

    /**
   * Atualiza registro de APIs
   *
   * @async
   * @param {Request} req
   * @param {number} id
   * @param {Partial<CreateApiRegistryDto>} api
   * @returns {Promise<ApiRegistryEntity>}
   */
    async updateApi(req: Request, id: number, api: Partial<CreateApiRegistryDto>): Promise<ApiRegistryEntity> {    
        try {
            const existingApiRegistry = await this.getExistingApiRegistry(id, api.status);

            const updatedUnitRelations = api.unitRelations
            ? {
                deleteMany: {},
                create: api.unitRelations.map((unit) => ({
                    UNIT_NAME: unit.unitName,
                    UNIT_ID: unit.unitId,
                })),
            }
            : undefined;

            const updatedApiRegistry = await this.prisma.apiRegistry.update({
                where: { ID: id },
                data: {
                    CLIENT_ID: api.clientId ?? existingApiRegistry.CLIENT_ID,
                    CLIENT_NAME: api.clientName ?? existingApiRegistry.CLIENT_NAME,
                    TITLE: api.title ?? existingApiRegistry.TITLE,
                    ApiUnitRelations: updatedUnitRelations ?? undefined,
                    NOTIFY_CONDITION: api.notifyCondition ?? existingApiRegistry.NOTIFY_CONDITION,
                    HEALTH_STATUS: api.healthStatus ?? existingApiRegistry.HEALTH_STATUS,
                    INTEGRATION_TYPE: api.integrationType ?? existingApiRegistry.INTEGRATION_TYPE,
                    TRIGGER_ID: api.triggerId ?? existingApiRegistry.TRIGGER_ID,
                    IS_TEST: api.isTest ?? existingApiRegistry.IS_TEST,
                    IS_ACTIVE: api.isActive ?? existingApiRegistry.IS_ACTIVE,
                    STATUS: api.status ?? existingApiRegistry.STATUS,
                },
                include: {
                    ApiUnitRelations: true
                }
            });

            return {
                id: updatedApiRegistry.ID,
                clientId: updatedApiRegistry.CLIENT_ID,
                clientName: updatedApiRegistry.CLIENT_NAME,
                title: updatedApiRegistry.TITLE,
                unitRelations: updatedApiRegistry.ApiUnitRelations?.map((unitRelation) => ({
                    unitName: unitRelation.UNIT_NAME,
                    unitId: unitRelation.UNIT_ID,
                    createdAt: unitRelation.CREATED_AT,
                    updatedAt: unitRelation.UPDATED_AT
                })),
                notifyCondition: updatedApiRegistry.NOTIFY_CONDITION,
                healthStatus: updatedApiRegistry.HEALTH_STATUS,
                integrationType: updatedApiRegistry.INTEGRATION_TYPE,
                triggerId: updatedApiRegistry.TRIGGER_ID,
                isTest: updatedApiRegistry.IS_TEST,
                isActive: updatedApiRegistry.IS_ACTIVE,
                status: updatedApiRegistry.STATUS,
                createdAt: updatedApiRegistry.CREATED_AT,
                updatedAt: updatedApiRegistry.UPDATED_AT
            } as ApiRegistryEntity;
        } catch (error) {
            this.logger.error({
                msg: `Error updating API registry with ID ${id}: ${error.message}`,
                params: api,
                error,
            });
            throw new Error(`Error updating API registry with ID ${id}: ${error.message}`);
        }
    }


    /**
   * Visualizar registro de APIs
   *
   * @async
   * @returns {Promise<GetApiRegistryDtoResponse>}
   */
    async getApisComboOpts(): Promise<GetApisComboOpts> {
        try {
            const apisRaw = await this.prisma.apiRegistry.findMany({
                select: {
                    CLIENT_ID: true,
                    CLIENT_NAME: true,
                    ApiUnitRelations: {
                        select: {
                            UNIT_NAME: true,
                            UNIT_ID: true,
                        },
                    },
                    NOTIFY_CONDITION: true,
                    TITLE: true,
                    TRIGGER_ID: true,
                },
                where: {
                    IS_ACTIVE: true,
                }
            });

            const filterData: FilterData = {
                CLIENTS: [],
                ApiUnitRelations: [],
                TITLES: [],
                TRIGGER_IDS: [],
            };

            const titleSet: Set<string> = new Set();
            const triggerIdSet: Set<string> = new Set();

            apisRaw.map(api => {
                if (!filterData.CLIENTS.some(client => client.CLIENT_ID === api.CLIENT_ID)) {
                    filterData.CLIENTS.push({
                        CLIENT_ID: api.CLIENT_ID,
                        CLIENT_NAME: api.CLIENT_NAME,
                    });
                }

                api.ApiUnitRelations.forEach(unit => {
                    if (!filterData.ApiUnitRelations.some(u => u.UNIT_ID === unit.UNIT_ID)) {
                        filterData.ApiUnitRelations.push({
                            UNIT_ID: unit.UNIT_ID,
                            UNIT_NAME: unit.UNIT_NAME,
                        });
                    }
                });

                titleSet.add(api.TITLE);
                triggerIdSet.add(api.TRIGGER_ID);

                return {
                    CLIENT: [{
                        CLIENT_ID: api.CLIENT_ID,
                        CLIENT_NAME: api.CLIENT_NAME,
                    }],
                    ApiUnitRelations: [
                        ...new Map(api.ApiUnitRelations.map(unit => [unit.UNIT_ID, unit])).values()
                    ],
                    TITLE: api.TITLE,
                    TRIGGER_ID: api.TRIGGER_ID,
                };
            });

            filterData.TITLES = Array.from(titleSet);
            filterData.TRIGGER_IDS = Array.from(triggerIdSet);

            return filterData;
        } catch (error) {
            this.logger.error({
                msg: `Error findMany api registry: ${error}`,
                error,
            });
            throw Error(`Error findMany api registry, ${error}`);
        }
    }
}