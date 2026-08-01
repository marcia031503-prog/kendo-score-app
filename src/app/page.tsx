"use client";

import React, { useState, useEffect } from "react";

// ポジション定義
const POSITIONS = ["先鋒", "次鋒", "中堅", "副将", "大将"];

// 技・決まり手オプション
const WAZA_OPTIONS = [
  "面", "出ばな面", "相面", "返し面", "引き面", "抜き面",
  "胴", "返し胴", "抜き胴",
  "小手", "出ばな小手", "相小手",
  "突",
  "反則"
];

// 赤側・白側それぞれの得点選択肢
const IPPON_OPTIONS = ["-", "赤:メ", "赤:ド", "赤:コ", "赤:ツ", "赤:▲", "白:メ", "白:ド", "白:コ", "白:ツ", "白:▲"];

interface PlayerScore {
  ippon1: string;
  ippon2: string;
  waza1: string;
  waza2: string;
}

export default function KendoScoreApp() {
  const [tournament, setTournament] = useState("山県中学校剣道選手権大会");
  const [date, setDate] = useState("2026-07-19");
  const [redTeam, setRedTeam] = useState("高川");
  const [whiteTeam, setWhiteTeam] = useState("川中");

  // 選手名
  const [redPlayers, setRedPlayers] = useState(["高川", "山本", "嶋内", "安野", "吉田"]);
  const [whitePlayers, setWhitePlayers] = useState(["川中", "因分", "小倉", "岡本", "河田"]);

  // 各対戦の記録データ
  const [scores, setScores] = useState<PlayerScore[]>(
    POSITIONS.map(() => ({ ippon1: "-", ippon2: "-", waza1: "", waza2: "" }))
  );

  // タイマー用の状態（秒単位）
  const [timeLeft, setTimeLeft] = useState(240); // 初期値 4分 (240秒)
  const [isRunning, setIsRunning] = useState(false);

  // タイマーのカウントダウン処理
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  // 秒を「分:秒」にフォーマット
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  // 得点や技の更新
  const updateScore = (index: number, field: keyof PlayerScore, value: string) => {
    const newScores = [...scores];
    newScores[index] = { ...newScores[index], [field]: value };
    setScores(newScores);
  };

  // スコアのリセット
  const resetScores = () => {
    if (confirm("スコア入力をリセットして初期化しますか？")) {
      setScores(POSITIONS.map(() => ({ ippon1: "-", ippon2: "-", waza1: "", waza2: "" })));
    }
  };

  // 1試合の勝敗判定
  const getMatchResult = (s: PlayerScore) => {
    const redCount = [s.ippon1, s.ippon2].filter((v) => v.startsWith("赤:")).length;
    const whiteCount = [s.ippon1, s.ippon2].filter((v) => v.startsWith("白:")).length;

    let resultText = "";
    if (s.ippon1 === "-" && s.ippon2 === "-") {
      resultText = "";
    } else if (redCount > whiteCount) {
      resultText = "勝";
    } else if (whiteCount > redCount) {
      resultText = "負";
    } else {
      resultText = "分";
    }

    return { redCount, whiteCount, resultText };
  };

  // チーム全体の集計
  let redWins = 0;
  let redTotalIppon = 0;
  let whiteWins = 0;
  let whiteTotalIppon = 0;

  scores.forEach((s) => {
    const res = getMatchResult(s);
    redTotalIppon += res.redCount;
    whiteTotalIppon += res.whiteCount;
    if (res.resultText === "勝") redWins += 1;
    if (res.resultText === "負") whiteWins += 1;
  });

  // Excelコピー機能
  const copyToExcel = () => {
    let tsv = `大会名\t${tournament}\t日付\t${date}\n`;
    tsv += `赤チーム\t${redTeam}\t白チーム\t${whiteTeam}\n`;
    tsv += `赤結果\t${redWins}勝 (${redTotalIppon}本)\t白結果\t${whiteWins}勝 (${whiteTotalIppon}本)\n\n`;
    tsv += `ポジション\t赤選手\t一本目\t二本目\t勝敗\t詳細技1\t詳細技2\t白選手\n`;

    POSITIONS.forEach((pos, idx) => {
      const s = scores[idx];
      const res = getMatchResult(s);
      tsv += `${pos}\t${redPlayers[idx]}\t${s.ippon1}\t${s.ippon2}\t${res.resultText}\t${s.waza1}\t${s.waza2}\t${whitePlayers[idx]}\n`;
    });

    navigator.clipboard.writeText(tsv);
    alert("Excel貼り付け用データをコピーしました！");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-8 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-xl shadow-md border border-slate-200">
        <h1 className="text-2xl font-bold text-center text-slate-800 mb-6">
          ⚔️ 剣道団体戦 スコア記録シート
        </h1>

        {/* 試合タイマーエリア */}
        <div className="bg-slate-800 text-white p-4 rounded-xl mb-6 text-center shadow-inner">
          <div className="text-xs text-slate-400 mb-1">試合時間タイマー</div>
          <div className="text-4xl font-mono font-bold tracking-widest mb-3">
            {formatTime(timeLeft)}
          </div>
          <div className="flex justify-center gap-2">
            <button
              onClick={() => setIsRunning(!isRunning)}
              className={`px-4 py-1.5 rounded font-bold text-sm ${
                isRunning ? "bg-amber-500 hover:bg-amber-600" : "bg-emerald-500 hover:bg-emerald-600"
              }`}
            >
              {isRunning ? "一時停止" : "スタート"}
            </button>
            <button
              onClick={() => {
                setIsRunning(false);
                setTimeLeft(240);
              }}
              className="bg-slate-600 hover:bg-slate-700 px-3 py-1.5 rounded text-sm"
            >
              4分リセット
            </button>
            <button
              onClick={() => {
                setIsRunning(false);
                setTimeLeft(180);
              }}
              className="bg-slate-600 hover:bg-slate-700 px-3 py-1.5 rounded text-sm"
            >
              3分リセット
            </button>
          </div>
        </div>

        {/* 大会基本情報 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 bg-slate-100 p-4 rounded-lg">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">大会名</label>
            <input
              type="text"
              value={tournament}
              onChange={(e) => setTournament(e.target.value)}
              className="w-full p-2 border rounded bg-white text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">日付</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border rounded bg-white text-sm"
            />
          </div>
        </div>

        {/* チーム総合スコア表示バナー */}
        <div className="flex justify-between items-center bg-amber-50 border border-amber-200 p-4 rounded-lg mb-6 text-center">
          <div className="text-lg font-bold text-red-600">
            {redTeam}（赤）: <span className="text-2xl font-black">{redWins}</span> 勝 (<span className="font-bold">{redTotalIppon}</span>本)
          </div>
          <div className="text-xl font-bold text-slate-400">VS</div>
          <div className="text-lg font-bold text-slate-700">
            {whiteTeam}（白）: <span className="text-2xl font-black">{whiteWins}</span> 勝 (<span className="font-bold">{whiteTotalIppon}</span>本)
          </div>
        </div>

        {/* スコアテーブル */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse border border-slate-300 text-sm text-center">
            <thead>
              <tr className="bg-slate-200">
                <th className="border p-2 w-16">ポジション</th>
                <th className="border p-2 text-red-600">赤選手</th>
                <th className="border p-2 w-28">一本目</th>
                <th className="border p-2 w-28">二本目</th>
                <th className="border p-2 w-16">勝敗</th>
                <th className="border p-2 w-28">詳細技1</th>
                <th className="border p-2 w-28">詳細技2</th>
                <th className="border p-2 text-slate-600">白選手</th>
              </tr>
            </thead>
            <tbody>
              {POSITIONS.map((pos, i) => {
                const matchRes = getMatchResult(scores[i]);
                return (
                  <tr key={pos} className="hover:bg-slate-50">
                    <td className="border p-2 font-bold bg-slate-100">{pos}</td>
                    <td className="border p-1">
                      <input
                        type="text"
                        value={redPlayers[i]}
                        onChange={(e) => {
                          const newP = [...redPlayers];
                          newP[i] = e.target.value;
                          setRedPlayers(newP);
                        }}
                        className="w-full text-center border-b focus:outline-none"
                      />
                    </td>
                    <td className="border p-1">
                      <select
                        value={scores[i].ippon1}
                        onChange={(e) => updateScore(i, "ippon1", e.target.value)}
                        className="w-full p-1 border rounded text-xs"
                      >
                        {IPPON_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </td>
                    <td className="border p-1">
                      <select
                        value={scores[i].ippon2}
                        onChange={(e) => updateScore(i, "ippon2", e.target.value)}
                        className="w-full p-1 border rounded text-xs"
                      >
                        {IPPON_OPTIONS.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </td>
                    <td className="border p-1 font-bold">
                      <span className={
                        matchRes.resultText === "勝" ? "text-red-600 font-bold text-base" :
                        matchRes.resultText === "負" ? "text-blue-600 font-bold text-base" : "text-slate-500"
                      }>
                        {matchRes.resultText || "-"}
                      </span>
                    </td>
                    <td className="border p-1">
                      <select
                        value={scores[i].waza1}
                        onChange={(e) => updateScore(i, "waza1", e.target.value)}
                        className="w-full p-1 border rounded text-xs"
                      >
                        <option value="">(詳細なし)</option>
                        {WAZA_OPTIONS.map((w) => (
                          <option key={w} value={w}>{w}</option>
                        ))}
                      </select>
                    </td>
                    <td className="border p-1">
                      <select
                        value={scores[i].waza2}
                        onChange={(e) => updateScore(i, "waza2", e.target.value)}
                        className="w-full p-1 border rounded text-xs"
                      >
                        <option value="">(詳細なし)</option>
                        {WAZA_OPTIONS.map((w) => (
                          <option key={w} value={w}>{w}</option>
                        ))}
                      </select>
                    </td>
                    <td className="border p-1">
                      <input
                        type="text"
                        value={whitePlayers[i]}
                        onChange={(e) => {
                          const newP = [...whitePlayers];
                          newP[i] = e.target.value;
                          setWhitePlayers(newP);
                        }}
                        className="w-full text-center border-b focus:outline-none"
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ボタンエリア */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 text-center">
          <button
            onClick={copyToExcel}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-lg shadow transition transform active:scale-95"
          >
            📋 Excel貼り付け用データをコピー
          </button>
          <button
            onClick={resetScores}
            className="bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-6 rounded-lg shadow transition transform active:scale-95"
          >
            🗑️ スコアをクリア
          </button>
        </div>
      </div>
    </div>
  );
}