/*
// Copyright 2024 The Lynx Authors. All rights reserved.
// Licensed under the Apache License Version 2.0 that can be found in the
// LICENSE file in the root directory of this source tree.
*/
import { Component } from '@lynx-js/web-elements-reactive';
import { LynxExposure } from '../common/Exposure.js';

@Component<typeof XFoldviewSlotDragNg>('x-foldivew-slot-drag-ng', [
  LynxExposure,
])
export class XFoldviewSlotDragNg extends HTMLElement {}
