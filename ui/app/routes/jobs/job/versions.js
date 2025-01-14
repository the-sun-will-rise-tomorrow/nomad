/**
 * Copyright (c) HashiCorp, Inc.
 * SPDX-License-Identifier: BUSL-1.1
 */

import Route from '@ember/routing/route';
import { collect } from '@ember/object/computed';
import {
  watchRecord,
  watchRelationship,
} from 'nomad-ui/utils/properties/watch';
import WithWatchers from 'nomad-ui/mixins/with-watchers';
import { inject as service } from '@ember/service';

export default class VersionsRoute extends Route.extend(WithWatchers) {
  @service store;

  queryParams = {
    diffVersion: {
      refreshModel: true,
    },
  };

  async model(params) {
    const job = this.modelFor('jobs.job');
    const versions = await job.getVersions(params.diffVersion);

    job.versions = job.versions.map((v, i) => {
      const diff = versions.Diffs[i];
      v.set('diff', diff);
      return v;
    });
    return job;
  }

  startWatchers(controller, model) {
    if (model) {
      controller.set('watcher', this.watch.perform(model));
      controller.set('watchVersions', this.watchVersions.perform(model));
    }
  }

  @watchRecord('job') watch;
  @watchRelationship('versions') watchVersions;

  @collect('watch', 'watchVersions') watchers;
}
