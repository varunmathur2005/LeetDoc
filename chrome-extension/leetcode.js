/*******************************************************
 * leetcode.js
 *
 * Content script for LeetDoc Chrome Extension.
 * Captures problem data on valid LeetCode problem URLs,
 * then attaches the user’s solution after acceptance.
 *******************************************************/
console.log("🚀 LeetDoc Scraper Loaded!");

// Only match: https://leetcode.com/problems/<slug>[/description/]
const PROBLEM_URL_REGEX = /^https:\/\/leetcode\.com\/problems\/[^/]+\/?(description)?\/?$/;

(function main() {
    // 1) If not on a valid problem page, do nothing
    if (!PROBLEM_URL_REGEX.test(window.location.href)) {
        console.log("🔸 Not a recognized LeetCode problem URL. Scraper not activated.");
        return;
    }

    console.log("🔹 Valid LeetCode problem URL—activating scraper.");

    /**
     * Captures the problem details (title, statement, difficulty, topics)
     * and stores them temporarily.
     */
    function captureProblem() {
        const titleSel = document.querySelector('a[href^="/problems/"][class*="no-underline"]')?.innerText || "Unknown";
        const difficultyEl = document.querySelector('.flex.gap-1 div[class*="text-difficulty-"]');
        const difficultySel = difficultyEl?.innerText || "Unknown";
        const statementSel = document.querySelector('.elfjS[data-track-load="description_content"]')?.innerText || "No statement found";
        const topicsSel = Array.from(document.querySelectorAll(".topic-tag")).map(el => el.innerText) || ["Uncategorized"];
        const problemUrl = window.location.href;

        const tempProblem = {
            title: titleSel,
            statement: statementSel,
            difficulty: difficultySel,
            topics: topicsSel,
            url: problemUrl
        };

        sessionStorage.setItem("leetdoc_tempProblem", JSON.stringify(tempProblem));
        console.log("📥 Problem captured (temp):", tempProblem);
    }

    /**
     * Checks for the "Accepted" label and captures the full problem data.
     * Opens the modal-ui app with encoded data in the URL.
     */
    function attachSolutionIfAccepted() {
        const acceptedTag = document.querySelector(".text-green-s");
        if (!acceptedTag) return false;

        const tempProblemRaw = sessionStorage.getItem("leetdoc_tempProblem");
        if (!tempProblemRaw) {
            console.log("✅ 'Accepted' found, but no temp problem stored—nothing to attach.");
            return false;
        }

        console.log("✅ Solution Accepted! Attaching solution to temp problem...");

        const tempProblem = JSON.parse(tempProblemRaw);
        const userSolution = document.querySelector(".view-lines")?.innerText || "No solution found";

        const finalProblemData = {
            ...tempProblem,
            solution: userSolution,
            timestamp: new Date().toISOString()
        };

        console.log("📋 Final Problem Data:", finalProblemData);

        // Encode and send to modal-ui via URL
        const encoded = encodeURIComponent(btoa(JSON.stringify(finalProblemData)));
        window.open(`http://localhost:3000?data=${encoded}`, "_blank");

        return true;
    }

    function startAcceptanceObserver() {
        const observer = new MutationObserver(() => {
            if (attachSolutionIfAccepted()) {
                observer.disconnect();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // --- Main routine ---
    captureProblem();
    startAcceptanceObserver();
})();
