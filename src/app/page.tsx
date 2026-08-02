'use client';

import React, { useState } from 'react';

export default function KendoTeamScoreApp() {
  const [tournamentName, setTournamentName] = useState('山県中学校剣道選手権大会');
  const [matchDate, setMatchDate] = useState('2026 / 07 / 19');
  const [teamRed, setTeamRed] = useState('高川');
  const [teamWhite, setTeamWhite] = useState('川中');

  // ご指定の新チームメンバー6名
  const redCandidates = ['山本', '松田', '山内', '橋本', '安野', '重村'];
  const whiteCandidates = ['因分', '小倉', '岡本', '河田', '重村', '選手H'];

  const [matches, setMatches] = useState([
    { position: '先鋒', redPlayer: '山本', whitePlayer: '因分', redPoint1: '-', redPoint2: '-', whitePoint1: '-', whitePoint2: '-', winner: '-' },
    { position: '次鋒', redPlayer: '松田', whitePlayer: '小倉', redPoint1: '-', redPoint2: '-', whitePoint1: '-', whitePoint2: '-', winner: '-' },
    { position: '中堅', redPlayer: '山内', whitePlayer: '岡本', redPoint1: '-', redPoint2: '-', whitePoint1: '-', whitePoint2: '-', winner: '-' },
    { position: '副将', redPlayer: '橋本', whitePlayer: '河田', redPoint1: '-', redPoint2: '-', whitePoint1: '-', whitePoint2: '-', winner: '-' },
    { position: '大将', redPlayer: '安野', whitePlayer: '重村', redPoint1: '-', redPoint2: '-', whitePoint1: '-', whitePoint2: '-', winner: '-' },
  ]);

  const techOptions = ['-', '面', '小手', '胴', '突', '出ばな面', '相面', '返し面', '引き面', '抜き面', '出ばな小手', '相小手', '返し胴', '抜き胴', '反則'];
  const winnerOptions = ['-', '赤勝ち', '白勝ち', '引き分け'];

  const updateMatch = (index: number, field: string, value: string) => {
    const newMatches = [...matches];
    newMatches[index] = { ...newMatches[index], [field]: value };
    setMatches(newMatches);
  };

  const calculateTotals = () => {
    let redWins = 0, redIppons = 0;
    let whiteWins = 0, whiteIppons = 0;

    matches.forEach(m => {
      if (m.winner === '赤勝ち') redWins++;
      if (m.winner === '白勝ち') whiteWins++;

      if (m.redPoint1 !== '-') redIppons++;
      if (m.redPoint2 !== '-') redIppons++;
      if (m.whitePoint1 !== '-') whiteIppons++;
      if (m.whitePoint2 !== '-') whiteIppons++;
    });

    return { redWins, redIppons, whiteWins, whiteIppons };
  };

  const totals = calculateTotals();

  const handleClear = () => {
    if (window.confirm('スコアをリセットしますか？')) {
      setMatches(matches.map(m => ({
        ...m,
        redPoint1: '-', redPoint2: '-', whitePoint1: '-', whitePoint2: '-', winner: '-'
      })));
    }
  };

  const handleCopyExcel = () => {
    const header = `大会名\t${tournamentName}\t日付\t${matchDate}\n` +
                   `赤チーム\t${teamRed} (${totals.redWins}勝 ${totals.redIppons}本)\tVS\t白チーム\t${teamWhite} (${totals.whiteWins}勝 ${totals.whiteIppons}本)\n\n` +
                   `ポジション\t先鋒\t次鋒\t中堅\t副将\t大将\n`;
    
    const redRow = `赤(${teamRed})\t` + matches.map(m => m.redPlayer).join('\t');
    const whiteRow = `白(${teamWhite})\t` + matches.map(m => m.whitePlayer).join('\t');
    const winRow = `勝敗\t` + matches.map(m => m.winner).join('\t');

    navigator.clipboard.writeText(header + redRow + '\n' + whiteRow + '\n' + winRow);
    alert('紙のスコア形式のデータをExcel用にコピーしました！');
  };

  return (
    <div style={{ padding: '15px', fontFamily: 'sans-serif', maxWidth: '1000px', margin: '0 auto', background: '#fff', minHeight: '100vh' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '15px', fontSize: '18px' }}>⚔️ 剣道団体戦 伝統スコアシート型</h2>

      <div style={{ background: '#f8f9fa', padding: '10px', borderRadius: '8px', marginBottom: '12px', fontSize: '13px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '6px' }}>
          <label style={{ flex: 1 }}>大会名: <input type="text" value={tournamentName} onChange={e => setTournamentName(e.target.value)} style={{ width: '100%', padding: '3px' }}/></label>
          <label style={{ flex: 1 }}>日付: <input type="text" value={matchDate} onChange={e => setMatchDate(e.target.value)} style={{ width: '100%', padding: '3px' }}/></label>
        </div>
        <div style={{ display: 'flex', gap: '8px', fontWeight: 'bold' }}>
          <label style={{ flex: 1, color: '#d9534f' }}>赤チーム: <input type="text" value={teamRed} onChange={e => setTeamRed(e.target.value)} style={{ width: '100%', padding: '3px', fontWeight: 'normal' }}/></label>
          <label style={{ flex: 1, color: '#0275d8' }}>白チーム: <input type="text" value={teamWhite} onChange={e => setTeamWhite(e.target.value)} style={{ width: '100%', padding: '3px', fontWeight: 'normal' }}/></label>
        </div>
      </div>

      <div style={{ textAlign: 'center', background: '#fff3cd', padding: '10px', borderRadius: '8px', fontSize: '16px', fontWeight: 'bold', marginBottom: '15px', border: '1px solid #ffeeba' }}>
        <span style={{ color: '#d9534f' }}>{teamRed}（赤）: {totals.redWins}勝 ({totals.redIppons}本)</span>
        <span style={{ margin: '0 12px' }}>—</span>
        <span style={{ color: '#0275d8' }}>{teamWhite}（白）: {totals.whiteWins}勝 ({totals.whiteIppons}本)</span>
      </div>

      <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '2px solid #333', minWidth: '900px', fontSize: '13px', background: '#fff' }}>
          <thead>
            <tr style={{ background: '#e9ecef', textAlign: 'center' }}>
              <th style={{ border: '1px solid #333', padding: '6px', width: '80px' }}>対戦</th>
              {['先鋒', '次鋒', '中堅', '副将', '大将'].map(pos => (
                <th key={pos} style={{ border: '1px solid #333', padding: '6px' }}>{pos}</th>
              ))}
              <th style={{ border: '1px solid #333', padding: '6px', width: '70px' }}>結果</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #333', padding: '6px', textAlign: 'center', background: '#fdf2f2', color: '#d9534f', fontWeight: 'bold' }}>
                赤: {teamRed}
              </td>
              {matches.map((m, idx) => (
                <td key={idx} style={{ border: '1px solid #333', padding: '4px', textAlign: 'center', background: '#fff5f5' }}>
                  <select value={m.redPlayer} onChange={e => updateMatch(idx, 'redPlayer', e.target.value)} style={{ width: '100%', padding: '4px', fontWeight: 'bold', color: '#d9534f' }}>
                    {redCandidates.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </td>
              ))}
              <td rowSpan={3} style={{ border: '1px solid #333', padding: '4px', textAlign: 'center', background: '#f8f9fa', verticalAlign: 'middle' }}>
                <div style={{ fontSize: '11px', color: '#666' }}>赤 {totals.redWins}勝</div>
                <div style={{ fontSize: '11px', color: '#666' }}>白 {totals.whiteWins}勝</div>
              </td>
            </tr>

            <tr>
              <td style={{ border: '1px solid #333', padding: '6px', textAlign: 'center', background: '#f1f3f5', fontSize: '11px' }}>
                技・判定
              </td>
              {matches.map((m, idx) => (
                <td key={idx} style={{ border: '1px solid #333', padding: '4px', textAlign: 'center' }}>
                  <div style={{ fontSize: '11px', marginBottom: '2px', color: '#d9534f' }}>赤技:</div>
                  <div style={{ display: 'flex', gap: '2px', marginBottom: '4px' }}>
                    <select value={m.redPoint1} onChange={e => updateMatch(idx, 'redPoint1', e.target.value)} style={{ width: '50%', fontSize: '11px', padding: '2px' }}>
                      {techOptions.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <select value={m.redPoint2} onChange={e => updateMatch(idx, 'redPoint2', e.target.value)} style={{ width: '50%', fontSize: '11px', padding: '2px' }}>
                      {techOptions.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div style={{ fontSize: '11px', marginBottom: '2px', color: '#0275d8' }}>白技:</div>
                  <div style={{ display: 'flex', gap: '2px', marginBottom: '4px' }}>
                    <select value={m.whitePoint1} onChange={e => updateMatch(idx, 'whitePoint1', e.target.value)} style={{ width: '50%', fontSize: '11px', padding: '2px' }}>
                      {techOptions.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    <select value={m.whitePoint2} onChange={e => updateMatch(idx, 'whitePoint2', e.target.value)} style={{ width: '50%', fontSize: '11px', padding: '2px' }}>
                      {techOptions.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div style={{ marginTop: '4px' }}>
                    <select value={m.winner} onChange={e => updateMatch(idx, 'winner', e.target.value)} style={{ width: '100%', fontSize: '11px', padding: '3px', fontWeight: 'bold' }}>
                      {winnerOptions.map(w => <option key={w} value={w}>{w}</option>)}
                    </select>
                  </div>
                </td>
              ))}
            </tr>

            <tr>
              <td style={{ border: '1px solid #333', padding: '6px', textAlign: 'center', background: '#f0f4f8', color: '#0275d8', fontWeight: 'bold' }}>
                白: {teamWhite}
              </td>
              {matches.map((m, idx) => (
                <td key={idx} style={{ border: '1px solid #333', padding: '4px', textAlign: 'center', background: '#f5f8fc' }}>
                  <select value={m.whitePlayer} onChange={e => updateMatch(idx, 'whitePlayer', e.target.value)} style={{ width: '100%', padding: '4px', fontWeight: 'bold', color: '#0275d8' }}>
                    {whiteCandidates.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <button onClick={handleCopyExcel} style={{ padding: '12px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>
          📋 伝統スコア形式でExcel用データをコピー
        </button>
        <button onClick={handleClear} style={{ padding: '10px', background: '#dc3545', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '14px', cursor: 'pointer' }}>
          🗑️ スコアをクリア
        </button>
      </div>
    </div>
  );
}