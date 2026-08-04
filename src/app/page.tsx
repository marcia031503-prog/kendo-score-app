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

// 個人戦データの型
type IndividualMatch = {
  round: string;          // 回戦 (例: 1回戦, 準決勝 など)
  myPlayer: string;       // 高川の我が子の名前（選択）
  opponentName: string;   // 相手選手名（手入力）
  opponentSchool: string; // 相手校名（手入力）
  myScores: string[];     // 自分の技 (2本分)
  oppScores: string[];    // 相手の技 (2本分)
  resultOverride: string;
};

export default function KendoScoreApp() {
  // モード切り替え: "team" (団体戦) または "individual" (個人戦)
  const [activeTab, setActiveTab] = useState<"team" | "individual">("team");

  // --- 団体戦用の状態 ---
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

  // --- 個人戦用の状態（我が子専用） ---
  const [indivTournament, setIndivTournament] = useState("");
  const [indivDate, setIndivDate] = useState("");
  const [individualMatches, setIndividualMatches] = useState<IndividualMatch[]>([
    {
      round: "1回戦",
      myPlayer: DEFAULT_RED_MEMBERS[0],
      opponentName: "",
      opponentSchool: "",
      myScores: ["-", "-"],
      oppScores: ["-", "-"],
      resultOverride: "引き分け",
    },
  ]);

  // 団体戦の変更ハンドラー
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

    if (match.redScores.includes("不戦勝(○2つ)")) return "赤勝ち";
    if (match.whiteScores.includes("不戦勝(○2つ)")) return "白勝ち";

    if (redValid > whiteValid) return "赤勝ち";
    if (whiteValid > redValid) return "白勝ち";
    return "引き分け";
  };

  // 団体戦トータル計算
  let redTotalWins = 0;
  let redTotalIppon = 0;
  let whiteTotalWins = 0;
  let whiteTotalIppon = 0;

  matches.forEach((match) => {
    const res = getMatchResult(match);
    const redValid = match.redScores.filter((s) => s !== "-" && s !== "反則" && s !== "不戦勝(○2つ)").length;
    const whiteValid = match.whiteScores.filter((s) => s !== "-" && s !== "反則" && s !== "不戦勝(○2つ)").length;

    if (match.redScores.includes("不戦勝(○2つ)")) redTotalIppon += 2;
    else redTotalIppon += redValid;

    if (match.whiteScores.includes("不戦勝(○2つ)")) whiteTotalIppon += 2;
    else whiteTotalIppon += whiteValid;

    if (res === "赤勝ち") redTotalWins++;
    if (res === "白勝ち") whiteTotalWins++;
  });

  let overallStatus = "試合中";
  if (redTotalWins > whiteTotalWins) overallStatus = "赤チームの勝利";
  else if (whiteTotalWins > redTotalWins) overallStatus = "白チームの勝利";
  else if (redTotalWins === whiteTotalWins && redTotalIppon > whiteTotalIppon) overallStatus = "赤チームの勝利（本数勝ち）";
  else if (redTotalWins === whiteTotalWins && whiteTotalIppon > redTotalIppon) overallStatus = "白チームの勝利（本数勝ち）";

  // --- 個人戦の操作ハンドラー ---
  const handleAddIndivMatch = () => {
    setIndividualMatches([
      ...individualMatches,
      {
        round: "2回戦",
        myPlayer: DEFAULT_RED_MEMBERS[0],
        opponentName: "",
        opponentSchool: "",
        myScores: ["-", "-"],
        oppScores: ["-", "-"],
        resultOverride: "引き分け",
      },
    ]);
  };

  const handleRemoveIndivMatch = (index: number) => {
    if (individualMatches.length === 1) return;
    setIndividualMatches(individualMatches.filter((_, i) => i !== index));
  };

  const handleIndivChange = (index: number, field: keyof IndividualMatch, value: any) => {
    const updated = [...individualMatches];
    (updated[index] as any)[field] = value;
    setIndividualMatches(updated);
  };

  const handleIndivScoreChange = (index: number, target: "my" | "opp", slot: number, value: string) => {
    const updated = [...individualMatches];
    if (target === "my") {
      updated[index].myScores[slot] = value;
    } else {
      updated[index].oppScores[slot] = value;
    }
    setIndividualMatches(updated);
  };

  const getIndivResult = (match: IndividualMatch) => {
    if (match.resultOverride) return match.resultOverride;
    const myValid = match.myScores.filter((s) => s !== "-" && s !== "反則" && s !== "不戦勝(○2つ)").length;
    const oppValid = match.oppScores.filter((s) => s !== "-" && s !== "反則" && s !== "不戦勝(○2つ)").length;

    if (match.myScores.includes("不戦勝(○2つ)")) return "勝ち";
    if (match.oppScores.includes("不戦勝(○2つ)")) return "負け";

    if (myValid > oppValid) return "勝ち";
    if (oppValid > myValid) return "負け";
    return "引き分け";
  };

  // Excelコピー機能（Excelの枠に次々貼り付けできるよう、見出しを省いたデータ行のみを出力）
  const handleCopyForExcel = () => {
    if (activeTab === "team") {
      let tsv = "大会名\t" + (tournamentName || "") + "\t日付\t" + (date || "") + "\n";
      tsv += "赤チーム\t高川\t白チーム\t" + (whiteTeamName || "") + "\n";
      tsv += "結果\t高川 (" + redTotalWins + "勝 " + redTotalIppon + "本) - " + (whiteTeamName || "白チーム") + " (" + whiteTotalWins + "勝 " + whiteTotalIppon + "本) 【" + overallStatus + "】\n\n";

      tsv += "対戦\t" + POSITIONS.join("\t") + "\n";
      tsv += "赤: 高川\t" + POSITIONS.map((_, i) => redPlayers[i]).join("\t") + "\n";
      tsv += "技・結果\t" + POSITIONS.map((_, i) => {
        const r = getMatchResult(matches[i]);
        return "赤:[" + matches[i].redScores.join(",") + "] 白:[" + matches[i].whiteScores.join(",") + "] (" + r + ")";
      }).join("\t") + "\n";
      tsv += "白: " + (whiteTeamName || "白チーム") + "\t" + POSITIONS.map((_, i) => whitePlayers[i] || "").join("\t") + "\n";

      navigator.clipboard.writeText(tsv).then(() => {
        alert("団体戦のExcel用データをコピーしました！");
      });
    } else {
      // 個人戦：各試合データをタブ区切りの値のみ（1行ずつ）にしてコピー
      let tsv = "";
      individualMatches.forEach((m) => {
        const res = getIndivResult(m);
        // [大会名, 日付, 回戦, 我が子名, 相手校, 相手選手名, 自分の技1, 自分の技2, 相手の技1, 相手の技2, 結果] の順番で1行ずつ
        const row = [
          indivTournament || "",
          indivDate || "",
          m.round,
          m.myPlayer,
          m.opponentSchool || "",
          m.opponentName || "",
          m.myScores[0],
          m.myScores[1],
          m.oppScores[0],
          m.oppScores[1],
          res,
        ];
        tsv += row.join("\t") + "\n";
      });

      navigator.clipboard.writeText(tsv).then(() => {
        alert("個人戦のExcel用データ（枠に貼り付け用）をコピーしました！");
      });
    }
  };

  const handleClear = () => {
    if (window.confirm("入力内容をクリアしますか？")) {
      if (activeTab === "team") {
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
      } else {
        setIndivTournament("");
        setIndivDate("");
        setIndividualMatches([
          {
            round: "1回戦",
            myPlayer: DEFAULT_RED_MEMBERS[0],
            opponentName: "",
            opponentSchool: "",
            myScores: ["-", "-"],
            oppScores: ["-", "-"],
            resultOverride: "引き分け",
          },
        ]);
      }
    }
  };

  return (
    <main className="p-4 max-w-5xl mx-auto font-sans text-gray-800">
      <h1 className="text-xl font-bold mb-4 text-center flex items-center justify-center gap-2">
        <span>⚔️</span> 剣道スコア管理アプリ
      </h1>

      {/* モード切り替えタブ */}
      <div className="flex justify-center mb-6 border-b">
        <button
          onClick={() => setActiveTab("team")}
          className={`py-2 px-6 font-bold text-sm border-b-2 transition ${
            activeTab === "team"
              ? "border-red-600 text-red-600 bg-red-50/50 rounded-t"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          🛡️ 団体戦モード
        </button>
        <button
          onClick={() => setActiveTab("individual")}
          className={`py-2 px-6 font-bold text-sm border-b-2 transition ${
            activeTab === "individual"
              ? "border-blue-600 text-blue-600 bg-blue-50/50 rounded-t"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          👤 個人戦モード（我が子専用）
        </button>
      </div>

      {/* ================= 団体戦モード画面 ================= */}
      {activeTab === "team" && (
        <>
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
              <label className="block text-sm font-semibold text-blue-600 mb-1">白チーム名 (手入力):</label>
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
        </>
      )}

      {/* ================= 個人戦モード画面 ================= */}
      {activeTab === "individual" && (
        <>
          <div className="bg-white p-4 rounded-lg shadow mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">個人戦 大会名:</label>
              <input
                type="text"
                className="w-full border rounded p-2 text-sm"
                placeholder="例: 県高校個人選手権"
                value={indivTournament}
                onChange={(e) => setIndivTournament(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-600 mb-1">日付:</label>
              <input
                type="text"
                className="w-full border rounded p-2 text-sm"
                placeholder="例: 2026年8月4日"
                value={indivDate}
                onChange={(e) => setIndivDate(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-4 mb-6">
            {individualMatches.map((m, index) => {
              const res = getIndivResult(m);
              return (
                <div key={index} className="bg-white border rounded-lg p-4 shadow relative">
                  <div className="flex justify-between items-center mb-3 border-b pb-2">
                    <div className="flex items-center gap-2">
                      <select
                        className="border rounded p-1 text-xs font-bold bg-gray-100"
                        value={m.round}
                        onChange={(e) => handleIndivChange(index, "round", e.target.value)}
                      >
                        <option value="1回戦">1回戦</option>
                        <option value="2回戦">2回戦</option>
                        <option value="3回戦">3回戦</option>
                        <option value="4回戦">4回戦</option>
                        <option value="準々決勝">準々決勝</option>
                        <option value="準決勝">準決勝</option>
                        <option value="決勝">決勝</option>
                      </select>
                      <span className="text-xs text-gray-500">試合 #{index + 1}</span>
                    </div>
                    {individualMatches.length > 1 && (
                      <button
                        onClick={() => handleRemoveIndivMatch(index)}
                        className="text-red-500 hover:text-red-700 text-xs font-bold"
                      >
                        🗑️ この試合を削除
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mb-3">
                    {/* 自分（高川メンバーから選択） */}
                    <div className="bg-red-50/50 p-3 rounded border border-red-200">
                      <label className="block font-semibold text-red-700 mb-1">我が子（高川）:</label>
                      <select
                        className="w-full border rounded p-1.5 text-xs bg-white font-medium mb-2"
                        value={m.myPlayer}
                        onChange={(e) => handleIndivChange(index, "myPlayer", e.target.value)}
                      >
                        {DEFAULT_RED_MEMBERS.map((mem, mIdx) => (
                          <option key={mIdx} value={mem}>
                            {mem}
                          </option>
                        ))}
                      </select>

                      <label className="block font-semibold text-red-700 mb-1">自分の技:</label>
                      <div className="flex gap-1">
                        <select
                          className="w-1/2 border rounded p-1 bg-white"
                          value={m.myScores[0]}
                          onChange={(e) => handleIndivScoreChange(index, "my", 0, e.target.value)}
                        >
                          <option value="-">-</option>
                          <option value="面">面</option>
                          <option value="小手">小手</option>
                          <option value="胴">胴</option>
                          <option value="突">突</option>
                          <option value="反則">反則</option>
                          <option value="不戦勝(○2つ)">不戦勝(○2つ)</option>
                        </select>
                        <select
                          className="w-1/2 border rounded p-1 bg-white"
                          value={m.myScores[1]}
                          onChange={(e) => handleIndivScoreChange(index, "my", 1, e.target.value)}
                        >
                          <option value="-">-</option>
                          <option value="面">面</option>
                          <option value="小手">小手</option>
                          <option value="胴">胴</option>
                          <option value="突">突</option>
                          <option value="反則">反則</option>
                          <option value="不戦勝(○2つ)">不戦勝(○2つ)</option>
                        </select>
                      </div>
                    </div>

                    {/* 対戦相手（自由入力） */}
                    <div className="bg-blue-50/50 p-3 rounded border border-blue-200">
                      <div className="grid grid-cols-2 gap-2 mb-2">
                        <div>
                          <label className="block font-semibold text-blue-700 mb-1">相手校名:</label>
                          <input
                            type="text"
                            className="w-full border rounded p-1.5 text-xs bg-white"
                            placeholder="例: ○○高校"
                            value={m.opponentSchool}
                            onChange={(e) => handleIndivChange(index, "opponentSchool", e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="block font-semibold text-blue-700 mb-1">相手選手名:</label>
                          <input
                            type="text"
                            className="w-full border rounded p-1.5 text-xs bg-white"
                            placeholder="例: 佐藤"
                            value={m.opponentName}
                            onChange={(e) => handleIndivChange(index, "opponentName", e.target.value)}
                          />
                        </div>
                      </div>

                      <label className="block font-semibold text-blue-700 mb-1">相手の技:</label>
                      <div className="flex gap-1">
                        <select
                          className="w-1/2 border rounded p-1 bg-white"
                          value={m.oppScores[0]}
                          onChange={(e) => handleIndivScoreChange(index, "opp", 0, e.target.value)}
                        >
                          <option value="-">-</option>
                          <option value="面">面</option>
                          <option value="小手">小手</option>
                          <option value="胴">胴</option>
                          <option value="突">突</option>
                          <option value="反則">反則</option>
                          <option value="不戦勝(○2つ)">不戦勝(○2つ)</option>
                        </select>
                        <select
                          className="w-1/2 border rounded p-1 bg-white"
                          value={m.oppScores[1]}
                          onChange={(e) => handleIndivScoreChange(index, "opp", 1, e.target.value)}
                        >
                          <option value="-">-</option>
                          <option value="面">面</option>
                          <option value="小手">小手</option>
                          <option value="胴">胴</option>
                          <option value="突">突</option>
                          <option value="反則">反則</option>
                          <option value="不戦勝(○2つ)">不戦勝(○2つ)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center bg-gray-50 p-2 rounded text-xs font-bold">
                    <span>判定結果:</span>
                    <select
                      className="border rounded p-1 text-xs bg-amber-50 font-bold"
                      value={m.resultOverride || res}
                      onChange={(e) => handleIndivChange(index, "resultOverride", e.target.value)}
                    >
                      <option value="引き分け">引き分け</option>
                      <option value="勝ち">勝ち</option>
                      <option value="負け">負け</option>
                    </select>
                  </div>
                </div>
              );
            })}

            <button
              onClick={handleAddIndivMatch}
              className="w-full bg-blue-50 border-2 border-dashed border-blue-300 text-blue-700 font-bold py-2.5 rounded-lg text-xs hover:bg-blue-100 transition"
            >
              ＋ 次の試合（回戦）を追加する
            </button>
          </div>
        </>
      )}

      {/* 共通ボタン */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={handleCopyForExcel}
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow flex items-center justify-center gap-2 transition"
        >
          <span>📋</span> {activeTab === "team" ? "団体戦のExcel用データをコピー" : "個人戦のExcel用データをコピー（枠用）"}
        </button>
        <button
          onClick={handleClear}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg shadow flex items-center justify-center gap-2 transition"
        >
          <span>🗑️</span> 入力をクリア
        </button>
      </div>
    </main>
  );
}