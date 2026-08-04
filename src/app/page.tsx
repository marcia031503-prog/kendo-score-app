"use client";

import React, { useState } from "react";

// 赤チームのデフォルトリスト（高川）
const DEFAULT_RED_MEMBERS = ["山本", "松田", "山内", "橋本", "安野", "重村"];
const POSITIONS = ["先鋒", "次鋒", "中堅", "副将", "大将", "代表戦"];

type MatchData = {
  redScores: string[];
  whiteScores: string[];
  resultOverride?: string;
};

export default function KendoScoreApp() {
  const [tournamentName, setTournamentName] = useState("");
  const [date, setDate] = useState("");
  const [whiteTeamName, setWhiteTeamName] = useState("");

  const [redPlayers, setRedPlayers] = useState<string[]>([...DEFAULT_RED_MEMBERS]);
  const [whitePlayers, setWhitePlayers] = useState<string[]>(["", "", "", "", "", ""]);

  const [matches, setMatches] = useState<MatchData[]>(
    POSITIONS.map(() => ({
      redScores: ["-", "-"],
      whiteScores: ["-", "-"],
      resultOverride: "",
    }))
  );

  const handleRedPlayerChange = (index: number, name: string) => {
    const updated = [...redPlayers];
    updated[index] = name;
    setRedPlayers(updated);
  };

  const handleWhitePlayerChange = (index: number, name: string) => {
    const updated = [...whitePlayers];
    updated[index] = name;
    setWhitePlayers(updated);
  };

  const handleScoreChange = (
    matchIndex: number,
    team: "red" | "white",
    slotIndex: number,
    value: string
  ) => {
    const newMatches = [...matches];
    if (team === "red") {
      newMatches[matchIndex].redScores[slotIndex] = value;
    } else {
      newMatches[matchIndex].whiteScores[slotIndex] = value;
    }
    setMatches(newMatches);
  };

  const handleResultOverrideChange = (matchIndex: number, value: string) => {
    const newMatches = [...matches];
    newMatches[matchIndex].resultOverride = value;
    setMatches(newMatches);
  };

  const getMatchResult = (match: MatchData) => {
    if (match.resultOverride && match.resultOverride !== "-") {
      return match.resultOverride;
    }

    const redValid = match.redScores.filter((s) => s !== "-" && s !== "反則" && s !== "不戦勝(○2つ)").length;
    const whiteValid = match.whiteScores.filter((s) => s !== "-" && s !== "反則" && s !== "不戦勝(○2つ)").length;

    const redFusen = match.redScores.includes("不戦勝(○2つ)");
    const whiteFusen = match.whiteScores.includes("不戦勝(○2つ)");

    if (redFusen) return "赤勝ち";
    if (whiteFusen) return "白勝ち";

    if (redValid > whiteValid) return "赤勝ち";
    if (whiteValid > redValid) return "白勝ち";

    return "引き分け";
  };

  let redTotalWins = 0;
  let redTotalIppon = 0;
  let whiteTotalWins = 0;
  let whiteTotalIppon = 0;

  matches.forEach((match) => {
    const res = getMatchResult(match);
    const redValid = match.redScores.filter((s) => s !== "-" && s !== "反則" && s !== "不戦勝(○2つ)").length;
    const whiteValid = match.whiteScores.filter((s) => s !== "-" && s !== "反則" && s !== "不戦勝(○2つ)").length;

    if (match.redScores.includes("不戦勝(○2つ)")) {
      redTotalIppon += 2;
    } else {
      redTotalIppon += redValid;
    }

    if (match.whiteScores.includes("不戦勝(○2つ)")) {
      whiteTotalIppon += 2;
    } else {
      whiteTotalIppon += whiteValid;
    }

    if (res === "赤勝ち") redTotalWins++;
    if (res === "白勝ち") whiteTotalWins++;
  });

  let overallStatus = "試合中";
  if (redTotalWins > whiteTotalWins) overallStatus = "赤チームの勝利";
  else if (whiteTotalWins > redTotalWins) overallStatus = "白チームの勝利";
  else if (redTotalWins === whiteTotalWins && redTotalIppon > whiteTotalIppon) overallStatus = "赤チームの勝利（本数勝ち）";
  else if (redTotalWins === whiteTotalWins && whiteTotalIppon > redTotalIppon) overallStatus = "白チームの勝利（本数勝ち）";

  const handleCopyForExcel = () => {
    let tsv = "大会名\t" + (tournamentName || "（未入力）") + "\t日付\t" + (date || "（未入力）") + "\n";
    tsv += "赤チーム\t高川\t白チーム\t" + (whiteTeamName || "（未入力）") + "\n";
    tsv += "結果\t高川 (" + redTotalWins + "勝 " + redTotalIppon + "本) - " + (whiteTeamName || "白チーム") + " (" + whiteTotalWins + "勝 " + whiteTotalIppon + "本) 【" + overallStatus + "】\n\n";

    tsv += "対戦\t" + POSITIONS.join("\t") + "\n";
    tsv += "赤: 高川\t" + POSITIONS.map((_, i) => redPlayers[i]).join("\t") + "\n";
    tsv += "技・結果\t" + POSITIONS.map((_, i) => {
      const r = getMatchResult(matches[i]);
      return "赤:[" + matches[i].redScores.join(",") + "] 白:[" + matches[i].whiteScores.join(",") + "] (" + r + ")";
    }).join("\t") + "\n";
    tsv += "白: " + (whiteTeamName || "白チーム") + "\t" + POSITIONS.map((_, i) => whitePlayers[i] || "（未入力）").join("\t") + "\n";

    navigator.clipboard.writeText(tsv).then(() => {
      alert("Excel用データをコピーしました！エクセルを開いてそのまま貼り付けられます。");
    });
  };

  const handleClear = () => {
    if (window.confirm("スコアをすべてクリアしますか？")) {
      setTournamentName("");
      setDate("");
      setWhiteTeamName("");
      setRedPlayers([...DEFAULT_RED_MEMBERS]);
      setWhitePlayers(["", "", "", "", "", ""]);
      setMatches(
        POSITIONS.map(() => ({
          redScores: ["-", "-"],
          whiteScores: ["-", "-"],
          resultOverride: "",
        }))
      );
    }
  };

  return (
    <main className="p-4 max-w-5xl mx-auto font-sans text-gray-800">
      <h1 className="text-xl font-bold mb-4 text-center flex items-center justify-center gap-2">
        <span>⚔️</span> 剣道団体戦 伝統スコアシート型
      </h1>

      <div className="bg-white p-4 rounded-lg shadow mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">大会名:</label>
          <input
            type="text"
            className="w-full border rounded p-2 text-sm"
            placeholder="例: 中国大会"
            value={tournamentName}
            onChange={(e) => setTournamentName(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-600 mb-1">日付:</label>
          <input
            type="text"
            className="w-full border rounded p-2 text-sm"
            placeholder="例: 2026年8月4日"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-red-600 mb-1">赤チーム (固定):</label>
          <div className="w-full border rounded p-2 text-sm bg-gray-50 font-bold text-red-700">
            高川
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold text-blue-600 mb-1">白チーム名:</label>
          <input
            type="text"
            className="w-full border rounded p-2 text-sm"
            placeholder="例: ○○高校"
            value={whiteTeamName}
            onChange={(e) => setWhiteTeamName(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-amber-100 border border-amber-300 p-3 rounded-lg shadow mb-4 flex flex-wrap justify-between items-center text-sm font-bold">
        <div>
          <span className="text-red-700">高川 (赤)</span> : {redTotalWins}勝 ({redTotalIppon}本) —{" "}
          <span className="text-blue-700">{whiteTeamName || "白チーム"} (白)</span> : {whiteTotalWins}勝 ({whiteTotalIppon}本)
        </div>
        <div className="bg-gray-800 text-white px-3 py-1 rounded text-xs">
          判定: {overallStatus}
        </div>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow mb-6">
        <table className="min-w-max w-full border-collapse text-center text-sm">
          <thead>
            <tr className="bg-gray-100 border-b">
              <th className="p-2 border-r w-24">対戦</th>
              {POSITIONS.map((pos, idx) => (
                <th key={idx} className="p-2 border-r min-w-[130px]">
                  {pos}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {/* 赤チーム選手行（プルダウン） */}
            <tr className="border-b bg-red-50/40">
              <td className="p-2 border-r font-semibold text-red-700">赤: 高川</td>
              {POSITIONS.map((_, i) => (
                <td key={i} className="p-2 border-r">
                  <select
                    className="w-full border rounded p-1 text-xs bg-white text-center font-medium"
                    value={redPlayers[i]}
                    onChange={(e) => handleRedPlayerChange(i, e.target.value)}
                  >
                    {DEFAULT_RED_MEMBERS.map((member, mIdx) => (
                      <option key={mIdx} value={member}>
                        {member}
                      </option>
                    ))}
                    {!DEFAULT_RED_MEMBERS.includes(redPlayers[i]) && (
                      <option value={redPlayers[i]}>{redPlayers[i]}</option>
                    )}
                  </select>
                </td>
              ))}
            </tr>

            {/* 技・判定行 */}
            <tr className="border-b bg-gray-50">
              <td className="p-2 border-r font-semibold text-gray-600">技・判定</td>
              {POSITIONS.map((_, i) => {
                const res = getMatchResult(matches[i]);
                return (
                  <td key={i} className="p-2 border-r text-xs space-y-2">
                    <div className="text-red-700 font-semibold">赤技:</div>
                    <div className="flex gap-1 justify-center">
                      <select
                        className="border rounded p-1 text-xs bg-white"
                        value={matches[i].redScores[0]}
                        onChange={(e) => handleScoreChange(i, "red", 0, e.target.value)}
                      >
                        <option value="-">-</option>
                        <option value="面">面</option>
                        <option value="小手">小手</option>
                        <option value="胴">胴</option>
                        <option value="突">突</option>
                        <option value="出ばな面">出ばな面</option>
                        <option value="相面">相面</option>
                        <option value="返し面">返し面</option>
                        <option value="引き面">引き面</option>
                        <option value="抜き面">抜き面</option>
                        <option value="出ばな小手">出ばな小手</option>
                        <option value="相小手">相小手</option>
                        <option value="返し胴">返し胴</option>
                        <option value="抜き胴">抜き胴</option>
                        <option value="反則">反則</option>
                        <option value="不戦勝(○2つ)">不戦勝(○2つ)</option>
                      </select>
                      <select
                        className="border rounded p-1 text-xs bg-white"
                        value={matches[i].redScores[1]}
                        onChange={(e) => handleScoreChange(i, "red", 1, e.target.value)}
                      >
                        <option value="-">-</option>
                        <option value="面">面</option>
                        <option value="小手">小手</option>
                        <option value="胴">胴</option>
                        <option value="突">突</option>
                        <option value="出ばな面">出ばな面</option>
                        <option value="相面">相面</option>
                        <option value="返し面">返し面</option>
                        <option value="引き面">引き面</option>
                        <option value="抜き面">抜き面</option>
                        <option value="出ばな小手">出ばな小手</option>
                        <option value="相小手">相小手</option>
                        <option value="返し胴">返し胴</option>
                        <option value="抜き胴">抜き胴</option>
                        <option value="反則">反則</option>
                        <option value="不戦勝(○2つ)">不戦勝(○2つ)</option>
                      </select>
                    </div>

                    <div className="text-blue-700 font-semibold pt-1">白技:</div>
                    <div className="flex gap-1 justify-center">
                      <select
                        className="border rounded p-1 text-xs bg-white"
                        value={matches[i].whiteScores[0]}
                        onChange={(e) => handleScoreChange(i, "white", 0, e.target.value)}
                      >
                        <option value="-">-</option>
                        <option value="面">面</option>
                        <option value="小手">小手</option>
                        <option value="胴">胴</option>
                        <option value="突">突</option>
                        <option value="出ばな面">出ばな面</option>
                        <option value="相面">相面</option>
                        <option value="返し面">返し面</option>
                        <option value="引き面">引き面</option>
                        <option value="抜き面">抜き面</option>
                        <option value="出ばな小手">出ばな小手</option>
                        <option value="相小手">相小手</option>
                        <option value="返し胴">返し胴</option>
                        <option value="抜き胴">抜き胴</option>
                        <option value="反則">反則</option>
                        <option value="不戦勝(○2つ)">不戦勝(○2つ)</option>
                      </select>
                      <select
                        className="border rounded p-1 text-xs bg-white"
                        value={matches[i].whiteScores[1]}
                        onChange={(e) => handleScoreChange(i, "white", 1, e.target.value)}
                      >
                        <option value="-">-</option>
                        <option value="面">面</option>
                        <option value="小手">小手</option>
                        <option value="胴">胴</option>
                        <option value="突">突</option>
                        <option value="出ばな面">出ばな面</option>
                        <option value="相面">相面</option>
                        <option value="返し面">返し面</option>
                        <option value="引き面">引き面</option>
                        <option value="抜き面">抜き面</option>
                        <option value="出ばな小手">出ばな小手</option>
                        <option value="相小手">相小手</option>
                        <option value="返し胴">返し胴</option>
                        <option value="抜き胴">抜き胴</option>
                        <option value="反則">反則</option>
                        <option value="不戦勝(○2つ)">不戦勝(○2つ)</option>
                      </select>
                    </div>

                    <div className="pt-1 border-t mt-1">
                      <select
                        className="w-full border rounded p-1 text-xs font-bold bg-amber-50"
                        value={matches[i].resultOverride || res}
                        onChange={(e) => handleResultOverrideChange(i, e.target.value)}
                      >
                        <option value="引き分け">引き分け</option>
                        <option value="赤勝ち">赤勝ち</option>
                        <option value="白勝ち">白勝ち</option>
                      </select>
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* 白チーム選手行（自由入力テキストボックス） */}
            <tr className="bg-blue-50/40">
              <td className="p-2 border-r font-semibold text-blue-700">白: {whiteTeamName || "チーム名"}</td>
              {POSITIONS.map((_, i) => (
                <td key={i} className="p-2 border-r">
                  <input
                    type="text"
                    className="w-full border rounded p-1 text-xs bg-white text-center font-medium"
                    placeholder="選手名入力"
                    value={whitePlayers[i]}
                    onChange={(e) => handleWhitePlayerChange(i, e.target.value)}
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={handleCopyForExcel}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow flex items-center justify-center gap-2 transition"
        >
          <span>📋</span> 伝統スコア形式でExcel用データをコピー
        </button>
        <button
          onClick={handleClear}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow flex items-center justify-center gap-2 transition"
        >
          <span>🗑️</span> スコアをクリア
        </button>
      </div>
    </main>
  );
}