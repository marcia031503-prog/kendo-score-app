'use client';

import React, { useState, useEffect } from 'react';

const quickWazas = ['面', 'コテ', '胴', 'ツキ'];
const allWazas = [
  '飛び込み面', '引き面', '巻き込み面', '返し面',
  '飛び込みコテ', '引きコテ', '返しコテ',
  '飛び込み胴', '抜き胴', '巻き込み胴',
  'ツキ', '片手ツキ'
];

const presetPlayers = ['重村', '松田', '山内', '橋本', '安野', '山本'];

const positions = [
  { key: 'senpo', label: '先鋒' },
  { key: 'jiho', label: '次鋒' },
  { key: 'chuken', label: '中堅' },
  { key: 'fukusho', label: '副将' },
  { key: 'taisho', label: '大将' },
  { key: 'daicho', label: '代表戦' },
];

export default function KendoScoreApp() {
  const [activeTab, setActiveTab] = useState('team');
  const [redTeamName, setRedTeamName] = useState('赤チーム');
  const [whiteTeamName, setWhiteTeamName] = useState('白チーム');

  const [redPlayers, setRedPlayers] = useState({
    senpo: '重村', jiho: '松田', chuken: '山内', fukusho: '橋本', taisho: '安野', daicho: ''
  });
  const [whitePlayers, setWhitePlayers] = useState({
    senpo: '', jiho: '', chuken: '', fukusho: '', taisho: '', daicho: ''
  });

  const [matchLogs, setMatchLogs] = useState({
    senpo: [], jiho: [], chuken: [], fukusho: [], taisho: [], daicho: []
  });

  const handleAddWaza = (pos, team, waza) => {
    setMatchLogs(prev => ({
      ...prev,
      [pos]: [...(prev[pos] || []), { id: Math.random().toString(36), team, waza }]
    }));
  };

  const calculateScore = (team) => {
    let hon = 0;
    Object.values(matchLogs).forEach(logs => {
      logs.forEach(l => { if (l.team === team) hon++; });
    });
    let wins = 0;
    positions.forEach(p => {
      const redHon = (matchLogs[p.key] || []).filter(l => l.team === 'red').length;
      const whiteHon = (matchLogs[p.key] || []).filter(l => l.team === 'white').length;
      if (redHon > whiteHon && team === 'red') wins++;
      if (whiteHon > redHon && team === 'white') wins++;
    });
    return { wins, hon };
  };

  const redScore = calculateScore('red');
  const whiteScore = calculateScore('white');

  const handleCopyExcelTable = () => {
    const headers = ['項目/勝敗', ...positions.map(p => p.label), '合計'];
    const redRow = [`赤:${redTeamName}`, ...positions.map(p => redPlayers[p.key]), `${redScore.wins}勝/${redScore.hon}本`];
    const whiteRow = [`白:${whiteTeamName}`, ...positions.map(p => whitePlayers[p.key]), `${whiteScore.wins}勝/${whiteScore.hon}本`];
    navigator.clipboard.writeText([headers.join('\t'), redRow.join('\t'), whiteRow.join('\t')].join('\n'));
    alert('Excel貼付用の一覧表をコピーしました！');
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen text-xs">
      <div className="mb-4 bg-gray-900 text-white p-3 rounded-lg flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="font-bold text-sm">剣道試合スコア管理アプリ</span>
          <button
            onClick={handleCopyExcelTable}
            className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold"
          >
            Excel用コピー
          </button>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setActiveTab('team')} className={`px-3 py-1.5 rounded font-bold ${activeTab === 'team' ? 'bg-red-600 text-white' : 'bg-gray-800 text-gray-300'}`}>団体戦</button>
          <button onClick={() => setActiveTab('timer')} className={`px-3 py-1.5 rounded font-bold ${activeTab === 'timer' ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-300'}`}>独立タイマー</button>
        </div>
      </div>

      <div className="overflow-x-auto bg-white border border-gray-300 rounded-xl shadow-sm">
        <table className="w-full border-collapse text-left min-w-[1200px]">
          <thead>
            <tr className="border-b bg-gray-100 text-gray-700">
              <th className="p-2 border-r font-bold w-40">チーム / 項目</th>
              {positions.map(p => (
                <th key={p.key} className="p-2 border-r font-bold text-center w-36">{p.label}</th>
              ))}
              <th className="p-2 font-bold text-center w-28 bg-gray-200">合計</th>
            </tr>
          </thead>
          <tbody>
            {/* 赤チーム選手選択行 */}
            <tr className="border-b bg-red-50/20">
              <td className="p-2 border-r font-bold text-red-600 align-middle">
                <input
                  type="text"
                  value={redTeamName}
                  onChange={e => setRedTeamName(e.target.value)}
                  className="w-full border border-red-300 rounded px-1.5 py-1 font-bold bg-white text-red-700"
                />
              </td>
              {positions.map(p => (
                <td key={p.key} className="p-2 border-r align-middle">
                  {p.key === 'daicho' ? (
                    <input
                      type="text"
                      value={redPlayers[p.key]}
                      onChange={e => setRedPlayers({...redPlayers, [p.key]: e.target.value})}
                      placeholder="赤代表者名"
                      className="w-full border border-gray-300 rounded px-1.5 py-1 font-bold bg-white"
                    />
                  ) : (
                    <select
                      value={redPlayers[p.key]}
                      onChange={e => setRedPlayers({...redPlayers, [p.key]: e.target.value})}
                      className="w-full border border-gray-300 rounded px-1.5 py-1 font-bold bg-white"
                    >
                      <option value="">(未選択)</option>
                      {presetPlayers.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  )}
                </td>
              ))}
              <td className="p-2 text-center font-bold text-red-600 bg-red-50/45">
                {redScore.wins}勝 / {redScore.hon}本
              </td>
            </tr>

            {/* 各ポジションのタイマー＆技記録カラム行 */}
            <tr className="border-b">
              <td className="p-2 border-r text-center font-bold text-gray-500 bg-gray-50 align-middle">
                タイマー &amp; 技
              </td>
              {positions.map(p => (
                <td key={p.key} className="p-2 border-r align-top">
                  <CompactMatchColumn logs={matchLogs[p.key] || []} onAddWaza={(team, w) => handleAddWaza(p.key, team, w)} />
                </td>
              ))}
              <td className="p-2 text-center text-gray-400 bg-gray-50/50 align-middle">
                各試合の経過
              </td>
            </tr>

            {/* 白チーム選手入力行 */}
            <tr className="bg-indigo-50/20">
              <td className="p-2 border-r font-bold text-indigo-600 align-middle">
                <input
                  type="text"
                  value={whiteTeamName}
                  onChange={e => setWhiteTeamName(e.target.value)}
                  className="w-full border border-indigo-300 rounded px-1.5 py-1 font-bold bg-white text-indigo-700"
                />
              </td>
              {positions.map(p => (
                <td key={p.key} className="p-2 border-r align-middle">
                  <input
                    type="text"
                    value={whitePlayers[p.key]}
                    onChange={e => setWhitePlayers({...whitePlayers, [p.key]: e.target.value})}
                    placeholder={p.key === 'daicho' ? '白代表者名' : '白選手名'}
                    className="w-full border border-gray-300 rounded px-1.5 py-1 font-bold bg-white"
                  />
                </td>
              ))}
              <td className="p-2 text-center font-bold text-indigo-600 bg-indigo-50/45">
                {whiteScore.wins}勝 / {whiteScore.hon}本
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CompactMatchColumn({ logs, onAddWaza }) {
  const [seconds, setSeconds] = useState(180);
  const [isRunning, setIsRunning] = useState(false);
  const [redSelected, setRedSelected] = useState(allWazas[0]);
  const [whiteSelected, setWhiteSelected] = useState(allWazas[0]);

  useEffect(() => {
    let t;
    if (isRunning && seconds > 0) {
      t = setInterval(() => setSeconds(s => s - 1), 1000);
    }
    return () => clearInterval(t);
  }, [isRunning, seconds]);

  const formatTime = (sec) => `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, '0')}`;

  return (
    <div className="flex flex-col gap-1.5 p-1.5 bg-white border border-gray-200 rounded-xl text-xs w-full">
      <div className="flex items-center justify-between bg-gray-50 p-1.5 rounded-lg border border-gray-100">
        <span className="font-bold text-sm text-gray-800">{formatTime(seconds)}</span>
        <div className="flex gap-1">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-2 py-0.5 rounded text-[10px] font-bold text-white ${isRunning ? 'bg-amber-500' : 'bg-emerald-600'}`}
          >
            {isRunning ? '一時' : 'スタ'}
          </button>
          <button
            onClick={() => { setIsRunning(false); setSeconds(180); }}
            className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-gray-200 text-gray-700"
          >
            リセ
          </button>
        </div>
      </div>

      {/* 赤チーム記録 */}
      <div className="bg-red-50/70 border border-red-200 rounded-lg p-1.5 space-y-1">
        <div className="text-[10px] font-bold text-red-700 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-red-600 inline-block"></span>赤チーム記録
        </div>
        <div className="grid grid-cols-4 gap-1">
          {quickWazas.map(w => (
            <button key={w} onClick={() => onAddWaza('red', w)} className="bg-red-600 hover:bg-red-700 text-white text-[10px] py-1 rounded font-bold">{w}</button>
          ))}
        </div>
        <div className="flex flex-col gap-1 pt-1 border-t border-red-200">
          <select value={redSelected} onChange={e => setRedSelected(e.target.value)} className="w-full border border-red-300 rounded px-1.5 py-1 text-[11px] font-bold bg-white text-red-800">
            {allWazas.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
          <button onClick={() => onAddWaza('red', redSelected)} className="w-full bg-red-700 hover:bg-red-800 text-white text-[10px] py-1 rounded font-bold">
            + 詳細技を記録
          </button>
        </div>
      </div>

      {/* 白チーム記録 */}
      <div className="bg-indigo-50/70 border border-indigo-200 rounded-lg p-1.5 space-y-1">
        <div className="text-[10px] font-bold text-indigo-700 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block"></span>白チーム記録
        </div>
        <div className="grid grid-cols-4 gap-1">
          {quickWazas.map(w => (
            <button key={w} onClick={() => onAddWaza('white', w)} className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] py-1 rounded font-bold">{w}</button>
          ))}
        </div>
        <div className="flex flex-col gap-1 pt-1 border-t border-indigo-200">
          <select value={whiteSelected} onChange={e => setWhiteSelected(e.target.value)} className="w-full border border-indigo-300 rounded px-1.5 py-1 text-[11px] font-bold bg-white text-indigo-800">
            {allWazas.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
          <button onClick={() => onAddWaza('white', whiteSelected)} className="w-full bg-indigo-700 hover:bg-indigo-800 text-white text-[10px] py-1 rounded font-bold">
            + 詳細技を記録
          </button>
        </div>
      </div>

      {/* 一本履歴 */}
      <div className="pt-1 border-t border-gray-100 text-[10px] text-gray-500">
        <div className="font-bold mb-0.5 text-gray-600">この試合の一本履歴:</div>
        {logs.length === 0 ? (
          <div>まだ記録はありません</div>
        ) : (
          <div className="space-y-0.5 max-h-16 overflow-y-auto">
            {logs.map(l => (
              <div
                key={l.id}
                className={l.team === 'red' ? 'text-red-600 font-semibold' : 'text-indigo-600 font-semibold'}
              >
                [{l.team === 'red' ? '赤' : '白'}] {l.waza}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}