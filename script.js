
/* FOOTBALL DNA - result screen */

// 診断結果
let result = null;

// タイプ別タグ
const tagLabels = {
  dribbler: ["DRIBBLE", "SPEED", "CARRY"],
  striker: ["SHOOT", "GOAL", "ATTACK"],
  passer: ["PASS", "ASSIST", "BUILD UP"],
  defender: ["TACKLE", "DEFENSE", "INTERCEPT"],
  goalkeeper: ["SAVE", "GOALKEEPER", "CLEAN SHEET"]
};

// 結果画面の初期化
async function loadResult() {
  const savedResult = sessionStorage.getItem("footballDiagnosis");

  if (!savedResult) {
    alert("診断結果が見つかりません。もう一度診断してください。");
    location.href = "situmon.html";
    return;
  }

  let diagnosis;

  try {
    diagnosis = JSON.parse(savedResult);
  } catch (error) {
    alert("診断結果を読み込めませんでした。もう一度診断してください。");
    location.href = "situmon.html";
    return;
  }

  try {
    // JSONデータを読み込む
    const response = await fetch("data/player_stats.json");

    if (!response.ok) {
      throw new Error("JSONファイルを読み込めませんでした");
    }

    const data = await response.json();

    // 診断タイプに対応するデータを取得
    const typeData = data.types[diagnosis.type];

    if (!typeData) {
      throw new Error("診断タイプが見つかりません");
    }

    result = typeData;

    // タイプ名・説明を表示
    document.getElementById("player-name").textContent =
      typeData.name;

    document.getElementById("player-position").textContent =
      typeData.english;

    document.getElementById("report-text").textContent =
      typeData.report;

    // 診断得点を表示
    document.getElementById("match-score").textContent =
      diagnosis.scores[diagnosis.type];

    // タグを変更
    const tags = document.querySelector(".tags");

    if (tags) {
      tags.innerHTML = tagLabels[diagnosis.type]
        .map(label => `<span class="tag">${label}</span>`)
        .join("");
    }

    // Excelの集計データを表示
    displayStats(typeData, data);

  } catch (error) {
    console.error(error);
    document.getElementById("stats-list").textContent =
      "データの読み込みに失敗しました。";
  }
}


// 集計データの表示
function displayStats(typeData, data) {
  const container = document.getElementById("stats-list");
  container.innerHTML = "";

  Object.entries(typeData.stats).forEach(([name, value]) => {
    const row = document.createElement("div");
    row.className = "data-stat-row";

    const label = document.createElement("span");
    label.textContent = name;

    const number = document.createElement("strong");

    if (name === "セーブ率") {
      number.textContent = `${Number(value).toFixed(2)}%`;
    } else {
      number.textContent = `${Number(value).toFixed(2)}回`;
    }

    row.appendChild(label);
    row.appendChild(number);
    container.appendChild(row);
  });

  // データの説明
  document.getElementById("data-note").textContent =
    `※ 2022年度・収録3チームのデータ。出場時間${data.minimumMinutes}分超の選手を対象とした90分あたりの中央値です。対象人数：${typeData.sampleSize}人。`;
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


// ページ読み込み時に実行
loadResult();
