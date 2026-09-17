/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import {useActiveVersion} from '@docusaurus/plugin-content-docs/client';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

function versionedDocsPath(path, activeVersion, release) {
  const normalized = path.replace(/^\/+/, '');
  if (!activeVersion || !normalized.startsWith('docs/')) {
    return normalized;
  }

  const suffix = normalized.slice('docs/'.length);
  if (activeVersion.name === 'current') {
    return release ? `docs/latest/${suffix}` : normalized;
  }
  if (release && activeVersion.name === release.stable_version) {
    return normalized;
  }
  return `docs/${activeVersion.name}/${suffix}`;
}

export default function ProjectSuperdexLink({site, path, children, ...props}) {
  const {siteConfig} = useDocusaurusContext();
  const activeVersion = useActiveVersion();
  const base = siteConfig.customFields.projectSuperdexUrls[site];
  if (!base) {
    throw new Error(`Unknown Project SuperDex site: ${site}`);
  }
  const href = path
    ? base +
      versionedDocsPath(
        path,
        activeVersion,
        siteConfig.customFields.docsRelease,
      )
    : base;
  return (
    <a
      {...props}
      href={href}
      target="_blank"
      rel="noopener noreferrer">
      {children}
    </a>
  );
}
