'use client';

import React, { useState, useEffect } from 'react';

export default function KendoTeamScoreApp() {
  const [tournamentName, setTournamentName] = useState('山県中学校剣道選手権大会');
  const [matchDate, setMatchDate] = useState('2026 / 07 / 19');
  const [teamRed, setTeamRed] = useState('高川');
  const [teamWhite, setTeamWhite] = useState('川中');

  const [timeLeft, setTimeLeft] = useState(240);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let timer;
    if (isTimerRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(timer);
  }, [isTimerRunning, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const [matchRows, setMatchRows] = useState([
    { position: '先鋒', redPlayer: '高川', whitePlayer: '川中', redPoint1: '-', redPoint2: '-', redPoint3: '-', winner: '-', detail1: '', detail2: '', detail3: '' },
    { position: '次鋒', redPlayer: '山本', whitePlayer: '因分', redPoint1: '-', redPoint2: '-', redPoint3: '-', winner: '-', detail1: '', detail2: '', detail3: '' },
    { position: '中堅', redPlayer: '嶋内', whitePlayer: '小倉', redPoint1: '-', redPoint2: '-', redPoint3: '-', winner: '-', detail1: '', detail2: '', detail3: '' },
    { position: '副将', redPlayer: '安野', whitePlayer: '岡本', redPoint1: '-', redPoint2: '-', redPoint3: '-', winner: '-', detail1: '', detail2: '', detail3: '' },
    { position: '大将', redPlayer: '吉田', whitePlayer: '河田', redPoint1: '-', redPoint2: '-', redPoint3: '-', winner: '-', detail1: '', detail2: '', detail3: '' },
  ]);

  const pointOptions = ['-', '赤:メ', '赤:ド', '赤:コ', '赤:ツ', '赤:▲', '白:メ', '白:ド', '白:コ', '白:ツ', '白:▲'];
  const detailOptions = ['(詳細なし)', '面', '出ばな面', '相面', '返し面', '引き面', '抜き面', '胴', '返し胴', '抜き胴', '小手', '出ばな小手', '相小手', '突', '反則'];
  const winnerOptions = ['-', '勝', '負', '引き分け'];

  const updateRow = (index, field, value) => {
    const newRows = [...matchRows];
    newRows[index][field] = value;
    setMatchRows(newRows);
  };

  const calculateTotals = () => {
    let redWins = 0, redIppon = 0;
    let whiteWins = 0, whiteIppon = 0;

    matchRows.forEach(row => {
      if (row.winner === '勝') redWins++;
      if (row.winner === '負') whiteWins++;

      [row.redPoint1, row.redPoint2, row.redPoint3].forEach(p => {
        if (p.startsWith('赤:')) redIppon++;
        if (p.startsWith('白:')) whiteIppon++;
      });
    });

    return { redWins, redIppon, whiteWins, whiteIppon };
  };

  const totals = calculateTotals();

  const handleClear = () => {
    if (window.confirm('入力内容をすべてリセットしますか？')) {
      setMatchRows(matchRows.map(row => ({
        ...row,
        redPoint1: '-',
        redPoint2: '-',
        redPoint3: '-',
        winner: '-',
        detail1: '',
        detail2: '',
        detail3: ''
      })));
    }
  };

  const handleCopyExcel = () => {
    const header = `大会名\t${tournamentName}\t日付\t${matchDate}\n` +
                   `赤チーム\t${teamRed}\t白チーム\t${teamWhite}\n` +
                   `スコア\t${totals.redWins}勝 (${totals.redIppon}本) - ${totals.whiteWins}勝 (${totals.whiteIppon}本)\n\n` +
                   `ポジション\t赤選手\t1本目\t2本目\t3本目\t勝敗\t詳細技1\t詳細技2\t詳細技3\t白選手\n`;
    
    const body = matchRows.map(r => 
      `${r.position}\t${r.redPlayer}\t${r.redPoint1}\t${r.redPoint2}\t${r.redPoint3}\t${r.winner}\t${r.detail1}\t${r.detail2}\t${r.detail3}\t${r.whitePlayer}`
    ).join('\n');

    navigator.clipboard.writeText(header + body);
    alert('Excel貼り付け用のデータをコピーしました！Excelのセルにそのまま貼り付け（Ctrl+V）できます。');
  };

  return (
    <div style={{ padding: '15px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto', background: '#fff', minHeight: '100vh' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '15px', fontSize: '20px' }}>⚔️ 剣道団体戦 スコア記録シート（三本勝負対応）</h2>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#e9ecef', padding: '10px', borderRadius: '8px', marginBottom: '15px' }}>
        <div>
          <strong>試合時間タイマー: </strong>
          <span style={{ fontSize: '22px', fontWeight: 'bold', marginLeft: '10px', color: timeLeft <= 30 ? 'red' : '#333' }}>
            {formatTime(timeLeft)}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setIsTimerRunning(!isTimerRunning)} style={{ padding: '6px 12px', background: isTimerRunning ? '#dc3545' : '#28a745', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            {isTimerRunning ? 'ストップ' : 'スタート'}
          </button>
          <button onClick={() => { setIsTimerRunning(false); setTimeLeft(240); }} style={{ padding: '6px 10px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            4分リセット
          </button>
          <button onClick={() => { setIsTimerRunning(false); setTimeLeft(180); }} style={{ padding: '6px 10px', background: '#6c757d', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            3分リセット
          </button>
        </div>
      </div>

      <div style={{ background: '#f8f9fa', padding: '10px', borderRadius: '8px', marginBottom: '15px', fontSize: '14px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '8px' }}>
          <label style={{ flex: 1 }}>大会名: <input type="text" value={tournamentName} onChange={e => setTournamentName(e.target.value)} style={{ width: '100%', padding: '4px' }}/></label>
          <label style={{ flex: 1 }}>日付: <input type="text" value={matchDate} onChange={e => setMatchDate(e.target.value)} style={{ width: '100%', padding: '4px' }}/></label>
        </div>
        <div style={{ display: 'flex', gap: '10px', fontWeight: 'bold' }}>
          <label style={{ flex: 1, color: '#d9534f' }}>赤チーム: <input type="text" value={teamRed} onChange={e => setTeamRed(e.target.value)} style={{ width: '100%', padding: '4px', fontWeight: 'normal' }}/></label>
          <label style={{ flex: 1, color: '#0275d8' }}>白チーム: <input type="text" value={teamWhite} onChange={e => setTeamWhite(e.target.value)} style={{ width: '100%', padding: '4px', fontWeight: 'normal' }}/></label>
        </div>
      </div>

      <div style={{ textAlign: 'center', background: '#fff3cd', padding: '12px', borderRadius: '8px', fontSize: '18px', fontWeight: 'bold', marginBottom: '15px', border: '1px solid #ffeeba' }}>
        <span style={{ color: '#d9534f' }}>{teamRed}（赤）: {totals.redWins}勝 ({totals.redIppon}本)</span>
        <span style={{ margin: '0 15px' }}>VS</span>
        <span style={{ color: '#0275d8' }}>{teamWhite}（白）: {totals.whiteWins}勝 ({totals.whiteIppon}本)</span>
      </div>

      <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd', minWidth: '900px', fontSize: '13px' }}>
          <thead>
            <tr style={{ background: '#f1f3f5' }}>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>ポジション</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', color: '#d9534f' }}>赤選手</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>1本目</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>2本目</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>3本目</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>勝敗</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>詳細技1</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>詳細技2</th>
              <th style={{ border: '1px solid #ddd', padding: '8px' }}>詳細技3</th>
              <th style={{ border: '1px solid #ddd', padding: '8px', color: '#0275d8' }}>白選手</th>
            </tr>
          </thead>
          <tbody>
            {matchRows.map((row, index) => (
              <tr key={row.position}>
                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center', fontWeight: 'bold', background: '#f8f9fa' }}>{row.position}</td>
                <td style={{ border: '1px solid #ddd', padding: '6px' }}>
                  <input type="text" value={row.redPlayer} onChange={e => updateRow(index, 'redPlayer', e.target.value)} style={{ width: '60px', padding: '4px' }} />
                </td>
                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>
                  <select value={row.redPoint1} onChange={e => updateRow(index, 'redPoint1', e.target.value)} style={{ padding: '4px' }}>
                    {pointOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </td>
                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>
                  <select value={row.redPoint2} onChange={e => updateRow(index, 'redPoint2', e.target.value)} style={{ padding: '4px' }}>
                    {pointOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </td>
                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>
                  <select value={row.redPoint3} onChange={e => updateRow(index, 'redPoint3', e.target.value)} style={{ padding: '4px' }}>
                    {pointOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </td>
                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>
                  <select value={row.winner} onChange={e => updateRow(index, 'winner', e.target.value)} style={{ padding: '4px', fontWeight: 'bold', color: row.winner === '勝' ? '#d9534f' : row.winner === '負' ? '#0275d8' : '#333' }}>
                    {winnerOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </td>
                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>
                  <select value={row.detail1} onChange={e => updateRow(index, 'detail1', e.target.value)} style={{ padding: '4px', fontSize: '11px' }}>
                    {detailOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </td>
                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>
                  <select value={row.detail2} onChange={e => updateRow(index, 'detail2', e.target.value)} style={{ padding: '4px', fontSize: '11px' }}>
                    {detailOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </td>
                <td style={{ border: '1px solid #ddd', padding: '6px', textAlign: 'center' }}>
                  <select value={row.detail3} onChange={e => updateRow(index, 'detail3', e.target.value)} style={{ padding: '4px', fontSize: '11px' }}>
                    {detailOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </td>
                <td style={{ border: '1px solid #ddd', padding: '6px' }}>
                  <input type="text" value={row.whitePlayer} onChange={e => updateRow(index, 'whitePlayer', e.target.value)} style={{ width: '60px', padding: '4px' }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button onClick={handleCopyExcel} style={{ padding: '12px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer' }}>
          📋 Excel貼り付け用データをコピー
        </button>
        <button onClick={handleClear} style={{ padding: '10px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}>
          🗑️ スコアをクリア
        </button>
      </div>
    </div>
  );
}