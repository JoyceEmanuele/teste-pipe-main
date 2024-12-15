import { faker } from '@faker-js/faker';
import { GetApiRegistryDto } from 'src/api-registries/dto/getApiRegistry.dto';

enum NotifyCondition {
    HEALTH_INDEX = 'HEALTH_INDEX',
}

enum HealthStatus {
    RED = 'RED',
    RED_OR_ORANGE = 'RED_OR_ORANGE',
    NOT_GREEN = 'NOT_GREEN',
}

enum IntegrationType {
    GOOGLE = 'GOOGLE',
    CELSIUS = 'CELSIUS',
}


export function generateApiRegistryEntity() {
    const api = {
        clientId: faker.number.int({ min: 1 }), // ID do cliente deve ser um inteiro e não vazio
        clientName: faker.string.sample(), // Nome do cliente
        title: faker.lorem.sentence(), // Título
        unitRelations: [
            {
                unitName: faker.string.sample(),
                unitId: faker.number.int({min: 1}),
                createdAt: faker.date.recent(),
                updatedAt: faker.date.recent(),        
            },
        ],
        triggerId: faker.string.sample(), // ID do trigger
        status: true, // Status ativado/desativado
        isTest: true,
        isActive: true,
        notifyCondition: NotifyCondition.HEALTH_INDEX,
        healthStatus: HealthStatus.RED,
        integrationType: IntegrationType.GOOGLE,
        createdAt: faker.date.recent(),
        updatedAt: faker.date.recent(),
    };

    return api;
}

export function generateGetApiRegistry() {
    const api: GetApiRegistryDto = {
        clientIds: [faker.number.int({min: 1})],
        clientName: faker.string.sample(),
        title: [faker.string.sample()],
        unitNames: [
            faker.string.sample(),
        ],
        unitIds: [
            faker.number.int({min: 1}),
            faker.number.int({min: 2}),
        ],
        notifyCondition: [NotifyCondition.HEALTH_INDEX],
        healthStatus: [HealthStatus.RED],
        integrationType: [IntegrationType.GOOGLE],
        triggerId: [faker.string.sample()],
        status: true,
        isTest: true,
        page: 1,
        limit: 10,
    }

    return api;
}