// Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import ContentShareController from './ContentShareController';
import Logger from '../logger/Logger';
import MeetingSessionCredentials from '../meetingsession/MeetingSessionCredentials';
import MeetingSessionConfiguration from '../meetingsession/MeetingSessionConfiguration';
import AudioVideoController from '../audiovideocontroller/AudioVideoController';
import DefaultWebSocketAdapter from '../websocketadapter/DefaultWebSocketAdapter';
import DefaultReconnectController from '../reconnectcontroller/DefaultReconnectController';
import FullJitterBackoff from '../backoff/FullJitterBackoff';
import DefaultAudioVideoController from '../audiovideocontroller/DefaultAudioVideoController';
import DeviceControllerBasedMediaStreamBroker from '../mediastreambroker/DeviceControllerBasedMediaStreamBroker';
import Device from '../devicecontroller/Device';
import DevicePermission from '../devicecontroller/DevicePermission';
import DeviceChangeObserver from '../devicechangeobserver/DeviceChangeObserver';
import DefaultDeviceController from '../devicecontroller/DefaultDeviceController';
import ContentShareConstants from './ContentShareConstants';

export default class DefaultContentShareController implements ContentShareController, DeviceControllerBasedMediaStreamBroker {
  private static RECONNECT_TIMEOUT_MS = 120 * 1000;
  private static RECONNECT_FIXED_WAIT_MS = 0;
  private static RECONNECT_SHORT_BACKOFF_MS = 1 * 1000;
  private static RECONNECT_LONG_BACKOFF_MS = 5 * 1000;

  private configuration: MeetingSessionConfiguration;
  private audioVideo: AudioVideoController;
  private mediaStream: MediaStream;

  constructor(private logger: Logger, configuration: MeetingSessionConfiguration) {
    this.configuration = new MeetingSessionConfiguration();
    this.configuration.meetingId = configuration.meetingId;
    this.configuration.urls = configuration.urls;
    this.configuration.credentials = new MeetingSessionCredentials();
    this.configuration.credentials.attendeeId = configuration.credentials.attendeeId + ContentShareConstants.Modality;
    this.configuration.credentials.joinToken = configuration.credentials.joinToken + ContentShareConstants.Modality;
    this.audioVideo = new DefaultAudioVideoController(
      this.configuration,
      this.logger,
      new DefaultWebSocketAdapter(this.logger),
      this,
      new DefaultReconnectController(
        DefaultContentShareController.RECONNECT_TIMEOUT_MS,
        new FullJitterBackoff(
          DefaultContentShareController.RECONNECT_FIXED_WAIT_MS,
          DefaultContentShareController.RECONNECT_SHORT_BACKOFF_MS,
          DefaultContentShareController.RECONNECT_LONG_BACKOFF_MS
        )
      )
    );
  }

  async start(stream: MediaStream): Promise<void> {
    this.mediaStream = stream;
    this.audioVideo.start();
    if (this.mediaStream.getVideoTracks().length > 0) {
      this.audioVideo.videoTileController.startLocalVideoTile();
    }
  }

  stop(): void {
    this.audioVideo.stop();
  }

  async acquireAudioInputStream(): Promise<MediaStream> {
    if (this.mediaStream.getAudioTracks().length === 0) {
      return DefaultDeviceController.synthesizeAudioDevice(0) as MediaStream;
    }
    return this.mediaStream;
  }

  async acquireVideoInputStream(): Promise<MediaStream> {
    return this.mediaStream;
  }

  releaseMediaStream(mediaStreamToRelease: MediaStream): void {
    this.logger.warn('release media stream called');
    return;
  }

  async acquireDisplayInputStream(streamConstraints: MediaStreamConstraints): Promise<MediaStream> {
    throw new Error('unsupported');
  }

  bindToAudioVideoController(audioVideoController: AudioVideoController): void {
    throw new Error('unsupported');
  }

  async listAudioInputDevices(): Promise<MediaDeviceInfo[]> {
    throw new Error('unsupported');
  }

  async listVideoInputDevices(): Promise<MediaDeviceInfo[]> {
    throw new Error('unsupported');
  }

  async listAudioOutputDevices(): Promise<MediaDeviceInfo[]> {
    throw new Error('unsupported');
  }

  chooseAudioInputDevice(device: Device): Promise<DevicePermission> {
    throw new Error('unsupported');
  }

  chooseVideoInputDevice(device: Device): Promise<DevicePermission> {
    throw new Error('unsupported');
  }

  chooseAudioOutputDevice(deviceId: string | null): Promise<void> {
    throw new Error('unsupported');
  }

  addDeviceChangeObserver(observer: DeviceChangeObserver): void {
    throw new Error('unsupported');
  }

  removeDeviceChangeObserver(observer: DeviceChangeObserver): void {
    throw new Error('unsupported');
  }

  createAnalyserNodeForAudioInput(): AnalyserNode | null {
    throw new Error('unsupported');
  }

  startVideoPreviewForVideoInput(element: HTMLVideoElement): void {
    throw new Error('unsupported');
  }

  stopVideoPreviewForVideoInput(element: HTMLVideoElement): void {
    throw new Error('unsupported');
  }

  setDeviceLabelTrigger(trigger: () => Promise<MediaStream>): void {
    throw new Error('unsupported');
  }

  mixIntoAudioInput(stream: MediaStream): MediaStreamAudioSourceNode {
    throw new Error('unsupported');
  }

  chooseVideoInputQuality(
    width: number,
    height: number,
    frameRate: number,
    maxBandwidthKbps: number
  ): void {
    throw new Error('unsupported');
  }

  enableWebAudio(): boolean {
    return false;
  }
}