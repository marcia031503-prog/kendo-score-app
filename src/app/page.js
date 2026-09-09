'use client';

import React, { useState } from 'react';

export default function KendoScoreApp() {
  // 状態管理の例（実際のアプリに組み込まれているステートに合わせてご利用ください）
  const [matchData, setMatchData] = useState({
    redTeamName: '高川',
    whiteTeamName: '白チーム',
    // 各選手の勝敗・本数データ等...
  });

  // 仮の合計値算出ロジック（お手元の変数が `redTotalWins` / `redTotalIppon` の場合はそのまま反映されます）
  const redTotalWins = 0;
  const redTotalIppon = 0;
  const whiteTotalWins = 0;
  const whiteTotalIppon = 0;

  return (
    <main className="p-4 max-w-7xl mx-auto">
      <h1 className="text-xl font-bold mb-4">⚔️ 剣道試合スコア管理アプリ</h1>

      <div className="border rounded p-4 bg-white shadow-sm">
        {/* 赤チーム合計表示 */}
        <div className="flex justify-between items-center py-2 border-b font-bold">
          <span>🔴 赤: {matchData.redTeamName} 合計</span>
          <div className="text-lg">
            {redTotalIppon}本 / {redTotalWins}勝
          </div>
        </div>

        {/* 白チーム合計表示 */}
        <div className="flex justify-between items-center py-2 font-bold">
          <span>🔵 白: {matchData.whiteTeamName} 合計</span>
          <div className="text-lg">
            {whiteTotalIppon}本 / {whiteTotalWins}勝
          </div>
        </div>
      </div>
    </main>
  );
}