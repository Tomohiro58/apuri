
// FOOTBALL DNA - result screen

const typeResults = {
  dribbler: {
    name: "ドリブラー型",
    position: "DRIBBLER TYPE",
    report: "ドリブルで相手をかわし、自ら攻撃のチャンスを生み出すプレースタイルです。突破力やボール運びに注目してみましょう。"
  },
  striker: {
    name: "ストライカー型",
    position: "STRIKER TYPE",
    report: "シュートや得点を狙い、ゴール前で存在感を発揮するプレースタイルです。決定力や得点につながる動きに注目してみましょう。"
  },
  passer: {
    name: "パサー型",
    position: "PASSER TYPE",
    report: "正確なパスで味方を活かし、チームの攻撃を組み立てるプレースタイルです。パスやアシストに注目してみましょう。"
  },
  defender: {
    name: "守備型",
    position: "DEFENDER TYPE",
    report: "タックルやインターセプトで相手の攻撃を防ぐプレースタイルです。ボール奪取や守備での貢献に注目してみましょう。"
  },
  goalkeeper: {
    name: "守護神型",
    position: "GOALKEEPER TYPE",
    report: "セーブでチームを救い、ゴールを守るプレースタイルです。シュートストップや失点を防ぐ活躍に注目してみましょう。"
  }
};

// 質問ページから診断結果を取得
const savedResult = sessionStorage.getItem("footballDiagnosis");

if (!savedResult) {
  alert("診断結果が見つかりません。もう一度診断してください。");
  location.href = "situmon.html";
}

const diagnosis = savedResult
  ? JSON.parse(savedResult)
  : null;

const result = diagnosis
  ? typeResults[diagnosis.type]
  : null;

// 結果を表示
if (result) {
  document.getElementById("player-name").textContent = result.name;
  document.getElementById("player-position").textContent = result.position;
  document.getElementById("report-text").textContent = result.report;

  const topScore = diagnosis.scores[diagnosis.type];
  document.getElementById("match-score").textContent = topScore;

  // 既存のタグをタイプに合わせて変更
  const tagLabels = {
    dribbler: ["DRIBBLE", "SPEED", "CARRY"],
    striker: ["SHOOT", "GOAL", "ATTACK"],
    passer: ["PASS", "ASSIST", "BUILD UP"],
    defender: ["TACKLE", "DEFENSE", "INTERCEPT"],
    goalkeeper: ["SAVE", "GOALKEEPER", "CLEAN SHEET"]
  };

  const tags = document.querySelector(".tags");

  if (tags) {
    tags.innerHTML = tagLabels[diagnosis.type]
      .map(label => `<span class="tag">${label}</span>`)
      .join("");
  }
}

// シェア機能
async function shareResult() {
  const text = result
    ? `FOOTBALL DNA診断：あなたは${result.name}！`
    : "FOOTBALL DNA 診断結果";

  try {
    if (navigator.share) {
      await navigator.share({
        title: "FOOTBALL DNA 診断結果",
        text: text
      });
    } else if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      alert("診断結果をコピーしました！");
    } else {
      window.prompt("この結果をコピーしてください", text);
    }
  } catch (error) {
    if (error.name !== "AbortError") {
      alert("シェアできませんでした。");
    }
  }
}

// もう一度診断する
function restartDiagnosis() {
  sessionStorage.removeItem("footballDiagnosis");
  location.href = "situmon.html";
}
