import { faker } from '@faker-js/faker';
import { NotificationEnergyEntity } from '../../notifications/entities/notificationEnergy.entity';
import { NotificationWaterEntity } from '../../notifications/entities/notificationWater.entity';
import { NotificationMachineHealthEntity } from '../../notifications/entities/notificationMachineHealth.entity';

export function generateNotification() {
  return {
    ID: faker.number.int({ min: 1 }),
    NOTIFICATION_SUBTYPE_ID: faker.number.int({ min: 1, max: 4 }),
    DATE_SEND: faker.date.recent(),
  };
}

export function generateNotificationDestinatary(
  NOTIFICATION_ID: number,
  DESTINATARY_ID: string,
) {
  return {
    ID: faker.number.int({ min: 1 }),
    DESTINATARY_ID: DESTINATARY_ID,
    NOTIFICATION_ID: NOTIFICATION_ID,
    IS_VIEWED: false,
  };
}

export function generateNotificationEnergy(notificationData: {
  ID: number;
  TYPE_ID: number;
  UNIT_ID: number;
  DESTINATARY_ID: string;
  DATE_DETECTION: Date;
  IS_VIEWED: boolean;
}) {
  return {
    ID: faker.number.int({ min: 1 }),
    NOTIFICATION_ID: notificationData.ID,
    CONSUMPTION: faker.number.int(),
    SETPOINT: faker.number.int(),
    IS_GREATER: faker.datatype.boolean(),
    IS_INSTANTANEOUS: faker.datatype.boolean(),
  };
}

export function generateNotificationViewed(notificationData: {
  ID: number;
  DESTINATARY_ID: string;
  NOTIFICATION_ID: number;
  IS_VIEWED: boolean;
}) {
  return {
    ID: notificationData.ID,
    DESTINATARY_ID: notificationData.DESTINATARY_ID,
    NOTIFICATION_ID: notificationData.NOTIFICATION_ID,
    IS_VIEWED: true,
  };
}

export function generateNotificationEnergyConditions(notificationData: {
  ID: number;
  SETPOINT: number;
  IS_GREATER: boolean;
  IS_INSTANTANEOUS: boolean;
}) {
  return {
    ID: notificationData.ID,
    SETPOINT: notificationData.SETPOINT,
    IS_GREATER: notificationData.IS_GREATER,
    IS_INSTANTANEOUS: notificationData.IS_INSTANTANEOUS,
  };
}

export function generateNotificationWaterConditions(notificationData: {
  ID: number;
  IS_INSTANTANEOUS: boolean;
}) {
  return {
    ID: notificationData.ID,
    IS_INSTANTANEOUS: notificationData.IS_INSTANTANEOUS,
  };
}

export function generateNotificationMachineHealthConditions(notificationData: {
  ID: number;
  IS_INSTANTANEOUS: boolean;
  HEALTH_INDEX_ID: number;
}) {
  return {
    ID: notificationData.ID,
    IS_INSTANTANEOUS: notificationData.IS_INSTANTANEOUS,
    HEALTH_INDEX_ID: notificationData.HEALTH_INDEX_ID,
  };
}

export function generateNotificationEntityEnergy() {
  const notification = new NotificationEnergyEntity(
    Array.from({ length: 1 }, () => generateDetectionsNotification()),
    Array.from({ length: 2 }, () => faker.internet.email()),
    faker.number.int(),
    faker.datatype.boolean(),
    faker.datatype.boolean(),
  );
  return notification;
}

export function generateNotificationEntityWater() {
  const notification = new NotificationWaterEntity(
    Array.from({ length: 1 }, () => generateDetectionsNotification()),
    Array.from({ length: 2 }, () => faker.internet.email()),
    faker.datatype.boolean(),
  );
  return notification;
}

export function generateNotificationEntityMachineHealth() {
  const notification = new NotificationMachineHealthEntity(
    Array.from({ length: 1 }, () => generateDetectionsNotificationMachineHealth()),
    Array.from({ length: 2 }, () => faker.internet.email()),
    faker.datatype.boolean(),
    faker.number.int({ min: 1, max: 4 }),
  );
  return notification;
}

export function generateDetectionsNotification() {
  return {
    unitId: faker.number.int(),
    consumption: faker.number.int(),
    dateDetection: faker.string.sample(),
  };
}

export function generateDetectionsNotificationMachineHealth() {
  return {
    unitId: faker.number.int(),
    dateDetection: faker.string.sample(),
    machineName: faker.string.sample(),
    machineId: faker.number.int(),
    assetName: faker.string.sample(),
    assetId: faker.number.int(),
    deviceCode: faker.string.sample(),
    report: faker.string.sample(),
  };
}

export const prismaMock = {
  entity: { create: jest.fn() },
  $transaction: jest
    .fn()
    .mockImplementation((callback) => callback(prismaMock)),
};
