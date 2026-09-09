'use client';

import React, { useState } from 'react';

export default function KendoScoreApp() {
  // サンプルとして基本的な状態の枠組みを網羅したコードです
  // 現在お手元のコード構成に合わせて、以下の合計表示部分（`totalIppon` と `totalWins`）の順序を書き換えています。

  const [redWins, setRedWins] = useState(0);
  const [redIppon, setRedIppon] = useState(0);
  const [whiteWins, setWhiteWins] = useState(0);
  const [whiteIppon, setWhiteIppon] = useState(0);

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-xl font-bold mb-4">⚔️ 剣道試合スコア管理アプリ</h1>

      {/* 団体戦テーブルなどの表示部分 */}
      <div className="border rounded p-4 mb-4">
        <div className="flex justify-between items-center mb-2 font-bold">
          <span>赤チーム合計</span>
          {/* 修正箇所：取得本数 / 勝ち数の順に変更 */}
          <div className="text-lg">
            {redIppon}本 / {redWins}勝
          </div>
        </div>

        <div className="flex justify-between items-center font-bold">
          <span>白チーム合計</span>
          {/* 修正箇所：取得本数 / 勝ち数の順に変更 */}
          <div className="text-lg">
            {whiteIppon}本 / {whiteWins}勝
          </div>
        </div>
      </div>
    </div>
  );
}