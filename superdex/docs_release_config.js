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

/* eslint-disable */

const fs = require('fs');
const path = require('path');

const VERSION_PATTERN = /^\d+\.\d+\.\d+$/;

function parseVersion(version) {
  if (!VERSION_PATTERN.test(version)) {
    throw new Error(`Invalid documentation version: ${version}`);
  }
  return version.split('.').map(Number);
}

function compareVersions(left, right) {
  const leftParts = parseVersion(left);
  const rightParts = parseVersion(right);
  for (let index = 0; index < leftParts.length; ++index) {
    if (leftParts[index] !== rightParts[index]) {
      return leftParts[index] - rightParts[index];
    }
  }
  return 0;
}

function currentOnly() {
  return {
    release: null,
    docsOptions: {
      includeCurrentVersion: true,
      lastVersion: 'current',
      onlyIncludeVersions: ['current'],
      versions: {current: {label: 'Latest'}},
    },
    navbarItems: [],
  };
}

function readVersions(siteDir) {
  const versionsPath = path.join(siteDir, 'versions.json');
  if (!fs.existsSync(versionsPath)) {
    return [];
  }
  const versions = JSON.parse(fs.readFileSync(versionsPath, 'utf8'));
  if (
    !Array.isArray(versions) ||
    versions.some(version => typeof version !== 'string') ||
    new Set(versions).size !== versions.length
  ) {
    throw new Error(`Invalid documentation versions file: ${versionsPath}`);
  }
  versions.forEach(parseVersion);
  for (let index = 1; index < versions.length; ++index) {
    if (compareVersions(versions[index - 1], versions[index]) <= 0) {
      throw new Error(`Documentation versions are not newest-first: ${versionsPath}`);
    }
  }
  return versions;
}

function readStableVersion() {
  const releasePath = path.join(__dirname, 'docs_release.json');
  const release = JSON.parse(fs.readFileSync(releasePath, 'utf8'));
  if (
    !release ||
    Array.isArray(release) ||
    typeof release !== 'object' ||
    Object.keys(release).length !== 1 ||
    !Object.prototype.hasOwnProperty.call(release, 'stable_version')
  ) {
    throw new Error(`Invalid documentation release file: ${releasePath}`);
  }
  const stableVersion = release.stable_version;
  if (stableVersion === null) {
    return null;
  }
  if (typeof stableVersion !== 'string') {
    throw new Error(`Invalid stable_version in ${releasePath}`);
  }
  parseVersion(stableVersion);
  return stableVersion;
}

function loadDocsReleaseConfig({siteDir}) {
  const stableVersion = readStableVersion();
  if (stableVersion === null) {
    return currentOnly();
  }
  const availableVersions = readVersions(siteDir);
  if (!availableVersions.includes(stableVersion)) {
    throw new Error(
      `Stable documentation version ${stableVersion} is missing from ${siteDir}`,
    );
  }

  const versions = {
    current: {
      label: 'Latest (main)',
      path: 'latest',
      banner: 'none',
      badge: false,
    },
  };
  for (const version of availableVersions) {
    const comparison = compareVersions(version, stableVersion);
    const suffix =
      comparison === 0
        ? 'stable'
        : comparison > 0
          ? 'release candidate'
          : 'previous';
    versions[version] = {
      label: `v${version} (${suffix})`,
      path: comparison === 0 ? '' : version,
      banner: 'none',
      badge: false,
    };
  }

  return {
    release: {stable_version: stableVersion},
    docsOptions: {
      includeCurrentVersion: true,
      lastVersion: stableVersion,
      versions,
    },
    navbarItems: [{type: 'docsVersionDropdown', position: 'left'}],
  };
}

module.exports = {loadDocsReleaseConfig};
