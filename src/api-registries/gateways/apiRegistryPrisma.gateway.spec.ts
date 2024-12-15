import { jest } from '@jest/globals';
import { ApiRegistryGatewayPrisma } from "./apiRegistryPrisma.gateway";
import * as factories from '../../test/factories/apiRegistry';
import { PrismaService } from '../../prisma/prisma.service';
import { Request, request } from 'express';
import { HealthStatus, IntegrationType, NotifyCondition } from '@prisma/client';
import { GetApiRegistryDto } from '../dto/getApiRegistry.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

type ApiRegistryWithRelations = {
  ID: number;
  CLIENT_ID: number;
  CLIENT_NAME: string;
  TITLE: string;
  TRIGGER_ID: string;
  STATUS: boolean;
  IS_TEST: boolean;
  IS_ACTIVE: boolean;
  NOTIFY_CONDITION: NotifyCondition;
  HEALTH_STATUS: HealthStatus;
  INTEGRATION_TYPE: IntegrationType;
  ApiUnitRelations: {
    UNIT_NAME: string;
    UNIT_ID: number;
    CREATED_AT: Date;
    UPDATED_AT: Date;
  }[];
  CREATED_AT: Date;
  UPDATED_AT: Date;
};

describe('ApiRegistryGatewayPrisma', () => {
  let apiRegistryGatewayPrisma: ApiRegistryGatewayPrisma;
  let prismaService: PrismaService;

  beforeEach(() => {
    prismaService = new PrismaService();
    apiRegistryGatewayPrisma = new ApiRegistryGatewayPrisma(prismaService);
    jest.restoreAllMocks();
  });

  describe('API Registry', () => {
    describe('SUCCESS', () => {
      test('should create an API successfully', async () => {
        const api = factories.generateApiRegistryEntity();
      
        jest.spyOn(prismaService.apiRegistry, 'findMany').mockResolvedValue([]);

        prismaService.$transaction = jest.fn(
          async (callback: (prisma: PrismaService) => Promise<any>) => {
            return await callback(prismaService);
          }
        ) as unknown as typeof prismaService.$transaction;
      
        jest.spyOn(prismaService.apiRegistry, 'create').mockResolvedValue({
          ID: 1,
          CLIENT_ID: api.clientId,
          CLIENT_NAME: api.clientName,
          TITLE: api.title,
          NOTIFY_CONDITION: api.notifyCondition,
          HEALTH_STATUS: api.healthStatus,
          INTEGRATION_TYPE: api.integrationType,
          TRIGGER_ID: api.triggerId,
          STATUS: api.status,
          IS_TEST: api.isTest,
          ApiUnitRelations: api.unitRelations?.map((unitRelation) => ({
            UNIT_NAME: unitRelation.unitName,
            UNIT_ID: unitRelation.unitId,
          })),
        } as ApiRegistryWithRelations);
      
        const result = await apiRegistryGatewayPrisma.createApiRegistry({
          clientId: api.clientId,
          clientName: api.clientName,
          healthStatus: api.healthStatus,
          integrationType: api.integrationType,
          notifyCondition: api.notifyCondition,
          status: api.status,
          isTest: api.isTest,
          isActive: api.isActive,
          title: api.title,
          triggerId: api.triggerId,
          unitRelations: api.unitRelations,
          createdAt: api.createdAt,
          updatedAt: api.updatedAt
        });
      
        expect(prismaService.apiRegistry.create).toHaveBeenCalled();
        expect(result).toEqual(api);
      });

      test('should get APIs successfully with filters', async () => {
        const api = factories.generateApiRegistryEntity();

        prismaService.$transaction = jest.fn(
          async (callback: (prisma: PrismaService) => Promise<any>) => {
            return await callback(prismaService);
          }
        ) as unknown as typeof prismaService.$transaction;

        jest.spyOn(prismaService.apiRegistry, 'findMany').mockResolvedValue([]);

        jest.spyOn(prismaService.apiRegistry, 'create').mockResolvedValue({
          ID: 1,
          CLIENT_ID: api.clientId,
          CLIENT_NAME: api.clientName,
          TITLE: api.title,
          NOTIFY_CONDITION: api.notifyCondition,
          HEALTH_STATUS: api.healthStatus,
          INTEGRATION_TYPE: api.integrationType,
          TRIGGER_ID: api.triggerId,
          STATUS: api.status,
          IS_TEST: api.isTest,
          ApiUnitRelations: api.unitRelations?.map((unitRelation) => ({
            UNIT_NAME: unitRelation.unitName,
            UNIT_ID: unitRelation.unitId,
          })),
        } as ApiRegistryWithRelations);

        await apiRegistryGatewayPrisma.createApiRegistry({
          clientId: api.clientId,
          clientName: api.clientName,
          healthStatus: api.healthStatus,
          integrationType: api.integrationType,
          notifyCondition: api.notifyCondition,
          status: api.status,
          isTest: api.isTest,
          isActive: api.isActive,
          title: api.title,
          triggerId: api.triggerId,
          unitRelations: api.unitRelations,
          createdAt: api.createdAt,
          updatedAt: api.updatedAt
        });
        
        jest.spyOn(prismaService.apiRegistry, 'findMany').mockResolvedValue([{
          ID: 1,
          CLIENT_ID: api.clientId,
          CLIENT_NAME: api.clientName,
          TITLE: api.title,
          NOTIFY_CONDITION: api.notifyCondition,
          HEALTH_STATUS: api.healthStatus,
          INTEGRATION_TYPE: api.integrationType,
          TRIGGER_ID: api.triggerId,
          STATUS: api.status,
          IS_TEST: api.isTest,
          ApiUnitRelations: api.unitRelations?.map((unitRelation) => ({
            UNIT_NAME: unitRelation.unitName,
            UNIT_ID: unitRelation.unitId,
            CREATED_AT: unitRelation.createdAt,
            UPDATED_AT: unitRelation.updatedAt
          })),
          CREATED_AT: api.createdAt,
          UPDATED_AT: api.updatedAt
        }] as ApiRegistryWithRelations[]);

        jest.spyOn(prismaService.apiRegistry, 'count').mockResolvedValue(1);

        const apiFilter = {
          clientName: api.clientName,
          clientIds: [api.clientId],
          title: [api.title],
          healthStatus: [api.healthStatus],
          notifyCondition: [api.notifyCondition],
          integrationType: [api.integrationType],
          triggerId: [api.triggerId],
          isTest: api.isTest,
          orderBy: 'UNIT_ID',
          orderDirection: 'asc',
        }
  
        const response = await apiRegistryGatewayPrisma.getApiRegistry(request, apiFilter);

        expect(prismaService.apiRegistry.findMany).toHaveBeenCalledWith({
          select: {
              ID: true,
              CLIENT_ID: true,
              CLIENT_NAME: true,
              HEALTH_STATUS: true,
              INTEGRATION_TYPE: true,
              NOTIFY_CONDITION: true,
              STATUS: true,
              IS_TEST: true,
              TITLE: true,
              TRIGGER_ID: true,
              CREATED_AT: true,
              UPDATED_AT: true,
              ApiUnitRelations: {
                  select: {
                      UNIT_NAME: true,
                      UNIT_ID: true,
                      CREATED_AT: true,
                      UPDATED_AT: true,
                  },
              },
          },
          where: {
              CLIENT_NAME: { in: api.clientName },
              CLIENT_ID: { in: [api.clientId] },
              TITLE: { in: [api.title] },
              HEALTH_STATUS: { in: [api.healthStatus] },
              NOTIFY_CONDITION: { in: [api.notifyCondition] },
              INTEGRATION_TYPE: { in: [api.integrationType] },
              TRIGGER_ID: { in: [api.triggerId] },
              IS_TEST: { equals: api.isTest },
              IS_ACTIVE: { equals: true },
          },
          orderBy: {
              UPDATED_AT: 'desc',
          },
          skip: undefined,
          take: undefined
        });

        expect(response.apis).toHaveLength(1);
        expect(response.totalItems).toBe(1);

        const sortedApiUnitRelations = response.apis[0].ApiUnitRelations;

        for (let i = 0; i < sortedApiUnitRelations.length - 1; i++) {
          const current = sortedApiUnitRelations[i].UNIT_ID;
          const next = sortedApiUnitRelations[i + 1].UNIT_ID;
          expect(current <= next).toBe(true);
      }
      });

      test('should get APIs successfully with filters and populate filter options', async () => {
        const api = factories.generateApiRegistryEntity();
      
        prismaService.$transaction = jest.fn(
          async (callback: (prisma: PrismaService) => Promise<any>) => {
            return await callback(prismaService);
          }
        ) as unknown as typeof prismaService.$transaction;
      
        jest.spyOn(prismaService.apiRegistry, 'findMany').mockResolvedValue([]);
      
        jest.spyOn(prismaService.apiRegistry, 'create').mockResolvedValue({
          ID: 1,
          CLIENT_ID: api.clientId,
          CLIENT_NAME: api.clientName,
          TITLE: api.title,
          NOTIFY_CONDITION: api.notifyCondition,
          HEALTH_STATUS: api.healthStatus,
          INTEGRATION_TYPE: api.integrationType,
          TRIGGER_ID: api.triggerId,
          STATUS: api.status,
          IS_TEST: api.isTest,
          ApiUnitRelations: api.unitRelations?.map((unitRelation) => ({
            UNIT_NAME: unitRelation.unitName,
            UNIT_ID: unitRelation.unitId,
          })),
        } as ApiRegistryWithRelations);
      
        await apiRegistryGatewayPrisma.createApiRegistry({
          clientId: api.clientId,
          clientName: api.clientName,
          healthStatus: api.healthStatus,
          integrationType: api.integrationType,
          notifyCondition: api.notifyCondition,
          status: api.status,
          isTest: api.isTest,
          isActive: api.isActive,
          title: api.title,
          triggerId: api.triggerId,
          unitRelations: api.unitRelations,
          createdAt: api.createdAt,
          updatedAt: api.updatedAt
        });
        
        jest.spyOn(prismaService.apiRegistry, 'findMany').mockResolvedValue([{
          ID: 1,
          CLIENT_ID: api.clientId,
          CLIENT_NAME: api.clientName,
          TITLE: api.title,
          NOTIFY_CONDITION: api.notifyCondition,
          HEALTH_STATUS: api.healthStatus,
          INTEGRATION_TYPE: api.integrationType,
          TRIGGER_ID: api.triggerId,
          STATUS: api.status,
          IS_TEST: api.isTest,
          ApiUnitRelations: api.unitRelations?.map((unitRelation) => ({
            UNIT_NAME: unitRelation.unitName,
            UNIT_ID: unitRelation.unitId,
            CREATED_AT: unitRelation.createdAt,
            UPDATED_AT: unitRelation.updatedAt
          })),
          CREATED_AT: api.createdAt,
          UPDATED_AT: api.updatedAt
        }] as ApiRegistryWithRelations[]);

        await apiRegistryGatewayPrisma.getApisComboOpts();
      
        expect(prismaService.apiRegistry.findMany).toHaveBeenCalledWith({
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
          },
        });
      

        const filterData = await apiRegistryGatewayPrisma.getApisComboOpts();
        expect(filterData).toHaveProperty('CLIENTS');
        expect(filterData).toHaveProperty('ApiUnitRelations');
        expect(filterData).toHaveProperty('TITLES');
        expect(filterData).toHaveProperty('TRIGGER_IDS');
        
        expect(filterData.CLIENTS).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              CLIENT_ID: api.clientId,
              CLIENT_NAME: api.clientName,
            })
          ])
        );
        expect(filterData.TITLES).toContain(api.title);
        expect(filterData.TRIGGER_IDS).toContain(api.triggerId);
      });
      

      test('should delete APIs successfully', async () => {
        const api = factories.generateApiRegistryEntity();

        prismaService.$transaction = jest.fn(
          async (callback: (prisma: PrismaService) => Promise<any>) => {
            return await callback(prismaService);
          }
        ) as unknown as typeof prismaService.$transaction;

        jest.spyOn(prismaService.apiRegistry, 'findMany').mockResolvedValue([]);

        jest.spyOn(prismaService.apiRegistry, 'create').mockResolvedValue({
          ID: 1,
          CLIENT_ID: api.clientId,
          CLIENT_NAME: api.clientName,
          TITLE: api.title,
          NOTIFY_CONDITION: api.notifyCondition,
          HEALTH_STATUS: api.healthStatus,
          INTEGRATION_TYPE: api.integrationType,
          TRIGGER_ID: api.triggerId,
          STATUS: api.status,
          IS_TEST: api.isTest,
          ApiUnitRelations: api.unitRelations?.map((unitRelation) => ({
            UNIT_NAME: unitRelation.unitName,
            UNIT_ID: unitRelation.unitId,
            CREATED_AT: unitRelation.createdAt,
            UPDATED_AT: unitRelation.updatedAt
          })),
          CREATED_AT: api.createdAt,
          UPDATED_AT: api.updatedAt
        } as ApiRegistryWithRelations);

        await apiRegistryGatewayPrisma.createApiRegistry({
          clientId: api.clientId,
          clientName: api.clientName,
          healthStatus: api.healthStatus,
          integrationType: api.integrationType,
          notifyCondition: api.notifyCondition,
          status: api.status,
          isTest: api.isTest,
          isActive: api.isActive,
          title: api.title,
          triggerId: api.triggerId,
          unitRelations: api.unitRelations,
          createdAt: api.createdAt,
          updatedAt: api.updatedAt
        });
        
        jest.spyOn(prismaService.apiRegistry, 'findMany').mockResolvedValue([{
          ID: 1,
          CLIENT_ID: api.clientId,
          CLIENT_NAME: api.clientName,
          TITLE: api.title,
          NOTIFY_CONDITION: api.notifyCondition,
          HEALTH_STATUS: api.healthStatus,
          INTEGRATION_TYPE: api.integrationType,
          TRIGGER_ID: api.triggerId,
          STATUS: api.status,
          IS_TEST: api.isTest,
          ApiUnitRelations: api.unitRelations?.map((unitRelation) => ({
            UNIT_NAME: unitRelation.unitName,
            UNIT_ID: unitRelation.unitId,
          })),
        }] as ApiRegistryWithRelations[]);

        jest.spyOn(prismaService.apiRegistry, 'count').mockResolvedValue(1);

        const apiFilter = {}
        await apiRegistryGatewayPrisma.getApiRegistry(request, apiFilter);

        expect(prismaService.apiRegistry.findMany).toHaveBeenCalledWith({
          select: {
            ID: true,
            CLIENT_ID: true,
            CLIENT_NAME: true,
            HEALTH_STATUS: true,
            INTEGRATION_TYPE: true,
            NOTIFY_CONDITION: true,
            STATUS: true,
            IS_TEST: true,
            TITLE: true,
            TRIGGER_ID: true,
            CREATED_AT: true,
            UPDATED_AT: true,
            ApiUnitRelations: {
              select: {
                UNIT_NAME: true,
                UNIT_ID: true,
                CREATED_AT: true,
                UPDATED_AT: true,
              },
            },
          },
          skip: undefined,
          take: undefined,
          orderBy: {
          "UPDATED_AT": "desc",
          },
          where: {
            IS_ACTIVE: { equals: true },
          },
        });

        jest.spyOn(prismaService.apiRegistry, 'updateMany').mockResolvedValue({ count: 1 });

        const result = await apiRegistryGatewayPrisma.deleteApi(request, [1]);

        expect(prismaService.apiRegistry.findMany).toHaveBeenCalledWith({
          where: { ID: { in: [1] } },
          select: { ID: true }
        });

        expect(prismaService.apiRegistry.updateMany).toHaveBeenCalledWith({
          data: {
            STATUS: false,
            IS_ACTIVE: false,
          },
          where: { ID: { in: [1] } }
        });

        expect(result).toEqual({
          message: '1 APIs deletadas com sucesso.',
          deletedIds: [1]
        });
    });

    test('should update API successfully', async () => {
      const api = factories.generateApiRegistryEntity();

      prismaService.$transaction = jest.fn(
        async (callback: (prisma: PrismaService) => Promise<any>) => {
          return await callback(prismaService);
        }
      ) as unknown as typeof prismaService.$transaction;

      jest.spyOn(prismaService.apiRegistry, 'findMany').mockResolvedValue([]);

      jest.spyOn(prismaService.apiRegistry, 'create').mockResolvedValue({
        ID: 1,
        CLIENT_ID: api.clientId,
        CLIENT_NAME: api.clientName,
        TITLE: api.title,
        NOTIFY_CONDITION: api.notifyCondition,
        HEALTH_STATUS: api.healthStatus,
        INTEGRATION_TYPE: api.integrationType,
        TRIGGER_ID: api.triggerId,
        STATUS: api.status,
        ApiUnitRelations: api.unitRelations?.map((unitRelation) => ({
          UNIT_NAME: unitRelation.unitName,
          UNIT_ID: unitRelation.unitId,
          CREATED_AT: unitRelation.createdAt,
          UPDATED_AT: unitRelation.updatedAt
        })),
      } as ApiRegistryWithRelations);

      jest.spyOn(prismaService.apiRegistry, 'findUnique').mockResolvedValue({
        ID: 1,
        CLIENT_ID: api.clientId,
        CLIENT_NAME: api.clientName,
        TITLE: api.title,
        NOTIFY_CONDITION: api.notifyCondition,
        HEALTH_STATUS: api.healthStatus,
        INTEGRATION_TYPE: api.integrationType,
        TRIGGER_ID: api.triggerId,
        STATUS: api.status,
        ApiUnitRelations: api.unitRelations?.map((unitRelation) => ({
          UNIT_NAME: unitRelation.unitName,
          UNIT_ID: unitRelation.unitId,
          CREATED_AT: unitRelation.createdAt,
          UPDATED_AT: unitRelation.updatedAt,
        })),
        CREATED_AT: api.createdAt,
        UPDATED_AT: api.updatedAt,
      } as ApiRegistryWithRelations);

      jest.spyOn(prismaService.apiRegistry, 'findFirst').mockResolvedValue(null);

      jest.spyOn(prismaService.apiRegistry, 'update').mockResolvedValue({
        ID: 1,
        CLIENT_ID: api.clientId,
        CLIENT_NAME: api.clientName,
        TITLE: api.title,
        NOTIFY_CONDITION: api.notifyCondition,
        HEALTH_STATUS: api.healthStatus,
        INTEGRATION_TYPE: api.integrationType,
        TRIGGER_ID: api.triggerId,
        STATUS: false,
        IS_ACTIVE: api.isActive,
        ApiUnitRelations: api.unitRelations?.map((unitRelation) => ({
          UNIT_ID: unitRelation.unitId,
          UNIT_NAME: unitRelation.unitName,
          CREATED_AT: unitRelation.createdAt,
          UPDATED_AT: unitRelation.updatedAt,
        })),
        CREATED_AT: api.createdAt,
        UPDATED_AT: api.updatedAt,
      } as ApiRegistryWithRelations);

      await apiRegistryGatewayPrisma.createApiRegistry({
        clientId: api.clientId,
        clientName: api.clientName,
        healthStatus: api.healthStatus,
        integrationType: api.integrationType,
        notifyCondition: api.notifyCondition,
        status: api.status,
        isTest: api.isTest,
        isActive: api.isActive,
        title: api.title,
        triggerId: api.triggerId,
        unitRelations: api.unitRelations,
        createdAt: api.createdAt,
        updatedAt: api.updatedAt
      });

      const result = await apiRegistryGatewayPrisma.updateApi(request, 1, { status: false });

      expect(prismaService.apiRegistry.findUnique).toHaveBeenCalledWith({
        where: { ID: 1, IS_ACTIVE: true },
        include: {
          ApiUnitRelations: {
            select: {
              UNIT_ID: true,
            },
          },
        },
      });

      expect(prismaService.apiRegistry.update).toHaveBeenCalledWith({
        where: { ID: 1 },
        data: {
          CLIENT_ID: api.clientId,
          CLIENT_NAME: api.clientName,
          TITLE: api.title,
          NOTIFY_CONDITION: api.notifyCondition,
          HEALTH_STATUS: api.healthStatus,
          INTEGRATION_TYPE: api.integrationType,
          TRIGGER_ID: api.triggerId,
          STATUS: false,
        },
        include: {
          ApiUnitRelations: true,
        },
      });

      expect(result).toEqual({
        id: 1,
        clientId: api.clientId,
        clientName: api.clientName,
        title: api.title,
        unitRelations: api.unitRelations?.map((unitRelation) => ({
          unitId: unitRelation.unitId,
          unitName: unitRelation.unitName,
          createdAt: unitRelation.createdAt,
          updatedAt: unitRelation.updatedAt,
        })),
        notifyCondition: api.notifyCondition,
        healthStatus: api.healthStatus,
        integrationType: api.integrationType,
        isActive: api.isActive,
        triggerId: api.triggerId,
        status: false,
        createdAt: api.createdAt,
        updatedAt: api.updatedAt,
      });
    });

    test('should throw conflict error when there is an active API for the same client', async () => {
      const api = factories.generateApiRegistryEntity();
  
      jest.spyOn(prismaService.apiRegistry, 'findMany').mockResolvedValue([
        {   
          ID: 2,
          CLIENT_ID: api.clientId,
          CLIENT_NAME: api.clientName,
          TITLE: api.title,
          NOTIFY_CONDITION: api.notifyCondition,
          HEALTH_STATUS: api.healthStatus,
          INTEGRATION_TYPE: api.integrationType,
          TRIGGER_ID: api.triggerId,
          STATUS: api.status,
          IS_ACTIVE: api.isActive,
          IS_TEST: api.isTest,
          CREATED_AT: api.createdAt,
          UPDATED_AT: api.updatedAt,
        },
      ]);
  
      await expect(apiRegistryGatewayPrisma.checkExistingApiConflicts(api)).rejects.toThrowError(
          new HttpException('Já existe uma API ativa para o cliente no modo teste', HttpStatus.CONFLICT)
      );
  });
  
  test('should throw conflict error when Trigger Id is used by another client', async () => {
      const api = factories.generateApiRegistryEntity();
      jest.spyOn(prismaService.apiRegistry, 'findMany').mockResolvedValue([
        {   
          ID: 2,
          CLIENT_ID: api.clientId + 1,
          CLIENT_NAME: api.clientName,
          TITLE: 'Different title',
          NOTIFY_CONDITION: api.notifyCondition,
          HEALTH_STATUS: api.healthStatus,
          INTEGRATION_TYPE: api.integrationType,
          TRIGGER_ID: api.triggerId,
          STATUS: false,
          IS_ACTIVE: api.isActive,
          IS_TEST: api.isTest,
          CREATED_AT: api.createdAt,
          UPDATED_AT: api.updatedAt,
        },
      ]);  
      await expect(apiRegistryGatewayPrisma.checkExistingApiConflicts(api)).rejects.toThrowError(
          new HttpException('O Trigger Id já está sendo utilizado por outro cliente', HttpStatus.CONFLICT)
      );
  });
  
  test('should throw conflict error when API title is already used', async () => {
      const api = factories.generateApiRegistryEntity();

      jest.spyOn(prismaService.apiRegistry, 'findMany').mockResolvedValue([
        {   
          ID: 2,
          CLIENT_ID: api.clientId,
          CLIENT_NAME: api.clientName,
          TITLE: api.title,
          NOTIFY_CONDITION: api.notifyCondition,
          HEALTH_STATUS: api.healthStatus,
          INTEGRATION_TYPE: api.integrationType,
          TRIGGER_ID: api.triggerId,
          STATUS: false,
          IS_ACTIVE: api.isActive,
          IS_TEST: api.isTest,
          CREATED_AT: api.createdAt,
          UPDATED_AT: api.updatedAt,
        },
      ]);
  
      await expect(apiRegistryGatewayPrisma.checkExistingApiConflicts(api)).rejects.toThrowError(
          new HttpException('O nome da API já está sendo utilizado', HttpStatus.CONFLICT)
      );
  });
  
  test('should not throw error when there are no conflicts', async () => {
      const api = factories.generateApiRegistryEntity();
  
      jest.spyOn(prismaService.apiRegistry, 'findMany').mockResolvedValue([]);
  
      await expect(apiRegistryGatewayPrisma.checkExistingApiConflicts(api)).resolves.not.toThrow();
  });  
  });

    describe('ERROR', () => {
      test('should throw conflict error if an active API for the client already exists', async () => {
        const api = factories.generateApiRegistryEntity();
        const existingApi = {
          ID: 1,
          CLIENT_ID: api.clientId,
          CLIENT_NAME: api.clientName,
          TITLE: api.title,
          NOTIFY_CONDITION: api.notifyCondition,
          HEALTH_STATUS: api.healthStatus,
          INTEGRATION_TYPE: api.integrationType,
          TRIGGER_ID: api.triggerId,
          STATUS: api.status,
          IS_TEST: api.isTest,
          IS_ACTIVE: api.isActive,
          ApiUnitRelations: api.unitRelations?.map((unitRelation) => ({
            UNIT_NAME: unitRelation.unitName,
            UNIT_ID: unitRelation.unitId,
            CREATED_AT: unitRelation.createdAt,
            UPDATED_AT: unitRelation.updatedAt
          })),
          CREATED_AT: api.createdAt,
          UPDATED_AT: api.updatedAt
        };
    
        jest.spyOn(prismaService.apiRegistry, 'findMany').mockResolvedValue([existingApi]);
    
        await expect(apiRegistryGatewayPrisma.createApiRegistry(api))
          .rejects
          .toThrow(HttpException);
        
        await expect(apiRegistryGatewayPrisma.createApiRegistry(api))
          .rejects
          .toThrow('Já existe uma API ativa para o cliente no modo teste');
      });
    
      test('should throw conflict error if the Trigger Id is already used by another client', async () => {
        const api = factories.generateApiRegistryEntity();
        const existingApi = {
          ID: 1,
          CLIENT_ID: 1,
          CLIENT_NAME: api.clientName,
          TITLE: api.title,
          NOTIFY_CONDITION: api.notifyCondition,
          HEALTH_STATUS: api.healthStatus,
          INTEGRATION_TYPE: api.integrationType,
          TRIGGER_ID: api.triggerId,
          STATUS: api.status,
          IS_TEST: api.isTest,
          IS_ACTIVE: api.isActive,
          ApiUnitRelations: api.unitRelations?.map((unitRelation) => ({
            UNIT_NAME: unitRelation.unitName,
            UNIT_ID: unitRelation.unitId,
            CREATED_AT: unitRelation.createdAt,
            UPDATED_AT: unitRelation.updatedAt
          })),
          CREATED_AT: api.createdAt,
          UPDATED_AT: api.updatedAt
        };
    
        jest.spyOn(prismaService.apiRegistry, 'findMany').mockResolvedValue([existingApi]);
    
        await expect(apiRegistryGatewayPrisma.createApiRegistry(api))
          .rejects
          .toThrow(HttpException);
        
        await expect(apiRegistryGatewayPrisma.createApiRegistry(api))
          .rejects
          .toThrow('O Trigger Id já está sendo utilizado por outro cliente');
      });
    
      test('should throw conflict error if the API title is already in use', async () => {
        const api = factories.generateApiRegistryEntity();
        const existingApi = {
          ID: 1,
          CLIENT_ID: 2,
          CLIENT_NAME: api.clientName,
          TITLE: api.title,
          NOTIFY_CONDITION: api.notifyCondition,
          HEALTH_STATUS: api.healthStatus,
          INTEGRATION_TYPE: api.integrationType,
          TRIGGER_ID: 'another',
          STATUS: api.status,
          IS_TEST: api.isTest,
          IS_ACTIVE: api.isActive,
          ApiUnitRelations: api.unitRelations?.map((unitRelation) => ({
            UNIT_NAME: unitRelation.unitName,
            UNIT_ID: unitRelation.unitId,
            CREATED_AT: unitRelation.createdAt,
            UPDATED_AT: unitRelation.updatedAt
          })),
          CREATED_AT: api.createdAt,
          UPDATED_AT: api.updatedAt
        };
    
        jest.spyOn(prismaService.apiRegistry, 'findMany').mockResolvedValue([existingApi]);
    
        await expect(apiRegistryGatewayPrisma.createApiRegistry(api))
          .rejects
          .toThrow(HttpException);
        
        await expect(apiRegistryGatewayPrisma.createApiRegistry(api))
          .rejects
          .toThrow('O nome da API já está sendo utilizado');
      });

      test('should update API Error', async () => {
        prismaService.$transaction = jest.fn(
          async (callback: (prisma: PrismaService) => Promise<any>) => {
            return await callback(prismaService);
          }
        ) as unknown as typeof prismaService.$transaction;
  
        jest.spyOn(prismaService.apiRegistry, 'findUnique').mockResolvedValue(null);

        await expect(apiRegistryGatewayPrisma.updateApi({} as Request, 1, {})).rejects.toThrow(
          `API registry with ID ${1} not found.`
      );
      });

      test('should throw Error', async () => {
        const api = factories.generateApiRegistryEntity();
        const errorMessage = 'Prisma error';

        prismaService.$transaction = jest.fn(async (callback: (prisma: PrismaService) => Promise<any>) => {
          return await callback(prismaService);
        }) as unknown as typeof prismaService.$transaction;

        jest.spyOn(prismaService.apiRegistry, 'findMany').mockResolvedValue([]);

        jest.spyOn(prismaService.apiRegistry, 'create').mockRejectedValue(new Error(errorMessage));

        await expect(
          apiRegistryGatewayPrisma.createApiRegistry({
            clientId: api.clientId,
            clientName: api.clientName,
            healthStatus: api.healthStatus,
            integrationType: api.integrationType,
            notifyCondition: api.notifyCondition,
            status: api.status,
            title: api.title,
            isTest: api.isTest,
            isActive: api.isActive,
            triggerId: api.triggerId,
            unitRelations: api.unitRelations,
            createdAt: api.createdAt,
            updatedAt: api.updatedAt
          })
        ).rejects.toThrow(`${errorMessage}`);
      });

      it('should throw an error if no IDs are provided', async () => {
        await expect(apiRegistryGatewayPrisma.deleteApi(request, [])).rejects.toThrow("Nenhum ID fornecido para deletar");
      });

      it('should handle errors gracefully', async () => {
        const idsToDelete = [1];

        jest.spyOn(prismaService.apiRegistry, 'findMany').mockRejectedValue(new Error("Database error"));

        await expect(apiRegistryGatewayPrisma.deleteApi(request, idsToDelete)).rejects.toThrow("Erro ao deletar as APIs: Database error, object, [1]");
      });
    });
  });

  describe('handleFilters', () => {
    it('should return an object with all filters set', () => {
        const api: GetApiRegistryDto = factories.generateGetApiRegistry();

        const result = apiRegistryGatewayPrisma.handleFilters(api);

        expect(result).toEqual({
            clientName: api.clientName,
            title: api.title,
            unitNames: api.unitNames,
            unitIds: api.unitIds,
            notifyCondition: api.notifyCondition,
            healthStatus: api.healthStatus,
            integrationType: api.integrationType,
            triggerId: api.triggerId,
            status: api.status,
            isTest: api.isTest,
            page: api.page,
            limit: api.limit,
            orderBy: api.orderBy,
            orderDirection: api.orderDirection,
        });
    });
  });
});
