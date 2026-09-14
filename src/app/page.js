'use client';

import React, { useState } from 'react';

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
  const [redTeamName, setRedTeamName] = useState('高川');
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

  const getHonCount = (team) => {
    let count = 0;
    Object.values(matchLogs).forEach(logs => {
      logs.forEach(l => { if (l.team === team) count++; });
    });
    return count;
  };

  const handleCopyExcelTable = () => {
    const headers = ['項目/勝敗', ...positions.map(p => p.label)];
    const redRow = [`赤:${redTeamName} (${getHonCount('red')}本)`, ...positions.map(p => redPlayers[p.key])];
    const whiteRow = [`白:${whiteTeamName} (${getHonCount('white')}本)`, ...positions.map(p => whitePlayers[p.key])];
    navigator.clipboard.writeText([headers.join('\t'), redRow.join('\t'), whiteRow.join('\t')].join('\n'));
    alert('Excel貼付用の一覧表をコピーしました！');
  };

  return (
    <div className="p-3 bg-gray-100 min-h-screen text-xs">
      <div className="mb-3 bg-gray-900 text-white p-2.5 rounded-lg flex items-center justify-between">
        <span className="font-bold text-sm">剣道試合スコア管理アプリ</span>
        <div className="flex gap-2">
          <button onClick={handleCopyExcelTable} className="px-3 py-1 rounded font-bold bg-emerald-600 hover:bg-emerald-700 text-white">
            Excel用コピー
          </button>
          <button onClick={() => setActiveTab('team')} className="px-3 py-1 rounded font-bold bg-red-600 text-white">
            団体戦
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-300 rounded-xl overflow-x-auto">
        <table className="w-full border-collapse text-left min-w-[1050px]">
          <thead>
            <tr className="bg-gray-100 border-b text-gray-700">
              <th className="p-2 border-r font-bold w-36">項目 / 勝敗</th>
              {positions.map(p => (
                <th key={p.key} className="p-2 border-r text-center font-bold">{p.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* 赤チーム選手行 */}
            <tr className="border-b bg-red-50/20">
              <td className="p-2 border-r font-bold text-red-600 align-middle">
                <input type="text" value={redTeamName} onChange={e => setRedTeamName(e.target.value)} className="w-full border border-red-300 rounded px-1.5 py-1 mb-1 font-bold text-red-700 bg-white" />
                <div className="text-[11px]">本数: {getHonCount('red')}本</div>
              </td>
              {positions.map(p => (
                <td key={p.key} className="p-2 border-r align-middle">
                  {p.key === 'daicho' ? (
                    <input type="text" value={redPlayers[p.key]} onChange={e => setRedPlayers({...redPlayers, [p.key]: e.target.value})} placeholder="代表者名" className="w-full border border-gray-300 rounded px-1.5 py-1 font-bold bg-white" />
                  ) : (
                    <select value={redPlayers[p.key]} onChange={e => setRedPlayers({...redPlayers, [p.key]: e.target.value})} className="w-full border border-gray-300 rounded px-1.5 py-1 font-bold bg-white">
                      <option value="">(未選択)</option>
                      {presetPlayers.map(n => <option key={n} value={n}>{n}</option>)}
                    </select>
                  )}
                </td>
              ))}
            </tr>

            {/* 技・タイマー行 */}
            <tr className="border-b">
              <td className="p-2 border-r text-center font-bold text-gray-500 bg-gray-50 align-middle">
                タイマー &amp; 技
              </td>
              {positions.map(p => (
                <td key={p.key} className="p-2 border-r align-top">
                  <CompactMatchColumn logs={matchLogs[p.key] || []} onAddWaza={(team, w) => handleAddWaza(p.key, team, w)} />
                </td>
              ))}
            </tr>

            {/* 白チーム選手行（すべて自由入力） */}
            <tr className="bg-indigo-50/20">
              <td className="p-2 border-r font-bold text-indigo-600 align-middle">
                <input type="text" value={whiteTeamName} onChange={e => setWhiteTeamName(e.target.value)} className="w-full border border-indigo-300 rounded px-1.5 py-1 mb-1 font-bold text-indigo-700 bg-white" />
                <div className="text-[11px]">本数: {getHonCount('white')}本</div>
              </td>
              {positions.map(p => (
                <td key={p.key} className="p-2 border-r align-middle">
                  <input type="text" value={whitePlayers[p.key]} onChange={e => setWhitePlayers({...whitePlayers, [p.key]: e.target.value})} placeholder="選手名(自由)" className="w-full border border-gray-300 rounded px-1.5 py-1 font-bold bg-white" />
                </td>
              ))}
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

  React.useEffect(() => {
    let t;
    if (isRunning && seconds > 0) {
      t = setInterval(() => setSeconds(s => s - 1), 1000);
    }
    return () => clearInterval(t);
  }, [isRunning, seconds]);

  const formatTime = (sec) => `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, '0')}`;

  return (
    <div className="flex flex-col gap-1.5 p-1 bg-white border border-gray-200 rounded-lg text-xs w-full">
      <div className="flex items-center justify-between bg-gray-50 p-1 rounded border border-gray-100">
        <span className="font-bold text-xs">{formatTime(seconds)}</span>
        <div className="flex gap-1">
          <button onClick={() => setIsRunning(!isRunning)} className={`px-1.5 py-0.5 rounded text-[10px] font-bold text-white ${isRunning ? 'bg-amber-500' : 'bg-emerald-600'}`}>
            {isRunning ? '一時' : 'スタ'}
          </button>
          <button onClick={() => { setIsRunning(false); setSeconds(180); }} className="px-1 py-0.5 rounded text-[10px] font-bold bg-gray-200 text-gray-700">
            リセ
          </button>
        </div>
      </div>
      <div className="flex gap-1">
        {quickWazas.map(w => (
          <button key={w} onClick={() => onAddWaza('red', w)} className="flex-1 bg-red-600 text-white py-0.5 rounded text-[9px] font-bold">{w}</button>
        ))}
      </div>
      <div className="flex gap-1">
        {quickWazas.map(w => (
          <button key={w} onClick={() => onAddWaza('white', w)} className="flex-1 bg-indigo-600 text-white py-0.5 rounded text-[9px] font-bold">{w}</button>
        ))}
      </div>
      <div className="max-h-12 overflow-y-auto space-y-0.5 border-t pt-1 text-[10px]">
        {logs.map(l => (
          <div key={l.id} className={l.team === 'red' ? 'text-red-600 font-semibold' : 'text-indigo-600 font-semibold'}>
            [{l.team === 'red' ? '赤' : '白'}] {l.waza}
          </div>
        ))}
      </div>
    </div>
  );
}