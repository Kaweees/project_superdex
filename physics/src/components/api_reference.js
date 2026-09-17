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

import React, { useEffect, useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import useBaseUrl from '@docusaurus/useBaseUrl';
import APIFrame from '@site/src/components/api_frame';

function ApiReferenceStatus({ children }) {
  return (
    <div className="api-reference-status" role="status">
      {children}
    </div>
  );
}

function ApiReferenceFrame({ apiVersion, language, title }) {
  return (
    <APIFrame
      src={`/generated/api/${apiVersion}/${language}/index.html`}
      title={title}
    />
  );
}

// Resolves the mutable API artifact only for current documentation. Numbered
// documentation snapshots pass a concrete artifact and never consult this manifest.
function LatestApiReference({ language, title }) {
  const manifestUrl = useBaseUrl('/generated/api/versions.json');
  const [apiVersion, setApiVersion] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(manifestUrl)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled) {
          return;
        }
        if (
          data &&
          Array.isArray(data.versions) &&
          data.versions.includes(data.latest)
        ) {
          setApiVersion(data.latest);
        }
        setLoaded(true);
      })
      .catch((err) => {
        // Logged so a malformed manifest is diagnosable (a dev-server SPA can
        // return 200 with index.html, making res.json() reject).
        if (!cancelled) {
          console.error(
            `Failed to load API version manifest from ${manifestUrl}:`,
            err,
          );
          setLoaded(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [manifestUrl]);

  if (!loaded) {
    return <ApiReferenceStatus>Loading API reference...</ApiReferenceStatus>;
  }

  if (!apiVersion) {
    return (
      <ApiReferenceStatus>
        API reference is unavailable for this version.
      </ApiReferenceStatus>
    );
  }

  return (
    <ApiReferenceFrame
      apiVersion={apiVersion}
      language={language}
      title={title}
    />
  );
}

function ApiReferenceInner({ apiVersion, language, title }) {
  if (apiVersion === 'latest') {
    return <LatestApiReference language={language} title={title} />;
  }
  if (!apiVersion) {
    return (
      <ApiReferenceStatus>
        API reference is unavailable for this version.
      </ApiReferenceStatus>
    );
  }
  return (
    <ApiReferenceFrame
      apiVersion={apiVersion}
      language={language}
      title={title}
    />
  );
}

export default function ApiReference({ apiVersion, language, title }) {
  const noticeTitleId = 'experimental-api-notice-title-' + language;
  return (
    <>
      <div
        className="alert alert--info"
        role="note"
        aria-labelledby={noticeTitleId}
      >
        <strong id={noticeTitleId}>Experimental APIs</strong>
        <div>
          Experimental APIs may be omitted from this reference. Those that are
          included may change or be removed without notice.
        </div>
      </div>
      <BrowserOnly
        fallback={
          <ApiReferenceStatus>Loading API reference...</ApiReferenceStatus>
        }
      >
        {() => (
          <ApiReferenceInner
            apiVersion={apiVersion}
            language={language}
            title={title}
          />
        )}
      </BrowserOnly>
    </>
  );
}
