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

  // 反則カウント（最大2まで）
  const [penalties, setPenalties] = useState({
    senpo: { red: 0, white: 0 },
    jiho: { red: 0, white: 0 },
    chuken: { red: 0, white: 0 },
    fukusho: { red: 0, white: 0 },
    taisho: { red: 0, white: 0 },
    daicho: { red: 0, white: 0 },
  });

  // 個人戦用ステート
  const [indivRedPlayer, setIndivRedPlayer] = useState('赤選手');
  const [indivWhitePlayer, setIndivWhitePlayer] = useState('白選手');
  const [indivLogs, setIndivLogs] = useState([]);
  const [indivPenalties, setIndivPenalties] = useState({ red: 0, white: 0 });

  // 試合履歴用
  const [historyList, setHistoryList] = useState([]);

  const handleAddWaza = (pos, team, waza) => {
    setMatchLogs(prev => ({
      ...prev,
      [pos]: [...(prev[pos] || []), { id: Math.random().toString(36), team, waza }]
    }));
  };

  const handleRemoveWaza = (pos, id) => {
    setMatchLogs(prev => ({
      ...prev,
      [pos]: (prev[pos] || []).filter(l => l.id !== id)
    }));
  };

  // 反則変更：最大2まで。2回に達したら相手に「〇反」を自動付与
  const handlePenaltyChange = (pos, team, delta) => {
    setPenalties(prev => {
      const currentVal = prev[pos][team];
      const newVal = Math.min(2, Math.max(0, currentVal + delta)); // 0〜2に制限
      
      // 増えてちょうど2になったら相手に〇反を追加
      if (delta > 0 && newVal === 2 && currentVal < 2) {
        const opposingTeam = team === 'red' ? 'white' : 'red';
        setMatchLogs(mPrev => ({
          ...mPrev,
          [pos]: [...(mPrev[pos] || []), { id: Math.random().toString(36), team: opposingTeam, waza: '〇反' }]
        }));
      }

      return {
        ...prev,
        [pos]: {
          ...prev[pos],
          [team]: newVal
        }
      };
    });
  };

  const handleIndivPenaltyChange = (team, delta) => {
    setIndivPenalties(prev => {
      const currentVal = prev[team];
      const newVal = Math.min(2, Math.max(0, currentVal + delta));
      if (delta > 0 && newVal === 2 && currentVal < 2) {
        const opposingTeam = team === 'red' ? 'white' : 'red';
        setIndivLogs(lPrev => [...lPrev, { id: Math.random().toString(36), team: opposingTeam, waza: '〇反' }]);
      }
      return { ...prev, [team]: newVal };
    });
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
          <button onClick={() => setActiveTab('individual')} className={`px-3 py-1.5 rounded font-bold ${activeTab === 'individual' ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-300'}`}>個人戦</button>
          <button onClick={() => setActiveTab('history')} className={`px-3 py-1.5 rounded font-bold ${activeTab === 'history' ? 'bg-amber-600 text-white' : 'bg-gray-800 text-gray-300'}`}>試合履歴 ({historyList.length})</button>
          <button onClick={() => setActiveTab('timer')} className={`px-3 py-1.5 rounded font-bold ${activeTab === 'timer' ? 'bg-gray-700 text-white' : 'bg-gray-800 text-gray-300'}`}>独立タイマー</button>
        </div>
      </div>

      {activeTab === 'team' && (
        <div className="overflow-x-auto bg-white border border-gray-300 rounded-xl shadow-sm">
          <table className="w-full border-collapse text-left min-w-[1250px]">
            <thead>
              <tr className="border-b bg-gray-100 text-gray-700">
                <th className="p-2 border-r font-bold w-44">チーム / 勝敗・本数</th>
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
                  <div className="flex items-center gap-1 mb-1">
                    <span className="w-2 h-2 rounded-full bg-red-600 inline-block"></span>
                    <input
                      type="text"
                      value={redTeamName}
                      onChange={e => setRedTeamName(e.target.value)}
                      className="w-full border border-red-300 rounded px-1.5 py-1 font-bold bg-white text-red-700"
                    />
                  </div>
                  <div className="text-[11px] text-red-800 font-semibold">赤チーム選手陣</div>
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
                <td className="p-2 text-center font-bold text-red-600 bg-red-50/45 align-middle">
                  {redScore.wins}勝 / {redScore.hon}本
                </td>
              </tr>

              {/* 各ポジションのタイマー＆技記録カラム行 */}
              <tr className="border-b">
                <td className="p-2 border-r text-center font-bold text-gray-500 bg-gray-50 align-middle">
                  タイマー &amp; 技記録
                </td>
                {positions.map(p => (
                  <td key={p.key} className="p-2 border-r align-top">
                    <CompactMatchColumn
                      logs={matchLogs[p.key] || []}
                      penalties={penalties[p.key]}
                      onAddWaza={(team, w) => handleAddWaza(p.key, team, w)}
                      onRemoveWaza={(id) => handleRemoveWaza(p.key, id)}
                      onPenaltyChange={(team, delta) => handlePenaltyChange(p.key, team, delta)}
                    />
                  </td>
                ))}
                <td className="p-2 text-center text-gray-400 bg-gray-50/50 align-middle">
                  各試合の経過
                </td>
              </tr>

              {/* 白チーム選手入力行 */}
              <tr className="bg-indigo-50/20">
                <td className="p-2 border-r font-bold text-indigo-600 align-middle">
                  <div className="flex items-center gap-1 mb-1">
                    <span className="w-2 h-2 rounded-full bg-blue-600 inline-block"></span>
                    <input
                      type="text"
                      value={whiteTeamName}
                      onChange={e => setWhiteTeamName(e.target.value)}
                      className="w-full border border-indigo-300 rounded px-1.5 py-1 font-bold bg-white text-indigo-700"
                    />
                  </div>
                  <div className="text-[11px] text-indigo-800 font-semibold">白チーム選手陣</div>
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
                <td className="p-2 text-center font-bold text-indigo-600 bg-indigo-50/45 align-middle">
                  {whiteScore.wins}勝 / {whiteScore.hon}本
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'individual' && (
        <div className="bg-white p-4 rounded-xl border border-gray-300 max-w-2xl mx-auto space-y-4">
          <div className="text-sm font-bold text-gray-800 border-b pb-2">個人戦スコア入力</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-red-50 p-3 rounded-lg border border-red-200 space-y-2">
              <input type="text" value={indivRedPlayer} onChange={e => setIndivRedPlayer(e.target.value)} className="w-full border rounded p-1 font-bold text-red-700 bg-white" />
              <div className="text-center font-bold text-red-600 text-lg">
                {indivLogs.filter(l => l.team === 'red').length} 本
              </div>
              <div className="text-xs text-red-600 font-bold">反則(指導): {indivPenalties.red} / 2</div>
              <div className="flex gap-1">
                <button onClick={() => handleIndivPenaltyChange('red', 1)} className="px-2 py-0.5 bg-red-100 text-red-700 rounded font-bold text-[10px]">+ 反則</button>
                <button onClick={() => handleIndivPenaltyChange('red', -1)} className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded font-bold text-[10px]">-</button>
              </div>
              <div className="grid grid-cols-2 gap-1 pt-2">
                {quickWazas.map(w => (
                  <button key={w} onClick={() => setIndivLogs([...indivLogs, { id: Math.random().toString(36), team: 'red', waza: w }])} className="bg-red-600 hover:bg-red-700 text-white py-1 rounded font-bold">{w}</button>
                ))}
              </div>
              <div className="space-y-1 pt-2 border-t text-[10px]">
                {indivLogs.map(l => (
                  <div key={l.id} className="flex justify-between items-center text-red-600 font-semibold">
                    <span>[{l.team === 'red' ? '赤' : '白'}] {l.waza}</span>
                    <button onClick={() => setIndivLogs(indivLogs.filter(item => item.id !== l.id))} className="text-gray-400 hover:text-red-800 px-1 font-bold">×</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200 space-y-2">
              <input type="text" value={indivWhitePlayer} onChange={e => setIndivWhitePlayer(e.target.value)} className="w-full border rounded p-1 font-bold text-indigo-700 bg-white" />
              <div className="text-center font-bold text-indigo-600 text-lg">
                {indivLogs.filter(l => l.team === 'white').length} 本
              </div>
              <div className="text-xs text-indigo-600 font-bold">反則(指導): {indivPenalties.white} / 2</div>
              <div className="flex gap-1">
                <button onClick={() => handleIndivPenaltyChange('white', 1)} className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded font-bold text-[10px]">+ 反則</button>
                <button onClick={() => handleIndivPenaltyChange('white', -1)} className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded font-bold text-[10px]">-</button>
              </div>
              <div className="grid grid-cols-2 gap-1 pt-2">
                {quickWazas.map(w => (
                  <button key={w} onClick={() => setIndivLogs([...indivLogs, { id: Math.random().toString(36), team: 'white', waza: w }])} className="bg-indigo-600 hover:bg-indigo-700 text-white py-1 rounded font-bold">{w}</button>
                ))}
              </div>
              <div className="space-y-1 pt-2 border-t text-[10px]">
                {indivLogs.map(l => (
                  <div key={l.id} className="flex justify-between items-center text-indigo-600 font-semibold">
                    <span>[{l.team === 'red' ? '赤' : '白'}] {l.waza}</span>
                    <button onClick={() => setIndivLogs(indivLogs.filter(item => item.id !== l.id))} className="text-gray-400 hover:text-indigo-800 px-1 font-bold">×</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center pt-2 border-t">
            <div className="text-gray-500">履歴: {indivLogs.length}件</div>
            <button onClick={() => { setIndivLogs([]); setIndivPenalties({ red: 0, white: 0 }); }} className="px-3 py-1 bg-gray-200 rounded font-bold text-gray-700">リセット</button>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white p-4 rounded-xl border border-gray-300 max-w-2xl mx-auto">
          <div className="text-sm font-bold text-gray-800 mb-2">試合履歴</div>
          {historyList.length === 0 ? (
            <div className="text-gray-400 py-4 text-center">保存された履歴はありません</div>
          ) : (
            <div className="space-y-2">
              {historyList.map((h, i) => <div key={i} className="p-2 border rounded">{h}</div>)}
            </div>
          )}
        </div>
      )}

      {activeTab === 'timer' && (
        <StandaloneTimer />
      )}
    </div>
  );
}

function StandaloneTimer() {
  const [seconds, setSeconds] = useState(180);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let t;
    if (isRunning && seconds > 0) {
      t = setInterval(() => setSeconds(s => s - 1), 1000);
    }
    return () => clearInterval(t);
  }, [isRunning, seconds]);

  const formatTime = (sec) => `${Math.floor(sec / 60)}:${(sec % 60).toString().padStart(2, '0')}`;

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-300 max-w-md mx-auto text-center space-y-4 shadow-sm">
      <div className="text-base font-bold text-gray-700">独立タイマー（試合用）</div>
      <div className="text-5xl font-mono font-bold text-gray-900 bg-gray-50 py-6 rounded-xl border">
        {formatTime(seconds)}
      </div>
      <div className="flex justify-center gap-2">
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`px-5 py-2 rounded-lg font-bold text-white text-sm ${isRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-emerald-600 hover:bg-emerald-700'}`}
        >
          {isRunning ? '一時停止' : 'スタート'}
        </button>
        <button
          onClick={() => { setIsRunning(false); setSeconds(180); }}
          className="px-4 py-2 rounded-lg font-bold bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm"
        >
          リセット (3分)
        </button>
      </div>
      <div className="flex justify-center gap-2 pt-2 border-t">
        <button onClick={() => { setIsRunning(false); setSeconds(180); }} className="px-3 py-1 bg-gray-100 rounded text-xs font-semibold">3分</button>
        <button onClick={() => { setIsRunning(false); setSeconds(120); }} className="px-3 py-1 bg-gray-100 rounded text-xs font-semibold">2分</button>
        <button onClick={() => { setIsRunning(false); setSeconds(600); }} className="px-3 py-1 bg-gray-100 rounded text-xs font-semibold">延長10分</button>
      </div>
    </div>
  );
}

function CompactMatchColumn({ logs, penalties, onAddWaza, onRemoveWaza, onPenaltyChange }) {
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

      {/* 赤チーム操作 ＆ 反則 */}
      <div className="bg-red-50/50 border border-red-200 rounded-lg p-1.5 space-y-1">
        <div className="flex justify-between items-center text-[10px] font-bold text-red-700 px-0.5">
          <span>反則: {penalties?.red || 0} / 2</span>
          <div className="flex gap-1">
            <button onClick={() => onPenaltyChange('red', 1)} className="px-1.5 py-0.5 bg-red-200 hover:bg-red-300 rounded text-red-800 font-bold">+反則</button>
            <button onClick={() => onPenaltyChange('red', -1)} className="px-1 py-0.5 bg-gray-200 hover:bg-gray-300 rounded text-gray-700">-</button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {quickWazas.map(w => (
            <button key={w} onClick={() => onAddWaza('red', w)} className="bg-red-600 hover:bg-red-700 text-white text-[10px] py-1 rounded font-bold">{w}</button>
          ))}
        </div>
        <div className="flex gap-1">
          <select value={redSelected} onChange={e => setRedSelected(e.target.value)} className="flex-1 border border-red-300 rounded px-1.5 py-1 text-[10px] font-bold bg-white text-red-800">
            {allWazas.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
          <button onClick={() => onAddWaza('red', redSelected)} className="bg-red-700 hover:bg-red-800 text-white text-[10px] px-2 py-1 rounded font-bold">
            赤追加
          </button>
        </div>
      </div>

      {/* 白チーム操作 ＆ 反則 */}
      <div className="bg-indigo-50/50 border border-indigo-200 rounded-lg p-1.5 space-y-1">
        <div className="flex justify-between items-center text-[10px] font-bold text-indigo-700 px-0.5">
          <span>反則: {penalties?.white || 0} / 2</span>
          <div className="flex gap-1">
            <button onClick={() => onPenaltyChange('white', 1)} className="px-1.5 py-0.5 bg-indigo-200 hover:bg-indigo-300 rounded text-indigo-800 font-bold">+反則</button>
            <button onClick={() => onPenaltyChange('white', -1)} className="px-1 py-0.5 bg-gray-200 hover:bg-gray-300 rounded text-gray-700">-</button>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-1">
          {quickWazas.map(w => (
            <button key={w} onClick={() => onAddWaza('white', w)} className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] py-1 rounded font-bold">{w}</button>
          ))}
        </div>
        <div className="flex gap-1">
          <select value={whiteSelected} onChange={e => setWhiteSelected(e.target.value)} className="flex-1 border border-indigo-300 rounded px-1.5 py-1 text-[10px] font-bold bg-white text-indigo-800">
            {allWazas.map(w => <option key={w} value={w}>{w}</option>)}
          </select>
          <button onClick={() => onAddWaza('white', whiteSelected)} className="bg-indigo-700 hover:bg-indigo-800 text-white text-[10px] px-2 py-1 rounded font-bold">
            白追加
          </button>
        </div>
      </div>

      {/* 一本・反則履歴（削除ボタン付き） */}
      <div className="pt-1 border-t border-gray-100 text-[10px] text-gray-500">
        {logs.length > 0 && (
          <div className="space-y-0.5 max-h-16 overflow-y-auto">
            {logs.map(l => (
              <div
                key={l.id}
                className={`flex justify-between items-center font-semibold ${l.team === 'red' ? 'text-red-600' : 'text-indigo-600'}`}
              >
                <span>[{l.team === 'red' ? '赤' : '白'}] {l.waza}</span>
                <button
                  onClick={() => onRemoveWaza(l.id)}
                  className="text-gray-400 hover:text-red-700 px-1 font-bold"
                  title="この記録を消す"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}