// npm install @ruffle-rs/ruffle

import React, { useEffect, useState } from 'react';
import '@ruffle-rs/ruffle';

const RevaGame: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadRuffle = () => {
    setLoading(true);
    // setError(null);
  
    if (!window.RufflePlayer) {
      const errorMsg = 'RufflePlayer is not available on window';
      console.error(errorMsg);
      // setError(errorMsg);
      setLoading(false);
      return;
    }
  
    const ruffle = window.RufflePlayer.newest();
    const player = ruffle.createPlayer();
    player.config = {
      autoplay: "auto",
      // and so on...
    };
    const container = document.querySelector("#ruffle-container");
  
    if (container) {
      container.replaceWith(player);
      player.load("/revaGame.swf").then(() => {
        setLoading(false);
      }).catch((loadError: Error) => {
        const errorMsg = 'Failed to load the SWF file';
        console.error(errorMsg, loadError);
        // setError(`${errorMsg}: ${loadError.message}`);
        setLoading(false);
      });
    } else {
      const errorMsg = 'Container is null';
      console.error(errorMsg);
      // setError(errorMsg);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Ruffle 설정 초기화
    window.RufflePlayer = window.RufflePlayer || {};
    window.RufflePlayer.config = {
      "publicPath": "/public", // WASM 파일의 경로 설정
      "polyfills": true,
      "allowScriptAccess": true, // 스크립트 접근 허용
      "autoplay": "auto",
      "unmuteOverlay": "visible",
      "backgroundColor": null,
      "wmode": "window",
      "letterbox": "fullscreen",
      "warnOnUnsupportedContent": true,
      "contextMenu": "on",
      "showSwfDownload": false,
      "upgradeToHttps": window.location.protocol === "https:",
      "maxExecutionDuration": 15,
      "logLevel": "error",
      "base": null,
      "menu": true,
      "salign": "",
      "forceAlign": false,
      "scale": "showAll",
      "forceScale": false,
      "frameRate": null,
      "quality": "high",
      "splashScreen": true,
      "preferredRenderer": null,
      "openUrlMode": "allow",
      "allowNetworking": "all",
      "favorFlash": true,
      "socketProxy": [],
      "fontSources": [],
      "defaultFonts": {},
      "credentialAllowList": [],
      "playerRuntime": "flashPlayer",
      "allowFullscreen": false
    };

    const interval = setInterval(() => {
      const container = document.querySelector("#ruffle-container");
      if (container) {
        clearInterval(interval);
        loadRuffle();
      } else {
        console.log("Waiting for the container to be available...");
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex bg-white h-screen items-center justify-center" style={{ textAlign: 'center', padding: '20px' }}>
      <div id="ruffle-container">
        <embed src="/revaGame.swf" width="800" height="600" />
      </div>
      {loading && !error ? (
        <div style={{ color: 'blue', fontSize: '18px', fontWeight: 'bold' }}>
          현재 게임이 로딩 중입니다. 잠시만 기다려주세요.
        </div>
      ) : error ? (
        <div style={{ color: 'red', fontWeight: 'bold' }}>
          <p>죄송합니다. 에러가 발생한 것 같습니다. ㅠ</p>
          <p>새로고침을 해주세요!</p>
          <button
            onClick={loadRuffle}
            style={{
              padding: '10px 20px',
              fontSize: '18px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            새로고침
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default RevaGame;