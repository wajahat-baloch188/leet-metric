document.addEventListener("DOMContentLoaded", function () {
  let searchBtn = document.querySelector("#search-btn");
  let usernameInput = document.querySelector("#user-input");
  let statsContainer = document.querySelector(".stats-container");
  let easyProgressCircle = document.querySelector(".easy-progress");
  let mediumProgressCircle = document.querySelector(".medium-progress");
  let hardProgressCircle = document.querySelector(".hard-progress");
  let easyLabel = document.querySelector("#easy-label");
  let mediumLabel = document.querySelector("#medium-label");
  let hardLabel = document.querySelector("#hard-label");
  let cardStatsContainer = document.querySelector(".stats-cards");
  let acceptanceRate = document.querySelector(".acceptance-rate");
  let contributionPoint = document.querySelector(".contribution-points");
  let ranking = document.querySelector(".ranking");

  // Ensure cardStatsContainer is hidden by default
  cardStatsContainer.style.display = "none";

  function validateUserName(username) {
    if (username.trim() === "") {
      alert("Username cannot be empty");
      return false;
    }

    const regex = /^[a-zA-Z0-9_-]{1,15}$/;
    const isMatching = regex.test(username);
    if (!isMatching) {
      alert("Invalid username");
    }
    return isMatching;
  }

  async function fetchUserDetails(username) {
    const url = `https://leetcode-stats-api.herokuapp.com/${username}`;
    try {
      searchBtn.textContent = "Searching...";
      searchBtn.disabled = true;
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);

      if (data && !data.error) {
        displayUserData(data);
        cardStatsContainer.style.display = "block"; // Show stats container when data is valid
      } else {
        statsContainer.innerHTML = `<p>No data found</p>`;
      }
    } catch (err) {
      statsContainer.innerHTML = `<p>Error fetching data</p>`;
    } finally {
      searchBtn.textContent = "Search";
      searchBtn.disabled = false;
    }
  }

  function updateProgress(solved, total, label, circle) {
    const progressDegree = (solved / total) * 100;
    circle.style.setProperty("--progress-degree", `${progressDegree}%`);
    label.textContent = `${solved}/${total}`;
  }

  function displayUserData(data) {
    const totalEasyQues = data.totalEasy;
    const totalMediumQues = data.totalMedium;
    const totalHardQues = data.totalHard;

    const solvedTotalEasyQues = data.easySolved;
    const solvedTotalMediumQues = data.mediumSolved;
    const solvedTotalHardQues = data.hardSolved;

    // Update the progress circles
    updateProgress(solvedTotalEasyQues, totalEasyQues, easyLabel, easyProgressCircle);
    updateProgress(solvedTotalMediumQues, totalMediumQues, mediumLabel, mediumProgressCircle);
    updateProgress(solvedTotalHardQues, totalHardQues, hardLabel, hardProgressCircle);

    // Update acceptance rate, contribution points, and ranking
    acceptanceRate.textContent = `${data.acceptanceRate}%`;
    contributionPoint.textContent = data.contributionPoints;
    ranking.textContent = `#${data.ranking}`;
  }

  searchBtn.addEventListener("click", function () {
    const username = usernameInput.value;

    if (validateUserName(username)) {
      fetchUserDetails(username);
    }
  });
});
