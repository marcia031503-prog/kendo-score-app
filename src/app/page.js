'use client';
import { useState } from 'react';

const TEAM_MEMBERS = ['山本', '松田', '山内', '橋本', '安野', '重村'];

export default function Home() {
  const [mode, setMode] = useState('team'); // 'team' or 'individual'

  // 左側の枠（自分側・赤）用：基本技のみ
  const basicTechniques = ['-', '面', '小手', '胴', '突', '反則', '不戦勝(○2つ)'];

  // 右側の枠（相手側・白）用：詳細技のみ（左側の基本技は除外）
  const detailedTechniques = [
    '-',
    '飛び込み面', '飛び込み小手', '飛び込み胴',
    '引き面', '引き小手', '引き胴',
    '片手面', '片手小手', '片手胴',
    '裏面', '裏小手', '裏胴',
    '返し胴', '抜き面', '出頭面', '逆胴', '出面', 'コテ', 'ドウ', 'ツキ',
    '相面', '出小手', '出ばな面', 'おさえて面', '後うち', '相小手面'
  ];

  const [teamInfo, setTeamInfo] = useState({
    tournament: '',
    date: '',
    opponentTeam: '',
  });

  const [positions] = useState(['先鋒', '次鋒', '中堅', '副将', '大将', '代表戦']);
  const [teamPlayers, setTeamPlayers] = useState(['山本', '松田', '山内', '橋本', '安野', '重村']);
  const [opponentPlayers, setOpponentPlayers] = useState(['', '', '', '', '', '']);
  const [teamMatches, setTeamMatches] = useState(
    Array(6).fill(null).map(() => ({ redTechnique1: '-', redTechnique2: '-', whiteTechnique1: '-', whiteTechnique2: '-', result: '引き分け' }))
  );

  const [indMatches, setIndMatches] = useState([
    { round: '1回戦', playerName: '安野', myTechnique1: '-', myTechnique2: '-', opponentSchool: '', opponentName: '', oppTechnique1: '-', oppTechnique2: '-', result: '引き分け' }
  ]);
  const [indInfo, setIndInfo] = useState({
    tournament: '',
    date: '',
  });

  // Excel用（タブ区切り・横一列）のコピー機能
  const copyTeamToExcel = () => {
    let rowsToCopy = [];
    teamMatches.forEach((match, index) => {
      const posName = positions[index];
      const myName = teamPlayers[index];
      const oppName = opponentPlayers[index] || '（相手なし）';
      const redTechs = `${match.redTechnique1}${match.redTechnique2 !== '-' ? '・' + match.redTechnique2 : ''}`;
      const whiteTechs = `${match.whiteTechnique1}${match.whiteTechnique2 !== '-' ? '・' + match.whiteTechnique2 : ''}`;
      
      const rowData = [
        teamInfo.tournament || '大会名未入力',
        teamInfo.date || '日付未入力',
        posName,
        myName,
        redTechs,
        teamInfo.opponentTeam || '対戦校未入力',
        oppName,
        whiteTechs,
        match.result
      ].join('\t');

      rowsToCopy.push(rowData);
    });

    navigator.clipboard.writeText(rowsToCopy.join('\n'));
    alert('団体戦データをExcel用にコピーしました！');
  };

  const copyIndToExcel = () => {
    let rowsToCopy = [];
    indMatches.forEach((m) => {
      const myTechs = `${m.myTechnique1}${m.myTechnique2 !== '-' ? '・' + m.myTechnique2 : ''}`;
      const oppTechs = `${m.oppTechnique1}${m.oppTechnique2 !== '-' ? '・' + m.oppTechnique2 : ''}`;

      const rowData = [
        indInfo.tournament || '大会名未入力',
        indInfo.date || '日付未入力',
        m.round,
        m.playerName,
        myTechs,
        m.opponentSchool || '相手校未入力',
        m.opponentName || '相手選手未入力',
        oppTechs,
        m.result
      ].join('\t');

      rowsToCopy.push(rowData);
    });

    navigator.clipboard.writeText(rowsToCopy.join('\n'));
    alert('個人戦データをExcel用にコピーしました！');
  };

  // チームの勝敗計算
  const redWins = teamMatches.filter(m => m.result === '赤勝ち').length;
  const whiteWins = teamMatches.filter(m => m.result === '白勝ち').length;
  let matchStatus = '試合中';
  if (redWins > whiteWins) matchStatus = '高川リード';
  else if (whiteWins > redWins) matchStatus = '相手チームリード';
  else if (teamMatches.every(m => m.result !== '引き分け')) matchStatus = '引き分け';

  return (
    <main className="min-h-screen bg-slate-50 p-4 pb-20 font-sans text-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold text-center flex items-center justify-center gap-2">
          <span>⚔️</span> 剣道スコア管理アプリ
        </h1>

        <div className="flex justify-center gap-2">
          <button
            onClick={() => setMode('team')}
            className={`px-5 py-2.5 rounded-lg font-bold shadow transition ${
              mode === 'team' ? 'bg-red-600 text-white' : 'bg-white text-slate-700 border'
            }`}
          >
            🛡️ 団体戦モード
          </button>
          <button
            onClick={() => setMode('individual')}
            className={`px-5 py-2.5 rounded-lg font-bold shadow transition ${
              mode === 'individual' ? 'bg-red-600 text-white' : 'bg-white text-slate-700 border'
            }`}
          >
            👤 個人戦モード
          </button>
        </div>

        {mode === 'team' && (
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">大会名:</label>
                <input
                  type="text"
                  placeholder="例: 中国大会"
                  value={teamInfo.tournament}
                  onChange={(e) => setTeamInfo({...teamInfo, tournament: e.target.value})}
                  className="w-full border rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">日付:</label>
                <input
                  type="text"
                  placeholder="例: 2026年8月4日"
                  value={teamInfo.date}
                  onChange={(e) => setTeamInfo({...teamInfo, date: e.target.value})}
                  className="w-full border rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">白チーム名 (手入力):</label>
                <input
                  type="text"
                  placeholder="例: ○○高校"
                  value={teamInfo.opponentTeam}
                  onChange={(e) => setTeamInfo({...teamInfo, opponentTeam: e.target.value})}
                  className="w-full border rounded-lg p-2"
                />
              </div>
            </div>

            {/* スコア概要 */}
            <div className="bg-slate-100 p-3 rounded-lg text-center font-bold text-slate-700 flex justify-around items-center">
              <span>高川 (赤) : <strong className="text-red-600 text-lg">{redWins}</strong> 勝</span>
              <span className="bg-white px-3 py-1 rounded shadow-sm text-sm">判定: {matchStatus}</span>
              <span>{teamInfo.opponentTeam || '白チーム'} (白) : <strong className="text-blue-600 text-lg">{whiteWins}</strong> 勝</span>
            </div>

            {/* 横並びテーブル形式の団体戦表 */}
            <div className="overflow-x-auto border rounded-xl shadow-sm">
              <table className="w-full text-left border-collapse bg-white text-sm">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 border-b">
                    <th className="p-3 font-bold border-r w-28">対戦</th>
                    {positions.map(pos => (
                      <th key={pos} className="p-3 font-bold text-center border-r">{pos}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* 赤チーム行（左側：基本技のみ） */}
                  <tr className="border-b bg-red-50/20">
                    <td className="p-3 font-bold text-red-700 border-r bg-red-50/60">赤: 高川</td>
                    {positions.map((pos, index) => (
                      <td key={pos} className="p-3 border-r align-top space-y-2">
                        <select
                          value={teamPlayers[index]}
                          onChange={(e) => {
                            const newP = [...teamPlayers];
                            newP[index] = e.target.value;
                            setTeamPlayers(newP);
                          }}
                          className="w-full border rounded p-1.5 bg-white font-medium text-xs"
                        >
                          {TEAM_MEMBERS.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                        <div className="text-[10px] text-slate-500 font-bold">赤技（基本技）:</div>
                        <div className="flex gap-1">
                          <select
                            value={teamMatches[index].redTechnique1}
                            onChange={(e) => {
                              const newM = [...teamMatches];
                              newM[index].redTechnique1 = e.target.value;
                              setTeamMatches(newM);
                            }}
                            className="w-1/2 border rounded p-1 bg-white text-xs"
                          >
                            {basicTechniques.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                          <select
                            value={teamMatches[index].redTechnique2}
                            onChange={(e) => {
                              const newM = [...teamMatches];
                              newM[index].redTechnique2 = e.target.value;
                              setTeamMatches(newM);
                            }}
                            className="w-1/2 border rounded p-1 bg-white text-xs"
                          >
                            {basicTechniques.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* 白チーム行（右側：詳細技のみ） */}
                  <tr className="border-b bg-slate-50/20">
                    <td className="p-3 font-bold text-slate-700 border-r bg-slate-100">白: 相手</td>
                    {positions.map((pos, index) => (
                      <td key={pos} className="p-3 border-r align-top space-y-2">
                        <input
                          type="text"
                          placeholder="選手名"
                          value={opponentPlayers[index]}
                          onChange={(e) => {
                            const newOp = [...opponentPlayers];
                            newOp[index] = e.target.value;
                            setOpponentPlayers(newOp);
                          }}
                          className="w-full border rounded p-1.5 bg-white text-xs"
                        />
                        <div className="text-[10px] text-slate-500 font-bold">白技（詳細技）:</div>
                        <div className="flex gap-1">
                          <select
                            value={teamMatches[index].whiteTechnique1}
                            onChange={(e) => {
                              const newM = [...teamMatches];
                              newM[index].whiteTechnique1 = e.target.value;
                              setTeamMatches(newM);
                            }}
                            className="w-1/2 border rounded p-1 bg-white text-xs"
                          >
                            {detailedTechniques.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                          <select
                            value={teamMatches[index].whiteTechnique2}
                            onChange={(e) => {
                              const newM = [...teamMatches];
                              newM[index].whiteTechnique2 = e.target.value;
                              setTeamMatches(newM);
                            }}
                            className="w-1/2 border rounded p-1 bg-white text-xs"
                          >
                            {detailedTechniques.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                      </td>
                    ))}
                  </tr>

                  {/* 試合結果行 */}
                  <tr className="bg-slate-100/60">
                    <td className="p-3 font-bold text-slate-700 border-r">勝敗結果</td>
                    {positions.map((pos, index) => (
                      <td key={pos} className="p-3 border-r text-center">
                        <select
                          value={teamMatches[index].result}
                          onChange={(e) => {
                            const newM = [...teamMatches];
                            newM[index].result = e.target.value;
                            setTeamMatches(newM);
                          }}
                          className="w-full border rounded p-1 bg-white text-xs font-bold text-center"
                        >
                          <option value="引き分け">引き分け</option>
                          <option value="赤勝ち">赤勝ち</option>
                          <option value="白勝ち">白勝ち</option>
                        </select>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                onClick={copyTeamToExcel}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow transition flex items-center justify-center gap-2"
              >
                <span>📋</span> 団体戦のExcel用データをコピー
              </button>
              <button
                onClick={() => {
                  if (confirm('入力をクリアしますか？')) {
                    setTeamMatches(Array(6).fill(null).map(() => ({ redTechnique1: '-', redTechnique2: '-', whiteTechnique1: '-', whiteTechnique2: '-', result: '引き分け' })));
                    setOpponentPlayers(['', '', '', '', '', '']);
                  }
                }}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3 px-4 rounded-xl transition text-sm"
              >
                🗑️ 入力をクリア
              </button>
            </div>
          </div>
        )}

        {mode === 'individual' && (
          <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">個人戦 大会名:</label>
                <input
                  type="text"
                  placeholder="例: 県高校個人選手権"
                  value={indInfo.tournament}
                  onChange={(e) => setIndInfo({...indInfo, tournament: e.target.value})}
                  className="w-full border rounded-lg p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-600 mb-1">日付:</label>
                <input
                  type="text"
                  placeholder="例: 2026年8月4日"
                  value={indInfo.date}
                  onChange={(e) => setIndInfo({...indInfo, date: e.target.value})}
                  className="w-full border rounded-lg p-2"
                />
              </div>
            </div>

            <div className="space-y-4">
              {indMatches.map((m, index) => (
                <div key={index} className="border rounded-xl p-4 bg-slate-50/50 space-y-4 relative">
                  <div className="flex justify-between items-center border-b pb-2">
                    <div className="flex items-center gap-2">
                      <select
                        value={m.round}
                        onChange={(e) => {
                          const newM = [...indMatches];
                          newM[index].round = e.target.value;
                          setIndMatches(newM);
                        }}
                        className="border rounded p-1 bg-white font-bold text-sm"
                      >
                        {['1回戦', '2回戦', '3回戦', '4回戦', '準々決勝', '準決勝', '決勝'].map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                      <span className="text-xs font-bold text-slate-500">試合 #{index + 1}</span>
                    </div>
                    {indMatches.length > 1 && (
                      <button
                        onClick={() => {
                          const newM = indMatches.filter((_, i) => i !== index);
                          setIndMatches(newM);
                        }}
                        className="text-red-500 hover:text-red-700 text-xs font-bold"
                      >
                        削除
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 自分側（左側・基本技のみ） */}
                    <div className="bg-red-50/40 p-3 rounded-lg border border-red-100 space-y-3">
                      <div>
                        <label className="block text-xs font-bold text-red-700 mb-1">高川 選手:</label>
                        <select
                          value={m.playerName}
                          onChange={(e) => {
                            const newM = [...indMatches];
                            newM[index].playerName = e.target.value;
                            setIndMatches(newM);
                          }}
                          className="w-full border rounded p-1.5 bg-white font-medium text-sm"
                        >
                          {TEAM_MEMBERS.map(mem => <option key={mem} value={mem}>{mem}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">自分の技（基本技のみ）:</label>
                        <div className="flex gap-2">
                          <select
                            value={m.myTechnique1}
                            onChange={(e) => {
                              const newM = [...indMatches];
                              newM[index].myTechnique1 = e.target.value;
                              setIndMatches(newM);
                            }}
                            className="w-1/2 border rounded p-1.5 bg-white text-sm"
                          >
                            {basicTechniques.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                          <select
                            value={m.myTechnique2}
                            onChange={(e) => {
                              const newM = [...indMatches];
                              newM[index].myTechnique2 = e.target.value;
                              setIndMatches(newM);
                            }}
                            className="w-1/2 border rounded p-1.5 bg-white text-sm"
                          >
                            {basicTechniques.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* 相手側（右側・詳細技のみ） */}
                    <div className="bg-slate-100 p-3 rounded-lg border border-slate-200 space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">相手校名:</label>
                          <input
                            type="text"
                            placeholder="例: ○○高校"
                            value={m.opponentSchool}
                            onChange={(e) => {
                              const newM = [...indMatches];
                              newM[index].opponentSchool = e.target.value;
                              setIndMatches(newM);
                            }}
                            className="w-full border rounded p-1.5 bg-white text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">相手選手名:</label>
                          <input
                            type="text"
                            placeholder="例: 佐藤"
                            value={m.opponentName}
                            onChange={(e) => {
                              const newM = [...indMatches];
                              newM[index].opponentName = e.target.value;
                              setIndMatches(newM);
                            }}
                            className="w-full border rounded p-1.5 bg-white text-sm"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-600 mb-1">相手の技（詳細技のみ）:</label>
                        <div className="flex gap-2">
                          <select
                            value={m.oppTechnique1}
                            onChange={(e) => {
                              const newM = [...indMatches];
                              newM[index].oppTechnique1 = e.target.value;
                              setIndMatches(newM);
                            }}
                            className="w-1/2 border rounded p-1.5 bg-white text-sm"
                          >
                            {detailedTechniques.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                          <select
                            value={m.oppTechnique2}
                            onChange={(e) => {
                              const newM = [...indMatches];
                              newM[index].oppTechnique2 = e.target.value;
                              setIndMatches(newM);
                            }}
                            className="w-1/2 border rounded p-1.5 bg-white text-sm"
                          >
                            {detailedTechniques.map(t => <option key={t} value={t}>{t}</option>)}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <span className="text-sm font-bold text-slate-700">判定結果:</span>
                    <select
                      value={m.result}
                      onChange={(e) => {
                        const newM = [...indMatches];
                        newM[index].result = e.target.value;
                        setIndMatches(newM);
                      }}
                      className="border rounded p-1.5 bg-white font-bold text-sm w-40"
                    >
                      <option value="勝ち">勝ち</option>
                      <option value="負け">負け</option>
                      <option value="引き分け">引き分け</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => setIndMatches([...indMatches, { round: '2回戦', playerName: '安野', myTechnique1: '-', myTechnique2: '-', opponentSchool: '', opponentName: '', oppTechnique1: '-', oppTechnique2: '-', result: '引き分け' }])}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-2 px-4 rounded-xl text-sm transition"
              >
                ＋ 次の試合（回戦）を追加する
              </button>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                onClick={copyIndToExcel}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl shadow transition flex items-center justify-center gap-2"
              >
                <span>📋</span> 個人戦のデータをExcel用にコピー
              </button>
              <button
                onClick={() => {
                  if (confirm('個人戦の入力をクリアしますか？')) {
                    setIndMatches([{ round: '1回戦', playerName: '安野', myTechnique1: '-', myTechnique2: '-', opponentSchool: '', opponentName: '', oppTechnique1: '-', oppTechnique2: '-', result: '引き分け' }]);
                  }
                }}
                className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold py-3 px-4 rounded-xl transition text-sm"
              >
                🗑️ クリア
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}