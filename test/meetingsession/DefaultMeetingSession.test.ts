// Copyright 2019-2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import * as chai from 'chai';

import NoOpAudioVideoController from '../../src/audiovideocontroller/NoOpAudioVideoController';
import NoOpDeviceController from '../../src/devicecontroller/NoOpDeviceController';
import NoOpLogger from '../../src/logger/NoOpLogger';
import DefaultMeetingSession from '../../src/meetingsession/DefaultMeetingSession';
import DOMMockBuilder from '../dommock/DOMMockBuilder';

describe('DefaultMeetingSession', () => {
  const expect: Chai.ExpectStatic = chai.expect;

  const OPERA_USERAGENT = 'Opera/9.80 (Windows NT 6.1; WOW64) Presto/2.12.388 Version/12.18';

  const setUserAgent = (userAgent: string): void => {
    // @ts-ignore
    navigator.userAgent = userAgent;
  };

  describe('constructor', () => {
    it('can be constructed', () => {
      const mockBuilder = new DOMMockBuilder();
      const session = new DefaultMeetingSession(
        new NoOpAudioVideoController().configuration,
        new NoOpLogger(),
        new NoOpDeviceController()
      );
      expect(session).to.exist;
      expect(session.audioVideo).to.exist;
      expect(session.configuration).to.exist;
      expect(session.logger).to.exist;
      expect(session.screenShare).to.exist;
      expect(session.screenShareView).to.exist;
      expect(session.deviceController).to.exist;
      expect(session.contentShare).to.exist;
      mockBuilder.cleanup();
    });

    it('can be constructed with an unsupported browser', () => {
      const mockBuilder = new DOMMockBuilder();
      setUserAgent(OPERA_USERAGENT);
      const session = new DefaultMeetingSession(
        new NoOpAudioVideoController().configuration,
        new NoOpLogger(),
        new NoOpDeviceController()
      );
      expect(session).to.exist;
      mockBuilder.cleanup();
    });
  });
});
