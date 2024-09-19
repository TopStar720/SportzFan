import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

import { default as messagingConfiguration } from '../config/firebase-configuration';
import { ProjectConfiguration, ProjectData } from './firebase.type';

@Injectable()
export class FireBase {
  private _projectItems = new Map<string, ProjectData>();

  private projects(): Array<ProjectConfiguration> {
    return messagingConfiguration.projects as ProjectConfiguration[];
  }

  configure(): void {
    this.projects().forEach((project) => {
      const ref = admin.initializeApp({
        credential: admin.credential.cert(project.serviceAccount),
      });
      const appData = {
        id: project.id,
        ref,
        serverKey: project.serverKey,
      } as ProjectData;
      this._projectItems.set(appData.id, appData);
    });
  }

  getProjectData(projectId: string): ProjectData {
    const data = this._projectItems.get(projectId);
    if (!data) {
      throw new Error('project not found');
    }
    return data;
  }

  async sendNotification(
    projectId: string,
    token: string,
    notification: any,
  ): Promise<any> {
    try {
      const project = this.getProjectData(projectId);
      const data = { ...notification, token };
      return await admin.messaging(project.ref).send(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async sendTopicNotification(
    projectId: string,
    notification: any,
    topic: string,
  ): Promise<any> {
    try {
      const project = this.getProjectData(projectId);
      const data = { ...notification, topic };
      return await admin.messaging(project.ref).send(data);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async subscribe(projectId: string, token: string, topic: string): Promise<any> {
    try {
      const project = this.getProjectData(projectId);
      return await admin
        .messaging(project.ref)
        .subscribeToTopic(token, topic);
    } catch (error) {
      return Promise.reject(error);
    }
  }

  async unSubscribe(projectId: string, token: string, topic: string): Promise<any> {
    try {
      const project = this.getProjectData(projectId);
      return await admin
        .messaging(project.ref)
        .unsubscribeFromTopic(token, topic);
    } catch (error) {
      return Promise.reject(error);
    }
  }
}
