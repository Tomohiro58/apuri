// FOOTBALL DNA — result screen interactions
// Keep this file separate from the page structure (HTML) and visual styles (CSS).

// スコアバーを表示時にアニメーション
    window.addEventListener("load", () => {
      document.querySelectorAll(".score-fill").forEach((bar) => {
        const score = Number(bar.dataset.score) || 0;
        setTimeout(() => { bar.style.width = Math.max(0, Math.min(100, score)) + "%"; }, 180);
      });
    });

    // 実際の診断結果に合わせて、この内容を更新できます。
    const result = {
      name: "選手名",
      position: "所属クラブ / ポジション",
      score: 92,
      report: "スピードとドリブルを重視するあなたにおすすめ。相手をかわしてチャンスを生み出すプレーに注目してみよう。"
    };
    document.getElementById("player-name").textContent = result.name;
    document.getElementById("player-position").textContent = result.position;
    document.getElementById("match-score").textContent = result.score;
    document.getElementById("report-text").textContent = result.report;

    async function shareResult() {
      const text = `FOOTBALL DNA診断：おすすめ選手は${result.name}！相性 ${result.score}/100`;
      try {
        if (navigator.share) await navigator.share({ title: "FOOTBALL DNA 診断結果", text });
        else if (navigator.clipboard && window.isSecureContext) { await navigator.clipboard.writeText(text); alert("診断結果をコピーしました！"); }
        else { window.prompt("この結果をコピーしてください", text); }
      } catch (error) {
        if (error.name !== "AbortError") alert("シェアできませんでした。もう一度お試しください。");
      }
    }
    function restartDiagnosis() {
      // 診断ページのファイル名に合わせて変更してください。
      // 例: location.href = "question.html";
      location.reload();
    }
