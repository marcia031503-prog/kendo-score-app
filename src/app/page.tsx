'use client';

import React, { useState } from 'react';

export default function KendoTeamScoreApp() {
  const [tournamentName, setTournamentName] = useState('山県中学校剣道選手権大会');
  const [matchDate, setMatchDate] = useState('2026 / 07 / 19');
  const [teamRed, setTeamRed] = useState('高川');
  const [teamWhite, setTeamWhite] = useState('川中');

  const redCandidates = ['山本', '松田', '山内', '橋本', '安野', '重村'];

  // 先鋒〜大将の5試合
  const [matches, setMatches] = useState([
    { position: '先鋒', redPlayer: '山本', whitePlayer: '', redPoint1: '-', redPoint2: '-', whitePoint1: '-', whitePoint2: '-', winner: '-' },
    { position: '次鋒', redPlayer: '松田', whitePlayer: '', redPoint1: '-', redPoint2: '-', whitePoint1: '-', whitePoint2: '-', winner: '-' },
    { position: '中堅', redPlayer: '山内', whitePlayer: '', redPoint1: '-', redPoint2: '-', whitePoint1: '-', whitePoint2: '-', winner: '-' },
    { position: '副将', redPlayer: '橋本', whitePlayer: '', redPoint1: '-', redPoint2: '-', whitePoint1: '-', whitePoint2: '-', winner: '-' },
    { position: '大将', redPlayer: '安野', whitePlayer: '', redPoint1: '-', redPoint2: '-', whitePoint1: '-', whitePoint2: '-', winner: '-' },
  ]);

  // 代表戦用
  const [daihyoMatch, setDaihyoMatch] = useState({
    redPlayer: '',
    whitePlayer: '',
    redPoint1: '-',
    redPoint2: '-',
    whitePoint1: '-',
    whitePoint2: '-',
    winner: '-'
  });

  // 不戦勝（二本勝ち＝丸ふたつ）の選択肢を追加
  const techOptions = ['-', '面', '小手', '胴', '突', '出ばな面', '相面', '返し面', '引き面', '抜き面', '出ばな小手', '相小手', '返し胴', '抜き胴', '反則', '不戦勝(○2つ)'];
  const winnerOptions = ['-', '赤勝ち', '白勝ち', '引き分け'];

  // 通常試合の自動勝敗判定
  const updateMatch = (index: number, field: string, value: string) => {
    const newMatches = [...matches];
    const target = { ...newMatches[index], [field]: value };

    // 不戦勝(○2つ)が選ばれた場合の自動処理
    if (field === 'redPoint1' && value === '不戦勝(○2つ)') {
      target.redPoint2 = '不戦勝(○2つ)';
      target.whitePoint1 = '-';
      target.whitePoint2 = '-';
      target.winner = '赤勝ち';
    } else if (field === 'whitePoint1' && value === '不戦勝(○2つ)') {
      target.whitePoint2 = '不戦勝(○2つ)';
      target.redPoint1 = '-';
      target.redPoint2 = '-';
      target.winner = '白勝ち';
    } else {
      const redCount = (target.redPoint1 !== '-' ? 1 : 0) + (target.redPoint2 !== '-' ? 1 : 0);
      const whiteCount = (target.whitePoint1 !== '-' ? 1 : 0) + (target.whitePoint2 !== '-' ? 1 : 0);

      if (redCount > whiteCount) {
        target.winner = '赤勝ち';
      } else if (whiteCount > redCount) {
        target.winner = '白勝ち';
      } else if (redCount === 2 && whiteCount === 2) {
        target.winner = '引き分け';
      } else if (redCount === 0 && whiteCount === 0) {
        target.winner = '-';
      } else {
        if (target.redPoint1 !== '-' && target.whitePoint1 !== '-') {
          target.winner = '引き分け';
        }
      }
    }

    newMatches[index] = target;
    setMatches(newMatches);
  };

  const handleWinnerChange = (index: number, value: string) => {
    const newMatches = [...matches];
    newMatches[index] = { ...newMatches[index], winner: value };
    setMatches(newMatches);
  };

  // 代表戦の自動勝敗判定
  const updateDaihyo = (field: string, value: string) => {
    const target = { ...daihyoMatch, [field]: value };

    if (field === 'redPoint1' && value === '不戦勝(○2つ)') {
      target.redPoint2 = '不戦勝(○2つ)';
      target.winner = '赤勝ち';
    } else if (field === 'whitePoint1' && value === '不戦勝(○2つ)') {
      target.whitePoint2 = '不戦勝(○2つ)';
      target.winner = '白勝ち';
    } else {
      const redCount = (target.redPoint1 !== '-' ? 1 : 0) + (target.redPoint2 !== '-' ? 1 : 0);
      const whiteCount = (target.whitePoint1 !== '-' ? 1 : 0) + (target.whitePoint2 !== '-' ? 1 : 0);

      if (redCount > whiteCount) {
        target.winner = '赤勝ち';
      } else if (whiteCount > redCount) {
        target.winner = '白勝ち';
      } else if (redCount === 0 && whiteCount === 0) {
        target.winner = '-';
      }
    }

    setDaihyoMatch(target);
  };

  // チーム全体の勝数と本数の計算
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

    if (daihyoMatch.winner === '赤勝ち') redWins++;
    if (daihyoMatch.winner === '白勝ち') whiteWins++;
    if (daihyoMatch.redPoint1 !== '-') redIppons++;
    if (daihyoMatch.redPoint2 !== '-') redIppons++;
    if (daihyoMatch.whitePoint1 !== '-') whiteIppons++;
    if (daihyoMatch.whitePoint2 !== '-') whiteIppons++;

    return { redWins, redIppons, whiteWins, whiteIppons };
  };

  const totals = calculateTotals();

  let matchStatus = '試合中';
  if (totals.redWins > totals.whiteWins) {
    matchStatus = `${teamRed}の勝ち`;
  } else if (totals.whiteWins > totals.redWins) {
    matchStatus = `${teamWhite}の勝ち`;
  } else if (totals.redWins === totals.whiteWins && totals.redWins > 0) {
    if (totals.redIppons > totals.whiteIppons) {
      matchStatus = `${teamRed}の勝ち（本数勝ち）`;
    } else if (totals.whiteIppons > totals.redIppons) {
      matchStatus = `${teamWhite}の勝ち（本数勝ち）`;
    } else {
      matchStatus = '引き分け（代表戦へ）';
    }
  }

  // 要望対応：データ一括クリア時に大会名、日付、チーム名もすべて空にする
  const handleClear = () => {
    if (window.confirm('大会名、チーム名、すべてのスコアをリセットしますか？')) {
      setTournamentName('');
      setMatchDate('');
      setTeamRed('');
      setTeamWhite('');
      setMatches(matches.map(m => ({
        ...m,
        redPlayer: '',
        whitePlayer: '',
        redPoint1: '-', redPoint2: '-', whitePoint1: '-', whitePoint2: '-', winner: '-'
      })));
      setDaihyoMatch({ redPlayer: '', whitePlayer: '', redPoint1: '-', redPoint2: '-', whitePoint1: '-', whitePoint2: '-', winner: '-' });
    }
  };

  // Excelコピー機能
  const handleCopyExcel = () => {
    const allPositions = ['先鋒', '次鋒', '中堅', '副将', '大将', '代表戦'];
    
    const allMatchData = [
      ...matches,
      { 
        redPlayer: daihyoMatch.redPlayer, 
        whitePlayer: daihyoMatch.whitePlayer, 
        redPoint1: daihyoMatch.redPoint1, 
        redPoint2: daihyoMatch.redPoint2, 
        whitePoint1: daihyoMatch.whitePoint1, 
        whitePoint2: daihyoMatch.whitePoint2, 
        winner: daihyoMatch.winner 
      }
    ];

    const titleLine = `大会名\t${tournamentName}\t日付\t${matchDate}`;
    const scoreLine = `赤チーム\t${teamRed} (${totals.redWins}/${totals.redIppons})\tVS\t白チーム\t${teamWhite} (${totals.whiteWins}/${totals.whiteIppons})\t【結果: ${matchStatus}】`;

    const posRow = `ポジション\t` + allPositions.join('\t') + `\t総合結果`;
    const redPlayerRow = `赤(${teamRed}) 選手\t` + allMatchData.map(m => m.redPlayer).join('\t') + `\t赤 ${totals.redWins}勝 ${totals.redIppons}本`;
    
    const redTech1Row = `赤 取得技(1本目)\t` + allMatchData.map(m => m.redPoint1).join('\t');
    const redTech2Row = `赤 取得技(2本目)\t` + allMatchData.map(m => m.redPoint2).join('\t');
    const whiteTech1Row = `白 取得技(1本目)\t` + allMatchData.map(m => m.whitePoint1).join('\t');
    const whiteTech2Row = `白 取得技(2本目)\t` + allMatchData.map(m => m.whitePoint2).join('\t');
    
    const whitePlayerRow = `白(${teamWhite}) 選手\t` + allMatchData.map(m => m.whitePlayer).join('\t') + `\t白 ${totals.whiteWins}勝 ${totals.whiteIppons}本`;
    const winRow = `勝敗\t` + allMatchData.map(m => m.winner).join('\t') + `\t${matchStatus}`;

    const textToCopy = [
      titleLine,
      scoreLine,
      '',
      posRow,
      redPlayerRow,
      redTech1Row,
      redTech2Row,
      whiteTech1Row,
      whiteTech2Row,
      whitePlayerRow,
      winRow
    ].join('\n');

    navigator.clipboard.writeText(textToCopy);
    alert('技の項目を分けてExcel用にデータをコピーしました！');
  };

  return (
    <div style={{ padding: '15px', fontFamily: 'sans-serif', maxWidth: '1050px', margin: '0 auto', background: '#fff', minHeight: '100vh' }}>
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff3cd', padding: '10px 15px', borderRadius: '8px', fontSize: '15px', fontWeight: 'bold', marginBottom: '15px', border: '1px solid #ffeeba' }}>
        <div>
          <span style={{ color: '#d9534f' }}>{teamRed || '赤チーム'}（赤）: {totals.redWins}勝 ({totals.redIppons}本)</span>
          <span style={{ margin: '0 10px' }}>—</span>
          <span style={{ color: '#0275d8' }}>{teamWhite || '白チーム'}（白）: {totals.whiteWins}勝 ({totals.whiteIppons}本)</span>
        </div>
        <div style={{ background: '#343a40', color: '#fff', padding: '4px 10px', borderRadius: '4px', fontSize: '14px' }}>
          判定: {matchStatus}
        </div>
      </div>

      <div style={{ overflowX: 'auto', marginBottom: '20px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '2px solid #333', minWidth: '950px', fontSize: '13px', background: '#fff' }}>
          <thead>
            <tr style={{ background: '#e9ecef', textAlign: 'center' }}>
              <th style={{ border: '1px solid #333', padding: '6px', width: '80px' }}>対戦</th>
              {['先鋒', '次鋒', '中堅', '副将', '大将', '代表戦'].map(pos => (
                <th key={pos} style={{ border: '1px solid #333', padding: '6px' }}>{pos}</th>
              ))}
              <th style={{ border: '1px solid #333', padding: '6px', width: '90px' }}>結果</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ border: '1px solid #333', padding: '6px', textAlign: 'center', background: '#fdf2f2', color: '#d9534f', fontWeight: 'bold' }}>
                赤: {teamRed}
              </td>
              {matches.map((m, idx) => (
                <td key={idx} style={{ border: '1px solid #333', padding: '4px', textAlign: 'center', background: '#fff5f5' }}>
                  <select value={m.redPlayer} onChange={e => {
                    const newMatches = [...matches];
                    newMatches[idx].redPlayer = e.target.value;
                    setMatches(newMatches);
                  }} style={{ width: '100%', padding: '4px', fontWeight: 'bold', color: '#d9534f' }}>
                    {redCandidates.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </td>
              ))}
              <td style={{ border: '1px solid #333', padding: '4px', textAlign: 'center', background: '#fff0f0' }}>
                <input
                  type="text"
                  value={daihyoMatch.redPlayer}
                  onChange={e => setDaihyoMatch({ ...daihyoMatch, redPlayer: e.target.value })}
                  placeholder="代表(赤)"
                  style={{ width: '100%', padding: '4px', fontWeight: 'bold', color: '#d9534f', textAlign: 'center', boxSizing: 'border-box' }}
                />
              </td>
              <td rowSpan={3} style={{ border: '1px solid #333', padding: '6px', textAlign: 'center', background: '#f8f9fa', verticalAlign: 'middle' }}>
                <div style={{ fontSize: '13px', color: '#d9534f', fontWeight: 'bold', marginBottom: '6px' }}>
                  赤 {totals.redWins} / {totals.redIppons}
                </div>
                <div style={{ fontSize: '13px', color: '#0275d8', fontWeight: 'bold' }}>
                  白 {totals.whiteWins} / {totals.whiteIppons}
                </div>
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
                    <select value={m.winner} onChange={e => handleWinnerChange(idx, e.target.value)} style={{ width: '100%', fontSize: '11px', padding: '3px', fontWeight: 'bold', background: m.winner === '赤勝ち' ? '#ffe3e3' : m.winner === '白勝ち' ? '#e7f5ff' : '#fff' }}>
                      {winnerOptions.map(w => <option key={w} value={w}>{w}</option>)}
                    </select>
                  </div>
                </td>
              ))}
              <td style={{ border: '1px solid #333', padding: '4px', textAlign: 'center', background: '#fafafa' }}>
                <div style={{ fontSize: '11px', marginBottom: '2px', color: '#d9534f' }}>赤技:</div>
                <div style={{ display: 'flex', gap: '2px', marginBottom: '4px' }}>
                  <select value={daihyoMatch.redPoint1} onChange={e => updateDaihyo('redPoint1', e.target.value)} style={{ width: '50%', fontSize: '11px', padding: '2px' }}>
                    {techOptions.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <select value={daihyoMatch.redPoint2} onChange={e => updateDaihyo('redPoint2', e.target.value)} style={{ width: '50%', fontSize: '11px', padding: '2px' }}>
                    {techOptions.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div style={{ fontSize: '11px', marginBottom: '2px', color: '#0275d8' }}>白技:</div>
                <div style={{ display: 'flex', gap: '2px', marginBottom: '4px' }}>
                  <select value={daihyoMatch.whitePoint1} onChange={e => updateDaihyo('whitePoint1', e.target.value)} style={{ width: '50%', fontSize: '11px', padding: '2px' }}>
                    {techOptions.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <select value={daihyoMatch.whitePoint2} onChange={e => updateDaihyo('whitePoint2', e.target.value)} style={{ width: '50%', fontSize: '11px', padding: '2px' }}>
                    {techOptions.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div style={{ marginTop: '4px' }}>
                  <select value={daihyoMatch.winner} onChange={e => setDaihyoMatch({ ...daihyoMatch, winner: e.target.value })} style={{ width: '100%', fontSize: '11px', padding: '3px', fontWeight: 'bold', background: daihyoMatch.winner === '赤勝ち' ? '#ffe3e3' : daihyoMatch.winner === '白勝ち' ? '#e7f5ff' : '#fff' }}>
                    {winnerOptions.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
              </td>
            </tr>

            <tr>
              <td style={{ border: '1px solid #333', padding: '6px', textAlign: 'center', background: '#f0f4f8', color: '#0275d8', fontWeight: 'bold' }}>
                白: {teamWhite}
              </td>
              {matches.map((m, idx) => (
                <td key={idx} style={{ border: '1px solid #333', padding: '4px', textAlign: 'center', background: '#f5f8fc' }}>
                  <input
                    type="text"
                    value={m.whitePlayer}
                    onChange={e => {
                      const newMatches = [...matches];
                      newMatches[idx].whitePlayer = e.target.value;
                      setMatches(newMatches);
                    }}
                    placeholder="選手名"
                    style={{ width: '100%', padding: '4px', fontWeight: 'bold', color: '#0275d8', textAlign: 'center', boxSizing: 'border-box' }}
                  />
                </td>
              ))}
              <td style={{ border: '1px solid #333', padding: '4px', textAlign: 'center', background: '#eef4fb' }}>
                <input
                  type="text"
                  value={daihyoMatch.whitePlayer}
                  onChange={e => setDaihyoMatch({ ...daihyoMatch, whitePlayer: e.target.value })}
                  placeholder="代表(白)"
                  style={{ width: '100%', padding: '4px', fontWeight: 'bold', color: '#0275d8', textAlign: 'center', boxSizing: 'border-box' }}
                />
              </td>
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