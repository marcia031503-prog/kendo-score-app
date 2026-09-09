'use client';

import React, { useState, useEffect } from 'react';

// 技選択をプルダウンに一本化したタイマー・スコアコンポーネント
function MatchTimerAndScorer({ title, history, onAddWaza, onRemoveWaza }) {
  const [timeLeft, setTimeLeft] = useState(180);
  const [isRunning, setIsRunning] = useState(false);
  
  // すべての技をまとめたリスト
  const allWazas = [
    '面', 'コテ', '胴', 'ツキ',
    '飛び込み面', '引き面', '小手面', '相面', '返し面', '相小手面',
    '飛び込みコテ', '引きコテ', '出小手',
    '返し胴', '抜き胴', '引きツキ'
  ];

  const [redSelectedWaza, setRedSelectedWaza] = useState(allWazas[0]);
  const [whiteSelectedWaza, setWhiteSelectedWaza] = useState(allWazas[0]);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="bg-slate-50 border border-slate-300 rounded-lg p-2.5 space-y-2.5">
      {/* タイマー表示 & 操作 */}
      <div className="flex items-center justify-between bg-white p-1.5 rounded border border-slate-200">
        <div className="text-base font-black text-slate-900 tracking-wider">
          {formatTime(timeLeft)}
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-2 py-1 rounded text-[10px] font-bold text-white ${isRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
          >
            {isRunning ? '一時停止' : 'スタート'}
          </button>
          <button
            onClick={() => { setIsRunning(false); setTimeLeft(180); }}
            className="px-1.5 py-1 rounded text-[10px] font-bold bg-slate-200 hover:bg-slate-300 text-slate-700"
          >
            リセット
          </button>
        </div>
      </div>

      {/* ================= 上側：赤チーム側スコアエリア ================= */}
      <div className="bg-red-50/70 border border-red-200 rounded-lg p-2 space-y-1.5">
        <div className="text-[10px] font-bold text-red-700">🔴 赤チーム記録</div>
        <div className="flex flex-col gap-1.5">
          <select
            value={redSelectedWaza}
            onChange={(e) => setRedSelectedWaza(e.target.value)}
            className="w-full border border-red-300 rounded px-1.5 py-1 text-[11px] font-bold bg-white text-red-800 focus:outline-none"
          >
            {allWazas.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
          <button
            onClick={() => onAddWaza('red', redSelectedWaza)}
            className="w-full bg-red-600 hover:bg-red-700 text-white text-[10px] py-1 rounded font-bold shadow transition text-center"
          >
            + 記録
          </button>
        </div>
      </div>

      {/* ================= 下側：白チーム側スコアエリア ================= */}
      <div className="bg-indigo-50/70 border border-indigo-200 rounded-lg p-2 space-y-1.5">
        <div className="text-[10px] font-bold text-indigo-700">🔵 白チーム記録</div>
        <div className="flex flex-col gap-1.5">
          <select
            value={whiteSelectedWaza}
            onChange={(e) => setWhiteSelectedWaza(e.target.value)}
            className="w-full border border-indigo-300 rounded px-1.5 py-1 text-[11px] font-bold bg-white text-indigo-800 focus:outline-none"
          >
            {allWazas.map((w) => (
              <option key={w} value={w}>{w}</option>
            ))}
          </select>
          <button
            onClick={() => onAddWaza('white', whiteSelectedWaza)}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] py-1 rounded font-bold shadow transition text-center"
          >
            + 記録
          </button>
        </div>
      </div>

      {/* 記録された履歴表示 */}
      <div className="space-y-1 pt-1 border-t border-slate-200">
        <div className="text-[10px] font-bold text-slate-500">この試合の一本履歴:</div>
        <div className="flex flex-wrap gap-1 min-h-[22px] items-center">
          {history.length === 0 ? (
            <span className="text-[10px] text-slate-400">まだ記録はありません</span>
          ) : (
            history.map((h, i) => (
              <span
                key={i}
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded text-white ${h.side === 'red' ? 'bg-red-600' : 'bg-indigo-600'}`}
              >
                {i + 1}本: {h.waza}
              </span>
            ))
          )}
        </div>
        {history.length > 0 && (
          <button
            onClick={onRemoveWaza}
            className="text-[10px] text-slate-500 hover:text-red-600 underline pt-0.5 block"
          >
            直前の技記録を取り消す
          </button>
        )}
      </div>
    </div>
  );
}

export default function KendoApp() {
  const [mode, setMode] = useState('team'); // 'team', 'individual', 'timer', 'archive'
  const [tournamentName, setTournamentName] = useState('');
  const [matchDate, setMatchDate] = useState('');
  
  const playerOptions = ['重村', '山本', '山内', '橋本', '安野', '松田', '佐藤', '鈴木', '高橋', '田中'];

  // 団体戦用ステート
  const [teamRed, setTeamRed] = useState('高川');
  const [teamWhite, setTeamWhite] = useState('');
  const [positions] = useState(['先鋒', '次鋒', '中堅', '副将', '大将']);
  
  const [redPlayers, setRedPlayers] = useState(['重村', '松田', '山内', '橋本', '安野']);
  const [whitePlayers, setWhitePlayers] = useState(['', '', '', '', '']);

  const [teamMatches, setTeamMatches] = useState(
    Array(5).fill(null).map(() => ({ history: [] }))
  );

  // 個人戦用ステート
  const [indPlayerRed] = useState('安野');
  const [indPlayerWhite, setIndPlayerWhite] = useState('');
  const [indHistory, setIndHistory] = useState([]);

  // メインの全体タイマー用ステート
  const [mainTimeLeft, setMainTimeLeft] = useState(180); 
  const [mainIsRunning, setMainIsRunning] = useState(false);

  // 連続試合のストックリスト
  const [matchArchive, setMatchArchive] = useState([]);

  useEffect(() => {
    let interval = null;
    if (mainIsRunning && mainTimeLeft > 0) {
      interval = setInterval(() => {
        setMainTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (mainTimeLeft === 0) {
      setMainIsRunning(false);
    }
    return () => clearInterval(interval);
  }, [mainIsRunning, mainTimeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const getMatchResult = (history) => {
    let redCount = 0;
    let whiteCount = 0;
    history.forEach((h) => {
      if (h.side === 'red') redCount++;
      if (h.side === 'white') whiteCount++;
    });

    if (redCount >= 2 || (redCount > whiteCount && (redCount + whiteCount >= 2))) return 'red';
    if (whiteCount >= 2 || (whiteCount > redCount && (redCount + whiteCount >= 2))) return 'white';
    if (redCount === 1 && whiteCount === 1) return 'draw';
    return 'none';
  };

  const calculateTeamSummary = () => {
    let redWins = 0, whiteWins = 0, redIppons = 0, whiteIppons = 0;
    teamMatches.forEach((m) => {
      m.history.forEach((h) => {
        if (h.side === 'red') redIppons++;
        if (h.side === 'white') whiteIppons++;
      });
      const res = getMatchResult(m.history);
      if (res === 'red') redWins++;
      else if (res === 'white') whiteWins++;
    });
    return { redWins, whiteWins, redIppons, whiteIppons };
  };

  const teamSummary = calculateTeamSummary();

  const handleSaveTeamMatch = () => {
    const summary = calculateTeamSummary();
    const matchData = {
      id: Date.now(),
      type: '団体戦',
      tournament: tournamentName || '未入力大会',
      date: matchDate || '未入力日付',
      matchName: `${teamRed} vs ${teamWhite || '白チーム'}`,
      scoreSummary: `${summary.redWins}勝(${summary.redIppons}本) ー ${summary.whiteWins}勝(${summary.whiteIppons}本)`,
      details: positions.map((pos, idx) => {
        const m = teamMatches[idx];
        const rP = redPlayers[idx];
        const wP = whitePlayers[idx] || '白選手';
        const hStr = m.history.map((h, i) => `${i+1}本:${h.side === 'red' ? rP : wP}(${h.waza})`).join(', ');
        const res = getMatchResult(m.history);
        let resText = '引き分け';
        if (res === 'red') resText = `${teamRed}勝ち`;
        if (res === 'white') resText = `${teamWhite || '白'}勝ち`;
        return `${pos}: ${rP} vs ${wP} [${hStr || '技なし'}] → ${resText}`;
      }).join(' / ')
    };

    setMatchArchive([...matchArchive, matchData]);
    alert('団体戦の試合結果をストックしました！');
  };

  const handleSaveIndMatch = () => {
    const rCount = indHistory.filter(h => h.side === 'red').length;
    const wCount = indHistory.filter(h => h.side === 'white').length;
    let resText = '引き分け/未決';
    if (rCount >= 2 || (rCount > wCount && rCount + wCount >= 2)) resText = `${indPlayerRed}の勝ち`;
    else if (wCount >= 2 || (wCount > rCount && rCount + wCount >= 2)) resText = `${indPlayerWhite || '白'}の勝ち`;

    const hStr = indHistory.map((h, i) => `${i+1}本:${h.side === 'red' ? indPlayerRed : (indPlayerWhite || '白')}(${h.waza})`).join(', ');

    const matchData = {
      id: Date.now(),
      type: '個人戦',
      tournament: tournamentName || '未入力大会',
      date: matchDate || '未入力日付',
      matchName: `${indPlayerRed} vs ${indPlayerWhite || '白選手'}`,
      scoreSummary: `赤(${rCount}本) ー 白(${wCount}本)`,
      details: `履歴: ${hStr || '技なし'} → ${resText}`
    };

    setMatchArchive([...matchArchive, matchData]);
    alert('個人戦の試合結果をストックしました！');
  };

  const handleCopyArchiveForExcel = () => {
    if (matchArchive.length === 0) {
      alert('ストックされた試合履歴がありません。');
      return;
    }

    let text = `大会名: ${tournamentName || '未入力'}\t日付: ${matchDate || '未入力'}\n\n`;
    text += `試合種別\t対戦カード\tスコア結果\t詳細内容（選手・技・勝敗）\n`;
    
    matchArchive.forEach((item) => {
      text += `${item.type}\t${item.matchName}\t${item.scoreSummary}\t${item.details}\n`;
    });

    navigator.clipboard.writeText(text).then(() => {
      alert('全試合データをExcel用の一覧表として一括コピーしました！Excelに貼り付けてください。');
    });
  };

  return (
    <main className="min-h-screen bg-slate-100 text-slate-800 pb-12 font-sans">
      <header className="bg-slate-900 text-white shadow p-4 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-lg font-bold flex items-center gap-2">
            ⚔️ 剣道試合スコア管理アプリ
          </h1>
          <div className="flex bg-slate-800 p-1 rounded-lg gap-1 flex-wrap justify-center">
            <button
              onClick={() => setMode('team')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${mode === 'team' ? 'bg-red-600 text-white' : 'text-slate-300 hover:text-white'}`}
            >
              📋 団体戦
            </button>
            <button
              onClick={() => setMode('individual')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${mode === 'individual' ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:text-white'}`}
            >
              👤 個人戦
            </button>
            <button
              onClick={() => setMode('archive')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition relative ${mode === 'archive' ? 'bg-emerald-600 text-white' : 'text-slate-300 hover:text-white'}`}
            >
              📂 試合履歴 ({matchArchive.length})
            </button>
            <button
              onClick={() => setMode('timer')}
              className={`px-3 py-1.5 rounded-md text-xs font-bold transition ${mode === 'timer' ? 'bg-amber-600 text-white' : 'text-slate-300 hover:text-white'}`}
            >
              ⏱️ 独立タイマー
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-4 space-y-6">
        <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-300 grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-0.5">大会名</label>
            <input
              type="text"
              value={tournamentName}
              onChange={(e) => setTournamentName(e.target.value)}
              placeholder="例: 中国大会"
              className="w-full border border-slate-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-500 mb-0.5">日付</label>
            <input
              type="text"
              value={matchDate}
              onChange={(e) => setMatchDate(e.target.value)}
              placeholder="例: 2026年8月4日"
              className="w-full border border-slate-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>
        </div>

        {mode === 'team' && (
          <div className="space-y-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-300 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded border border-red-200">赤チーム</span>
                  <input
                    type="text"
                    value={teamRed}
                    onChange={(e) => setTeamRed(e.target.value)}
                    className="border border-slate-300 rounded px-2 py-1 text-xs font-bold w-28 bg-red-50/30"
                  />
                </div>
                <span className="text-xs font-bold text-slate-400">VS</span>
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-200">白チーム</span>
                  <input
                    type="text"
                    value={teamWhite}
                    onChange={(e) => setTeamWhite(e.target.value)}
                    placeholder="例: 八幡"
                    className="border border-indigo-300 rounded px-2 py-1 text-xs font-bold w-28 bg-indigo-50/30 text-indigo-800"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end flex-wrap">
                <div className="text-xs font-bold bg-slate-900 text-white px-3 py-1.5 rounded">
                  総成績: <span className="text-red-400">{teamSummary.redWins}勝({teamSummary.redIppons}本)</span> ー <span className="text-indigo-400">{teamSummary.whiteWins}勝({teamSummary.whiteIppons}本)</span>
                </div>
                <button
                  onClick={handleSaveTeamMatch}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-xs font-bold shadow transition shrink-0"
                >
                  📥 この試合結果をストック
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border-2 border-slate-800 overflow-x-auto">
              <table className="w-full border-collapse text-center text-xs min-w-[950px]">
                <thead>
                  <tr className="bg-slate-200 border-b-2 border-slate-800">
                    <th className="border-r border-slate-400 p-2 font-bold text-slate-700 w-28">項目</th>
                    {positions.map((pos) => (
                      <th key={pos} className="border-r border-slate-400 p-2 font-bold text-slate-700">{pos}</th>
                    ))}
                    <th className="p-2 font-bold text-slate-700 w-24">合計</th>
                  </tr>
                </thead>
                <tbody>
                  {/* 赤チーム選手選択行 */}
                  <tr className="border-b border-slate-400 bg-red-50/20">
                    <td className="border-r border-slate-400 p-2 font-bold text-red-700 bg-red-50/50">
                      🔴 赤: {teamRed}
                    </td>
                    {positions.map((pos, idx) => (
                      <td key={pos} className="border-r border-slate-400 p-2">
                        <select
                          value={redPlayers[idx]}
                          onChange={(e) => {
                            const newP = [...redPlayers];
                            newP[idx] = e.target.value;
                            setRedPlayers(newP);
                          }}
                          className="w-full border border-red-300 rounded p-1 text-xs font-bold text-center bg-white text-red-800"
                        >
                          {playerOptions.map((p) => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      </td>
                    ))}
                    <td className="p-2 font-bold text-red-700">
                      {teamTotalIppon}本 / {teamTotalWins}勝
                    </td>
                  </tr>

                  {/* 試合タイマー＆ボタン＆技記録 */}
                  <tr className="border-b border-slate-400 bg-white">
                    <td className="border-r border-slate-400 p-2 font-bold text-slate-600 bg-slate-100">
                      タイマー & 技記録
                    </td>
                    {positions.map((pos, idx) => {
                      const match = teamMatches[idx];
                      return (
                        <td key={pos} className="border-r border-slate-400 p-2 align-top">
                          <MatchTimerAndScorer
                            title={pos}
                            history={match.history}
                            onAddWaza={(side, waza) => {
                              const newM = [...teamMatches];
                              newM[idx].history.push({ side, waza });
                              setTeamMatches(newM);
                            }}
                            onRemoveWaza={() => {
                              const newM = [...teamMatches];
                              newM[idx].history.pop();
                              setTeamMatches(newM);
                            }}
                          />
                        </td>
                      );
                    })}
                    <td className="p-2 text-[11px] text-slate-500">
                      各試合の勝敗
                    </td>
                  </tr>

                  {/* 白チーム選手選択行 */}
                  <tr className="bg-indigo-50/20">
                    <td className="border-r border-slate-400 p-2 font-bold text-indigo-700 bg-indigo-50/50">
                      🔵 白: {teamWhite || '白チーム'}
                    </td>
                    {positions.map((pos, idx) => (
                      <td key={pos} className="border-r border-slate-400 p-2">
                        <input
                          type="text"
                          value={whitePlayers[idx]}
                          onChange={(e) => {
                            const newP = [...whitePlayers];
                            newP[idx] = e.target.value;
                            setWhitePlayers(newP);
                          }}
                          placeholder={`${pos}選手名`}
                          className="w-full border border-indigo-300 rounded p-1 text-xs font-bold text-center bg-white text-indigo-800"
                        />
                      </td>
                    ))}
                    <td className="p-2 font-bold text-indigo-700">
                      {teamSummary.whiteWins}勝 / {teamSummary.whiteIppons}本
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {mode === 'individual' && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-300 space-y-6 max-w-xl mx-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-slate-700">👤 個人戦スコア・タイマー管理</h2>
              <button
                onClick={handleSaveIndMatch}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-xs font-bold shadow transition"
              >
                📥 この個人戦結果をストック
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-red-50 p-3 rounded-lg border border-red-200 space-y-2">
                <label className="block text-xs font-bold text-red-600">赤選手</label>
                <div className="w-full border border-red-300 rounded px-2 py-1.5 text-xs bg-white font-bold text-red-700">
                  {indPlayerRed}
                </div>
              </div>

              <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200 space-y-2">
                <label className="block text-xs font-bold text-indigo-600">白選手名（手入力）</label>
                <input
                  type="text"
                  value={indPlayerWhite}
                  onChange={(e) => setIndPlayerWhite(e.target.value)}
                  placeholder="選手名"
                  className="w-full border border-slate-300 rounded px-2 py-1.5 text-xs bg-white font-bold text-indigo-700"
                />
              </div>
            </div>

            <MatchTimerAndScorer
              title="個人戦 試合管理"
              history={indHistory}
              onAddWaza={(side, waza) => {
                setIndHistory([...indHistory, { side, waza }]);
              }}
              onRemoveWaza={() => {
                setIndHistory(indHistory.slice(0, -1));
              }}
            />
          </div>
        )}

        {mode === 'archive' && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-300 space-y-6 max-w-3xl mx-auto">
            <div className="flex justify-between items-center">
              <h2 className="text-base font-bold text-slate-700">📂 ストックされた試合履歴 ({matchArchive.length}件)</h2>
              {matchArchive.length > 0 && (
                <div className="flex gap-2">
                  <button
                    onClick={handleCopyArchiveForExcel}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded text-xs font-bold shadow transition"
                  >
                    📋 全履歴をExcel用一括コピー
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('蓄積された履歴をすべてクリアしますか？')) setMatchArchive([]);
                    }}
                    className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-3 py-2 rounded text-xs font-bold transition"
                  >
                    全クリア
                  </button>
                </div>
              )}
            </div>

            {matchArchive.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs border border-dashed border-slate-300 rounded-lg">
                まだストックされた試合はありません。
              </div>
            ) : (
              <div className="space-y-3">
                {matchArchive.map((item, index) => (
                  <div key={item.id} className="border border-slate-200 rounded-lg p-3 bg-slate-50 space-y-1 relative">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-800 text-white">
                        第 {index + 1} 試合 ({item.type})
                      </span>
                      <button
                        onClick={() => {
                          setMatchArchive(matchArchive.filter(m => m.id !== item.id));
                        }}
                        className="text-[10px] text-red-600 hover:underline font-bold"
                      >
                        削除
                      </button>
                    </div>
                    <div className="text-xs font-bold text-slate-900 pt-1">
                      対戦: {item.matchName}
                    </div>
                    <div className="text-xs text-red-600 font-bold">
                      成績: {item.scoreSummary}
                    </div>
                    <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-200">
                      {item.details}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {mode === 'timer' && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-slate-300 text-center space-y-6 max-w-md mx-auto">
            <h2 className="text-base font-bold text-slate-700">⏱️ 独立試合タイマー</h2>
            <div className="text-6xl font-black text-slate-900 tracking-wider bg-slate-100 py-6 rounded-lg border border-slate-300">
              {formatTime(mainTimeLeft)}
            </div>
            
            <div className="flex justify-center gap-3">
              <button
                onClick={() => {
                  setMainIsRunning(false);
                  setMainTimeLeft(180);
                }}
                className={`px-4 py-2 rounded font-bold text-xs transition ${mainTimeLeft === 180 ? 'bg-slate-900 text-white shadow' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
              >
                3分 (中学生)
              </button>
              <button
                onClick={() => {
                  setMainIsRunning(false);
                  setMainTimeLeft(240);
                }}
                className={`px-4 py-2 rounded font-bold text-xs transition ${mainTimeLeft === 240 ? 'bg-slate-900 text-white shadow' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'}`}
              >
                4分
              </button>
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setMainIsRunning(!mainIsRunning)}
                className={`px-6 py-2.5 rounded-lg font-bold text-white text-xs shadow transition ${mainIsRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'}`}
              >
                {mainIsRunning ? '一時停止' : 'スタート'}
              </button>
              <button
                onClick={() => {
                  setMainIsRunning(false);
                  setMainTimeLeft(180);
                }}
                className="px-6 py-2.5 rounded-lg font-bold bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs transition"
              >
                リセット
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}